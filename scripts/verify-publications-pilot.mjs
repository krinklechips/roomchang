import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { once } from 'node:events'
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { assertHealthyPage } from './pilot-page-check.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const out = process.env.PILOT_EVIDENCE_DIR || path.join(root, '.artifacts', 'publications-pilot')
fs.mkdirSync(out, { recursive: true, mode: 0o700 })
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2), { flag: 'wx', mode: 0o600 })
const hash = text => createHash('sha256').update(text).digest('hex')
const messages = Object.fromEntries(['en', 'km', 'zh'].map(locale => [locale,
  JSON.parse(fs.readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'))]))
function expectedPage(route) {
  const [, locale, section] = route.split('/')
  const language = { en: 'en', kh: 'km', cn: 'zh' }[locale]
  const m = messages[language]
  assert.ok(m, `Unknown verification language: ${route}`)
  if (!section) return { language, text: m.homeHero.trustPill }
  if (section === 'contact' || section === 'team') return { language, text: m[section].hero.heading }
  if (section === 'services') return { language, href: `/${locale}/pricing#whitening` }
  return { language, text: m.publications.hero.title, articles: 8 }
}
const environment = Object.fromEntries(['HOME', 'PATH', 'TMPDIR', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_CDN_URL']
  .filter(key => process.env[key]).map(key => [key, process.env[key]]))
assert.ok(environment.NEXT_PUBLIC_SUPABASE_URL && environment.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'Provide the same public read configuration used for the build.')

const response = await fetch('https://roomchang.serviettelab.com/api/publications?locale=en&fallback-locale=none&depth=0&limit=100&sort=-year,order,id', { signal: AbortSignal.timeout(20000) })
assert.equal(response.status, 200)
const published = await response.json()
assert.equal(published.hasNextPage, false)
assert.ok(published.docs.length > 0)
save('published-fixture.json', published)

let scenario = 'healthy'
const upstreamRequests = []
const timers = new Set()
const fixture = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const record = { scenario, method: req.method, path: url.pathname, locale: url.searchParams.get('locale'),
    draft: url.searchParams.has('draft'), authorized: Boolean(req.headers.authorization), cookies: Boolean(req.headers.cookie) }
  upstreamRequests.push(record)
  if (req.method !== 'GET' || url.pathname !== '/api/publications' || record.locale !== 'en' || record.draft || record.authorized || record.cookies) {
    res.writeHead(400).end('Invalid public reader request')
    return
  }
  if (scenario === 'http-503') return void res.writeHead(503).end('Fixture unavailable')
  if (scenario === 'malformed') return void res.writeHead(200, { 'content-type': 'application/json' }).end('{not JSON')
  let body = published
  if (scenario === 'empty') body = { docs: [], totalDocs: 0, hasNextPage: false, nextPage: null }
  if (scenario === 'draft') body = { ...published, docs: published.docs.map(doc => ({ ...doc, _status: 'draft' })) }
  const send = () => { if (!res.destroyed) res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(body)) }
  if (scenario === 'timeout') {
    const timer = setTimeout(() => { timers.delete(timer); send() }, 6000)
    timers.add(timer)
    res.once('close', () => { clearTimeout(timer); timers.delete(timer) })
  } else send()
})
fixture.listen(0, '127.0.0.1')
await once(fixture, 'listening')
const fixtureOrigin = `http://127.0.0.1:${fixture.address().port}`
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
let child
let childLog
let origin

async function stop() {
  if (!child) return
  const done = once(child, 'exit').catch(() => {})
  child.kill('SIGTERM')
  const deadline = setTimeout(() => child?.kill('SIGKILL'), 5000)
  await done
  clearTimeout(deadline)
  fs.closeSync(childLog)
  child = undefined
}

async function start(selected, label) {
  await stop()
  const socket = http.createServer()
  socket.listen(0, '127.0.0.1')
  await once(socket, 'listening')
  const port = socket.address().port
  await new Promise(resolve => socket.close(resolve))
  origin = `http://127.0.0.1:${port}`
  childLog = fs.openSync(path.join(out, `${label}-server.log`), 'wx', 0o600)
  child = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root, stdio: ['ignore', childLog, childLog], env: { ...environment, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
      CONTENT_SOURCE: 'pilot', CMS_PILOT_PAGES: selected ? '/en/blog/publications' : '', SITE_VISIBILITY: 'staging', PAYLOAD_API_URL: fixtureOrigin },
  })
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    if (child.exitCode != null) throw Error(`Next server exited: ${child.exitCode}`)
    try {
      const ready = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(1000) })
      if (ready.status === 200) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw Error('Next server did not become ready.')
}

async function page(route, unavailable = false) {
  const start = performance.now()
  const response = await fetch(origin + route, { signal: AbortSignal.timeout(12000) })
  const html = await response.text()
  const dom = new JSDOM(html)
  const document = dom.window.document
  const main = document.querySelector('main')
  assert.ok(main, route)
  main.querySelectorAll('script,style,noscript,template,[hidden]').forEach(node => node.remove())
  const text = main.textContent.replace(/\s+/g, ' ').trim()
  const result = { route, status: response.status, elapsedMs: Math.round(performance.now() - start), text, hash: hash(text),
    state: document.querySelector('[data-publications-state]')?.getAttribute('data-publications-state'),
    language: document.documentElement.lang, robots: response.headers.get('x-robots-tag'),
    links: [...main.querySelectorAll('a[href]')].map(node => node.getAttribute('href')),
    articles: [...main.querySelectorAll('article')].map(node => ({ title: node.querySelector('h3')?.textContent,
      citation: node.querySelector('p')?.textContent, doi: node.querySelector('a[href*="doi.org/"]')?.getAttribute('href') })) }
  dom.window.close()
  if (unavailable) assertHealthyPage(result, { language: 'en', text: 'Publications are temporarily unavailable', articles: 0 })
  else assertHealthyPage(result, expectedPage(route))
  return result
}

const unaffected = ['/kh/blog/publications', '/cn/blog/publications', ...['en', 'kh', 'cn'].flatMap(locale =>
  [`/${locale}`, `/${locale}/contact`, `/${locale}/team`, `/${locale}/services/teeth-whitening`])]
const results = []
try {
  await start(false, 'legacy-control')
  const baseline = await page('/en/blog/publications')
  assert.equal(baseline.state, 'legacy')
  assert.equal(baseline.articles.length, 8)
  const controls = new Map()
  for (const route of unaffected) controls.set(route, await page(route))
  assert.equal(upstreamRequests.length, 0, 'Disabled pilot must not call the CMS fixture.')
  await start(true, 'selected-pilot')
  const healthy = await page('/en/blog/publications')
  assert.equal(healthy.state, 'ready')
  assert.equal(healthy.articles.length, published.docs.length)
  for (const doc of published.docs) assert.ok(healthy.text.includes(doc.displayTitle?.trim() || doc.title), `Missing published title ${doc.id}`)
  for (const route of unaffected) {
    const current = await page(route)
    assert.equal(current.hash, controls.get(route).hash, `Nonpilot text changed: ${route}`)
  }
  for (const failure of ['http-503', 'empty', 'malformed', 'draft', 'timeout']) {
    scenario = failure
    const failed = await page('/en/blog/publications', true)
    assert.equal(failed.state, 'unavailable', failure)
    assert.ok(failed.text.includes('Publications are temporarily unavailable'))
    if (failure === 'timeout') assert.ok(failed.elapsedMs < 7000, 'The total CMS deadline must remain bounded.')
    assert.equal((await page('/kh/blog/publications')).hash, controls.get('/kh/blog/publications').hash)
    results.push({ scenario: failure, state: failed.state, status: failed.status, elapsedMs: failed.elapsedMs, unrelatedKhmerUnchanged: true })
  }
  scenario = 'healthy'
  const recovered = await page('/en/blog/publications')
  assert.equal(recovered.hash, healthy.hash, 'Recovery must restore current published output.')
  await start(false, 'legacy-rollback')
  const rolledBack = await page('/en/blog/publications')
  assert.equal(rolledBack.state, 'legacy')
  assert.equal(rolledBack.hash, baseline.hash, 'Rollback must restore exact original visible text.')
  for (const route of unaffected) assert.equal((await page(route)).hash, controls.get(route).hash)
  const diffs = healthy.articles.map(article => {
    const original = baseline.articles.find(row => row.doi === article.doi)
    return { doi: article.doi, originalTitle: original?.title, cmsTitle: article.title,
      originalCitation: original?.citation, cmsCitation: article.citation,
      changed: original?.title !== article.title || original?.citation !== article.citation }
  })
  assert.ok(upstreamRequests.every(row => row.method === 'GET' && row.locale === 'en' && !row.draft && !row.authorized && !row.cookies))
  save('local-outage-rollback.json', { checkedAt: new Date().toISOString(), cmsWrites: 0, unchangedNonpilotPages: unaffected.length,
    currentPublishedRecords: published.docs.length, scenarios: results, recovered: true, exactLegacyTextRollback: true,
    baselineHash: baseline.hash, pilotHash: healthy.hash, rollbackHash: rolledBack.hash, upstreamRequests,
    productionContentApprovalRequired: diffs.some(row => row.changed), publicationDifferences: diffs })
  console.log(JSON.stringify({ unchangedNonpilotPages: unaffected.length, outageScenarios: results.length, recovered: true,
    exactLegacyTextRollback: true, publicationDifferences: diffs.filter(row => row.changed).length, cmsWrites: 0 }))
} finally {
  await stop()
  for (const timer of timers) clearTimeout(timer)
  fixture.closeAllConnections()
  await new Promise(resolve => fixture.close(resolve))
}
