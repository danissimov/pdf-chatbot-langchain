# GPT-4 & LangChain - Create a ChatGPT Chatbot for Your PDF Files

Use the new GPT-4 api to build a chatGPT chatbot for multiple Large PDF files.

Tech stack used includes LangChain, Pinecone, Typescript, Openai, and Next.js. LangChain is a framework that makes it easier to build scalable AI/LLM apps and chatbots. Pinecone is a vectorstore for storing embeddings and your PDF in text to later retrieve similar docs.

[Tutorial video](https://www.youtube.com/watch?v=ih9PBGVVOO4)

[Join the discord if you have questions](https://discord.gg/E4Mc77qwjm)

The visual guide of this repo and tutorial is in the `visual guide` folder.

**If you run into errors, please review the troubleshooting section further down this page.**

Prelude: Please make sure you have already downloaded node on your system and the version is 18 or greater.

## Development

1. Clone the repo or download the ZIP

```
git clone [github https url]
```

2. Install packages

First run `npm install yarn -g` to install yarn globally (if you haven't already).

Then run:

```
yarn install
```

After installation, you should now see a `node_modules` folder.

3. Set up your `.env` file

- Copy `.env.example` into `.env`
  Your `.env` file should look like this:

```
OPENAI_API_KEY=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

PINECONE_INDEX_NAME=

```

- Visit [openai](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to retrieve API keys and insert into your `.env` file.
- Visit [pinecone](https://pinecone.io/) to create and retrieve your API keys, and also retrieve your environment and index name from the dashboard.

4. In the `config` folder, replace the `PINECONE_NAME_SPACE` with a `namespace` where you'd like to store your embeddings on Pinecone when you run `npm run ingest`. This namespace will later be used for queries and retrieval.

5. In `utils/makechain.ts` chain change the `QA_PROMPT` for your own usecase. Change `modelName` in `new OpenAI` to `gpt-4`, if you have access to `gpt-4` api. Please verify outside this repo that you have access to `gpt-4` api, otherwise the application will not work.

## Convert your PDF files to embeddings

**This repo can load multiple PDF files**

1. Inside `docs` folder, add your pdf files or folders that contain pdf files.

2. Run the script `npm run ingest` to 'ingest' and embed your docs. If you run into errors troubleshoot below.

3. Check Pinecone dashboard to verify your namespace and vectors have been added.

## Run the app

Once you've verified that the embeddings and content have been successfully added to your Pinecone, you can run the app `npm run dev` to launch the local dev environment, and then type a question in the chat interface.

## Troubleshooting

In general, keep an eye out in the `issues` and `discussions` section of this repo for solutions.

**General errors**

- Make sure you're running the latest Node version. Run `node -v`
- Try a different PDF or convert your PDF to text first. It's possible your PDF is corrupted, scanned, or requires OCR to convert to text.
- `Console.log` the `env` variables and make sure they are exposed.
- Make sure you're using the same versions of LangChain and Pinecone as this repo.
- Check that you've created an `.env` file that contains your valid (and working) API keys, environment and index name.
- If you change `modelName` in `OpenAI`, make sure you have access to the api for the appropriate model.
- Make sure you have enough OpenAI credits and a valid card on your billings account.
- Check that you don't have multiple OPENAPI keys in your global environment. If you do, the local `env` file from the project will be overwritten by systems `env` variable.
- Try to hard code your API keys into the `process.env` variables if there are still issues.

**Pinecone errors**

- Make sure your pinecone dashboard `environment` and `index` matches the one in the `pinecone.ts` and `.env` files.
- Check that you've set the vector dimensions to `1536`.
- Make sure your pinecone namespace is in lowercase.
- Pinecone indexes of users on the Starter(free) plan are deleted after 7 days of inactivity. To prevent this, send an API request to Pinecone to reset the counter before 7 days.
- Retry from scratch with a new Pinecone project, index, and cloned repo.

## Credit

Frontend of this repo is inspired by [langchain-chat-nextjs](https://github.com/zahidkhawaja/langchain-chat-nextjs)


## Project-tree 

```
pdf-chatbot-langchain // Your project root
├─ .eslintrc.json // Configures ESLint, a tool for identifying and reporting on patterns in JavaScript/TypeScript
├─ .git // The git repository data for your project, including history, config, and branches
│  ├─ (and everything inside .git is part of your git version control)
├─ .gitignore // Specifies intentionally untracked files that Git should ignore
├─ .prettierrc // Configures Prettier, an opinionated code formatter
├─ components // Folder containing all React components
│  ├─ layout.tsx // Layout component used across multiple pages
│  └─ ui // Folder for UI components
│     ├─ accordion.tsx // Accordion UI component
│     ├─ LoadingDots.tsx // Loading animation UI component
│     └─ TextArea.tsx // Textarea UI component
├─ config // Folder for project configuration files
│  └─ pinecone.ts // Configurations for pinecone, a machine learning service
├─ declarations // Folder for TypeScript declaration files
│  └─ pdf-parse.d.ts // Declaration file for pdf-parse, a PDF parsing library
├─ default // Could contain default configurations or values, need more context
├─ docs // Folder for documentation files
│  └─ Semantic Sholar_AI_2301.10140.pdf // A PDF document
├─ next.config.js // Configuration for the Next.js project
├─ package-lock.json // Describes the node package dependencies with exact versions
├─ package.json // Lists package dependencies and provides information about the project
├─ pages // Folder for Next.js pages
│  ├─ api // Folder for API routes
│  │  └─ chat.ts // API endpoint for chat functionalities
│  ├─ index.tsx // Entry point (homepage) of the Next.js app
│  ├─ _app.tsx // Next.js custom App component, allows shared layout across all pages
│  └─ _document.tsx // Next.js custom Document, used to augment your application's <html> and <body> tags
├─ postcss.config.cjs // Configures PostCSS, a tool for transforming CSS with JavaScript
├─ public // Folder for static files that are served at the root of your Next.js app
│  ├─ bot-image.png // Image of a bot
│  ├─ favicon.ico // Favicon to be displayed in browser tabs
│  ├─ logo.png // Logo image
│  └─ usericon.png // User icon image
├─ RAAPP.conf // Not a common file, likely a configuration file for a specific tool or service
├─ README.md // Markdown file containing information about the project
├─ scripts // Folder for script files
│  └─ ingest-data.ts // Script for ingesting data
├─ styles // Folder for style/CSS files
│  ├─ base.css // Base styles for the project
│  ├─ chrome-bug.css // Specific styles to address Chrome browser bugs
│  ├─ Home.module.css // CSS Module for Home page
│  └─ loading-dots.module.css // CSS for loading dots animation
├─ tailwind.config.cjs // Configuration for Tailwind CSS, a utility-first CSS framework
├─ tsconfig.json // Configuration for TypeScript project
├─ types // Folder for custom TypeScript type definitions
│  └─ chat.ts // TypeScript types for chat functionalities
'''