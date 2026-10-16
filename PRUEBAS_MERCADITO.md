# Pruebas automáticas de Mercadito

Este paquete agrega una verificación que GitHub ejecuta al recibir cualquier cambio y al abrir o actualizar un pull request. También se puede iniciar manualmente desde **Actions → Pruebas de Mercadito → Run workflow**.

## Qué se prueba

- **Sintaxis:** revisa los scripts JavaScript que están dentro de `index.html`.
- **Lógica unitaria:** importa el código real `MercaditoCore` desde `index.html` y prueba importes, cantidades, cálculos, artículos, numeración, tickets, importaciones, CSV, QR, fechas y respaldos.
- **Autopruebas integradas:** ejecuta las 10 comprobaciones que ya tiene Mercadito.
- **E2E con Chromium:** inicia la web en un servidor local y prueba alta de artículos, venta con descuento, ticket y resumen después de recargar, importación de planilla pegada, filtro de proveedores con distintas mayúsculas, exportación CSV y guardado del tamaño de letra.

## Archivos del paquete

Descomprimí todo en la carpeta principal del repositorio, conservando estas rutas:

```text
package.json
package-lock.json
.gitignore
playwright.config.cjs
PRUEBAS_MERCADITO.md
REGISTRO_CAMBIOS.md
.github/workflows/pruebas.yml
tests/server.cjs
tests/unit/core.test.cjs
tests/e2e/mercadito.spec.cjs
```

Subí esos archivos y carpetas al repositorio `paredesivan/Mercadito` y confirmá el cambio. GitHub Actions ejecutará las pruebas automáticamente. El resultado queda en la pestaña **Actions**, en el flujo **Pruebas de Mercadito**.

## Ejecutarlas en una computadora

Con Node.js 22 o posterior, desde la carpeta del proyecto:

```bash
npm ci
npx playwright install chromium
npm test
```

En una computadora Linux local puede hacer falta `npx playwright install --with-deps chromium`. GitHub instala Chromium y sus dependencias en el workflow.

## Qué significa un fallo

Una prueba roja identifica el recorrido o cálculo que dejó de coincidir con el resultado esperado. Revisá el nombre de la prueba y el detalle en **Actions** antes de subir una corrección adicional. Las pruebas cubren las funciones indicadas arriba; no reemplazan una comprobación física de cámara, lector USB, impresora ni de cada navegador y teléfono.

Si se sube directo a `main`, GitHub ejecuta las pruebas después de crear el commit. Para impedir que un cambio con pruebas fallidas se integre antes de publicarse, hay que usar una rama y un pull request, y configurar en GitHub la comprobación **Pruebas de Mercadito / Unitarias y E2E** como obligatoria para la rama `main`.
