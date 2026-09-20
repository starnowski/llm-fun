# Implementation Plan: Stress Situations Game

## 1. Overview
The goal is to create a single-page, serverless browser game where players input "stress situations" in Polish. The game will match their input against a predefined list, award points if found, or display an "X" if not found, while maintaining a running total of points.

## 2. Technical Stack
- **HTML5**: For structure, contained in a single `index.html` file.
- **CSS3**: For styling, to ensure the application looks like a game.
- **TypeScript**: To ensure type safety during development. It will be compiled down to a vanilla JavaScript file (`app.js`) that the HTML file will load. No external bundlers or servers are needed for execution, ensuring it works from `file://`.

## 3. Data Structure
The situations will be mapped into an array of objects within the code.
```typescript
interface Situation {
    id: number;
    name: string;
    points: number;
}
```
*All 43 situations provided in GOAL.md will be transcribed into this array.*

## 4. Matching Logic
To make the game user-friendly while strictly adhering to the rules:
- **String Normalization**: Both the list and the user input will be trimmed of whitespace and converted to lowercase.
- **Comparison**: We will compare the normalized user input against the normalized descriptions. 
- *Enhancement (Optional)*: Implementing a simple fuzzy search or diacritic normalizer (e.g., matching "slub" to "ślub") could improve the user experience significantly.

## 5. UI Layout
1. **Header**: Game title (e.g., "Kalkulator Stresu").
2. **Current Score**: Prominent display of the total points calculated so far.
3. **Input Section**: 
    - Text input field.
    - "Dodaj" (Add) button.
4. **History List**: A log of the user's inputs:
    - *Match found*: Displays the situation name and `+ [Points] pkt`.
    - *No match*: Displays the text typed by the user along with a clear `❌` (X character).
5. **Reset Game**: A button to clear the board and start a new session.

## 6. Execution Steps
- [x] **Repository Setup**: Create `index.html`, `style.css`, and `app.ts` in the project folder.
- [x] **Data Preparation**: Copy the situations from `GOAL.md` and format them into the TypeScript array.
- [x] **Core Logic Implementation**: Write the TypeScript logic to handle the state (current score, list of attempts) and the matching algorithm.
- [x] **DOM Manipulation**: Wire the input and buttons to the TypeScript logic so that the DOM updates dynamically when a user submits an entry.
- [x] **Styling**: Apply CSS to make the UI clean and responsive.
- [x] **Compilation**: Run `tsc` to compile `app.ts` to `app.js`.
- [ ] **Manual Testing**: Open `index.html` in a web browser (without a local server) to verify that the game functions correctly offline.
