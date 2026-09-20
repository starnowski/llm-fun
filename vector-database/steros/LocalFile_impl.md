# Implementation Plan: Supporting `file://` Execution (No Web Server)

## 1. Overview
The user wants to open `index.html` directly from the file system (`file:///...`) without running a local web server (like Vite or Node.js). Modern browsers block ES Module imports (`<script type="module">`) and local JSON/WASM loading over the `file://` protocol due to strict Cross-Origin Resource Sharing (CORS) security policies. 

To bypass this and satisfy the original "serverless one-pager" requirement, we need to bundle all our TypeScript code and Node modules (RxDB, Transformers.js) into a single standard JavaScript file that doesn't rely on local ES module resolution.

## 2. Technical Approach
We will use **esbuild**, an extremely fast JavaScript bundler, to package `app.ts` and all its imported libraries into a single `bundle.js` file formatted as an IIFE (Immediately Invoked Function Expression). This allows the browser to execute it as a classic script without triggering CORS module restrictions.

*Note: Transformers.js loads its AI models and WASM execution files from a remote CDN (Hugging Face) over `https://`, which is permitted by CORS even when the host page is on `file://`.*

## 3. Implementation Steps

- [x] **Step 1: Modify HTML Script Tag**
  - Update `index.html` to load a bundled file instead of the raw TypeScript file.
  - Change `<script type="module" src="/app.ts"></script>` to `<script src="bundle.js"></script>`.

- [ ] **Step 2: Install esbuild**
  - Run `npm install -D esbuild` to install the bundler.
  
- [ ] **Step 3: Update `package.json` Build Scripts**
  - Add a build script to package the application.
  - `"build": "esbuild app.ts --bundle --outfile=bundle.js --format=iife"`

- [ ] **Step 4: Bundle the Application**
  - Run `npm run build` to generate `bundle.js`.

- [ ] **Step 5: Testing on `file://`**
  - Open `index.html` directly in the browser via the file system to verify that the vector database and AI model initialize correctly without CORS errors.

## 4. Execution Details
By bundling everything into `bundle.js`, we eliminate the browser's need to make local HTTP requests to resolve module imports. The entire logic (including RxDB and the Transformers.js engine wrapper) will exist in one file, making the game fully portable and launchable via a simple double-click on `index.html`.
