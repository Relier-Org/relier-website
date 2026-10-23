# Confirmación y conversiones de reservas

## Señal para GTM

`ReservationWidget` recibe el `purchase` nativo de Limo Anywhere y publica
`relier_reservation_complete` en el dataLayer del sitio. Requiere origen exacto
de Relier en AddOns/mylimobiz, la ventana del iframe de ese widget, un ID de
transacción válido, moneda y un importe numérico no negativo. Los mensajes de
resize y las etapas anteriores del checkout no cuentan como conversión.

El hook solo se publica si hay `NEXT_PUBLIC_GTM_ID` configurado y consentimiento
vigente de marketing. Los eventos rechazados por falta de consentimiento no se
guardan ni se reproducen después. Un mismo transaction_id se publica una vez por
carga del documento, incluso después de navegar entre rutas de Next.js.

```js
{
  event: "relier_reservation_complete",
  booking_provider: "limo_anywhere",
  transaction_id: "<id enviado por Limo Anywhere>",
  currency: "USD",
  value: 240.84
}
```

Se reenvían solo esos campos. No se copian emails, teléfonos, nombres, datos de
pago ni user_data. La integración nativa del proveedor sigue siendo responsable
de `purchase` en GA4: el hook no vuelve a llamar a gtag ni al pixel de Meta.

### Configuración necesaria en el contenedor de Flor

Crear un activador de evento personalizado `relier_reservation_complete` y
variables de capa de datos `transaction_id`, `currency` y `value`. Utilizar ese
activador para la etiqueta de conversión de Google Ads (su Conversion ID y label
deben provenir de la acción de conversión real) y Meta Purchase. En Ads pasar
transaction_id como Transaction ID; en Meta usarlo como eventID si se combina
con CAPI. No añadir otra etiqueta GA4 purchase sobre este hook ni activar dos
etiquetas de compra para el mismo proveedor/acción.

El código por sí solo NO configura ni publica etiquetas en GTM. El acceso y las
acciones de conversión de Ads/Meta deben comprobarse antes de publicar el
contenedor. La deduplicación local no reemplaza la deduplicación por ID de las
plataformas, especialmente después de recargar o si se combina con CAPI/imports.

## Estado observado en AddOns, 22-oct-2026

- Formulario 13: DEV - Next Embed, Horizontal (Modern), CSS #7.
- GA4 del formulario: `G-CV2QZ9VV0M` (override del GTM global).
- LQC > Marketing > Analytics: Google Tag Manager Code vacío; Meta Pixel y token
  vacíos; nombre de conversión offline Google `Relier`, ventana de 7 días.
- Conteo nativo: por vehículo, con dos conversiones en ida/vuelta. No se cambia
  automáticamente: hay que acordar con medición si se cuentan tramos o ventas.
- El ID de compañía `gelimoservice` corresponde a la conexión de Relier.
- ORES tiene otros IDs (GA4 `G-JZE4S6VRG3`, GTM `GTM-KDDTHMM8`), separados del
  override del formulario 13. No copiarlos sobre LQC sin verificar su propósito.

La guía dentro de LQC > Marketing > Analytics > Setup Guide documenta purchase
al confirmar la reserva. El envelope gtag_event se observó en el HTML archivado
del checkout para otros eventos; falta capturar y comprobar el purchase real.
No fabricar un éxito ni completar una reserva de producción para probarlo.

## Thank You

Plantilla guardada en Secure (#2): `docs/limoanywhere-thank-you.html`.

Ruta: AddOns > Lead Quote Close > Settings > Booking Quote Config > Secure
(#2) > Thank You Page > Source code. Selections aplica Secure mediante Always
(factor 367), con una excepción SPAIN (factor 381, configuración #102), que no
se modificó. Se conservó el HTML anterior en
`docs/limoanywhere-thank-you-secure-original.html`.

Después de guardar, se volvió a abrir Secure y se compararon los campos del
formulario: el único campo modificado fue `thank_you_page`. La vista previa del
panel muestra la plantilla actualizada; las variables se sustituyen durante la
reserva real. No se completó ninguna reserva de producción.

La plantilla mantiene variables y enlaces de calendario, usa fondo oscuro y
colores explícitos para evitar el texto claro sobre los fondos blancos del
HTML anterior. Incluye `#relier-reservation-confirmed`,
`.relier-reservation-success` y `#relier-confirmation-code` como hooks internos.
No incluye scripts: la conversión depende del evento del proveedor, no del DOM.

No modificar Whitelisted Hosts, precios, pagos, acciones de reserva o términos.

## Verificación

Pruebas del parser, origen/source y deduplicación: compilar
`lib/booking/conversion.test.ts` con TypeScript a un directorio temporal y
ejecutar el archivo JS con `node --test`. Son fixtures sintéticos y no envían
reservas ni tráfico de conversiones.

Antes de dar por terminada la integración: comprobar el hook con Tag Assistant
y una reserva de prueba coordinada; verificar importe/moneda/transaction_id,
ausencia de doble GA4 purchase, consentimiento y las etiquetas de Ads/Meta.
Verificar el HTML guardado a 390 px y escritorio con el CSS real del proveedor.

TypeScript, lint y las cinco pruebas del parser pasaron. La plantilla se revisó
a 390 px y escritorio con el CSS existente, sin desbordamiento horizontal.

Estado al 23-oct-2026: el hook está desplegado en relier.com y la Thank You
guardada en Limo Anywhere. **Falta la configuración de GTM** (activador,
variables y etiquetas de Ads/Meta, a cargo de Flor): hasta entonces el evento
llega al dataLayer pero ninguna etiqueta lo consume. No se verificó todavía una
conversión de extremo a extremo.
