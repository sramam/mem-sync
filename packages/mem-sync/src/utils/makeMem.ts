import { PageInfo } from "../types";

/**
 * Converts a PageInfo object into markdown.
 * Currently, only supports regular markdown, though tags are treated specially
 */
export default function makeMem(pageInfo: PageInfo, allTags: string[]): string {
  return [
    `# [${pageInfo.title || "Article has no title"}](${pageInfo.url ?? "#"})`,
    pageInfo.ogImage ? `![main image](${pageInfo.ogImage})` : null,
    pageInfo.tldr
      ? [`### TL;DR`, `${pageInfo.tldr || "No TL;DR provided."}`]
      : null,
    pageInfo.synopsis
      ? [`### Synopsis`, `${pageInfo.synopsis || "No synopsis provided."}`]
      : null,
    `#### Tags`,
    `${allTags.map((tag) => `#${tag} `)}`,
    `### Notes`,
    `${pageInfo.notes || "No notes provided."}`,
  ]
    .flat(10)
    .filter((n) => n !== null)
    .join("\n");
}
