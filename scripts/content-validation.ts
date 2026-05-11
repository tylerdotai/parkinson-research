#!/usr/bin/env tsx
/**
 * Content validation for parkinson-research
 * - Validates EN and ES pages return HTTP 200
 * - Validates report JSON structure
 * - Runs against the built Next.js standalone output
 */

import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const LOCALES = ['en', 'es'] as const

async function waitForServer(url: string, timeout = 30000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`Server did not become ready at ${url} within ${timeout}ms`)
}

async function validatePage(locale: string): Promise<void> {
  const url = `http://localhost:${PORT}/${locale}`
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`FAIL: ${locale} page returned HTTP ${res.status}`)
    process.exit(1)
  }
  console.log(`PASS: ${locale} page — HTTP ${res.status}`)
}

function validateReports(): void {
  const candidates = [
    path.join(process.cwd(), 'public', 'reports'),
    path.join(process.cwd(), '.next', 'standalone', 'public', 'reports'),
  ]

  let dir: string | null = null
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) { dir = candidate; break }
  }

  if (!dir) {
    console.log('SKIP: No reports directory found — nothing to validate')
    return
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  if (files.length === 0) {
    console.log('SKIP: No report JSON files found yet')
    return
  }

  for (const file of files) {
    const filePath = path.join(dir!, file)
    let content: Record<string, unknown>
    try {
      content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      console.error(`FAIL: Report ${file} is not valid JSON —`, e)
      process.exit(1)
    }

    const required: (keyof typeof content)[] = ['date', 'title', 'sections', 'lang']
    for (const key of required) {
      if (!(key in content)) {
        console.error(`FAIL: Report ${file} missing required field: "${key}"`)
        process.exit(1)
      }
    }

    if (!Array.isArray(content.sections) || content.sections.length === 0) {
      console.error(`FAIL: Report ${file} — "sections" must be a non-empty array`)
      process.exit(1)
    }

    console.log(`PASS: Report ${file} — all required fields present`)
  }
}

async function main() {
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev, dir: process.cwd() })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url ?? '/', true)
    handle(req, res, parsedUrl)
  })

  await new Promise<void>((resolve, reject) => {
    server.listen(PORT, () => resolve()).on('error', reject)
  })

  console.log(`Next.js server started on port ${PORT}`)
  await waitForServer(`http://localhost:${PORT}/en`)

  for (const locale of LOCALES) {
    await validatePage(locale)
  }

  validateReports()

  server.close()
  console.log('\nAll content validations passed ✓')
  process.exit(0)
}

main().catch(err => {
  console.error('Validation failed:', err)
  process.exit(1)
})