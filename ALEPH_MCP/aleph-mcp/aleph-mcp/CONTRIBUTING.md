# Aleph MCP Contributing Guide

¡Gracias por tu interés en contribuir a Aleph MCP! Este documento proporciona lineamientos para colaborar con el proyecto.

## Código de Conducta

Por favor, lee y sigue nuestro [Código de Conducta](CODE_OF_CONDUCT.md) en todas tus interacciones con el proyecto.

## Cómo Contribuir

1. **Reporta Bugs**: Usa el sistema de issues de GitHub para reportar bugs.
2. **Sugiere Mejoras**: Crea issues para proponer nuevas características o mejoras.
3. **Envía Pull Requests**: Contribuye con código realizando pull requests.

## Proceso de Pull Request

1. Asegúrate de que la feature o fix está relacionada con alguna issue existente.
2. Actualiza la documentación según corresponda.
3. Actualiza el CHANGELOG.md en el formato correcto.
4. Asegúrate de que todas las pruebas pasen antes de enviar el PR.
5. El título del PR debe ser descriptivo y seguir la convención de commit convencional.

## Estilo de Código

- Utilizamos ESLint y Prettier para mantener un estilo de código consistente.
- Asegúrate de ejecutar `npm run lint` y `npm run format` antes de enviar tus cambios.

## Versionado

Seguimos [SemVer](http://semver.org/) para el versionado:

- MAJOR version para cambios incompatibles con versiones anteriores (breaking changes)
- MINOR version para añadir funcionalidad de manera compatible
- PATCH version para correcciones de errores compatibles

## Registro de Cambios

- Mantén actualizado el archivo CHANGELOG.md según el formato Keep a Changelog.
- Agrupa los cambios en categorías: Added, Changed, Deprecated, Removed, Fixed, Security.

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar pruebas
npm test
```

## Preguntas

Si tienes alguna pregunta, no dudes en abrir una issue o contactar a los mantenedores.

---

¡Esperamos tu contribución!
