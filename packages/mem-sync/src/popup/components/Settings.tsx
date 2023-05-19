import React, { useState } from "react";
import { useStore } from "@nanostores/react"; // or '@nanostores/preact'
import { $settings } from "../stores";
import { Settings } from "../../types";
import useInterval from "../hooks/useInterval";
import { ScaleLoader } from "react-spinners";

const SettingsForm: React.FC = () => {
  const serverUrlOptions = ["http://localhost:3000"];

  const [delay, setDelay] = useState(3000); // TODO: do we really need delay as state?
  const [serverState, setServerState] = useState<"unknown" | "up" | "down">(
    "unknown"
  );
  useInterval(async () => {
    try {
      const result = await fetch(`${serverUrlOptions[0]}/health`);
      console.log(result.text);
      if (result.ok && (await result.text()) === "ok") {
        setServerState("up");
      } else {
        setServerState("down");
      }
    } catch {
      setServerState("down");
    }
  }, delay);

  const statusColor = {
    unknown: "#0ea5e9",
    up: "#84cc16",
    down: "#b91c1c",
  };

  const settings = useStore($settings);
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as typeof e.target & {
      checked?: boolean;
    };
    const newValue = value?.toString() ?? "";
    // update store
    $settings.setKey(name as keyof Settings, newValue);
  };
  // form submission is handled from the footer buttons.
  // done to provide better UX.
  return (
    <>
      <form style={formStyles}>
        <h1>Settings</h1>
        <label style={labelStyles}>
          <span>
            Server URL
            <span style={loaderStyle}>
              {`status: (${serverState})`}
              <ScaleLoader color={statusColor[serverState]} height="12px" />
            </span>
          </span>
          <select
            name="serverUrl"
            value={settings.serverUrl}
            onChange={handleChange}
            style={inputStyles}
          >
            {serverUrlOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyles}>
          mem.ai API Key
          <input
            type="password"
            name="memaiApiKey"
            value={settings.MEMAI_API_KEY}
            onChange={handleChange}
            style={inputStyles}
          />
        </label>

        <label style={labelStyles}>
          OpenAI API Key
          <input
            type="password"
            name="openaiApiKey"
            value={settings.OPENAI_API_KEY}
            onChange={handleChange}
            style={inputStyles}
          />
        </label>
      </form>
    </>
  );
};

const formStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  maxWidth: "400px",
  margin: "0 auto",
};

const labelStyles: React.CSSProperties = {
  margin: "10px 0",
  fontSize: "1.3em",
  fontWeight: "bold",
  paddingBottom: "0.1em",
};

const inputStyles: React.CSSProperties = {
  padding: "8px",
  fontSize: "1.3em",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};

const buttonStyles: React.CSSProperties = {
  backgroundColor: "#F22E61",
  color: "white",
  padding: "10px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  marginTop: "20px",
};

const loaderStyle: React.CSSProperties = {
  paddingLeft: "1em",
  fontSize: "0.8em",
  color: "#64748b",
};

export default SettingsForm;
