"use client";

import { useState } from "react";
import {
  FacebookIcon,
  LinkedInIcon,
  XIcon,
  MailIcon,
  LinkIcon,
} from "@/components/icons/SocialIcons";
import styles from "./PostShare.module.css";

interface PostShareProps {
  title: string;
  url: string;
}

const buildTargets = (title: string, url: string) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: FacebookIcon,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: LinkedInIcon,
    },
    {
      key: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      Icon: XIcon,
    },
    {
      key: "email",
      label: "Share by email",
      href: `mailto:?subject=${t}&body=${u}`,
      Icon: MailIcon,
    },
  ] as const;
};

export default function PostShare({ title, url }: PostShareProps) {
  const [copied, setCopied] = useState(false);
  const targets = buildTargets(title, url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Share this post</p>
      <div className={styles.row}>
        {targets.map(({ key, label, href, Icon }) => (
          <a
            key={key}
            className={styles.btn}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon width={16} height={16} />
          </a>
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          <LinkIcon width={16} height={16} />
        </button>
        <span className={styles.copyHint} aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}
