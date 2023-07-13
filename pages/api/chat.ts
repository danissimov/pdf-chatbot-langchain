// Importing necessary types from the Next.js framework.
import type { NextApiRequest, NextApiResponse } from 'next';

// Importing necessary utilities for handling the OpenAI embeddings and Pinecone vector storage.
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

// Importing necessary utilities from the local project files.
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';

// Importing configuration constants.
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

// The default exported function is the API route handler.
// It is an async function because it will perform asynchronous operations (database access, network requests etc.).
export default async function handler(
  req: NextApiRequest,  // The incoming request object.
  res: NextApiResponse, // The outgoing response object.
) {
  // Extracting 'question' and 'history' properties from the request body.
  const { question, history } = req.body;

  console.log('question', question);

  // Only accept POST requests.
  // If the request method is not POST, respond with a 405 status code (Method Not Allowed) and an error message.
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // If there's no question in the request, respond with a 400 status code (Bad Request) and an error message.
  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    // Connect to the Pinecone index.
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // Create a PineconeStore instance from the existing index.
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    // Create a chain of operations to process the question and generate a response.
    const chain = makeChain(vectorStore);

    // Ask a question using the chat history.
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);

    // If all went well, respond with a 200 status code (OK) and the chat response.
    res.status(200).json(response);
  } catch (error: any) {
    // If something went wrong, log the error and respond with a 500 status code (Internal Server Error) and the error message.
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
}
