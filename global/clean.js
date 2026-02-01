import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    try {
      fs.rmSync(directoryPath, { recursive: true, force: true, maxRetries: 3 });
      console.log(`✅ Eliminada carpeta: ${directoryPath}`);
    } catch (e) {
      console.error(`❌ Error al eliminar ${directoryPath}:`, e.message);
    }
  }
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Eliminado archivo: ${filePath}`);
    } catch (e) {
      console.error(`❌ Error al eliminar ${filePath}:`, e.message);
    }
  }
}

function traverseAndClean(currentDir, depth = 0) {
  // Evitar recursión infinita
  if (depth > 20) {
    console.warn(`⚠️  Profundidad máxima alcanzada en: ${currentDir}`);
    return;
  }

  if (!fs.existsSync(currentDir)) {
    return;
  }

  let items;
  try {
    items = fs.readdirSync(currentDir);
  } catch (e) {
    console.error(`❌ Error al leer directorio ${currentDir}:`, e.message);
    return;
  }

  for (const item of items) {
    const fullPath = path.join(currentDir, item);

    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      console.error(`❌ Error al acceder a ${fullPath}:`, e.message);
      continue;
    }

    if (stat.isDirectory()) {
      // Eliminar node_modules
      if (item === 'node_modules') {
        deleteFolderRecursive(fullPath);
      }
      // Eliminar .next en la carpeta frontend
      else if (item === '.next' && currentDir.endsWith('frontend')) {
        deleteFolderRecursive(fullPath);
      }
      else if (item === 'dist' && currentDir.endsWith('frontend')) {
        deleteFolderRecursive(fullPath);
      }
      // Eliminar dist en la carpeta backend
      else if (item === 'dist' && currentDir.endsWith('backend')) {
        deleteFolderRecursive(fullPath);
      }
      // Eliminar carpetas de caché .turbo
      else if (item === '.turbo') {
        deleteFolderRecursive(fullPath);
      }
      // Continuar recursión (ignorar carpetas ocultas como .git)
      else if (!item.startsWith('.')) {
        traverseAndClean(fullPath, depth + 1);
      }
    }
    // Eliminar package-lock.json
    else if (item === 'package-lock.json') {
      deleteFile(fullPath);
    }
  }
}

console.log('🧹 Iniciando limpieza...');
console.log(`📂 Directorio raíz: ${rootDir}\n`);

try {
  traverseAndClean(rootDir);
  console.log('\n✨ Limpieza completada con éxito');
} catch (e) {
  console.error('\n❌ Error durante la limpieza:', e.message);
  process.exit(1);
}

process.exit(0);