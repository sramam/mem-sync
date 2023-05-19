import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageInfo from "./PageInfo";
import Settings from "./Settings";
import { useStore } from "@nanostores/react";
import { $activePanel } from "../stores";

const Main: React.FC = () => {
  const activePanel = useStore($activePanel);

  const toggleSettings = () => {
    $activePanel.set(activePanel === "PageInfo" ? "Settings" : "PageInfo");
  };

  return (
    <div style={appStyles}>
      <Header />
      <main style={mainStyles}>
        {activePanel === "Settings" ? <Settings /> : <PageInfo />}
      </main>
      <Footer onCancel={toggleSettings} onSave={toggleSettings} />
    </div>
  );
};

const appStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  paddingTop: "5em",
  minHeight: "100vh",
  width: "780px",
};

const mainStyles: React.CSSProperties = {
  flex: "1",
  // padding: "1em",
};

export default Main;
