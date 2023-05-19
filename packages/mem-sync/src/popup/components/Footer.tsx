import React from "react";
import { useStore } from "@nanostores/react";
import { $activePanel, $settings, $pageInfo, $allTags } from "../stores";
import makeMem from "../../utils/makeMem";

type FooterProps = {
  onCancel: () => void;
  onSave: () => void;
};

const Footer: React.FC<FooterProps> = (props) => {
  const activePanel = useStore($activePanel);

  const saveSettings = async () => {
    const { serverUrl, OPENAI_API_KEY, MEMAI_API_KEY } = $settings.get();
    if (
      OPENAI_API_KEY.trim().length === 0 &&
      MEMAI_API_KEY.trim().length === 0
    ) {
      alert(`please ensure openaiApiKey and memaiApiKey have valid values`);
      return;
    }
    const response = await fetch(`${serverUrl}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        OPENAI_API_KEY,
        MEMAI_API_KEY,
      }),
    });

    if (response.ok) {
      // on success, clear the fields.
      // TODO: should be also clear settings on failure to save???
      $settings.set({
        serverUrl,
        OPENAI_API_KEY: "",
        MEMAI_API_KEY: "",
      });
      const responseBody = await response.text();
      console.log(responseBody);
      $activePanel.set("PageInfo");
    } else {
      console.log("HTTP-Error: " + response.status);
    }
  };

  const saveMem = async () => {
    const { serverUrl } = $settings.get();
    const pageInfo = $pageInfo.get();
    // format pageInfo as mem.md
    const content = makeMem(pageInfo, $allTags.get());

    const response = await fetch(`${serverUrl}/save_mem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      // on success, clear the fields.
      const responseBody = await response.text();
      console.log(responseBody);
      window.close();
    } else {
      console.log("HTTP-Error: " + response.status);
    }
  };

  const onSave = async () => {
    return activePanel === "PageInfo" ? saveMem() : saveSettings();
  };

  const onCancel = async () => {
    if (activePanel === "Settings") {
      const curr = $settings.get();
      $settings.set({
        ...curr,
        // reset these on
        OPENAI_API_KEY: "",
        MEMAI_API_KEY: "",
      });
      $activePanel.set("PageInfo");
    } else {
      window.close();
    }
  };

  return (
    <footer style={footerStyles}>
      <div style={rightContainerStyles}>
        <button style={cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button style={saveButton} onClick={onSave}>
          Save
        </button>
      </div>
    </footer>
  );
};

const footerStyles: React.CSSProperties = {
  position: "fixed",
  bottom: "0",
  height: "3em",
  maxHeight: "3em",
  width: "100%",
  backgroundColor: "#fdfdfd",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "1em",
  boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
};

const rightContainerStyles: React.CSSProperties = {
  paddingRight: "2.5em",
};

const cancelButton: React.CSSProperties = {
  background: "#dedede",
  color: "#2D3039",
  border: "1px solid #ccc",
  fontSize: "1.5em",
  padding: "0.4em 0.8em",
  borderRadius: "0.25em",
};

const saveButton: React.CSSProperties = {
  background: "#EB2487",
  color: "#f1f1f1",
  border: "1px solid #f22e61",
  marginLeft: "0.4em",
  fontSize: "1.5em",
  padding: "0.4em 0.8em",
  borderRadius: "0.25em",
};

export default Footer;
