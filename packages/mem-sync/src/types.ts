export type Settings = {
  serverUrl: string;
  MEMAI_API_KEY: string;
  OPENAI_API_KEY: string;
};

export type PageCore = {
  url: string;
  ogImage?: string; // <meta property="og:image" content"image-uri">
  title?: string;
  description?: string;
};

export type DomDetails = PageCore & {
  innerHTML: string;
  innerText: string;
};

export type PageSummary = {
  tags: string[];
  tldr: string;
  synopsis: string;
};

export type PageInfo = PageCore &
  PageSummary & {
    // user provided
    notes?: string;
    // internal state to manage tags
    noteTags?: string[]; // auto extracted from notes
  };

// GetDomDetails
// background -> content_script
// >>>
export type GetDomDetails = {
  action: "getDomDetails";
};
// <<<
export type GetDomDetailsResponse =
  | {
      id: string;
      loaded: false;
    }
  | {
      id: string;
      loaded: true;
      domDetails: DomDetails;
    };

// GetSummary
// background -> server
// >>>
export type GetSummary = {
  id: string;
  text: string;
};
// <<<
export type GetSummaryResponse = PageSummary & {
  id: string;
};

// SendPageInfo
// background -> popup
export type SendPageInfo = {
  action: "sendPageInfo";
  id: string;
  pageInfo: PageInfo;
};

export type SendPageInfoResponse = {
  id: string;
};
