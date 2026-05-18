"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Reveal from "@/components/effects/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import ShieldIcon from "@/components/icons/ShieldIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import CalendarCheckIcon from "@/components/icons/CalendarCheckIcon";
import styles from "./Pillars.module.css";

const PILLARS = [
  {
    icon: ShieldIcon,
    title: "Safe Travels",
    body: "Travel confidently knowing your safety is our #1 priority. Rigorous health and cleaning standards round out a best-in-class service.",
    image:
      "/images/home/vehicle.webp",
    alt: "Safe travels",
  },
  {
    icon: ClockIcon,
    title: "Private Travel Solutions",
    body: "Discover your one-stop travel shop: long-distance rides, one way or return, by the hour, airport transfers, and more.",
    image:
      "/images/home/airport.webp",
    alt: "Private travel solutions",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book Online",
    body: "No need to call or email for a quote. Enter your ride details, see the fixed price, and book. It’s really that simple.",
    image:
      "/images/home/corporate.webp",
    alt: "Book online",
  },
];

export default function Pillars() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageRef.current || !trackRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stage = stageRef.current;
          const track = trackRef.current;
          if (!stage || !track) return;

          const getDistance = () => {
            const cards = track.children;
            if (cards.length < 2) return 0;
            const first = cards[0] as HTMLElement;
            const last = cards[cards.length - 1] as HTMLElement;
            const firstCenter =
              first.offsetLeft + first.offsetWidth / 2;
            const lastCenter =
              last.offsetLeft + last.offsetWidth / 2;
            return lastCenter - firstCenter;
          };

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        }
      );

      return () => {
        mm.revert();
      };
    },
    { scope: stageRef }
  );

  return (
    <section className={styles.pillars}>
      <div className="container">
        <Reveal>
          <SectionHead
            title={
              <>
                Reasons to
                <br />
                <span className="muted">choose Relier.</span>
              </>
            }
            lead="Three principles, held without exception. What we promise on the booking page is what arrives at the curb."
          />
        </Reveal>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {PILLARS.map(({ icon: Icon, title, body, image, alt }) => (
              <article key={title} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image src={image} alt={alt} fill sizes="50vw" />
                </div>
                <div className={styles.cardText}>
                  <div className={styles.header}>
                    <div className={styles.icon}>
                      <Icon size="100%" />
                    </div>
                    <h3>{title}</h3>
                  </div>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
