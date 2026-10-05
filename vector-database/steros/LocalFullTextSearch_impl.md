# Implementation Plan: Client-Side Full-Text & Hybrid Search

## 1. Overview
The goal is to enhance the existing "Kalkulator Stresu" application by adding full-text search capabilities using RxDB's full-text search integration. This will allow the application to perform hybrid search, combining the existing vector search with full-text search to improve matching accuracy (semantic matching via vectors + keyword matching via full-text search).

## 2. Technical Stack Additions
- **RxDB Fulltext Search / FlexSearch**: Following the [RxDB Fulltext Search documentation](https://rxdb.info/fulltext-search.html#using-the-rxdb-fulltext-search), we will introduce the FlexSearch plugin for RxDB to index the `situations` collection.

## 3. Implementation Steps

- [x] **Step 1: Install Dependencies**
  - Install the required full-text search dependencies (e.g., RxDB FlexSearch plugin and/or `flexsearch`).
  - Update `package.json` to include the new packages.

- [x] **Step 2: Database & Plugin Initialization**
  - Import the full-text search plugin and register it with RxDB (`addRxPlugin`).
  - Inside `initDB()` (or after the collection is created), initialize the search index using `addFulltextSearch()`.
  - Configure the index with a unique `identifier` (e.g., `'situations-search'`).
  - Map the document content to a string using the `docToString` configuration, ensuring the `name` field of each situation is indexed.

- [x] **Step 3: Implement Hybrid Search Logic**
  - Modify the `processInput(input: string)` function to query both the full-text search index and the existing vector search.
  - Run the full-text search query using the flexSearch instance (e.g., `await flexSearch.find(input)`).
  - Combine and rank the results:
    - If the full-text search finds an exact or strong keyword match, prioritize it.
    - If no strong keyword match is found, fallback to the vector search result (using the existing cosine similarity threshold of `0.85`).
    - Alternatively, implement a scoring algorithm (like Reciprocal Rank Fusion) to blend the scores.

- [x] **Step 4: Refactoring & Testing**
  - Ensure the full-text index initialization is awaited correctly before enabling the UI inputs.
  - Test the game with inputs that require keyword matching vs. inputs that require semantic matching to ensure the hybrid approach works effectively.
  - Clean up any unused code and ensure the application remains responsive during searches.
