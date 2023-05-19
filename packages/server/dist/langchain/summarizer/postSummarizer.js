import { Configuration, OpenAIApi } from "openai";
export const extractTldr = async function (text) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Summarize this in 50 words or less",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.data.choices[0].text;
};
export const extractTags = async function (text) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Please extract upto 5 words (comma separated) that could be used as tags for the following text?",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    try {
        return JSON.parse(response.data.choices[0].text);
    }
    catch (err) {
        // we failed to get tags in proper json format. So we'll make
        // a hacky attempt, and return a null list on failure
        return response.data.choices[0].text
            .split(",")
            .filter((tag) => tag.split(/\s+/).length === 1);
    }
};
