import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

// Pre-process custom [youtube:VIDEO_ID] tokens BEFORE markdown rendering, then
// sanitize the resulting HTML to neutralize any XSS attempts.
const youtubeRegex = /\[youtube:([a-zA-Z0-9_-]{11})\]/g;

const purifyConfig = {
  ALLOWED_TAGS: [
    "p", "br", "hr", "strong", "em", "u", "s", "code", "pre", "blockquote",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "a", "img", "iframe", "div", "span",
  ],
  ALLOWED_ATTR: [
    "href", "title", "alt", "src", "class",
    "target", "rel", "loading",
    "width", "height", "frameborder", "allowfullscreen", "allow",
  ],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/)/i,
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["allowfullscreen", "frameborder", "allow"],
};

// Only allow iframes whose src is a youtube embed URL
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = (node as Element).getAttribute("src") || "";
    if (!/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/.test(src)) {
      (node as Element).parentNode?.removeChild(node as Element);
    }
  }
});

export function renderSafeMarkdown(md: string): string {
  if (!md) return "";
  const withEmbeds = md.replace(
    youtubeRegex,
    (_, id) =>
      `<div class="my-6 aspect-video"><iframe class="w-full h-full rounded-xl" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe></div>`,
  );
  const rawHtml = marked.parse(withEmbeds, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, purifyConfig) as unknown as string;
}
