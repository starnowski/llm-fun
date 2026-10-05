# Implementation Plan for Autocomplete Feature

- [x] **Update `index.html`**
  - Wrap the `situation-input` in a new `div` with a class like `autocomplete-wrapper` to allow relative positioning.
  - Add an empty `<ul id="autocomplete-list" class="autocomplete-list"></ul>` below the input to serve as the dropdown container.

- [x] **Update `style.css`**
  - Add CSS for `.autocomplete-wrapper` (`position: relative`, `flex: 1`, `display: flex`).
  - Add CSS for `.autocomplete-list` to position it absolutely below the input (`position: absolute`, `top: 100%`, `left: 0`, `right: 0`, `z-index: 100`, `background-color: white`, `border: 1px solid #ccc`, `max-height: 200px`, `overflow-y: auto`, `list-style: none`, `padding: 0`, `margin: 0`, `display: none`).
  - Add styling for the list items `.autocomplete-list li` (padding, cursor) and a hover effect `.autocomplete-list li:hover` (`background-color: #f4f4f9`).

- [x] **Update `app.ts` - DOM Elements**
  - Add a reference to the new `autocomplete-list` element inside the `DOMContentLoaded` event listener.

- [x] **Update `app.ts` - Input Event Listener**
  - Add an `input` event listener to `situation-input`.
  - On every keystroke, capture the input value. If the value is empty, clear and hide the autocomplete list.
  - If the value is not empty, perform a full-text search using `flexSearch.search(inputValue, 5)` to get up to 5 matching document IDs.

- [x] **Update `app.ts` - Rendering Suggestions**
  - Extract the matched string IDs from the search result.
  - Map these IDs to their corresponding situation names by looking them up in the static `situations` array (e.g., `situations.find(s => s.id.toString() === id)`).
  - Clear the existing `autocomplete-list` inner HTML.
  - For each matched name, create an `li` element, set its text content to the name, and append it to the `autocomplete-list`.
  - Change the display style of `autocomplete-list` to `block` to show the suggestions.

- [x] **Update `app.ts` - Suggestion Selection & Cleanup**
  - Attach a `mousedown` or `click` event listener to each created `li` element.
  - When an option is clicked, set the `situation-input.value` to the selected text, hide the autocomplete list, and keep focus on the input field.
  - Update the `handleAdd` function to hide and clear the autocomplete list when an entry is submitted.
  - Add a document-level `click` event listener to hide the autocomplete list when the user clicks anywhere outside of the input field or the list.
