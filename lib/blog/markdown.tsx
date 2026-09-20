import { Fragment, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

// Render a single line of inline Markdown ([text](url), **bold**, *italic*,
// escaped chars like \{ or \<). Returns an array of React nodes / strings.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let i = 0;

  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = "";
    }
  };

  while (i < text.length) {
    const rest = text.slice(i);

    const link = /^\[([^\]]+)\]\(([^)]+)\)/.exec(rest);
    if (link) {
      flush();
      const [full, label, url] = link;
      const external = /^(https?:|mailto:|tel:)/.test(url);
      if (external) {
        out.push(
          <a
            key={`${keyPrefix}-l${i}`}
            href={url}
            target={url.startsWith("http") ? "_blank" : undefined}
            rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {renderInline(label, `${keyPrefix}-l${i}`)}
          </a>
        );
      } else {
        out.push(
          <Link key={`${keyPrefix}-l${i}`} href={url}>
            {renderInline(label, `${keyPrefix}-l${i}`)}
          </Link>
        );
      }
      i += full.length;
      continue;
    }

    const bold = /^\*\*([^*]+)\*\*/.exec(rest);
    if (bold) {
      flush();
      out.push(<strong key={`${keyPrefix}-b${i}`}>{bold[1]}</strong>);
      i += bold[0].length;
      continue;
    }

    const italic = /^\*([^*\n]+)\*/.exec(rest);
    if (italic) {
      flush();
      out.push(<em key={`${keyPrefix}-i${i}`}>{italic[1]}</em>);
      i += italic[0].length;
      continue;
    }

    if (text[i] === "\\" && i + 1 < text.length) {
      buf += text[i + 1];
      i += 2;
      continue;
    }

    buf += text[i];
    i++;
  }

  flush();
  return out;
}

const BLOCK_PREFIX = /^(##\s|###\s|####\s|-\s|\d+\.\s)/;

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={`h2-${i}`}>{renderInline(line.slice(3), `h2-${i}`)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(<h3 key={`h3-${i}`}>{renderInline(line.slice(4), `h3-${i}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("#### ")) {
      blocks.push(<h4 key={`h4-${i}`}>{renderInline(line.slice(5), `h4-${i}`)}</h4>);
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`}>
          {items.map((it, j) => (
            <li key={j}>{renderInline(it, `ul-${i}-${j}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`}>
          {items.map((it, j) => (
            <li key={j}>{renderInline(it, `ol-${i}-${j}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // paragraph: collect lines until blank or next block marker
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !BLOCK_PREFIX.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`p-${i}`}>{renderInline(para.join(" "), `p-${i}`)}</p>
    );
  }

  return (
    <>
      {blocks.map((b, idx) => (
        <Fragment key={idx}>{b}</Fragment>
      ))}
    </>
  );
}
