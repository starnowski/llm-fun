# Implementation Plan: Client-Side Vector Database

## 1. Overview
The objective is to enhance the existing "Kalkulator Stresu" game by replacing the exact string-matching logic with a semantic search powered by a client-side vector database. We will use Transformers.js for generating text embeddings directly in the browser and RxDB (or a similar local vector store) to store and query these embeddings, as referenced in the provided article.

## 2. Technical Stack Additions
- **Transformers.js (`@xenova/transformers`)**: To run a pre-trained language model in the browser and convert text (situations) into vector embeddings. A multilingual model (e.g., `Xenova/paraphrase-multilingual-MiniLM-L12-v2`) is recommended to properly support the Polish language.
- **RxDB**: A local-first, offline-first JavaScript database. We will configure it to store documents with an `embedding` array field and perform vector similarity searches.
- **Bundler (Optional but recommended)**: Since we are adding npm packages like RxDB and Transformers.js, we may need to introduce a bundler like Vite, Webpack, or use ES modules via CDN (e.g., Skypack/esm.sh) to keep it a simple one-pager.

## 3. Implementation Steps

- [x] **Step 1: UI Updates for Loading State**
  - Add a loading indicator or status text in the UI (e.g., `<div id="db-status">Loading AI Model...</div>`).
  - The game inputs should be disabled until the database is fully initialized.

- [x] **Step 2: Database & Model Initialization (Page Load)**
  - **Initialize Transformers.js**: Load the pipeline for feature extraction (`feature-extraction`).
  - **Initialize RxDB**: 
    - Create a local database instance.
    - Define a collection schema (e.g., `situations`) with fields: `id` (string), `name` (string), `points` (number), and `embedding` (array of numbers).
  - **Populate Database**:
    - Check if the database is already populated (to avoid re-embedding on every refresh).
    - If empty, iterate through the `situations` array, generate the embedding vector for each, and insert the document into the RxDB collection.
  - **Notify User**: Once all embeddings are stored, update the UI to display: *"Wszystkie sytuacje zostały zapisane w bazie danych"* and enable the input fields.

- [ ] **Step 3: Semantic Search Implementation**
  - Modify the `processInput` function:
    - Generate the embedding vector for the user's input.
    - Query the RxDB collection using vector search capabilities (cosine similarity).
    - Define a similarity threshold (e.g., `0.85`).
    - If above threshold, consider it a match, add points, and update the UI.
    - If below threshold, treat it as a miss (display `❌`).

- [ ] **Step 4: Refactoring & Cleanup**
  - Remove the old `normalizeString` exact-matching logic.
  - Ensure all asynchronous operations are properly handled with `async/await` and that the UI remains responsive.

## 4. Execution Details
We will start by modifying `index.html` to include the required CDNs or set up a simple `package.json` with a bundler to support the new dependencies. Then, we will rewrite the `app.ts` initialization logic to handle the async loading of the vector database and embeddings.
