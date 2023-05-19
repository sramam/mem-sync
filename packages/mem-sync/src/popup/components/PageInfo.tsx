import React, { useCallback } from "react";
import SimpleMDEEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import TagsInput from "react-tagsinput";
import MarkdownView from "react-showdown";
import BeatLoader from "react-spinners/BeatLoader";
import "./react-tagsInput.css";
import { useStore } from "@nanostores/react";
import { $pageInfo, $allTags } from "../stores";

const PageInfo: React.FC = () => {
  const pageInfo = useStore($pageInfo);
  const allTags = useStore($allTags);
  const onChange = useCallback((md: string) => {
    $pageInfo.setKey("notes", md);
    // extract tags from notes and append to existing tags
    const tagsFromNotes = md.match(/(?<!\w)(?<!#)(?!##+#)(#\w+)\b/g)?.map(tag => tag.slice(1)) || [];
    $pageInfo.setKey("noteTags", tagsFromNotes);
  }, []);

  const handleTagsChange = (tags: string[]) => {
    const userTags = tags.filter((t) => !pageInfo.noteTags?.includes(t));
    $pageInfo.setKey("tags", userTags);
  };

  return (
    <form style={formStyle}>
      <h1>
        <a
          href={pageInfo?.url?.trim().length ? pageInfo.url : "#"}
          title={pageInfo.title}
          target="_blank"
        >
          {pageInfo?.title?.trim().length
            ? pageInfo.title
            : "Title would go here"}
        </a>
      </h1>
      {pageInfo.ogImage ? <img style={ogImageStyle} src={pageInfo.ogImage} alt="og:image" /> : null}
      {pageInfo.description ? (
        <>
          <h2>Description</h2>
          <p>{pageInfo.description}</p>
        </>
      ) : null}

      {/* <div>
        <h2>TL;DR</h2>
        {pageInfo.tldr ? (
          <MarkdownView
            markdown={pageInfo.tldr}
            options={{ tables: true, emoji: true }}
          />
        ) : (
          <p>
            Awaiting tl;dr from AI{" "}
            <span style={beatLoaderStyle}>
              <BeatLoader color="#ec4899" size="7px" />
            </span>
          </p>
        )}
      </div> */}
      <div>
        <h2>Synopsis</h2>
        {pageInfo.synopsis ? (
          <MarkdownView
            markdown={pageInfo.synopsis}
            options={{ tables: true, emoji: true }}
          />
        ) : (
          <p>
            Awaiting synopsis from AI{" "}
            <span style={beatLoaderStyle}>
              <BeatLoader color="#ec4899" size="7px" />
            </span>
          </p>
        )}
      </div>
      <div>
        <h2>Tags</h2>
        <TagsInput value={allTags} onChange={handleTagsChange} />
      </div>
      <div>
        <h2>Notes</h2>
        <div style={subtitleStyle}>Markdown works here!</div>
        <SimpleMDEEditor
          id="notes-editor"
          autoFocus={true}
          value={pageInfo.notes}
          onChange={onChange}
          options={{
            autofocus: true,
            spellChecker: true,
            status: false,
            minHeight: "200px",
            toolbar: false,
          }}
        />
      </div>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  padding: "1em",
};
const editButtonStyle: React.CSSProperties = {
  marginLeft: "10px",
  border: "none",
  background: "none",
  color: "blue",
  cursor: "pointer",
};

const notesContainerStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

const ogImageStyle: React.CSSProperties = {
  width: "100%"

}

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#eee",
  padding: "5px",
  margin: "5px",
  borderRadius: "3px",
};

const tagDeleteButtonStyle: React.CSSProperties = {
  marginLeft: "5px",
  border: "none",
  background: "none",
  color: "red",
  cursor: "pointer",
};

const subtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "-0.5em",
  marginBottom: "0.5em",
};

const loaderStyle: React.CSSProperties = {
  paddingLeft: "1em",
};

const beatLoaderStyle: React.CSSProperties = {
  paddingLeft: "0.5em",
};

export default PageInfo;
