// Base URL for JSON server
const baseURL = "http://localhost:3000/films";

// Fetch and display movies in the sidebar
function fetchMovies() {
  const storedMovies = localStorage.getItem("movies");
  if (storedMovies) {
    const movies = JSON.parse(storedMovies);
    populateMoviesList(movies);
  } else {
    fetch(baseURL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((movies) => {
        localStorage.setItem("movies", JSON.stringify(movies)); // Save to localStorage
        populateMoviesList(movies);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }
}

// Populate the list of movies in the sidebar
function populateMoviesList(movies) {
  const filmsList = document.getElementById("films");
  filmsList.innerHTML = "";

  movies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title;

    if (movie.capacity - movie.tickets_sold <= 0) {
      li.classList.add("sold-out");
    } else {
      li.addEventListener("click", () => displayMovieDetails(movie));
    }

    filmsList.appendChild(li);
  });
}

// Display movie details
function displayMovieDetails(movie) {
  document.getElementById("poster").src = movie.poster;
  document.getElementById("title").textContent = movie.title;
  document.getElementById("runtime").textContent = movie.runtime;
  document.getElementById("showtime").textContent = movie.showtime;
  document.getElementById("available-tickets").textContent = 
    movie.capacity - movie.tickets_sold;

  const buyButton = document.getElementById("buy-ticket");
  buyButton.disabled = movie.capacity - movie.tickets_sold <= 0;

  buyButton.onclick = () => {
    if (movie.tickets_sold < movie.capacity) {
      movie.tickets_sold += 1;
      localStorage.setItem("movies", JSON.stringify(JSON.parse(localStorage.getItem("movies")).map(m =>
        m.id === movie.id ? { ...m, tickets_sold: movie.tickets_sold } : m
      )));
      displayMovieDetails(movie);
      populateMoviesList(JSON.parse(localStorage.getItem("movies")));
    }
  };
}

// Highlight top movies with high ticket sales
function highlightTopMovies() {
  const storedMovies = localStorage.getItem("movies");
  const movies = storedMovies ? JSON.parse(storedMovies) : [];

  const topMovies = movies
    .filter(movie => movie.tickets_sold > movie.capacity * 0.75)
    .sort((a, b) => b.tickets_sold - a.tickets_sold);

  const topMoviesList = document.getElementById("top-movies");
  topMoviesList.innerHTML = "";

  topMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = `${movie.title} - ${movie.tickets_sold} tickets sold`;
    topMoviesList.appendChild(li);
  });
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
  highlightTopMovies();
});
