const fs = require('fs');
const path = require('path');

/**
 * Lista blanca de archivos a sincronizar desde global a frontend y backend
 */
const WHITELIST = ['enums.ts'];

/**
 * Directorios destino donde sincronizar los archivos
 */
const DESTINATIONS = ['frontend', 'backend'];

/**
 * Sincroniza los archivos de la lista blanca desde global a los módulos
 * @param {string} globalDir - Ruta a la carpeta global (default: directorio actual)
 */
function syncGlobalFiles(globalDir = __dirname) {
    const rootDir = path.dirname(globalDir);

    console.log(`📦 Iniciando sincronización de archivos desde ${globalDir}...`);

    WHITELIST.forEach((file) => {
        const sourcePath = path.join(globalDir, file);

        // Verificar que el archivo existe en global
        if (!fs.existsSync(sourcePath)) {
            console.warn(`⚠️  Archivo no encontrado: ${file}`);
            return;
        }

        // Leer el contenido del archivo
        const content = fs.readFileSync(sourcePath, 'utf8');

        // Copiar a cada destino
        DESTINATIONS.forEach((dest) => {
            const destBaseDir = path.join(rootDir, dest);
            
            // Para frontend usa la ruta directa, para backend usa src/global
            const destGlobalDir = dest === 'frontend' 
                ? path.join(destBaseDir, 'global')
                : path.join(destBaseDir, 'src', 'global');
            
            const destPath = path.join(destGlobalDir, file);

            // Verificar que el directorio destino existe
            if (!fs.existsSync(destBaseDir)) {
                console.warn(`⚠️  Directorio no encontrado: ${dest}`);
                return;
            }

            // Crear la carpeta global si no existe
            if (!fs.existsSync(destGlobalDir)) {
                fs.mkdirSync(destGlobalDir, { recursive: true });
            }

            try {
                fs.writeFileSync(destPath, content, 'utf8');
                console.log(`✅ ${file} → ${dest}/global/`);
            } catch (error) {
                console.error(`❌ Error al copiar ${file} a ${dest}/global/: ${error.message}`);
            }
        });
    });

    console.log('✨ Sincronización completada');
}

// Ejecutar si se llama directamente desde la línea de comandos
if (require.main === module) {
    syncGlobalFiles();
}

module.exports = { syncGlobalFiles, WHITELIST, DESTINATIONS };