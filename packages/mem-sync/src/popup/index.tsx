import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./components/Main";

// registers message listeners
import './popup';

const rootElem =
  document.getElementById("root") ?? document.createElement("div");
rootElem.setAttribute("id", "root");

const root = createRoot(rootElem);

const App: React.FC = () => {
  return <Main></Main>
};

root.render(<App />);
