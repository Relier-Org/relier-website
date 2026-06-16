/* =========================================================
   RELIER - Lead Form (Horizontal) - Dark / Champagne
   Custom CSS #7, asignado a config 13
   ========================================================= */

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Manrope:wght@400;500;600&display=swap');

:root {
  --rl-bg: #0A0A0A;
  --rl-surface: #121212;
  --rl-tile: #12121A;
  --rl-elev: #1A1A1A;

  --rl-text: #F5F7F9;
  --rl-text-2: #C5CDD5;
  --rl-label: #A0A8B0;
  --rl-muted: #7A8189;
  --rl-placeholder: #5C636A;

  --rl-accent: #C9A961;
  --rl-accent-hover: #D0B062;
  --rl-on-accent: #0A0A0A;

  --rl-border: rgba(197,205,213,.18);
  --rl-border-subtle: rgba(197,205,213,.10);
  --rl-border-strong: rgba(197,205,213,.32);
  --rl-border-accent: rgba(201,169,97,.32);

  --rl-error: #E67373;
  --rl-radius: 4px;

  --rl-display: 'Fraunces','Cormorant Garamond',Georgia,serif;
  --rl-body: 'Manrope',-apple-system,BlinkMacSystemFont,sans-serif;
  --rl-ease: cubic-bezier(0.16,1,0.3,1);
}

/* Pagina transparente: deja ver el fondo oscuro del sitio Next */
html, body { background: transparent !important; }
body, #content, #lead_form { font-family: var(--rl-body); color: var(--rl-text); }

h1, h2, h3 {
  font-family: var(--rl-display) !important;
  font-weight: 400; letter-spacing: -.02em; color: var(--rl-text);
}

label {
  font-family: var(--rl-body) !important;
  font-size: 10px; font-weight: 500; letter-spacing: .16em;
  text-transform: uppercase; color: var(--rl-label);
}

/* ---------- Barra horizontal (paso 1) ---------- */
#lead_form {
  background: var(--rl-surface) !important;
  border: 1px solid var(--rl-border);
  border-radius: var(--rl-radius);
  padding: 18px; color: var(--rl-text);
}

/* Inputs underline */
.form-control {
  background: transparent !important;
  border: 0 !important;
  border-bottom: 1px solid var(--rl-border) !important;
  border-radius: 0 !important;
  color: var(--rl-text) !important;
  font-family: var(--rl-body); font-size: 15px;
  padding: 12px 2px !important; box-shadow: none !important;
}
.form-control::placeholder { color: var(--rl-placeholder); }
.form-control:hover { border-bottom-color: var(--rl-border-strong) !important; }
.form-control:focus { border-bottom-color: var(--rl-accent) !important; outline: none; box-shadow: none !important; }
.form-control.is-invalid, .form-control:invalid { border-bottom-color: var(--rl-error) !important; }

/* Boton submit (#book_button en horizontal): radio afilado, no pill */
#book_button, input[type="submit"], .btn-default {
  background: var(--rl-accent) !important; color: var(--rl-on-accent) !important;
  border: 0 !important; border-radius: var(--rl-radius) !important;
  font-family: var(--rl-body); font-size: 11px; font-weight: 500;
  letter-spacing: .18em; text-transform: uppercase;
  padding: 14px 28px !important; transition: all 180ms var(--rl-ease);
}
#book_button:hover, input[type="submit"]:hover, .btn-default:hover {
  background: var(--rl-accent-hover) !important;
  box-shadow: 0 0 0 1px rgba(201,169,97,.3), 0 0 32px rgba(201,169,97,.18);
}
#searching_text { color: var(--rl-accent); }

/* ---------- Autocomplete de direcciones ---------- */
.artusmode_autocomplete_results {
  background: var(--rl-elev) !important; border: 1px solid var(--rl-border) !important;
  border-radius: var(--rl-radius); color: var(--rl-text);
}
.artusmode_suggest_address { color: var(--rl-text-2); }
.artusmode_suggest_hover { background: rgba(201,169,97,.12) !important; color: var(--rl-text) !important; }

/* =========================================================
   RELIER - Pasos internos del wizard (quote / info / summary / pago)
   Cargan por AJAX; el template Bootstrap los pinta CLAROS. Aca se
   fuerza el tema oscuro y se garantiza legibilidad del texto.
   ========================================================= */

/* Lienzo de las paginas internas */
#content, .page { background: var(--rl-bg) !important; color: var(--rl-text-2) !important; }

/* Paneles que el template deja blancos. IDs reales del template Artusmode:
   #trip_info (ribbon pickup/dropoff), #personal_information (form de datos).
   + catch-all de Bootstrap por si aparece algun panel sin id propio.
   OJO: NO tocar el canvas de la firma (queda blanco a proposito). */
#trip_info, #personal_information, #ribbon,
.summary_vehicle, .line_item_wrapper,
#content .panel, #content .panel-body, #content .panel-heading,
#content .panel-footer, #content .well {
  background-color: var(--rl-surface) !important;
  color: var(--rl-text) !important;
  border: 1px solid var(--rl-border) !important;
  border-radius: var(--rl-radius) !important;
}

/* Bloque del precio por vehiculo (panel blanco en Select your ride).
   min-width para que "Reserve <vehiculo>" entre en una sola linea. */
.vehicle-price {
  background-color: var(--rl-tile) !important;
  border: 1px solid var(--rl-border) !important;
  border-radius: var(--rl-radius) !important;
  color: var(--rl-text) !important;
  min-width: 200px !important;
}

/* Texto legible dentro de los pasos */
#content, #content .page, #trip_info, #personal_information, #ribbon,
#content .panel, #content .panel-body,
.cost_breakdown, #billing_language, #tos { color: var(--rl-text-2) !important; }
#content strong, #content b,
#trip_info strong, #trip_info b, #personal_information strong,
.vehicle_name, #content h1, #content h2, #content h3 { color: var(--rl-text) !important; }
.trip_total { color: var(--rl-accent) !important; font-family: var(--rl-display); }
.trip_total th { color: var(--rl-accent) !important; }

/* Reservation Summary: el <section> blanco del template se integra al fondo
   oscuro; el card .summary_vehicle queda como unica superficie (sin caja
   dentro de caja). Textos sueltos del summary, legibles. */
.page section { background: transparent !important; color: var(--rl-text-2) !important; }
.vehicle_subtotal, .vehicle_subtotal th, .vehicle_subtotal td,
.trip_person, .trip_person label, #trip_summary p { color: var(--rl-text-2) !important; }

/* Iconos de equipaje / child seats (PNG oscuros): aclararlos sobre el dark */
.luggage_type img, .child_seat img { filter: invert(0.85) !important; opacity: .85; }

/* SOLO el tel: del Billing Contact (salia ROJO con el color de link del template).
   OJO: .page_next/.page_prev/.final_submit/.send_me_quote son <a> -> NO usar un
   selector amplio tipo "#content a" porque pinta el texto del boton y lo deja
   invisible (champagne sobre champagne). Targetear solo el contacto. */
.trip_person a { color: var(--rl-accent) !important; text-decoration: none !important; }
.trip_person a:hover { color: var(--rl-accent-hover) !important; }

/* =========================================================
   RELIER - Ajustes finos (cards, paneles anidados, iconos)
   ========================================================= */

/* Auto mas grande en Select your ride (hay espacio de sobra al centro) */
.category .thumbnail { width: 190px !important; max-width: none !important; }

/* #trip_info anidado en Your Information: el template repite el id y quedaba
   caja-dentro-de-caja. El interior se integra (sin panel propio). */
#trip_info #trip_info { background: transparent !important; border: 0 !important; padding: 0 !important; }

/* Iconos de los inputs de pago: el template los mete en .input-group-addon con
   fondo claro (cajas blancas). Los integramos al dark con acento champagne.
   (Los iconos son FontAwesome del template; no se pueden cambiar por los SVG
   del sitio, pero asi dejan de cortar el tema.) */
.input-group-addon {
  background: transparent !important;
  border: 1px solid var(--rl-border) !important;
  color: var(--rl-accent) !important;
}
.input-group .form-control { border-radius: 0 !important; }

/* Totales del Reservation Summary: alinear a la derecha como un bloque */
.vehicle_subtotal, .trip_total { float: right !important; clear: right !important; width: auto !important; }
.vehicle_subtotal table, .trip_total table { margin-left: auto !important; }

/* Imagen del vehiculo: mas grande (antes .thumbnail la achicaba al 70%) */
.vehicle_image, .summary_vehicle img, .category img, .thumbnail img {
  width: 100% !important;
  max-width: 240px !important;
  height: auto !important;
  background: transparent !important;
}
.line_item_image { max-width: 64px !important; height: auto !important; }

/* ---------- Seleccion de vehiculo (Select your ride) ---------- */
#cat_list { background: transparent !important; }
.category {
  background: var(--rl-tile) !important; border: 1px solid var(--rl-border) !important;
  border-radius: var(--rl-radius); padding: 16px;
  transition: transform .2s var(--rl-ease), border-color .2s var(--rl-ease);
}
.category:hover { transform: translateY(-2px); border-color: var(--rl-border-accent) !important; }
.thumbnail { background: transparent !important; border: 0 !important; }
.description, .long_description, .price { font-family: var(--rl-body) !important; color: var(--rl-text-2) !important; }
.book_subtext { background-color: var(--rl-accent) !important; color: var(--rl-on-accent) !important; border-radius: var(--rl-radius) !important; white-space: nowrap !important; padding: 12px 16px !important; }
.send_me_quote { background: transparent !important; border: 1px solid var(--rl-border-strong) !important; color: var(--rl-text) !important; border-radius: var(--rl-radius) !important; }
.send_me_quote:hover { border-color: var(--rl-accent) !important; }

/* ---------- Botones de navegacion del wizard ----------
   border:0 + box-shadow:none mata el borde/sombra fantasma del template. */
.page_button { font-family: var(--rl-body); border-radius: var(--rl-radius) !important; box-shadow: none !important; }
.page_next, .final_submit {
  background: var(--rl-accent) !important; color: var(--rl-on-accent) !important;
  border: 0 !important; box-shadow: none !important;
  text-transform: uppercase; letter-spacing: .18em; font-weight: 500;
}
.page_next:hover, .final_submit:hover { background: var(--rl-accent-hover) !important; }
.page_prev {
  background: transparent !important; color: var(--rl-text) !important;
  border: 1px solid var(--rl-border-strong) !important; box-shadow: none !important;
  text-transform: uppercase; letter-spacing: .18em; font-weight: 500;
}
.page_prev:hover { border-color: var(--rl-accent) !important; }

/* ---------- TOS / pago / stops ---------- */
ul.stops_list li { color: var(--rl-text-2) !important; border-color: var(--rl-border-subtle) !important; }
#tos { background: var(--rl-surface) !important; border: 1px solid var(--rl-border) !important; }
.line_item_wrapper { background: var(--rl-tile) !important; }
#wrap_credit_card, #promo_code { color: var(--rl-text) !important; }

/* =========================================================
   RELIER - Barra horizontal - controles paso 1
   Tabs Transfer/Hourly + date/time/selects nativos (dark)
   ========================================================= */

/* Tabs ARRIBA en su propia fila (el template los mete en una columna
   lateral de 15% que roba ancho a los inputs). Los pasamos a fila completa
   con los dos tabs en linea, y ensanchamos los campos. */
#type {
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  margin: 0 0 14px 0 !important;
}
#type br { display: none !important; }

/* Ancho de columnas SOLO en desktop. Critico: el template stackea en mobile con
   @media (max-width:600px){.input_group{display:block;width:96%}}. Si dejamos el
   14% sin media query (y declarado despues), gana en mobile -> campos apilados
   pero a 14% de ancho (inusables en celular). Scope a >=601px y mobile vuelve a
   apilar full-width como manda el template. */
@media (min-width: 601px) {
  .input_group { width: 14% !important; }
}

/* Mobile: el boton Quote quedaba mas ancho que los campos apilados y se iba del
   borde. Full-width + border-box para que alinee con los inputs, sin overflow. */
@media (max-width: 600px) {
  #book_button {
    width: 100% !important;
    box-sizing: border-box !important;
    margin: 12px 0 0 0 !important;
  }
}

/* Tabs Transfer / Hourly. Radio oculto; el label es el tab.
   Override del gris #353938 del template. */
#type input[type="radio"] + label {
  display: inline-block !important;
  width: auto !important;
  margin: 0 8px 0 0 !important;
  background: transparent !important;
  color: var(--rl-muted) !important;
  font-family: var(--rl-body) !important;
  font-size: 11px !important;
  font-weight: 500;
  letter-spacing: .16em;
  text-transform: uppercase;
  line-height: 1.2 !important;
  min-width: 0 !important;
  padding: 10px 18px !important;
  border: 1px solid transparent;
  border-radius: var(--rl-radius);
  transition: color 180ms var(--rl-ease), background 180ms var(--rl-ease), border-color 180ms var(--rl-ease);
}
#type input[type="radio"] + label:hover { color: var(--rl-text-2) !important; }
#type input[type="radio"]:checked + label {
  background: var(--rl-elev) !important;
  color: var(--rl-accent) !important;
  border-color: transparent !important;
}

/* Controles nativos en dark: color-scheme oscurece calendario,
   dropdown del select y spinners del number sin tocar librerias. */
.form-control,
#date_pickup, #time_pickup, #hours, #num_passengers { color-scheme: dark; }

/* Selects: caret champagne propio (url en UNA sola linea) */
select.form-control {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 22px !important;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23C9A961' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>") !important;
  background-repeat: no-repeat !important;
  background-position: right 2px center !important;
  background-size: 13px !important;
}

/* Valor seleccionado + opciones de los selects: legibles sobre oscuro.
   (El valor cerrado salia en un tono apagado; lo forzamos a texto claro
   y damos a las <option> fondo oscuro para el dropdown abierto.) */
select.form-control, #content select, #lead_form select {
  color: var(--rl-text) !important;
  line-height: 1.6 !important;
  height: auto !important;
}
select.form-control option, #content select option, #lead_form select option {
  color: var(--rl-text) !important;
  background-color: var(--rl-surface) !important;
}

/* Icono del date picker nativo, tintado a champagne */
#date_pickup::-webkit-calendar-picker-indicator {
  filter: invert(72%) sepia(38%) saturate(560%) hue-rotate(5deg) brightness(92%);
  opacity: .9;
  cursor: pointer;
}
#date_pickup::-webkit-calendar-picker-indicator:hover { opacity: 1; }

/* Spinners del number, discretos */
#num_passengers::-webkit-inner-spin-button,
#num_passengers::-webkit-outer-spin-button { opacity: .55; }
/* =========================================================
   RELIER - FIX PASS 2 (feedback Nico, screenshots)
   ========================================================= */

/* #2 Headers de paso legibles (algunos salian tenues, ej. YOUR INFORMATION).
   El color sin !important lo pisaba el template. */
h1, h2, h3,
#content h1, #content h2, #content h3,
.page h1, .page h2, .page h3 {
  color: var(--rl-text) !important;
  opacity: 1 !important;
}

/* #3 Select your ride: auto mas grande + menos espacio muerto en la card.
   La imagen estaba chica y la card muy alta con hueco al centro. */
.category { padding: 18px 22px !important; }
.category .thumbnail,
.category .thumbnail.carousel,
.category .thumbnail.max-250 { width: 100% !important; max-width: 300px !important; }
.category img, .thumbnail img { max-width: 300px !important; width: 100% !important; height: auto !important; }

/* #4 Sliver blanco a la derecha (paneles del template sin cubrir, sin ancestro
   #content). Cubrir paneles/wells genericos al tema oscuro. */
.panel, .panel-default, .panel-body, .panel-heading, .panel-footer, .well {
  background-color: var(--rl-surface) !important;
  border-color: var(--rl-border) !important;
  color: var(--rl-text-2) !important;
}

/* #4b Your Information: el template anida imagen + ribbon + form en un mismo
   wrapper #trip_info (con #personal_information adentro), lo que generaba
   caja-dentro-de-caja, anchos distintos y un sliver blanco a la derecha.
   Lo unificamos en UNA sola superficie limpia (overflow hidden mata el sliver). */
#trip_info:not(.trip-info) {
  background-color: var(--rl-surface) !important;
  border: 1px solid var(--rl-border) !important;
  border-radius: var(--rl-radius) !important;
  padding: 24px 28px !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  width: 100% !important;
}
/* ribbon interno y form: sin caja propia (se integran al box unico) */
.trip-info, #personal_information {
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
/* separador sutil entre ribbon y form, en lugar de dos cajas */
#personal_information { margin-top: 20px !important; padding-top: 20px !important; border-top: 1px solid var(--rl-border-subtle) !important; }

/* #5 Reservation Summary: alinear los totales (subtotal/total) en un bloque de
   ancho fijo a la derecha para que no queden desfasados entre si. */
.vehicle_subtotal, .trip_total { width: 320px !important; }
.vehicle_subtotal table, .trip_total table { width: 100% !important; margin-left: auto !important; }
.vehicle_subtotal th, .trip_total th { text-align: left !important; }
.vehicle_subtotal td, .trip_total td { text-align: right !important; }

/* =========================================================
   RELIER - FIX PASS 3 (audit exhaustivo headless, feedback Nico)
   ========================================================= */

/* Toggle "(manual address)" en el paso de pago: salia AZUL (link default).
   A champagne para integrarse al tema. */
#toggle_manual_billing_address,
a#toggle_manual_billing_address,
.toggle_manual_billing_address { color: var(--rl-accent) !important; }

/* Billing Phone (#cc_phone): la lib intl-tel-input mete el flag DENTRO del input
   con padding-left:75px inline. Nuestro ".form-control { padding:12px 2px }" lo
   pisaba y el flag terminaba encimando el numero. Restauramos el espacio. */
#cc_phone { padding-left: 52px !important; }

/* NOTA (no es CSS): la imagen del vehiculo se ve sobre caja blanca cuando el JPEG
   cargado en Limo Anywhere tiene fondo blanco (van / minibus / motorcoach).
   NO se puede tapar por CSS sin arruinar los que ya son transparentes (sedan/suv).
   Fix real: resubir esas imagenes como PNG transparente en LA (Vehicle Categories). */
