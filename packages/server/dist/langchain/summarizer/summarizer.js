import "dotenv/config";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { extractTags } from "./postSummarizer.js";
export default async function summarize(fullText) {
    console.log(`summarization started`);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2020,
        chunkOverlap: 20,
        separators: [".", "\n", "\n\n", " "],
    });
    const docs = await splitter.createDocuments([fullText]);
    // since we instantiate openAI here, it'll pick the "current" key from env.
    const model = new OpenAI({ temperature: 0 });
    const chain = loadSummarizationChain(model, {
        type: "map_reduce",
        combineMapPrompt: combinePrompt(),
    });
    const response = await chain.call({
        input_documents: docs,
    });
    console.log(`langchain completed`);
    const result = {
        synopsis: response.text,
        tags: await extractTags(response.text),
        // the UX suffers too much delay, so we'll skip tl;dr here. 
        // but this also means we need to remove it from the UI.
        tldr: "", // await extractTldr(response.tldr),
    };
    console.log(result);
    return result;
}
function combinePrompt() {
    return new PromptTemplate({
        template: [
            "Summarize the text in less than 200 words, use bullets and return markdown",
            "",
            "Text begins now:",
            "```{text}```",
        ].join(" "),
        inputVariables: ["text"],
    });
}
