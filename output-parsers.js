import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";

const callerParser = async () => {
    const llm = new ChatOllama({
        model: "gpt-oss:120b-cloud",
        temperature: 0.7, 
        timeout: 30, 
        max_tokens: 1000
    });

    const parser = new StringOutputParser

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Extract information from"],
        ['human', "{input}"]
    ])

    const chain = prompt.pipe(llm).pipe(parser)

    return await chain.invoke({
        input: "Emanuel macron"
    })
}

const response = await callerParser()

console.log(response)