# Analytics y tags

Todo se enciende con dos env vars. Sin ellas el sitio no carga ni un tag, que es
lo que queremos en local: ningún `npm run dev` debería aparecer en los reportes
del cliente.

```bash
NEXT_PUBLIC_GTM_ID=GTM-KCLH74B7    # Google Ads + Meta pixel (vía container)
NEXT_PUBLIC_GA4_ID=G-CV2QZ9VV0M    # GA4, cableado directo
```

En Vercel están cargadas **solo en Production**, a propósito: los deploys de
preview por branch no tienen que ensuciar los datos.

## Qué corre y por qué

| Capa | ID | Cómo entra |
| --- | --- | --- |
| GTM | `GTM-KCLH74B7` | snippet propio, `components/analytics/GoogleTagManager.tsx` |
| Google Ads | `AW-17772455341` | **dentro** del container |
| Meta pixel | `4423881761234988` | **dentro** del container |
| GA4 | `G-CV2QZ9VV0M` | gtag directo, `components/analytics/GoogleAnalytics.tsx` |

**GA4 va aparte porque ningún container lo trae.** Se comprobó cargando cada
container aislado en un HTML vacío y mirando qué salía por la red:

| Container | Dispara |
| --- | --- |
| `GTM-KCLH74B7` | Ads `AW-17772455341` + Meta `4423881761234988` |
| `GTM-T7N9T6J9` | Ads `AW-17772455341` y nada más |

Ninguno de los dos tiene un tag de GA4. En el WordPress, `G-CV2QZ9VV0M` entra por
un lado completamente distinto: **Google Site Kit**, que inyecta su propio Google
tag `GT-NB9VDKSH` y tiene la propiedad configurada como destination. Acá no hay
Site Kit, así que si no lo cableábamos a mano no había GA4.

Si el equipo de performance agrega un tag de GA4 al container, hay que **borrar
`NEXT_PUBLIC_GA4_ID`** o cada pageview se cuenta dos veces.

## Navegación client-side

No hay hook de route change, y es deliberado: las dos capas ya lo manejan solas.
Medido, no asumido — 4 páginas (home + 3 clicks internos) dieron **exactamente 4
`page_view`** en GA4, con las URLs correctas.

- **GA4** dispara su propio `page_view` en history change (enhanced measurement).
- **GTM** empuja `gtm.historyChange-v2` al dataLayer de forma nativa.

Un envío manual encima de eso duplica. Se probó: un
`gtag('event','page_view')` propio daba dos hits por navegación.

**Ojo al medir esto:** GA4 batchea eventos en el **body** del POST a
`/g/collect`, no solo en el query string. Contar `en=` en la URL da lecturas
falsas — hits que parecen faltar y otros que parecen duplicados. Hay que parsear
el body también.

## Lo que quedó pendiente del lado del container

Dos cosas que no se arreglan desde el código:

1. **Ads y Meta no cuentan las navegaciones client-side.** Sus tags disparan solo
   al cargar el container, así que en una SPA registran la primera página de cada
   sesión y nada más. Se arregla agregándoles un trigger de History Change en
   GTM. El evento `gtm.historyChange-v2` ya está en el dataLayer esperando.
2. **El pixel de Meta se inicializa pero no manda `PageView`.** Se ve el
   `signals/config/4423881761234988` y `fbq` queda como función con el pixel
   registrado, pero no sale ningún request a `facebook.com/tr`. **El WordPress se
   comporta igual**, así que no es algo que rompimos nosotros: es cómo está
   configurado el tag en el container.

## El WordPress actual, para referencia

Relevado el 18-ago-2026 cargando `relier.com` y mirando la red. Está acumulado:

| Loader | Qué dispara |
| --- | --- |
| GTM `GTM-T7N9T6J9` | Ads `AW-17772455341` |
| GTM `GTM-KCLH74B7` | Ads `AW-17772455341` + Meta `4423881761234988` |
| gtag hardcodeado en el head | GA4 `G-JZE4S6VRG3` + GA4 `G-13FRG3L2MP` + Ads `AW-10836195222` |
| Site Kit `GT-NB9VDKSH` | GA4 `G-CV2QZ9VV0M` |
| HubSpot `45175211` | **nada** — el script está dentro de un comentario HTML sin cerrar |

Tres cosas que valen una decisión del equipo de performance:

- **Ads `AW-17772455341` dispara dos veces** en el sitio actual, una por cada
  container. Acá instalamos un solo container, así que queda una sola vez.
- **`GTM-T7N9T6J9` es redundante:** todo lo que hace ya lo hace `GTM-KCLH74B7`.
  No lo replicamos.
- **Hay dos propiedades de GA4 más** (`G-JZE4S6VRG3`, `G-13FRG3L2MP`) y **otra
  cuenta de Ads** (`AW-10836195222`) recibiendo datos hoy que no están en la
  lista que nos pasaron. Si alguna de esas propiedades es la que realmente miran,
  hay que sumarla: `NEXT_PUBLIC_GA4_ID` acepta lista separada por comas
  (`G-CV2QZ9VV0M,G-JZE4S6VRG3`) y la primera es la que carga gtag.js.
- **HubSpot no lo portamos.** No funciona en el sitio actual y no estaba en la
  lista de IDs que nos pasaron.

## Consentimiento (GDPR)

No hay banner de cookies. Hoy los tags cargan para todo el mundo, incluida la UE
— y Relier tiene oficina en Barcelona y una página Relier Europe. GTM más un
pixel de Meta sin consentimiento previo es exposición real bajo GDPR. No lo
resolvimos porque implica una decisión del cliente (qué CMP, qué bloquear, qué
copy legal) y porque el sitio actual tampoco lo tiene. **Queda flaggeado.**
