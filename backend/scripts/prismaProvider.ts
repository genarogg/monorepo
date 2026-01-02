import 'dotenv/config'
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'

function cleanSqliteArtifacts(provider: 'sqlite' | 'postgresql') {

  // 1. Borrar carpeta de migraciones
  const migrationsPath = join(process.cwd(), 'prisma', 'migrations')
  if (existsSync(migrationsPath)) {
    rmSync(migrationsPath, { recursive: true, force: true })
    console.log('Carpeta prisma/migrations eliminada')
  }

  // 2. Borrar archivo .db (desde DATABASE_URL)
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('file:')) {
    const dbPath = url.replace('file:', '')
    const absoluteDbPath = resolve(process.cwd(), dbPath)

    if (existsSync(absoluteDbPath)) {
      rmSync(absoluteDbPath, { force: true })
      console.log(`Archivo SQLite eliminado: ${absoluteDbPath}`)
    }
  }
}

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
cleanSqliteArtifacts(provider)
updateSchema(provider)
