# Registro de cambios solicitados — Mercadito

Describe el propósito de cada commit visible en el historial, además de lo comprobable en su parche. “Intento” no significa que haya funcionado. Cuando no hay prueba o el parche no está disponible, lo indico.

## Historial revisado hasta el 16/10/2026

| Hora (Argentina) | Commit | Cambio intentado / evidencia y resultado conocido |
|---|---|---|
| 11:56 | [eeed494](https://github.com/paredesivan/Mercadito/commit/eeed494567e12eb24d33ae35bcb95fd61d46924a) | Crear repositorio. Solo agrega README inicial. |
| 12:21 | [796b0f9](https://github.com/paredesivan/Mercadito/commit/796b0f9c3faa46b4d49ac9128450eb786715dc61) | Subir primera versión de la aplicación. El parche no está disponible; funciones incluidas no reconstruibles. |
| 12:44 | [490840e](https://github.com/paredesivan/Mercadito/commit/490840e3df0080ad01589a999688b50242b18967) | Simplificar la pantalla de venta: quitar encabezado y ocultar artículos hasta que se busque. El código implementa búsqueda y muestra coincidencias. |
| 13:14 | [4383b38](https://github.com/paredesivan/Mercadito/commit/4383b38db7cb421e02e7cc7425ff31c7e59bfef0) | Ajustar filtro de proveedor y edición en artículos/venta. Mueve el filtro a la pestaña de artículos. Luego se reportó que el filtro al cargar un artículo no funcionaba; no consta aquí resolución confirmada. |
| 13:36 | [c3a9f34](https://github.com/paredesivan/Mercadito/commit/c3a9f34686fc09bbb8b5e86b78ebf99825b70955) | Elegir proveedor existente o escribir uno nuevo al cargar/editar artículo. El parche agrega selección y campo condicional. |
| 14:42 | [fb078ac](https://github.com/paredesivan/Mercadito/commit/fb078ac984a81947c485b9163757057498a724f2) | Carga desde editor. Sin archivos/parche disponibles: objetivo no identificable. |
| 14:55 | [270fa6e](https://github.com/paredesivan/Mercadito/commit/270fa6ee7064c0cc0fd2b02d6dbae0ac26d49a5f) | Carga desde editor. Sin archivos/parche disponibles: objetivo no identificable. |
| 14:59 | [f55d5cf](https://github.com/paredesivan/Mercadito/commit/f55d5cf60f4c76b0b669452ea136f96c4479cabe) | Ajustes de interfaz/textos en index.html; el parche no permite reconstruir todo el objetivo. |
| 15:08 | [847d452](https://github.com/paredesivan/Mercadito/commit/847d45240641e0bdd1a13d02fcffeb972d9ece36) | Ajustar flujo tras guardar venta y detalle del ticket. Cambia cierre y reinicio de búsqueda; no abre ticket automáticamente al guardar. |
| 15:20 | [6b8b401](https://github.com/paredesivan/Mercadito/commit/6b8b40190b7ec5714a4b0562a9ea4689d67bdcb9) | Mejorar flujo del ticket: abrirlo tras guardar y volver a venta al cerrar/eliminar. El parche implementa esa navegación; sin prueba de interfaz adjunta. |
| 15:36 | [b6c3f64](https://github.com/paredesivan/Mercadito/commit/b6c3f649f98fec7b65a131abd065cce79c611837) | Carga desde editor. Sin archivos/parche disponibles: objetivo no identificable. |
| 15:43 | [73370e9](https://github.com/paredesivan/Mercadito/commit/73370e9842ec35bf1828ae03f021fab479995e7d) | Carga desde editor. Sin archivos/parche disponibles: objetivo no identificable. |
| 15:50 | [de35168](https://github.com/paredesivan/Mercadito/commit/de35168f24f0fbc94cee08ab811441820dcf1fdc) | Subida de index.html, mensaje «1549». Sin parche disponible: cambio funcional no identificable. |
| 16:04 | [37da153](https://github.com/paredesivan/Mercadito/commit/37da153036b0740542944eea1bc64c12d8c76bd5) | Carga desde editor. Sin archivos/parche disponibles: objetivo no identificable. |
| 16:04 | [b0d7606](https://github.com/paredesivan/Mercadito/commit/b0d7606f6d279d3ee5e41d1570a2fb4c3a1171a3) | Subida con mensaje «1604». Sin parche disponible: cambio no identificable. |
| 16:24 | [0e3b558](https://github.com/paredesivan/Mercadito/commit/0e3b558581c0348335b8118aeeda889e655882f4) | Eliminar index.html. |
| 16:25 | [1f81625](https://github.com/paredesivan/Mercadito/commit/1f816251dadac790e8179debf25bd4e6a19c8afc) | Volver a cargar index.html tras su eliminación. Sin parche disponible. |
| 16:38 | [0363310](https://github.com/paredesivan/Mercadito/commit/03633107353b4d072991e77b9322e3ff05750d82) | Diferenciar escaneo: lector USB en computadora y cámara/QR en celular. El código detecta teléfonos y cambia etiqueta del botón. |
| 16:44 | [dc1474a](https://github.com/paredesivan/Mercadito/commit/dc1474a6a68db50ba75ab2bca7ac26595aa925d2) | Ajustar repetición de lecturas de cámara para permitir detectar un nuevo código. |
| 16:57 | [650cda2](https://github.com/paredesivan/Mercadito/commit/650cda2cac446b7cbf86d875cc62b4833697e31d) | Agregar paletas de colores y mejorar ayuda del escáner. |
| 17:14 | [ae21032](https://github.com/paredesivan/Mercadito/commit/ae210325189f6d83743298512dd85463c2a14395) | Evitar lecturas repetidas del mismo QR en el escáner continuo mediante una espera. |
| 17:19 | [4b96744](https://github.com/paredesivan/Mercadito/commit/4b967444802ed25181d0b5f0a6f82065d08ea21e) | Añadir sonido breve al aceptar un código leído por cámara. |
| 17:22 | [9c9ccf9](https://github.com/paredesivan/Mercadito/commit/9c9ccf9a84cee311c193bf7f542e65f29d6e439c) | Limitar la frecuencia de lecturas aceptadas en modo continuo. |
| 17:34 | [98e9c73](https://github.com/paredesivan/Mercadito/commit/98e9c738d021a4d536166266c4f15ff297650aa7) | Ajustar diálogo de cámara para que entre con el botón de cierre en pantalla móvil. |
| 17:47 | [e6694a8](https://github.com/paredesivan/Mercadito/commit/e6694a84803b02e76f6b42deed6214912398c20e) | Reforzar cálculos/validaciones de tickets y agregar pruebas de lógica. Esas pruebas no verifican cámara ni interfaz real. |
| 18:17 | [5199652](https://github.com/paredesivan/Mercadito/commit/5199652ac6cc9e21e7cad249cfa9ed00e513dc58) | Añadir opción de tamaño de letra en configuración y guardar elección. |
| 18:28 | [b5ce294](https://github.com/paredesivan/Mercadito/commit/b5ce294e90a1abfd63b5aa24955100cf67c96228) | Corregir botones de tamaño de letra reportados como inactivos; conectar sus eventos directamente. Intento de corrección pendiente de prueba en la página. |
| 15/10 19:15 | [1b8fac0](https://github.com/paredesivan/Mercadito/commit/1b8fac001aa5469d9f27f7d70c00d0488f16f90f) | Agregar este registro al repositorio. Cambio administrativo; no modifica la aplicación. |
| 16/10 11:56 | [752cb61](https://github.com/paredesivan/Mercadito/commit/752cb617721cb8c92d55d915fc28572a245de63f) | Unificar el filtro de proveedores sin distinguir mayúsculas/minúsculas. Las opciones y la comparación usan el nombre normalizado; el cambio está en el código. Todavía no tenía pruebas automáticas de interfaz. |

## Actualización a futuro

Cuando me pidas un cambio en Mercadito, revisaré el historial actualizado y agregaré una fila con el commit, el objetivo, el cambio comprobable y el resultado conocido. Si el parche no está disponible o no hay prueba, quedará explícito en el registro.

La revisión llega hasta 752cb61. El registro también incluye 1b8fac0, que lo agregó al repositorio como cambio administrativo.

## Pruebas preparadas — 16/10/2026 (pendientes de subir)

Por pedido del usuario se preparó un paquete con pruebas unitarias para la lógica de `MercaditoCore`, verificación de sintaxis, ejecución de las 10 autopruebas existentes y cuatro recorridos E2E con Chromium. Una GitHub Action correrá el conjunto en cada `push`, pull request y ejecución manual.

**Verificación local:** 13/13 pruebas unitarias y 4/4 E2E aprobadas sobre el estado de `main` (752cb61). El paquete todavía no está subido al repositorio, por lo que la Action aún no tiene una ejecución en GitHub.

## Ampliación de integridad — 17/10/2026 (pendiente de subir)

Base inspeccionada: 745bafe7b00729430df77824d7d792a366bbb396. Se preparan dos archivos nuevos sin modificar las pruebas anteriores: `tests/Unit/integridad.test.cjs` (51 casos nuevos; 300 escenarios de cálculo dentro de uno de ellos) y `tests/e2e/integridad.spec.cjs` (5 recorridos nuevos). El workflow conserva disparadores push/PR/manual, separa unitarias y E2E, prueba dos zonas horarias y guarda informes de navegador.

Resultado local: 64/64 pruebas unitarias aprobadas en UTC y Argentina. Los 9 E2E se descubren; no se pudieron ejecutar porque Chromium no puede iniciarse en este entorno. Validación funcional pendiente en GitHub. No se modificó directamente el repositorio; sin commit nuevo asignado todavía. Detalle de alcance y carga en LEEME_PRUEBAS_INTEGRIDAD.md.
