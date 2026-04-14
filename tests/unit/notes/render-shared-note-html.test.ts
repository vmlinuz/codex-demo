import { describe, expect, it } from "vitest";

import { renderSharedNoteHtml } from "@/notes/render-shared-note-html";

describe("renderSharedNoteHtml", () => {
  it("renders common nodes with escaped text", () => {
    const html = renderSharedNoteHtml({
      content: [
        {
          attrs: { level: 1 },
          content: [{ text: "Heading <unsafe>", type: "text" }],
          type: "heading",
        },
        {
          content: [
            { marks: [{ type: "bold" }], text: "Bold", type: "text" },
            { text: " and ", type: "text" },
            { marks: [{ type: "italic" }], text: "italic", type: "text" },
          ],
          type: "paragraph",
        },
        {
          content: [
            {
              content: [{ text: "First", type: "text" }],
              type: "listItem",
            },
          ],
          type: "bulletList",
        },
        {
          content: [{ text: 'const x = "<ok>";', type: "text" }],
          type: "codeBlock",
        },
      ],
      type: "doc",
    });

    expect(html).toContain("<h1>Heading &lt;unsafe&gt;</h1>");
    expect(html).toContain("<p><strong>Bold</strong> and <em>italic</em></p>");
    expect(html).toContain("<ul><li><p>First</p></li></ul>");
    expect(html).toContain("<pre><code>const x = &quot;&lt;ok&gt;&quot;;</code></pre>");
  });

  it("keeps only safe http(s) links and strips unsafe links", () => {
    const html = renderSharedNoteHtml({
      content: [
        {
          content: [
            {
              marks: [{ attrs: { href: "https://example.com/docs" }, type: "link" }],
              text: "safe",
              type: "text",
            },
            { text: " / ", type: "text" },
            {
              marks: [{ attrs: { href: "javascript:alert(1)" }, type: "link" }],
              text: "unsafe",
              type: "text",
            },
            { text: " / ", type: "text" },
            {
              marks: [{ attrs: { href: "mailto:test@example.com" }, type: "link" }],
              text: "mailto",
              type: "text",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "doc",
    });

    expect(html).toContain(
      '<a href="https://example.com/docs" target="_blank" rel="noopener noreferrer">safe</a>',
    );
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("mailto:");
    expect(html).toContain("unsafe");
    expect(html).toContain("mailto");
  });
});
