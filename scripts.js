import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Dark/Light mode toggle

const themeSettings = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

const themeSelect = document.querySelector("[data-settings-theme]");
const saveButton = document.querySelector("[data-settings-save]");
const cancelButton = document.querySelector("[data-settings-cancel]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");

// Retrieve the saved theme from localStorage, defaulting to "day" if not found
const selectedTheme = localStorage.getItem("selectedTheme") || "day";
const { dark, light } = themeSettings[selectedTheme];

// Apply the saved theme on page load
document.body.style.setProperty("--color-dark", dark);
document.body.style.setProperty("--color-light", light);

// Set the themeSelect dropdown to the saved theme
themeSelect.value = selectedTheme;

saveButton.addEventListener("click", () => {
  const selectedTheme = themeSelect.value;
  const { dark, light } = themeSettings[selectedTheme];

  // Save the selected theme to localStorage
  localStorage.setItem("selectedTheme", selectedTheme);

  document.body.style.setProperty("--color-dark", dark);
  document.body.style.setProperty("--color-light", light);

  settingsOverlay.style.display = "none";
});

cancelButton.addEventListener("click", () => {
  settingsOverlay.style.display = "none";
});

const openSettingsButton = document.querySelector("[data-header-settings]");
openSettingsButton.addEventListener("click", () => {
  settingsOverlay.style.display = "block";
});


// Book Previews

const matches = books;
const currentPage = 1;
const loadPreview = document.querySelector('[data-list-items]');

loadPreview.addEventListener("load", () => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active;
  for (const node of pathArray) {
    if (active) break;
    const previewId = node?.dataset?.preview;
    for (const book of books) {
      if (book.id === previewId) {
        active = book;
        break;
      }
    }
  }

  const fragment = document.createDocumentFragment();
  const extracted = books.slice(0, 37);

  for (const { author, image, title, id, description, published } of extracted) {
    const element = createPreview(author, image, title, id);
    element.dataset.description = description;
    element.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
    fragment.appendChild(element);
  }

  loadPreview.innerHTML = "";
  loadPreview.appendChild(fragment);
});

(function createPreview() {
  const fragment = document.createDocumentFragment();
  const extracted = books.slice(0, 36)
  for (const {author, image, title, id, description, published} of extracted) {
    let element = document.createElement("button");
    element.classList.add("preview");
    element.dataset.id = id;
    element.dataset.title = title;
    element.dataset.description = description;
    element.dataset.image = image;
    element.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
    element.setAttribute("data-preview", id);

    element.innerHTML = /* html */ `
      <div>
        <img class="preview__image" src="${image}" />
      </div>
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    fragment.appendChild(element);
  }
  document.querySelector('[data-list-items]').appendChild(fragment)
})()


function defaultDisplay (results, page) {
  const startIndex = (page - 1) * BOOKS_PER_PAGE
  const endIndex = page * BOOKS_PER_PAGE;
  const currentResults = results.slice(startIndex, endIndex);
  const bookList = document.querySelector("[data-list-items]");

  bookList.innerHTML = "";

  if (currentResults.length > 0) {
    for (const book of currentResults) {
      const { author, image, title, id, description, published } = book;
      let element = document.createElement("button");
      element.classList.add("preview");
      element.dataset.id = id;
      element.dataset.title = title;
      element.dataset.description = description;
      element.dataset.image = image;
      element.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
      element.setAttribute("data-preview", id);

      element.innerHTML = /* html */ `
        <div>
          <img class="preview__image" src="${image}" />
        </div>
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
      bookList.appendChild(element);
    }
  }
}

defaultDisplay(books, currentPage);
// if (!books && !Array.isArray(books)) {
//   throw new Error("Source required");
// }
// if (!range && range.length < 2) {
//   throw new Error("Range must be an array with two numbers");
// }

// Show Book Details Function

function showBookDetails(event) {
  const overlay = document.querySelector("[data-list-active]");
  const title = document.querySelector("[data-list-title]");
  const subtitle = document.querySelector("[data-list-subtitle]");
  const description = document.querySelector("[data-list-description]");
  const image = document.querySelector("[data-list-image]");
  const imageBlur = document.querySelector("[data-list-blur]");

  if (event.target.dataset.id) {
    overlay.show();
  }

  if (event.target.dataset.title) {
    title.innerHTML = event.target.dataset.title;
  }

  if (event.target.dataset.subtitle) {
    subtitle.innerHTML = event.target.dataset.subtitle;
  }

  if (event.target.dataset.description) {
    description.innerHTML = event.target.dataset.description;
  }

  if (event.target.dataset.image) {
    image.setAttribute("src", event.target.dataset.image);
    imageBlur.setAttribute("src", event.target.dataset.image);
  }
}

document.querySelector("[data-list-items]")
document.addEventListener("click", showBookDetails);

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").style.display = "none";
});

// Show More Button

const showMoreButton = document.querySelector("[data-list-button]");
const bookList = document.querySelector("[data-list-items]");

let startIndex = 0;
let endIndex = 36;

const showMoreBooks = () => {
  const extracted = books.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();

  for (const {
    author,
    image,
    title,
    id,
    description,
    published,
  } of extracted) {
    let element = document.createElement("button");
    element.classList.add("preview");
    element.dataset.id = id;
    element.dataset.title = title;
    element.dataset.description = description;
    element.dataset.image = image;
    element.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
    element.setAttribute("data-preview", id);

    element.innerHTML = /* html */ `
      <div>
        <img class="preview__image" src="${image}" />
      </div>
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    fragment.appendChild(element);
  }

  const remaining = matches.slice(showMoreBooks, matches.length)
  for (const {author, image, title, id, description, published} of remaining) {
    const bookPreview = createPreview({author, image, title, id, description, published})
    fragment.appendChild(bookPreview)
  }
  bookList.appendChild(fragment);

  startIndex += BOOKS_PER_PAGE;
  endIndex += BOOKS_PER_PAGE;
};



showMoreButton.addEventListener("click", showMoreBooks);

// fragment = document.createDocumentFragment()

// Search Button

const searchButton = document.querySelector("[data-header-search]");
const searchBar = document.querySelector("[data-search-overlay]");
const searchTitle = document.querySelector("[data-search-title]");

searchButton.addEventListener("click", () => {
  searchBar.style.display = "block";
});

// Genre and Author Drop-down Lists

const genreSelect = document.querySelector("[data-search-genres]");
const authorSelect = document.querySelector("[data-search-authors]");

const expandDropdown = (selectedElement, option) => {
  for (const [id, name] of Object.entries(option)) {
    const option = document.createElement("option");
    option.value = id;
    option.innerText = name;
    selectedElement.appendChild(option);
  }
};

expandDropdown(genreSelect, genres);
expandDropdown(authorSelect, authors);

const submitSearchButton = document.querySelector("[data-search-submit]");
submitSearchButton.addEventListener("click", () => {
  searchBar.style.display = "none";
});

const cancelSearchButton = document.querySelector("[data-search-cancel]");
cancelSearchButton.addEventListener("click", () => {
  searchBar.style.display = "none";
})

// Book Results Filters

const searchForm = document.querySelector("[data-search-form]");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const resultsFiltered = [];

  for (const book of books) {
    const titleMatch = book.title.toLowerCase().includes(filters.title.toLowerCase().trim());
    const authorMatch = book.author.toLowerCase().includes(filters.author.toLowerCase().trim());
    const genreMatch = book.genres.includes(filters.genre);

    if (titleMatch !== false && authorMatch !== false && genreMatch !== false) {
      resultsFiltered.push(book);
    }
  }

  //   Update Book List with Filtered Results

  startIndex = 0;
  endIndex = startIndex + BOOKS_PER_PAGE;
  bookList.innerHTML = "";
  if (resultsFiltered.length > 0) {
    for (const book of resultsFiltered) {
      const {author, image, title} = book;
      const previewFilters = createPreviewFilters(authors[author], image, title);
      bookList.appendChild(previewFilters);
    }
    //  Show No Results Pop-Up
    const message = document.querySelector("[data-list-message]");
    message.style.display = "none"
  } else {
    const message = document.querySelector("[data-list-message]");
    message.style.display = "block"
  }

  event.target.reset();


function createPreviewFilters(author, image, title) {
  const element = document.createElement("button");
  element.classList.add("preview")
  element.innerHTML = `
    <div>
      <img class="preview__image" src="${image}" />
    </div>
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${author}</div>
    </div>
  `;

  return element
}



  //  Scroll to Top

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close Search Overlay

  searchBar.close();
});

/* BUG FIXES:
 *
 * Added import from data.js
 * Declared undeclared variables
 * Added the light/dark theme toggle
 * Created function to display book details
 * If statements with truthy conditions to check for when and what to display and what to update on availability
 * Added an eventListener to book previews and button clicks
 * Restructured code into groups of common functionalities
 * Created a more readable atmosphere in the codebase
 * Rewrote code with correct syntax
 * Discarded unused variables(i)
 * Removed unnecessary code snippets that had no syntactic value to the main codebase
 * Restructured ternaries that were syntactically incorrect
 * Focussed codebase on functionality and deleted code snippets with unclear/redundant purposes/declarations
 * Added functionality to "Show More" button---allows user to load more book previews and display them
 * Retrieve new set of books to display according to current range whenever we click "Show More"
 * Dynamically created book previews that get added to list
 * Clicking "Search" button displays search bar overlay---users can search for books in search bar form by filtering titles, authors, and genres to narrow search results
 * Author/Genre dropdowns contain lists of available genres and authors in built-in system for user selection
 * Desired search filters submitted via search form get stored to memory and returned to filter results
 * Matching results are pushed to results[array] and book list is updated
 * Pop-up message is displayed for no results matching search criteria
 * Better UI functionality and UE 
 * More user-friendly
 * 
 */
