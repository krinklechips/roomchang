import { describe, expect, it } from 'vitest'
import { assertHealthyPage } from './pilot-page-check.mjs'
import fs from 'node:fs'
import path from 'node:path'

const expected = { language: 'en', text: 'Our Doctors', href: '/en/contact', articles: 0 }
const healthy = { route: '/en/team', status: 200, language: 'en', text: 'Our Doctors', links: ['/en/contact'], articles: [] }

describe('nonpilot preservation health gate', () => {
  it('validates every fetched page before returning it to the hash comparison', () => {
    const script = fs.readFileSync(path.resolve('scripts/verify-publications-pilot.mjs'), 'utf8')
    expect(script).toContain('assertHealthyPage(result, expectedPage(route))')
  })
  it('accepts a successful page with its expected content', () => {
    expect(() => assertHealthyPage(healthy, expected)).not.toThrow()
  })
  it.each([
    { status: 404 }, { status: 500 }, { language: 'zh' }, { text: 'Not found' }, { links: [] }, { articles: [{}] },
  ])('rejects an unchanged but unhealthy/wrong page: %j', change => {
    expect(() => assertHealthyPage({ ...healthy, ...change }, expected)).toThrow()
  })
})
