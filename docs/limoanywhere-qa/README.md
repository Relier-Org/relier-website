# QA del iframe de reservas de Relier

Revisión del 19–20 de septiembre de 2026. Pruebas en Chromium visible sobre
`relier.com`, con el CSS inyectado temporalmente dentro del iframe real.
Los cambios todavía no están publicados en Limo ni en Relier.

## Archivo listo para pegar

Usar [limoanywhere-custom-css-complete.css](../limoanywhere-custom-css-complete.css).
Guardar una copia del valor actual de **Custom CSS 7**, configuración **13**,
y reemplazar **todo** su contenido con el archivo completo, sin etiquetas
`<style>`. Este archivo incluye el tema original, formulario, login y los ajustes
de esta revisión. No hace falta agregar también `limoanywhere-layout-fix.css`.

También hay un cambio en
[ReservationWidget.module.css](../../components/ReservationWidget.module.css):
el proveedor escribe un ancho fijo en píxeles en el iframe al cotizar. La regla
local obliga a mantener su ancho dentro del contenedor al reducir la ventana o
rotar el dispositivo. **Este cambio requiere publicar el sitio de Relier**;
pegar CSS dentro de Limo no puede modificar el elemento iframe de la página padre.
Las pruebas responsive utilizaron ambos cambios en la vista previa.

## Recorrido funcional comprobado

| Área | Resultado y alcance |
| --- | --- |
| Búsqueda vacía | Muestra la alerta de validación del proveedor. |
| Transfer | Autocompletado real JFK → Times Square, fecha y pasajeros; cotización con seis categorías de vehículos. |
| Ida y vuelta | Cotización real con dos trayectos, direcciones invertidas y fechas correctas. |
| Hourly | Retorno al origen desactiva destino; cotización de cuatro horas con seis categorías. |
| Editar viaje | Edit visible en móvil; actualización a cinco horas y tres pasajeros; agregar y quitar parada. |
| Contacto | Campos utilizables en móvil y escritorio; email inválido rechazado por validación nativa. |
| Resumen | Ruta, importe y cupón legibles; un código de prueba inválido devuelve “Promo Code does not apply.” |
| Detalles | Selector de aerolínea, vuelo, equipaje y expansión de sillas infantiles; navegación anterior/siguiente. |
| Términos | Avanzar sin aceptar ni firmar queda bloqueado por la validación. Texto y superficie de firma visibles. |
| Facturación | Revisión visual del formulario ya cargado; dirección manual y sugerencias, alternancia con teclado, vencimiento y CCV. |
| Confirmación | Revisión visual del panel ya cargado y sus controles; no se pulsó la confirmación final. |
| Login | Revisión previa documentada: abrir/cerrar, Escape, campos vacíos y estados simulados de carga, error y éxito; no autenticación real. |

Se creó una cotización de prueba **#559**, usando QA Test y datos ficticios.
No se confirmó una reserva, no se aceptaron ni firmaron términos y no se
ingresaron tarjetas ni enviaron pagos. No se usaron acciones de envío de emails;
no se verificaron posibles notificaciones automáticas del proveedor.
Pago y confirmación se mostraron temporalmente desde el DOM para inspeccionar su
diseño: esto no demuestra que el procesamiento de pagos o la reserva final funcionen.

## Ajustes realizados

- Se conservaron el formulario responsive y el login con scroll de la revisión previa.
- Alertas del proveedor con superficie oscura, contraste y cierre accesible.
- Selector de aerolínea y búsqueda con tema coherente y flecha corregida.
- Indicador de pasos legible; en pantallas pequeñas permite desplazamiento horizontal.
- Itinerario y botón Edit restaurados en móvil; campos de edición sin ancho mínimo de 400 px.
- Contacto y teléfono con espacio suficiente para prefijo internacional.
- Facturación apilada en anchos pequeños, vencimiento y CCV sin compresión.
- Dirección manual sin campos colapsados; retorno a sugerencias conserva el diseño.
- Texto legal legible y firma sobre fondo claro para que se vea la tinta negra.
- Cupón con campo amplio y botón táctil; confirmación apilada en móvil.
- Placeholder con mayor contraste, foco visible y campos móviles de 16 px.
- Contenedor del iframe responsive en el CSS del sitio padre.

## Verificación responsive

Los cinco paneles del asistente se midieron en **16 anchos de ventana**:
320, 390, 600, 601, 651, 652, 653, 768, 977, 978, 979, 1024, 1086, 1087,
1088 y 1440 px. Incluyen los bordes alrededor de los breakpoints internos del
iframe. En las **80 combinaciones** no se detectó desborde horizontal ni controles
de texto visibles por debajo del umbral de 90 px de la comprobación.

La dirección manual se verificó además en los 16 anchos: sin desborde y con
campos de al menos 150 px. Contacto se verificó en cinco tamaños, desde una
ventana de 320 px, con campos de al menos 212 px. La lista de vehículos también
se revisó en cinco tamaños. Las comprobaciones geométricas se complementaron
con interacción y capturas; no equivalen a una auditoría completa de accesibilidad.

- [Resultados de los 80 casos](breakpoint-results.json)
- [Dirección manual](manual-address-results.json)
- [Contacto](contact-results.json)
- [Edición del viaje en móvil](22-edit-trip-mobile-after.png)
- [Contacto en móvil](26-contact-mobile-after.png)
- [Pago en escritorio](25-payment-desktop-after.png)
- [Pago en móvil](matrix-after-payment_information-390.png)
- [Términos en móvil](matrix-after-tos_accept-390.png)
- [Login y revisión inicial](../limoanywhere-layout-review/README.md)

TypeScript (`npx tsc --noEmit`), lint (`npm run lint`), build de producción
(`npm run build`) y `git diff --check` pasaron. El build conserva advertencias
existentes de metadataBase y next-intl/Webpack.

## Pendientes del proveedor y límites de la prueba

1. **Fecha de regreso:** su mínimo permanece en la fecha actual en vez de la
   fecha de ida. Con ida el 15 de octubre, regreso el 14 supera `checkValidity()`.
   Se restauró una fecha correcta antes de cotizar; no se probó cómo responde el
   servidor a ese caso inválido. Requiere validación del proveedor o JavaScript,
   no CSS.
2. El número de vuelo muestra un asterisco, pero permite continuar vacío y su
   placeholder indica que es opcional. Conviene unificar texto y validación.
3. No se probaron autenticación real, cupón válido, tokenización, cobro,
   confirmación final, notificaciones ni errores reales del servidor de reservas.
4. Las medidas móviles se hicieron en Chromium, no en dispositivos iOS/Safari.
5. Después de guardar el CSS y publicar Relier, queda verificar la versión
   publicada sin inyección local y con recarga de caché.
