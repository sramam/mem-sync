import React from "react";
import { useStore } from "@nanostores/react";
import { $activePanel } from "../stores";
import { FaCog } from "react-icons/fa";

const HeaderBar: React.FC = () => {
  const activePanel = useStore($activePanel);

  const toggleSettings = () => {
    $activePanel.set(activePanel === "PageInfo" ? "Settings" : "PageInfo");
  };

  return (
    <header style={headerStyles}>
      <div style={leftContainerStyles}>
        <img src="/icons/128.svg" alt="mem sync" style={logoStyles} />
        <span style={nameStyles}>Mem Sync</span>
      </div>
      <div style={rightContainerStyles}>
        <button style={gearButtonStyles} onClick={toggleSettings}>
          {/* <i className="fas fa-cog" style={gearIconStyles}></i> */}
          <FaCog style={gearIconStyles} />
        </button>
      </div>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  position: "fixed",
  top: "0",
  width: "100%",
  color: "#2D3039",
  backgroundColor: "#fafafa",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1em",
  paddingBottom: "0.5em",
  borderBottom: "solid 1px #f1f1f1",
  zIndex: "100",
};

const leftContainerStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const logoStyles: React.CSSProperties = {
  height: "4em",
  marginRight: "0.5em",
};

const nameStyles: React.CSSProperties = {
  fontSize: "2.6em",
  fontWeight: "bold",
};

const rightContainerStyles: React.CSSProperties = {
  paddingRight: "2em",
};

const gearButtonStyles: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
};

const gearIconStyles: React.CSSProperties = {
  fontSize: "1.5em",
  color: "#555",
};

export default HeaderBar;
