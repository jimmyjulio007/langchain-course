import { ChatOllama } from "@langchain/ollama";
import { tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
    async (input) => {
        const location = input.location.trim();
        return `It's sunny and 25°C in ${location}.`;
    },
    {
        name: "get_weather",
        description: "Get the current weather at a given location.",
        schema: z.object({
            location: z
                .string()
                .min(2)
                .describe("The city or place to get the weather for"),
        }),
    },
);

const llm = new ChatOllama({
    model: "gpt-oss:120b-cloud",
    temperature: 0.7,
    timeout: 30_000,
    maxTokens: 1000,
});

const llmWithTools = llm.bindTools([getWeather]);

const query = "What's the weather like in Boston?";
const response = await llmWithTools.invoke([{ role: "user", content: query }]);

if (response.tool_calls?.length) {
    for (const call of response.tool_calls) {
        console.log(`Tool called: ${call.name}`);
        console.log(`Args: ${JSON.stringify(call.args, null, 2)}`);

        if (call.name === "get_weather") {
            const toolResult = await getWeather.func(call.args);
            console.log(`Tool result: ${toolResult}`);
        }
    }
} else {
    console.log("Model response:", response.content);
}
