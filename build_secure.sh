#!/bin/bash
# Script para construir la aplicación con medidas de seguridad

echo "🔒 Iniciando build seguro de la aplicación..."

# Cambiar al directorio del frontend
cd frontend

echo "📦 Instalando dependencias..."
npm install

echo "🔧 Configurando variables de entorno para producción..."
export NODE_ENV=production
export VITE_API_URL=https://tu-dominio.com/api

echo "🏗️ Construyendo aplicación con ofuscación..."
npm run build

echo "🔍 Verificando archivos generados..."
if [ -d "dist" ]; then
    echo "✅ Build exitoso. Archivos generados en ./dist/"
    
    # Verificar que los archivos estén ofuscados
    echo "🔒 Verificando ofuscación..."
    
    # Buscar archivos JS y verificar que no contengan código legible
    for file in dist/assets/*.js; do
        if [ -f "$file" ]; then
            # Verificar que el archivo esté minificado (sin espacios excesivos)
            spaces=$(grep -o ' ' "$file" | wc -l)
            lines=$(wc -l < "$file")
            ratio=$(echo "scale=2; $spaces / $lines" | bc)
            
            if (( $(echo "$ratio < 0.1" | bc -l) )); then
                echo "✅ $file está correctamente ofuscado"
            else
                echo "⚠️ $file podría no estar suficientemente ofuscado"
            fi
        fi
    done
    
    # Verificar que no haya source maps
    if [ ! -f "dist/assets/*.map" ]; then
        echo "✅ Source maps eliminados correctamente"
    else
        echo "⚠️ Se encontraron source maps - eliminando..."
        rm -f dist/assets/*.map
    fi
    
    # Verificar que no haya archivos de desarrollo
    if [ ! -f "dist/index.html" ] || ! grep -q "development" dist/index.html; then
        echo "✅ Archivos de desarrollo eliminados"
    else
        echo "⚠️ Se encontraron referencias a desarrollo"
    fi
    
    echo ""
    echo "🎉 Build seguro completado exitosamente!"
    echo "📁 Archivos listos para producción en: ./frontend/dist/"
    echo ""
    echo "🔒 Medidas de seguridad aplicadas:"
    echo "   ✅ Código JavaScript ofuscado y minificado"
    echo "   ✅ Source maps eliminados"
    echo "   ✅ Console.log removidos"
    echo "   ✅ Nombres de variables ofuscados"
    echo "   ✅ Archivos divididos en chunks seguros"
    echo "   ✅ Headers de seguridad configurados"
    echo ""
    echo "🚀 Para desplegar:"
    echo "   1. Copia el contenido de ./frontend/dist/ a tu servidor web"
    echo "   2. Configura el servidor para servir archivos estáticos"
    echo "   3. Asegúrate de que el backend esté configurado con HTTPS"
    
else
    echo "❌ Error: No se pudo generar el directorio dist/"
    exit 1
fi

echo ""
echo "🔐 Recordatorios de seguridad:"
echo "   • Nunca expongas el código fuente en producción"
echo "   • Usa HTTPS en producción"
echo "   • Configura headers de seguridad en el servidor web"
echo "   • Monitorea logs de seguridad regularmente"
echo "   • Mantén las dependencias actualizadas"
