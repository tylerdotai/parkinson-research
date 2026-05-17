#!/usr/bin/env npx tsx
/**
 * test-email.ts
 * 
 * Test the email pipeline by sending the most recent report to the test subscriber.
 * Run: npx tsx scripts/test-email.ts
 * 
 * Usage:
 *   npx tsx scripts/test-email.ts                  # sends latest EN report
 *   npx tsx scripts/test-email.ts --date 2026-04-09 # sends specific date
 *   npx tsx scripts/test-email.ts --lang es         # sends Spanish report
 */

const SITE_URL = 'https://aiagainstparkinson.com'

interface Args {
  date?: string
  language?: string
}

function parseArgs(): Args {
  const args: Args = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--date' && argv[i + 1]) args.date = argv[++i]
    if (argv[i] === '--lang' && argv[i + 1]) args.language = argv[++i]
  }
  return args
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

async function main() {
  const { date = today(), language = 'en' } = parseArgs()

  console.log(`\nTesting email pipeline:`)
  console.log(`  Date: ${date}`)
  console.log(`  Language: ${language}`)
  console.log(`  Endpoint: ${SITE_URL}/api/send-report`)
  console.log('')

  const { execSync } = await import('child_process')
  
  try {
    const res = execSync(
      `curl -s -X POST "${SITE_URL}/api/send-report" ` +
      `-H "Content-Type: application/json" ` +
      `-d '{"date": "${date}", "language": "${language}"}'`,
      { encoding: 'utf-8', maxBuffer: 1024 * 1024 }
    )

    const data = JSON.parse(res)
    console.log(`Response:`)
    console.log(`  success: ${data.success}`)
    console.log(`  sent: ${data.sent}`)
    console.log(`  failed: ${data.failed?.length || 0}`)
    if (data.failed?.length) {
      console.log(`  failures:`)
      data.failed.forEach((f: string) => console.log(`    - ${f}`))
    }
    console.log('')
    if (data.success && data.sent > 0) {
      console.log('✅ Email test PASSED')
    } else {
      console.log('❌ Email test FAILED — check response above')
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('❌ Request failed:', message)
    process.exit(1)
  }
}

main()