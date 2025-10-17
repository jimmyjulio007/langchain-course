import { ChatOllama } from "@langchain/ollama";
import {ChatPromptTemplate} from "@langchain/core/prompts"

const llm = new ChatOllama({
    model: "gpt-oss:120b-cloud",
    temperature: 0,
    maxRetries: 2,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate a description in french about the word provide by the user in french details"],
    ['human', "{input}"]
])

const chain = prompt.pipe(llm)

const res = await chain.invoke({
    input: "Napoleon"
})

console.log(res.content)