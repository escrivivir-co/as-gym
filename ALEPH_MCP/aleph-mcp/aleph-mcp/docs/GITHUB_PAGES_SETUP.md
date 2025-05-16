# Configuración de GitHub Pages para Aleph MCP

Este archivo describe cómo configurar GitHub Pages para el sitio web de Aleph MCP.

## Habilitación de GitHub Pages

Para habilitar GitHub Pages en este repositorio:

1. Ve a la configuración del repositorio en GitHub (`Settings`)
2. Navega a la sección `Pages` en el menú lateral izquierdo
3. En la sección `Source`:
   - Selecciona la opción `Deploy from a branch`
   - En `Branch`, elige la rama principal (normalmente `main` o `master`)
   - En el selector de directorio, selecciona `/docs`
   - Haz clic en `Save`

Una vez configurado, GitHub procesará tu sitio y lo publicará. La URL de tu sitio será similar a:
`https://[nombre-usuario].github.io/aleph-mcp/`

## Personalización del Dominio (Opcional)

Si deseas usar un dominio personalizado:

1. En la misma sección `Pages` de la configuración
2. En `Custom domain`, introduce tu dominio personalizado
3. Haz clic en `Save`
4. Sigue las instrucciones para configurar los registros DNS necesarios

## Contenido del Sitio

Todo el contenido del sitio debe estar en el directorio `/docs`:

- `index.html` - Página principal
- `styles.css` - Estilos CSS
- `script.js` - JavaScript para interactividad
- `DOCUMENTATION.md` - Documentación detallada

## Actualización del Sitio

Para actualizar el sitio, simplemente modifica los archivos en el directorio `/docs` y haz commit de los cambios a la rama principal. GitHub Pages automáticamente desplegará los cambios.
