import StarterKit from "@tiptap/starter-kit";

function normalizeUrl(url: string, defaultProtocol: string): URL | null {
  if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^https?:/i.test(url)) {
    return null;
  }

  const normalizedUrl = url.includes("://") ? url : `${defaultProtocol}://${url}`;

  try {
    const parsedUrl = new URL(normalizedUrl);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl : null;
  } catch {
    return null;
  }
}

export function createNoteEditorExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      link: {
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
        defaultProtocol: "https",
        isAllowedUri: (url, context) =>
          Boolean(context.defaultValidate(url) && normalizeUrl(url, context.defaultProtocol)),
        openOnClick: false,
        protocols: ["http", "https"],
      },
    }),
  ];
}

export function normalizeHttpUrl(url: string): string | null {
  const normalizedUrl = normalizeUrl(url.trim(), "https");

  return normalizedUrl ? normalizedUrl.toString() : null;
}
