import { MemClient } from "@mem-labs/mem-node";
export default function saveMem(content) {
    const apiAccessToken = process.env.MEMAI_API_KEY;
    if (!apiAccessToken) {
        throw new Error(`Unable to save mem - MEMAI_API_KEY is not configured`);
    }
    // Since we instantiate the MemClient on each save,
    // we use the latest setting of the environment variable.
    const memClient = new MemClient({
        apiAccessToken: process.env.MEMAI_API_KEY
    });
    return memClient.createMem({
        content
    });
}
