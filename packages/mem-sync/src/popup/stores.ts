import { atom, map, computed } from "nanostores";
import { PageInfo, Settings } from "../types";

export const $pageInfo = map<PageInfo>({
  url: "",
  title: "",
  description: "",
  tldr: "",
  synopsis: "",
  notes: "",
  tags: [],
});

export const $settings = map<Settings>({
  serverUrl: "http://localhost:3000",
  MEMAI_API_KEY: "",
  OPENAI_API_KEY: "",
});

export const $activePanel = atom<"PageInfo" | "Settings">("PageInfo");
// export const activePanel = atom<"PageInfo" | "Settings">("Settings");

export const $allTags = computed($pageInfo, ({ tags, noteTags }) => {
  return [...new Set([...(tags ?? []), ...(noteTags ?? [])])];
});
