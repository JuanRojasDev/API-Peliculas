<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <div class="navbar-left">
        <h1 class="logo">2 Type</h1>
      </div>
      <div class="navbar-right">
        <button @click="onHomeButtonClick" class="nav-button">
          {{ translations[currentLanguage].home }}
        </button>
        <div
          class="dropdown"
          @mouseover="showGenreOptions = true"
          @mouseleave="showGenreOptions = false"
        >
          <button class="nav-button dropdown-button">
            {{ translations[currentLanguage].genre }}
          </button>
          <div class="dropdown-content" v-show="showGenreOptions">
            <a
              v-for="genre in genres"
              :key="genre.id"
              @click="filterByGenre(genre.id)"
            >
              {{ genre.name }}
            </a>
          </div>
        </div>
        <div class="dropdown">
          <button class="nav-button dropdown-button">
            {{ translations[currentLanguage].language }}
          </button>
          <div class="dropdown-content">
            <a href="#" @click="changeLanguage('en')">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg"
                alt="English"
              />
              {{ translations[currentLanguage].english }}
            </a>
            <a href="#" @click="changeLanguage('es')">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg"
                alt="Español"
              />
              {{ translations[currentLanguage].spanish }}
            </a>
          </div>
        </div>
        <button @click="toggleDarkMode" class="mode-toggle">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </button>
      </div>
    </nav>
    <div class="search-filter-container">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchText"
          @input="filterAndSortMovies"
          class="search-input"
          :placeholder="translations[currentLanguage].search"
        />
        <button @click="filterAndSortMovies" class="search-button">
          {{ translations[currentLanguage].search }}
        </button>
      </div>
      <button @click="toggleFilterOptions" class="filter-button">
        {{ translations[currentLanguage].filter }}
      </button>
    </div>
    <div class="filter-section" v-if="showFilterOptions">
      <ul class="filter-list">
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="all" />
            {{ translations[currentLanguage].allGenres }}
          </label>
        </li>
        <select v-model="selectedGenre">
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </ul>
    </div>
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
    </div>
    <div class="movie-container" v-else>
      <div class="movie-card" v-for="movie in paginatedMovies" :key="movie.id">
        <div class="movie-card-header">
          <button class="movie-card-language">
            {{ movie.original_language.toUpperCase() }}
          </button>
          <button class="movie-card-date">{{ movie.release_date }}</button>
        </div>
        <img
          :src="`https://image.tmdb.org/t/p/original${movie.poster_path}`"
          alt="Movie Poster"
          class="movie-card-image"
        />
        <div class="movie-card-content">
          <h3 class="movie-card-title">
            {{ movie.translated_title || movie.title }}
          </h3>
          <p class="movie-card-description">
            {{ movie.translated_overview || movie.overview }}
          </p>
          <div class="movie-card-info">
            <span class="adult">
              {{ movie.adult ? translations[currentLanguage].adult : "" }}
            </span>
            <span class="popularity">
              {{ translations[currentLanguage].popularity }}:
              {{ movie.popularity }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">
          <i class="fas fa-arrow-left">{{
            translations[currentLanguage].prev
          }}</i>
        </button>
        <span>{{ currentPage }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage * itemsPerPage >= filteredMovies.length"
        >
          <i class="fas fa-arrow-right">{{
            translations[currentLanguage].next
          }}</i>
        </button>
      </div>
    </div>
    <footer class="footer">
      <div class="footer-left">
        <h2 class="logo-text">Juan Rojas</h2>
        <p class="footer-description">
          Desarrollador de software con experiencia en desarrollo web y móvil.
        </p>
        <h3 class="footer-heading">Redes Sociales</h3>
        <div class="socials">
          <a href="https://github.com/JuanRojasDev" target="_blank">
            <i class="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/juan-andres-rojas-salinas-2a74b31bb/"
            target="_blank"
          >
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
      <div class="footer-right">
        <h3 class="footer-heading">Contacto</h3>
        <p class="footer-contact">Email: juan.rojas@example.com</p>
        <p class="footer-contact">Teléfono: +1 234 567 890</p>
      </div>
      <div class="footer-bottom">
        <p>© 2024 2Type Peliculas Online, Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  props: {
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      movies: [],
      originalMovies: [],
      apiUrl: "https://api.themoviedb.org/3/discover/movie",
      apiKey: "0204da4c740bb5ffc6e709be0af7f05f",
      searchText: "",
      selectedGenre: null,
      genres: [],
      showFilterOptions: false,
      showGenreOptions: false,
      genreToFilter: null,
      currentLanguage: "en",
      loading: true,
      currentPage: 1,
      itemsPerPage: 20,
      translations: {
        en: {
          home: "Home",
          genre: "Genre",
          action: "Action",
          adventure: "Adventure",
          language: "Language",
          english: "English",
          spanish: "Spanish",
          search: "Search",
          filter: "Filter",
          allGenres: "All Genres",
          popularity: "Popularity",
          adult: "Adult",
          prev: "Previous",
          next: "Next",
        },
        es: {
          home: "Inicio",
          genre: "Género",
          action: "Acción",
          adventure: "Aventura",
          language: "Idioma",
          english: "Inglés",
          spanish: "Español",
          search: "Buscar",
          filter: "Filtrar",
          allGenres: "Todos los géneros",
          popularity: "Popularidad",
          adult: "Adulto",
          prev: "Anterior",
          next: "Siguiente",
        },
      },
    };
  },
  created() {
    this.fetchMovies();
    this.fetchGenres();
  },
  watch: {
    selectedGenre(newGenre) {
      this.selectedGenres = [newGenre];
    },
  },
  methods: {
    async fetchMovies() {
      try {
        const totalPages = 500;
        const requests = Array.from({ length: totalPages }, (_, i) =>
          axios.get(this.apiUrl, {
            params: {
              api_key: this.apiKey,
              page: i + 1,
            },
          })
        );
        const responses = await Promise.all(requests);
        const allMovies = responses.flatMap(
          (response) => response.data.results
        );
        if (this.currentLanguage === "es") {
          await this.translateMovies(allMovies);
        }
        this.originalMovies = allMovies;
        this.movies = allMovies;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    async fetchGenres() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list`,
          {
            params: {
              api_key: this.apiKey,
              language: this.currentLanguage,
            },
          }
        );
        this.genres = response.data.genres;
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },
    async translateMovies(movies) {
      const translatePromises = movies.map(async (movie) => {
        await this.translateOverview(movie);
        await this.translateTitle(movie);
      });
      await Promise.all(translatePromises);
    },
    async translateOverview(movie) {
  if (this.countWords(movie.overview) <= 100) {
    const localStorageKey = `overview_translation_${movie.id}_${this.currentLanguage}`;
    const storedTranslation = localStorage.getItem(localStorageKey);

    if (storedTranslation) {
      movie.translated_overview = storedTranslation;
    } else {
      try {
        const response = await axios.get(
          "https://translation.googleapis.com/language/translate/v2",
          {
            params: {
              q: movie.overview,
              source: "en",
              target: "es",
              key: "AIzaSyCqRYINJR0ON1xtGrwYN5IrfcsrJHBQkwI",
            },
          }
        );
        if (
          response.data &&
          response.data.data &&
          response.data.data.translations &&
          response.data.data.translations.length > 0
        ) {
          movie.translated_overview =
            response.data.data.translations[0].translatedText;
          // Guardar la traducción en el localStorage
          localStorage.setItem(
            localStorageKey,
            movie.translated_overview
          );
        } else {
          console.error(
            "Translation response structure does not match expected format:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Error translating overview:",
          error.response ? error.response.data : error.message
        );
      }
    }
  }
},
async translateTitle(movie) {
  const localStorageKey = `title_translation_${movie.id}_${this.currentLanguage}`;
  const storedTranslation = localStorage.getItem(localStorageKey);

  if (storedTranslation) {
    movie.translated_title = storedTranslation;
  } else {
    try {
      const response = await axios.get(
        "https://translation.googleapis.com/language/translate/v2",
        {
          params: {
            q: movie.title,
            source: "en",
            target: "es",
            key: "AIzaSyCqRYINJR0ON1xtGrwYN5IrfcsrJHBQkwI",
          },
        }
      );
      if (
        response.data &&
        response.data.data &&
        response.data.data.translations &&
        response.data.data.translations.length > 0
      ) {
        movie.translated_title =
          response.data.data.translations[0].translatedText;
        // Guardar la traducción en el localStorage
        localStorage.setItem(
          localStorageKey,
          movie.translated_title
        );
      } else {
        console.error(
          "Translation response structure does not match expected format:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "Error translating title:",
        error.response ? error.response.data : error.message
      );
    }
  }
},
    countWords(text) {
      return text.split(/\s+/).length;
    },
    filterAndSortMovies() {
      let filteredMovies = this.originalMovies.filter((movie) =>
        movie.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
      if (this.selectedGenre) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genre_ids.includes(this.selectedGenre)
        );
      }
      this.movies = filteredMovies;
    },
    filterByGenre(genreId) {
      this.selectedGenre = genreId;
      this.filterAndSortMovies();
    },
    changeLanguage(language) {
      this.currentLanguage = language;
      this.fetchMovies();
      this.fetchGenres();
    },
    toggleDarkMode() {
      this.$emit("toggle-dark-mode");
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    onHomeButtonClick() {
      this.selectedGenre = null;
      this.searchText = "";
      this.movies = this.originalMovies;
      this.currentPage = 1;
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.filteredMovies.length) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  computed: {
    filteredMovies() {
      let filtered = this.movies;
      if (this.selectedGenre && this.selectedGenre !== "all") {
        filtered = filtered.filter((movie) =>
          movie.genre_ids.includes(this.selectedGenre)
        );
      }
      return filtered.filter((movie) =>
        movie.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    paginatedMovies() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredMovies.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
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

body,
html {
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

.nav-button,
.mode-toggle {
  margin-left: 20px;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1em; /* Aumenta el tamaño de la letra */
}

.dropdown-button::after {
  content: "▼";
  padding-left: 5px;
  font-size: 0.8em;
}

.dropdown-button:hover::after {
  color: #007bff;
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
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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
  background-color: #d3d3d377;
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

.filter-section {
  padding: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #333;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.pagination span {
  display: inline-block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 5px;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #ddd;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
}

.filter-button {
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1em;
}

.filter-options {
  display: none;
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50px;
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-top: none;
}

.filter-list {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
}

.filter-list li {
  margin: 0;
  font-size: 1.21em;
  cursor: pointer;
  padding: 15px;
  background-color: #f7f7f7;
}

.filter-list li:hover {
  background-color: #e3e3e3;
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
  background-color: #007bff;
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
  background-color: #007bff;
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
  color: #007bff;
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

.footer {
  width: 100%;
  background-color: black; /* Un color de fondo más oscuro */
  color: #bdc3c7;
  padding: 30px 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 3px solid #555; /* Un color de borde más oscuro */
}

.footer-left,
.footer-right {
  flex: 1;
  padding: 20px; /* Más espacio entre los elementos */
  text-align: center;
}

.footer-left {
  border-right: 1px solid #7f8c8d; /* Añadir una línea delgada a la derecha */
  padding-right: 20px; /* Agregar espacio a la derecha de "Juan Rojas" */
}

.logo-text {
  font-size: 1.5em; /* Tamaño de letra más grande */
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 2px; /* Más espacio entre las letras */
}

.footer-description {
  margin-bottom: 20px; /* Más espacio debajo del texto */
  font-size: 1em; /* Tamaño de letra más grande */
}

.footer-heading {
  font-size: 1.3em; /* Tamaño de letra más grande */
  font-weight: bold;
}

.footer-contact {
  margin-bottom: 10px; /* Más espacio debajo del contacto */
}

.socials {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.socials a {
  color: #bdc3c7;
  font-size: 1.8em; /* Iconos más grandes */
  margin-right: 20px; /* Más espacio entre los iconos */
  transition: color 0.3s ease;
}

.socials a:hover {
  color: #3498db;
}

.contact-form {
  width: calc(
    33% - 20px
  ); /* Establece el ancho de la sección de formulario de contacto */
}

.contact-input {
  width: 100%;
  margin-bottom: 10px; /* Agrega espacio entre los campos de entrada */
  border-radius: 5px; /* Añade bordes redondeados a los campos de entrada */
}

.contact-btn {
  width: 100%;
  background-color: #007bff; /* Cambia el color de fondo del botón a azul */
  color: white; /* Cambia el color del texto del botón a blanco */
  border: none; /* Elimina el borde del botón */
  border-radius: 5px; /* Añade bordes redondeados al botón */
}

.footer-bottom {
  margin-top: 20px; /* Agrega espacio entre el contenido del pie de página y el borde inferior */
  border-top: 1px solid #666; /* Agrega una línea divisoria en la parte superior del pie de página */
  padding-top: 10px; /* Añade espacio entre la línea divisoria y el texto inferior */
  text-align: center; /* Centra el texto en la parte inferior */
  font-size: 0.9em; /* Tamaño de letra para el texto inferior */
  color: #ccc; /* Color de texto para el texto inferior */
  position: fixed; /* Fija la posición del elemento */
  bottom: 0; /* Lo coloca en la parte inferior de la ventana del navegador */
  width: 100%; /* Ajusta el ancho para ocupar toda la pantalla */
}

/* Estilos del modo oscuro */
:root {
  --main-color: #eee;
  --dark-bg-color: #333;
}

.dark-mode {
  background-color: var(--dark-bg-color);
  color: var(--main-color);
}

body.dark-mode input.search-input {
  color: white !important; /* Cambia el color del texto de entrada en el modo oscuro */
}

.dark-mode .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: black;
  color: white;
}

.dark-mode .nav-button,
.dark-mode .mode-toggle {
  margin-left: 20px;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1em; /* Aumenta el tamaño de la letra */
}

.dark-mode .movie-card-language,
.dark-mode .movie-card-date {
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 3px;
  border: none;
  font-size: 0.8em;
}

.dark-mode .filter-button {
  background-color: #007bff; /* Cambia el color de fondo del botón de filtro a azul */
  color: #eee; /* Cambia el color del texto de los botones a un tono claro */
}

.dark-mode .select {
  background-color: #333; /* Cambia el color de fondo del select a un tono oscuro */
  color: #eee; /* Cambia el color del texto del select a un tono claro */
}

.dark-mode .movie-card {
  background-color: #111; /* Cambia el color de fondo de las tarjetas a un tono oscuro */
  color: #eee; /* Cambia el color del texto de las tarjetas a un tono claro */
  border: 1px solid #333; /* Añade un borde para resaltar las tarjetas */
}

.dark-mode .search-input {
  background-color: #d3d3d377; /* Color de fondo del input en modo oscuro */
  color: white; /* Color del texto en modo oscuro */
}

.dark-mode .search-input::placeholder {
  color: #eeeeee95; /* Color del marcador de posición en modo oscuro */
  font-family: Arial, Helvetica, sans-serif;
}

.dark-mode button {
  background-color: #444; /* Cambia el color de fondo de los botones a un tono más oscuro */
  color: #eee; /* Cambia el color del texto de los botones a un tono claro */
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1em;
}

.dark-mode .filter-options {
  background-color: #333; /* Cambia el color de fondo de las opciones de filtro a un tono oscuro */
  border: 1px solid #eee; /* Cambia el color del borde a un tono claro */
}

.dark-mode .filter-list li {
  background-color: #444; /* Cambia el color de fondo de los elementos de la lista a un tono oscuro */
  color: #eee; /* Cambia el color del texto a un tono claro */
}

.dark-mode .filter-list li:hover {
  background-color: #444; /* Ajusta el color de fondo al pasar el cursor a un tono más oscuro */
}

.dark-mode .filter-list input[type="checkbox"] {
  background-color: #333; /* Cambia el color de fondo del checkbox a un tono oscuro */
}

.dark-mode .filter-list input[type="checkbox"]:checked:before {
  background-color: #eee; /* Cambia el color de fondo del checkbox marcado a azul */
}

/* Estilos para móvil pequeño */
@media (max-width: 360px) {
  .navbar {
    flex-direction: column;
  }

  .navbar-left,
  .navbar-right {
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

  .footer {
    flex-direction: column;
    text-align: center; /* Centra el contenido en dispositivos móviles */
  }

  .footer-left,
  .footer-right {
    border-right: none; /* Elimina el borde derecho en dispositivos móviles */
    padding-right: 0; /* Elimina el espacio derecho en dispositivos móviles */
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px; /* Ajusta el espacio entre la sección de contacto y el siguiente elemento */
  }

  .footer-bottom {
    margin-top: 20px; /* Agrega espacio entre el contenido del pie de página y el borde inferior */
    border-top: 1px solid #666; /* Agrega una línea divisoria en la parte superior del pie de página */
    padding-top: 10px; /* Añade espacio entre la línea divisoria y el texto inferior */
    text-align: center; /* Centra el texto en la parte inferior */
    font-size: 0.9em; /* Tamaño de letra para el texto inferior */
    color: #ccc; /* Color de texto para el texto inferior */
    position: relative; /* Ajusta la posición para evitar superposiciones */
  }

  .socials {
    margin-bottom: 20px; /* Ajusta el espacio entre los iconos y la línea divisoria */
    position: relative; /* Permite posicionar la línea de forma relativa a este contenedor */
  }

  .socials:after {
    content: "";
    position: absolute; /* Permite posicionar la línea de forma absoluta dentro de .socials */
    bottom: -10px; /* Ubica la línea 10px debajo de .socials */
    left: 0; /* Ajusta la posición inicial de la línea */
    width: 100%; /* Ajusta la anchura de la línea al 100% del contenedor */
    border-bottom: 1px solid #ccc; /* Agrega la línea divisoria */
  }
}

/* Estilos para móvil medio */
@media (min-width: 361px) and (max-width: 375px) {
  .navbar {
    flex-direction: column;
  }

  .navbar-left,
  .navbar-right {
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

  .footer {
    flex-direction: column;
    text-align: center; /* Centra el contenido en dispositivos móviles */
  }

  .footer-left,
  .footer-right {
    border-right: none; /* Elimina el borde derecho en dispositivos móviles */
    padding-right: 0; /* Elimina el espacio derecho en dispositivos móviles */
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px; /* Ajusta el espacio entre la sección de contacto y el siguiente elemento */
  }

  .footer-bottom {
    margin-top: 20px; /* Agrega espacio entre el contenido del pie de página y el borde inferior */
    border-top: 1px solid #666; /* Agrega una línea divisoria en la parte superior del pie de página */
    padding-top: 10px; /* Añade espacio entre la línea divisoria y el texto inferior */
    text-align: center; /* Centra el texto en la parte inferior */
    font-size: 0.9em; /* Tamaño de letra para el texto inferior */
    color: #ccc; /* Color de texto para el texto inferior */
    position: relative; /* Ajusta la posición para evitar superposiciones */
  }

  .socials {
    margin-bottom: 20px; /* Ajusta el espacio entre los iconos y la línea divisoria */
    position: relative; /* Permite posicionar la línea de forma relativa a este contenedor */
  }

  .socials:after {
    content: "";
    position: absolute; /* Permite posicionar la línea de forma absoluta dentro de .socials */
    bottom: -10px; /* Ubica la línea 10px debajo de .socials */
    left: 0; /* Ajusta la posición inicial de la línea */
    width: 100%; /* Ajusta la anchura de la línea al 100% del contenedor */
    border-bottom: 1px solid #ccc; /* Agrega la línea divisoria */
  }
}

/* Estilos para smartphone grande */
@media (min-width: 376px) and (max-width: 720px) {
  .navbar {
    flex-direction: column;
  }

  .navbar-left,
  .navbar-right {
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

  .footer {
    flex-direction: column;
    text-align: center; /* Centra el contenido en dispositivos móviles */
  }

  .footer-left,
  .footer-right {
    border-right: none; /* Elimina el borde derecho en dispositivos móviles */
    padding-right: 0; /* Elimina el espacio derecho en dispositivos móviles */
  }

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px; /* Ajusta el espacio entre la sección de contacto y el siguiente elemento */
  }

  .footer-bottom {
    margin-top: 20px; /* Agrega espacio entre el contenido del pie de página y el borde inferior */
    border-top: 1px solid #666; /* Agrega una línea divisoria en la parte superior del pie de página */
    padding-top: 10px; /* Añade espacio entre la línea divisoria y el texto inferior */
    text-align: center; /* Centra el texto en la parte inferior */
    font-size: 0.9em; /* Tamaño de letra para el texto inferior */
    color: #ccc; /* Color de texto para el texto inferior */
    position: relative; /* Ajusta la posición para evitar superposiciones */
  }

  .socials {
    margin-bottom: 20px; /* Ajusta el espacio entre los iconos y la línea divisoria */
    position: relative; /* Permite posicionar la línea de forma relativa a este contenedor */
  }

  .socials:after {
    content: "";
    position: absolute; /* Permite posicionar la línea de forma absoluta dentro de .socials */
    bottom: -10px; /* Ubica la línea 10px debajo de .socials */
    left: 0; /* Ajusta la posición inicial de la línea */
    width: 100%; /* Ajusta la anchura de la línea al 100% del contenedor */
    border-bottom: 1px solid #ccc; /* Agrega la línea divisoria */
  }
}
</style>
