import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import toml from "toml";
import * as fs from "fs";
import { reloadEnv } from "./reloadEnv.js";
import summarize from "../langchain/summarizer/summarizer.js";
import saveMem from "./saveMem.js";
// Load initial .env variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.send("A simple server for mem sync");
});

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.post("/settings", (req, res) => {
  const envFile = "./.env";
  const raw = fs.readFileSync(envFile, "utf8");
  const _prevDotEnv = toml.parse(raw);
  const val = { ..._prevDotEnv, ...req.body };
  if (!!val?.OPENAI_API_KEY && !!val?.MEMAI_API_KEY) {
    // Update .env file
    const _dotEnv = [
      "# https://platform.openai.com/account/api-keys",
      `OPENAI_API_KEY="${val.OPENAI_API_KEY}"`,
      "# https://mem.ai/flows/api",
      `MEMAI_API_KEY="${val.MEMAI_API_KEY}"`,
    ].join("\n");
    fs.writeFileSync(".env", _dotEnv, "utf8");
    reloadEnv();
    console.log(
      `settings updates: openAI=...${process.env.OPENAI_API_KEY.slice(
        -4
      )}, memAI=...${process.env.MEMAI_API_KEY.slice(-4)}`
    );
    res.send("Settings have been updated");
  } else {
    // one of the keys is empty. cannot update
    res.status(400).send("To update settings, both keys must be provided");
  }
});

app.post("/get_summary", async (req, res) => {
  const { text, id } = req.body;
  try {
    const summary = await summarize(text);
    res.status(200).json({ status: "summary", id, ...summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
});

app.post("/save_mem", async (req, res) => {
  const { content } = req.body;
  try {
    if (content && content.trim().length) {
      await saveMem(content);
      console.log(`saved mem successfully`);
      res.status(200).json({ status: "success" });
    } else {
      console.log(`skip creating empty mem`);
      res.status(400).json({
        status: "noop",
        message: "content was empty. Cannot create empty mems",
      });
    }
  } catch (err) {
    // something went wrong
    console.log({
      message: `Error while saving mem`,
      content,
      err,
    });
    res.status(500).json({
      status: "error",
      message: "something went awry on the server. Please see server logs",
    });
  }
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
