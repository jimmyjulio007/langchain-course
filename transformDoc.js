import { HTMLWebBaseLoader } from "@langchain/community/document_loaders/web/html";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const llm = new ChatOllama({
    model: "gpt-oss:120b-cloud",
    temperature: 0.9,
    maxRetries: 2,
});

const loader = new HTMLWebBaseLoader(
    "https://fr.wikipedia.org/wiki/Biologie_marine"
);
const rawDocs = await loader.load();

const transformer = new HtmlToTextTransformer();
const textDocs = await transformer.transformDocuments(rawDocs);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
});
const splitDocs = await splitter.splitDocuments(textDocs);

const fullText = splitDocs.map((d) => d.pageContent).join("\n\n")

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are an expert technical writer. Summarize the following content into a short resume of key principles in french."],
    ["human", "{input}"],
]);

const chain = RunnableSequence.from([
    prompt,
    llm,
]);

const result = await chain.invoke({
    input: fullText,
});

console.log("Summary:\n");
console.log(result.content);
