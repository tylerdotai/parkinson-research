#!/usr/bin/env tsx
/**
 * Content validation for parkinson-research
 * - Validates EN and ES pages return HTTP 200
 * - Validates report JSON structure
 * - Runs against the built Next.js output
 */

import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const LOCALES = ['en', 'es'] as const
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiagainstparkinson.com'

async function waitForServer(url: string, timeout = 30000): Promise<void> {
  const start = Date.now()
  process.stdout.write(`Waiting for server at ${url}...`)
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        console.log(' ready')
        return
      }
    } catch { /* still starting */ }
    await new Promise(r => setTimeout(r, 500))
    process.stdout.write('.')
  }
  throw new Error(`Server did not become ready at ${url} within ${timeout}ms`)
}

async function validatePage(locale: string): Promise<void> {
  const url = `${SITE_URL.replace('https://', 'http://')}:${PORT}/${locale}`
  console.log(`  Checking ${locale} page at ${url}`)
  let res: Response
  try {
    res = await fetch(url)
  } catch (e) {
    console.error(`\nFAIL: Could not reach ${locale} page — ${e}`)
    process.exit(1)
  }
  if (!res.ok) {
    console.error(`\nFAIL: ${locale} page returned HTTP ${res.status}`)
    process.exit(1)
  }
  console.log(`  PASS: ${locale} — HTTP ${res.status}`)
}

function validateReports(): void {
  const reportsDir = path.join(process.cwd(), 'public', 'reports')
  if (!fs.existsSync(reportsDir)) {
    console.log('  SKIP: No public/reports directory found')
    return
  }

  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'))
  if (files.length === 0) {
    console.log('  SKIP: No report JSON files found yet')
    return
  }

  console.log(`  Validating ${files.length} report file(s)...`)
  for (const file of files) {
    const filePath = path.join(reportsDir, file)
    let content: Record<string, unknown>
    try {
      content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      console.error(`  FAIL: Report ${file} is not valid JSON — ${e}`)
      process.exit(1)
    }

    const required: (keyof typeof content)[] = ['date', 'title', 'sections', 'lang']
    for (const key of required) {
      if (!(key in content)) {
        console.error(`  FAIL: Report ${file} missing required field: "${key}"`)
        process.exit(1)
      }
    }

    if (!Array.isArray(content.sections) || content.sections.length === 0) {
      console.error(`  FAIL: Report ${file} — "sections" must be a non-empty array`)
      process.exit(1)
    }

    console.log(`  PASS: ${file}`)
  }
}

async function main() {
  console.log('\n=== Content Validation ===')
  const dev = process.env.NODE_ENV !== 'production'

  // Build output is at .next/ (root of repo)
  const nextDir = path.join(process.cwd(), '.next')
  console.log(`Using Next.js build from: ${nextDir}`)

  const app = next({ dev, dir: nextDir })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url ?? '/', true)
    handle(req, res, parsedUrl)
  })

  await new Promise<void>((resolve, reject) => {
    server.listen(PORT, () => resolve()).on('error', reject)
  })
  console.log(`Server started on port ${PORT}`)

  await waitForServer(`http://localhost:${PORT}/en`)

  console.log('\n--- Page validation ---')
  for (const locale of LOCALES) {
    await validatePage(locale)
  }

  console.log('\n--- Report validation ---')
  validateReports()

  server.close()
  console.log('\nAll content validations passed ✓\n')
  process.exit(0)
}

main().catch(err => {
  console.error('\nValidation failed:', err)
  process.exit(1)
})