import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
    model: "gpt-oss:120b-cloud",
    temperature: 0,
    maxRetries: 2,
});

const response = await llm.invoke("write poem for the president of madagascar")

console.log(response)
