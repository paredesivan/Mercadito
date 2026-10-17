# Ampliación de pruebas de Mercadito — 17/10/2026

## Archivos para subir

| Archivo del ZIP | Ruta en GitHub | Acción |
|---|---|---|
| integridad.test.cjs | tests/Unit/integridad.test.cjs | Agregar archivo nuevo; Unit lleva U mayúscula |
| integridad.spec.cjs | tests/e2e/integridad.spec.cjs | Agregar archivo nuevo |
| pruebas.yml | .github/workflows/pruebas.yml | Reemplazar el workflow existente |
| REGISTRO_CAMBIOS.md | REGISTRO_CAMBIOS.md | Reemplazar registro |

El ZIP conserva esas carpetas. Si se cargan desde el teléfono, entrar en cada carpeta de GitHub y subir el archivo correspondiente. No subir el ZIP como sustituto de sus archivos. No hace falta cambiar index.html, package.json, lockfile ni las pruebas anteriores. La base revisada es el commit 745bafe7b00729430df77824d7d792a366bbb396.

## Qué se controla

- Validez: rechazar costos y cantidades inválidas, fechas imposibles y renglones mal formados.
- Exactitud: redondeo por renglón, descuentos, totales, costo y ganancia; también ganancias negativas. Hay 300 escenarios con una fórmula de referencia independiente.
- Unicidad: EAN, identificadores y números de ticket duplicados en respaldos; proveedores con distinta capitalización en el formulario.
- Consistencia: detectar importes alterados en respaldos y conservar la numeración.
- Conservación: viaje JSON de respaldo sin pérdida de datos; las vistas previas no modifican entradas; editar o borrar un artículo no cambia tickets históricos.
- Importación: separar filas válidas de erróneas, no aplicar duplicados, conservar ceros iniciales, y cancelar sin modificar el catálogo.
- Exportación: CSV con tildes, comillas, saltos y protección frente a fórmulas.
- Persistencia: los E2E inspeccionan IndexedDB y recargan la página para comprobar datos guardados.

## Resultados y límites reales

- Se conservan sin cambios los 13 tests unitarios anteriores y los 4 E2E anteriores.
- Se agregan 51 pruebas unitarias (64 en total) y 5 E2E (9 en total).
- Las 64 unitarias pasan en UTC y America/Argentina/Buenos_Aires. Incluyen ejecución de las 10 autopruebas integradas existentes.
- Los 5 E2E nuevos se comprobaron sintácticamente y se descubren correctamente junto con los 4 existentes. Su ejecución funcional queda pendiente: este entorno bloqueó el arranque de Chromium antes de abrir la página. No se informa aprobación de esos recorridos.
- GitHub ejecutará las unitarias en ambas zonas horarias y los 9 E2E, en trabajos independientes, en cada push, pull request o ejecución manual. Un fallo unitario no impide que se intenten los E2E.
- Revisar que los tres trabajos estén verdes. En Actions, abrir la ejecución de «Pruebas de Mercadito». El artefacto «informe-pruebas-mercadito» contiene el informe HTML y, si fallaron pruebas de navegador, trazas y capturas. Se conserva 14 días.
- Subir varios archivos por separado genera ejecuciones intermedias: evaluar la última ejecución después de terminar todas las cargas.

Las pruebas verifican reglas y escenarios concretos; no garantizan ausencia de errores ni verifican que un precio escrito corresponda al precio real del proveedor. No cubren todos los navegadores, un lector físico, cámara real, concurrencia entre pestañas ni fallos físicos de almacenamiento. Los datos siguen guardándose en el navegador: los tests no reemplazan las copias de seguridad. Una Action informa fallos; por sí sola no bloquea una publicación de GitHub Pages.
