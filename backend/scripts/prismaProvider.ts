import 'dotenv/config'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function detect(url: string): 'sqlite' | 'postgresql' {
  const u = url.toLowerCase()
  if (u.startsWith('file:')) return 'sqlite'
  if (u.startsWith('postgres://') || u.startsWith('postgresql://') || u.startsWith('prisma+postgres://')) {
    return 'postgresql'
  }
  return 'sqlite'
}

function updateSchema(provider: 'sqlite' | 'postgresql') {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
  const content = readFileSync(schemaPath, 'utf8')
  const updated = content.replace(
    /(datasource\s+db\s*\{\s*provider\s*=\s*")(\w+)(")/m,
    (_m, p1, _prov, p3) => `${p1}${provider}${p3}`,
  )
  writeFileSync(schemaPath, updated, 'utf8')
  console.log(`Provider actualizado a: ${provider}`)
}

const url = process.env.DATABASE_URL ?? ''
if (!url) {
  console.error('DATABASE_URL no definido')
  process.exit(1)
}

const provider = detect(url)
updateSchema(provider)
