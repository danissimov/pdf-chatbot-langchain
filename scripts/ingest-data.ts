// Importing necessary modules and libraries.
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

// Path of the directory containing the documents to be processed.
// const filePath = 'docs';
// const filePath = 'docs\\InternationalRelations_AndrejKrickovic';
 const filePath = 'G:\\My Drive\\Research_Assistant\\статьи\\InternationalRelations_AndrejKrickovic';

// This is the main function that orchestrates the whole data ingestion process.
export const run = async () => {
  try {
    // DirectoryLoader loads all files from the specified directory.
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
    });

    // Load all the documents from the specified directory.
    const rawDocs = await directoryLoader.load();

    // TextSplitter is used to split the loaded documents into smaller chunks.
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,  // Size of each chunk.
      chunkOverlap: 200, // Number of overlapping characters between consecutive chunks.
      
    });
    

    // Split the documents into chunks.
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Create embeddings of the chunks using OpenAI's language model.
    const embeddings = new OpenAIEmbeddings();

    // Access the specific Pinecone index where the embeddings will be stored.
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // Store the embeddings of the documents in the Pinecone vector store.
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
  } catch (error) {
    // If there's any error during the process, log it and throw an error.
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

// Immediately Invoked Function Expression (IIFE) that calls the run function.
(async () => {
  await run();
  console.log('ingestion complete');
})();
