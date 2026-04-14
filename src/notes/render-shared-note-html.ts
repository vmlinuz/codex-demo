import type { NoteDocument } from "@/notes/document";

type NoteNode = NoteDocument;
type NoteMark = Exclude<NoteNode["marks"], undefined>[number];

const ALLOWED_HEADING_LEVELS = new Set([1, 2, 3]);

export function renderSharedNoteHtml(document: NoteDocument): string {
  return renderNodes(document.content);
}

function renderNodes(nodes: NoteNode[] | undefined): string {
  if (!nodes) {
    return "";
  }

  return nodes.map((node) => renderNode(node)).join("");
}

function renderNode(node: NoteNode): string {
  switch (node.type) {
    case "paragraph":
      return wrapBlock("p", renderNodes(node.content));
    case "heading": {
      const level =
        typeof node.attrs?.level === "number" && ALLOWED_HEADING_LEVELS.has(node.attrs.level)
          ? node.attrs.level
          : 2;
      return wrapBlock(`h${level}`, renderNodes(node.content));
    }
    case "bulletList":
      return wrapBlock("ul", renderNodes(node.content));
    case "orderedList":
      return wrapBlock("ol", renderNodes(node.content));
    case "listItem":
      return wrapBlock("li", renderNodes(node.content));
    case "blockquote":
      return wrapBlock("blockquote", renderNodes(node.content));
    case "codeBlock":
      return `<pre><code>${escapeHtml(collectText(node.content))}</code></pre>`;
    case "hardBreak":
      return "<br>";
    case "text": {
      const safeText = escapeHtml(typeof node.text === "string" ? node.text : "");
      return applyMarks(safeText, node.marks);
    }
    default:
      return renderNodes(node.content);
  }
}

function collectText(nodes: NoteNode[] | undefined): string {
  if (!nodes) {
    return "";
  }

  return nodes
    .map((node) => {
      if (node.type === "hardBreak") {
        return "\n";
      }

      if (node.type === "text") {
        return typeof node.text === "string" ? node.text : "";
      }

      return collectText(node.content);
    })
    .join("");
}

function applyMarks(text: string, marks: NoteMark[] | undefined): string {
  if (!marks?.length) {
    return text;
  }

  return marks.reduce((html, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${html}</strong>`;
      case "italic":
        return `<em>${html}</em>`;
      case "strike":
        return `<s>${html}</s>`;
      case "underline":
        return `<u>${html}</u>`;
      case "code":
        return `<code>${html}</code>`;
      case "link": {
        const normalizedHref = normalizePublicLink(mark.attrs?.href);

        if (!normalizedHref) {
          return html;
        }

        return `<a href="${escapeHtml(normalizedHref)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
      }
      default:
        return html;
    }
  }, text);
}

function normalizePublicLink(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const href = value.trim();

  if (!href) {
    return null;
  }

  try {
    const parsed = new URL(href);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function wrapBlock(tag: string, content: string): string {
  return `<${tag}>${content}</${tag}>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
