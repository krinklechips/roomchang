import assert from 'node:assert/strict'

export function assertHealthyPage(page, expected) {
  assert.equal(page.status, 200, `Unexpected HTTP status: ${page.route}`)
  assert.equal(page.language, expected.language, `Wrong language: ${page.route}`)
  if (expected.text) assert.ok(page.text.includes(expected.text), `Missing expected page content: ${page.route}`)
  if (expected.href) assert.ok(page.links.includes(expected.href), `Missing expected page link: ${page.route}`)
  if (expected.articles != null) assert.equal(page.articles.length, expected.articles, `Missing publications: ${page.route}`)
}
