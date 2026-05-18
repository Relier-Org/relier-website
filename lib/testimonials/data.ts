export interface Testimonial {
  initial: string;
  name: string;
  quote: string;
  source?: string;
}

// Verified 5-star Google / Tripadvisor / Birdeye reviews.
// Minor cleanup applied (typos, doubled punctuation, trailing emojis) — never paraphrased.
export const TESTIMONIALS: Testimonial[] = [
  {
    initial: "A",
    name: "Aglaia Fataliev",
    quote:
      "Best service ever. Very reliable and very pleasant. I without doubt recommend Relier.",
  },
  {
    initial: "A",
    name: "Aaron Collins",
    quote:
      "The car was spotless, luxurious, and incredibly comfortable, making the entire ride a smooth and relaxing experience. The driver was professional, punctual, and very courteous.",
  },
  {
    initial: "C",
    name: "Carla A. Suarez",
    quote:
      "We went yesterday to Six Flags from New York — a great experience. We travelled comfortably and they waited for us until we needed to get home. Recommend every time.",
  },
  {
    initial: "M",
    name: "Marquitos L.",
    quote:
      "Always 10 minutes before the pick up time the car is waiting for you, the service is another level. Apart from car service they cover a big range of travel services.",
  },
  {
    initial: "S",
    name: "Sebastián J. Peralta",
    quote:
      "Excellent service, prompt and clean limousine waiting for me at JFK on time. The chauffeur was very kind and professional. Top-tier in NY.",
  },
  {
    initial: "F",
    name: "Fabri P.",
    quote:
      "Good service and treatment from Chris. He helped us with all our luggage, and was very punctual with the pick-up time.",
  },
  {
    initial: "A",
    name: "Ahmad",
    quote:
      "This is by far the best transportation service out there. I've only had positive experiences with them. They are on time, professional, and friendly and the vehicle was comfortable and clean. I highly recommend to others.",
  },
  {
    initial: "A",
    name: "Alex S.",
    quote:
      "I recently visited New York City for a short trip, and Relier was recommended by some friends in Greece. Besides their excellent driving services and affordable prices, they have unique tours in various neighborhoods in New York. Very knowledgeable, entertaining, and attendant to your needs. Always on time, very friendly and positive, and super professional. Highly recommendable, and will certainly use them again on my next visit.",
  },
  {
    initial: "C",
    name: "Camila Araujo Avalos",
    quote:
      "Entrar a la ciudad de NYC en un Relier es lujo, seguridad y comodidad asegurada. Sergio nos puso al día con sus cálidas charlas sobre actualidad, clima y más. Su amabilidad y atención es impecable. Año tras año se superan, los felicito.",
  },
  {
    initial: "M",
    name: "Mariano E.",
    quote:
      "Amazing unique experience. The best of quality, Sergio is a perfect driver. Relier is the best option.",
  },
  {
    initial: "A",
    name: "Andres Denham",
    quote: "Servicio de 10. Muy profesional todo.",
  },
  {
    initial: "J",
    name: "Jose Pedraza",
    quote: "Siempre los mejores. Grandes profesionales.",
  },
];

// Top 6 (home).
export const HOME_TESTIMONIALS = TESTIMONIALS.slice(0, 6);

export const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Relier+Worldwide+Chauffeured+Services";
export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 412;
