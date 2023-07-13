// Importing necessary modules and libraries.
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const thematicQuestion = 'For, example, ask about transformer neural networks architecture and its application.';

let fieldSelector = {
  "Large Language Models": {
    thematicQuestion: "Ask about transformer neural networks architecture and its application.",
    QA_Prompt: "You are a helpful AI assistant. Your expertise fields are Natural Language Processing, Neural Networks and Large Language Models...",
  },
  "Physics": {
    thematicQuestion: "Ask about quantum mechanics and its interpretations.",
    QA_Prompt: "You are a helpful AI assistant. Your expertise fields are Theoretical Physics, Quantum Mechanics and Field Theory...",
  },
  "Economy": {
    thematicQuestion: "Ask about macroeconomic theories and their application.",
    QA_Prompt: "You are a helpful AI assistant. Your expertise fields are Microeconomics, Macroeconomics and Economic History...",
  },
  // Add as many fields as needed...
};

// fieldSelector["Physics"].thematicQuestion
// fieldSelector["Physics"].QA_Prompt

export function usePlaceholderValue(loading: boolean, selectedOption: string) {
  let placeholderValue;
  if (loading) {
    placeholderValue = 'Waiting for response...';
  } else {
    // Check if selectedOption exists in fieldSelector
    if (selectedOption && fieldSelector[selectedOption]) {
      placeholderValue = fieldSelector[selectedOption].thematicQuestion;
    } else {
      placeholderValue = "Please select a field of expertise."; // Default message
    }
  }

  return placeholderValue;
}

// Prompt templates for the question generation and answering process.
const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History: 
{chat_history} 
Follow Up Input: {question} 
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Your expertise fields are Natural Language Processing, Neural Networks and Large Language Models. You have access to a wide range of books and research papers in these fields. 
Use the information provided below to answer the question at the end. 
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you have not find appropriate souces in user database and answer using your understanding of the key theories and concepts from the relevant fields.

{context}

Question: {question} 
Helpful answer in markdown:`;

// This function creates and returns a conversational QA chain.
export const makeChain = (vectorstore: PineconeStore) => {
  // Create an instance of the OpenAI language model.
  const model = new OpenAI({
    temperature: 0, // The level of randomness in the generated responses (higher means more random).
    modelName: 'gpt-3.5-turbo', // The name of the model to use.
  });

  // Create a conversational QA chain using the model and vectorstore.
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model, // The language model to use.
    vectorstore.asRetriever(), // Convert the vectorstore to a retriever.
    {
      qaTemplate: QA_PROMPT, // The template for the answer.
      questionGeneratorTemplate: CONDENSE_PROMPT, // The template for generating new questions.
      returnSourceDocuments: true, // Whether to return the source documents with the response.
    },
  );

  // Return the created chain.
  return chain;
};
