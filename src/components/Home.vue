<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <div class="navbar-left">
        <h1 class="logo">2 Type</h1>
      </div>
      <div class="navbar-right">
        <button class="nav-button">Inicio</button>
        <div class="dropdown">
          <button @click="toggleGenreOptions" class="nav-button dropdown-button">Género</button>
          <div class="dropdown-content" v-show="showGenreOptions">
            <a href="#">Acción</a>
            <a href="#">Aventura</a>
          </div>
        </div>
        <div class="dropdown">
          <button class="nav-button dropdown-button">Idioma</button>
          <div class="dropdown-content">
            <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg" alt="English"> Inglés</a>
            <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg" alt="Español"> Español</a>
          </div>
        </div>
        <button @click="toggleDarkMode" class="mode-toggle">{{ isDarkMode ? '☀️' : '🌙' }}</button>
      </div>
    </nav>
    <div class="search-filter-container">
      <div class="search-bar">
        <input type="text" placeholder="Search..." v-model="searchText" class="search-input">
        <button @click="filterMovies" class="search-button">Search</button>
      </div>
      <button @click="toggleFilterOptions" class="filter-button">Filter</button>
    </div>
    <div class="filter-section" v-if="showFilterOptions">
      <ul class="filter-list">
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="all"> All Genres
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="28"> Action
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="12"> Adventure
          </label>
        </li>
        <!-- Add more genres as needed -->
      </ul>
    </div>
    <div class="movie-container">
      <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
        <div class="movie-card-header">
          <button class="movie-card-language">{{ movie.original_language.toUpperCase() }}</button>
          <button class="movie-card-date">{{ movie.release_date }}</button>
        </div>
        <img :src="`https://image.tmdb.org/t/p/original${movie.poster_path}`" alt="Movie Poster" class="movie-card-image">
        <div class="movie-card-content">
          <h3 class="movie-card-title">{{ movie.title }}</h3>
          <p class="movie-card-description">{{ movie.overview }}</p>
          <div class="movie-card-info">
            <span class="adult">{{ movie.adult ? "Adult" : "" }}</span>
            <span class="popularity">Popularity: {{ movie.popularity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      movies: [],
      apiUrl: 'https://api.themoviedb.org/3/movie/popular?api_key=0204da4c740bb5ffc6e709be0af7f05f',
      searchText: '',
      selectedGenres: [],
      isDarkMode: false,
      showFilterOptions: false,
      showGenreOptions: false,
    };
  },
  created() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch(this.apiUrl);
        const data = await response.json();
        this.movies = data.results;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    filterMovies() {
      let filteredMovies = this.movies.slice();
      if (this.searchText) {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      if (this.selectedGenres.length && !this.selectedGenres.includes('all')) {
        filteredMovies = filteredMovies.filter((movie) =>
          this.selectedGenres.some(genre => movie.genre_ids.includes(parseInt(genre)))
        );
      }
      this.filteredMovies = filteredMovies;
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    toggleGenreOptions() {
      this.showGenreOptions = !this.showGenreOptions;
    },
  },
  computed: {
    filteredMovies() {
      let filteredMovies = this.movies.slice();
      if (this.searchText) {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      if (this.selectedGenres.length && !this.selectedGenres.includes('all')) {
        filteredMovies = filteredMovies.filter((movie) =>
          this.selectedGenres.some(genre => movie.genre_ids.includes(parseInt(genre)))
        );
      }
      return filteredMovies;
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  background-color: white;
  color: black;
  width: 100%;
  height: 100%;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: black;
  color: white;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 2.5em;
  margin-right: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.nav-button, .mode-toggle {
  margin-left: 20px;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1em; /* Aumenta el tamaño de la letra */
}

.dropdown-button::after {
  content: '▼';
  padding-left: 5px;
  font-size: 0.8em ;
}

.dropdown-button:hover::after {
  color: #007BFF;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: black;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown-content img {
  width: 20px;
  height: auto;
  margin-right: 5px;
}

.search-filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.search-input {
  padding: 10px;
  border: none;
  border-radius: 50px;
  width: 350px;
  font-size: 1.2em;
  background-color: #d3d3d377; /* Añade esta línea */
}

.search-button {
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  margin-left: 10px;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 1em;
}

.filter-button {
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  margin-left: 10px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  font-size: 1em;
}

.filter-options {
  display: none;
  position: absolute;
  top: calc(100% + 10px); /* Ajusta el espacio entre la barra de búsqueda y las opciones de filtro */
  left: 50%; /* Centra horizontalmente */
  transform: translateX(-50%); /* Centra horizontalmente */
  border-radius: 50%;
  background-color: #f7f7f7; /* Cambiado a un gris más claro */
  border: 1px solid #ccc;
  border-top: none;
}

.filter-list {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center; /* Centra horizontalmente */
}

.filter-list li {
  margin: 0;
  font-size: 1.21em; /* Aumenta el tamaño de la letra */
  cursor: pointer;
  padding: 15px; /* Aumenta el espacio alrededor de las opciones */
  background-color: #f7f7f7; /* Cambiado a un gris más claro */
}

.filter-list li:hover {
  background-color: #e3e3e3; /* Ajusta el color de fondo al pasar el cursor */
}

.filter-list input[type="checkbox"] {
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  vertical-align: middle;
  position: relative;
}

.filter-list input[type="checkbox"]:checked:before {
  content: "";
  display: block;
  width: 9px;
  height: 9px;
  background-color: #007BFF;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
}

/* Movie container and card styles */
.movie-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 auto;
  width: 90%;
}

.movie-card {
  width: 23%;
  margin: 1%;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 10px;
  box-sizing: border-box;
}

.movie-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.movie-card-language,
.movie-card-date {
  background-color: #007BFF;
  color: white;
  padding: 5px;
  border-radius: 3px;
  border: none;
  font-size: 0.8em;
}

.movie-card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
}

.movie-card-image:hover {
  transform: scale(1.1);
}

.movie-card-content {
  padding: 10px;
}

.movie-card-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
  transition: color 0.3s ease-in-out;
}

.movie-card-title:hover {
  color: #007BFF;
}

.movie-card-description {
  margin-top: 10px;
  font-size: 0.9em;
}

.movie-card-info {
  margin-top: 10px;
  font-size: 0.8em;
  color: #666;
}

/* Dark mode styles */
.dark-mode {
  background-color: #222;
  color: white;
}

.dark-mode .navbar {
  background-color: #333;
  color: white;
}

.dark-mode .search-bar button, .dark-mode .mode-toggle, .dark-mode .filter-button {
  background-color: #555;
  color: white;
}

.dark-mode .select {
  background-color: #333;
  color: white;
  border: 1px solid #555;
}

.dark-mode .movie-card {
  background-color: #444;
  color: white;
  border: 1px solid #555;
}

.dark-mode .movie-card-title:hover {
  color: #FFD700;
}

@media (min-width: 600px) and (max-width: 900px) {
  /* Estilos específicos para tablet */
  .navbar {
    flex-direction: column;
  }

  .navbar-left, .navbar-right {
    width: 100%;
    justify-content: space-around;
    margin-bottom: 10px;
  }

  .search-filter-container {
    flex-direction: column;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .search-input {
    width: 100%;
  }

  .movie-card {
    width: 45%;
  }
}

@media (max-width: 600px) {
  /* Estilos específicos para celular */
  .navbar {
    flex-direction: column;
  }

  .navbar-left, .navbar-right {
    width: 100%;
    justify-content: space-around;
    margin-bottom: 10px;
  }

  .search-filter-container {
    flex-direction: column;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .search-input {
    width: 100%;
  }

  .movie-card {
    width: 90%;
  }
}
</style>
