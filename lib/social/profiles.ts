import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";

// Los íconos sociales del Footer y del ContactSplit habían quedado con
// href="#": el corte del WordPress se llevó las URLs. Están rescatadas del
// footer del WP vía Wayback (mismo snapshot que docs/seo-legacy-wordpress.md).
//
// LinkedIn se normaliza a www: el WP linkeaba al subdominio regional
// (ar.linkedin.com), que redirige pero no es la URL canónica del perfil.
// WhatsApp sale del plugin Click to Chat del WP (+1 917 275 0000), que es un
// número distinto al 844 público del sitio. El mismo link alimenta el ícono
// social y el botón flotante (components/layout/WhatsAppButton.tsx).
export const WHATSAPP_HREF = "https://wa.me/19172750000";

export const SOCIAL_PROFILES = [
  {
    href: "https://www.instagram.com/relier/",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.facebook.com/reliernyc/",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://www.linkedin.com/company/relier-new-york",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  { href: WHATSAPP_HREF, label: "WhatsApp", Icon: WhatsAppIcon },
];

// Para el `sameAs` del JSON-LD: sólo perfiles de la entidad. wa.me queda
// afuera (es un deep link de chat, no un perfil) y TikTok entra aunque no
// tenga ícono en el UI, porque a Google le sirve igual para consolidar la
// entidad.
export const SOCIAL_SAME_AS = [
  "https://www.instagram.com/relier/",
  "https://www.facebook.com/reliernyc/",
  "https://www.linkedin.com/company/relier-new-york",
  "https://www.tiktok.com/@reliernyc",
];
