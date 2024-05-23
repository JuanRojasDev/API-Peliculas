<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <div class="navbar-left">
        <h1 class="logo">2 Type</h1>
      </div>
      <div class="navbar-right">
        <button @click="onHomeButtonClick" class="nav-button">{{ translations[currentLanguage].home }}</button>
        <div class="dropdown" @mouseover="showGenreOptions = true" @mouseleave="showGenreOptions = false">
          <button class="nav-button dropdown-button">{{ translations[currentLanguage].genre }}</button>
          <div class="dropdown-content" v-show="showGenreOptions">
            <a href="#" @click="filterByGenre('28')">{{ translations[currentLanguage].action }}</a>
            <a href="#" @click="filterByGenre('12')">{{ translations[currentLanguage].adventure }}</a>
          </div>
        </div>
        <div class="dropdown">
          <button class="nav-button dropdown-button">{{ translations[currentLanguage].language }}</button>
          <div class="dropdown-content">
            <a href="#" @click="changeLanguage('en')">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg"
                alt="English">
              {{ translations[currentLanguage].english }}
            </a>
            <a href="#" @click="changeLanguage('es')">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg" alt="Español">
              {{ translations[currentLanguage].spanish }}
            </a>
          </div>
        </div>
        <button @click="toggleDarkMode" class="mode-toggle">{{ isDarkMode ? '☀️' : '🌙' }}</button>
      </div>
    </nav>
    <div class="search-filter-container">
      <div class="search-bar">
        <input type="text" :placeholder="translations[currentLanguage].search" v-model="searchText"
          class="search-input">
        <button @click="filterMovies" class="search-button">{{ translations[currentLanguage].search }}</button>
      </div>
      <button @click="toggleFilterOptions" class="filter-button">{{ translations[currentLanguage].filter }}</button>
    </div>
    <div class="filter-section" v-if="showFilterOptions">
      <ul class="filter-list">
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="all"> {{ translations[currentLanguage].allGenres }}
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="28"> {{ translations[currentLanguage].action }}
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" v-model="selectedGenres" value="12"> {{ translations[currentLanguage].adventure }}
          </label>
        </li>
      </ul>
    </div>
    <div class="movie-container">
      <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
        <div class="movie-card-header">
          <button class="movie-card-language">{{ movie.original_language.toUpperCase() }}</button>
          <button class="movie-card-date">{{ movie.release_date }}</button>
        </div>
        <img :src="`https://image.tmdb.org/t/p/original${movie.poster_path}`" alt="Movie Poster"
          class="movie-card-image">
        <div class="movie-card-content">
          <h3 class="movie-card-title">{{ movie.title }}</h3>
          <p class="movie-card-description">{{ movie.translated_overview || movie.overview }}</p>
          <div class="movie-card-info">
            <span class="adult">{{ movie.adult ? translations[currentLanguage].adult : "" }}</span>
            <span class="popularity">{{ translations[currentLanguage].popularity }}: {{ movie.popularity }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer aquí -->
    <footer class="footer">
    <div class="footer-section">
      <h2 class="logo-text">Juan Rojas</h2>
      <p class="footer-description">Desarrollador de software con experiencia en desarrollo web y móvil.</p>
    </div>
    <div class="footer-section">
      <h3 class="footer-heading">Contacto</h3>
      <p class="footer-contact">Email: juan.rojas@example.com</p>
      <p class="footer-contact">Teléfono: +1 234 567 890</p>
    </div>
    <div class="footer-section">
      <h3 class="footer-heading">Redes sociales</h3>
      <div class="socials">
        <a href="https://github.com/your-github-username" target="_blank">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://linkedin.com/in/your-linkedin-username" target="_blank">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  </footer>
    <!-- Fin del footer -->
  </div>
</template>


<script>
import axios from 'axios';

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
      genreToFilter: null,
      currentLanguage: 'en',
      translations: {
        en: {
          home: 'Home',
          genre: 'Genre',
          action: 'Action',
          adventure: 'Adventure',
          language: 'Language',
          english: 'English',
          spanish: 'Spanish',
          search: 'Search',
          filter: 'Filter',
          allGenres: 'All Genres',
          popularity: 'Popularity',
          adult: 'Adult',
        },
        es: {
          home: 'Inicio',
          genre: 'Género',
          action: 'Acción',
          adventure: 'Aventura',
          language: 'Idioma',
          english: 'Inglés',
          spanish: 'Español',
          search: 'Buscar',
          filter: 'Filtrar',
          allGenres: 'Todos los géneros',
          popularity: 'Popularidad',
          adult: 'Adulto',
        }
      }
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
        if (this.currentLanguage === 'es') {
          this.translateOverviews();
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    async translateOverviews() {
      for (const movie of this.movies) {
        const wordCount = this.countWords(movie.overview);
        const quoteUrl = `https://www.translated.net/hts/?f=quote&s=en-GB&t=es-419&w=${wordCount}&cid=htsdemo&p=htsdemo5&of=json`;
        try {
          const quoteResponse = await axios.get(quoteUrl);
          console.log(`Translation quote for "${movie.title}":`, quoteResponse.data);
          movie.translation_cost = quoteResponse.data.price;

          // Asumiendo que tienes una API de traducción
          const translationUrl = `https://api.translation.com/translate?text=${encodeURIComponent(movie.overview)}&source=en&target=es`;
          const translationResponse = await axios.post(translationUrl); // Cambiado de axios.get a axios.post
          movie.overview = translationResponse.data.translatedText;
        } catch (error) {
          console.error('Error getting translation quote:', error);
        }
      }
    },
    countWords(text) {
      if (!text) return 0;
      return text.split(' ').filter(word => word.length > 0).length;
    },
    filterMovies() {
      this.filteredMovies = this.movies.slice();
      if (this.searchText) {
        this.filteredMovies = this.filteredMovies.filter(
          (movie) => movie.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      if (this.selectedGenres.length > 0 && !this.selectedGenres.includes('all')) {
        this.filteredMovies = this.filteredMovies.filter((movie) =>
          this.selectedGenres.some((genre) => movie.genre_ids.includes(parseInt(genre)))
        );
      }
      if (this.genreToFilter) {
        this.filteredMovies = this.filteredMovies.filter((movie) =>
          movie.genre_ids.includes(parseInt(this.genreToFilter))
        );
      }
    },
    filterByGenre(genre) {
      this.genreToFilter = genre;
      this.filterMovies();
    },
    onHomeButtonClick() {
      window.location.reload();
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    changeLanguage(language) {
      this.currentLanguage = language;
      if (language === 'es') {
        this.translateOverviews();
      }
    },
  },
  computed: {
    appClass() {
      return {
        'dark-mode': this.isDarkMode,
      };
    },
    filteredMovies() {
      let filteredMovies = this.movies.slice();
      if (this.searchText) {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      if (this.selectedGenres.length > 0 && !this.selectedGenres.includes('all')) {
        filteredMovies = filteredMovies.filter((movie) =>
          this.selectedGenres.some((genre) => movie.genre_ids.includes(parseInt(genre)))
        );
      }
      if (this.genreToFilter) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genre_ids.includes(parseInt(this.genreToFilter))
        );
      }
      return filteredMovies;
    }
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
  font-size: 1.1em;
  /* Aumenta el tamaño de la letra */
}

.dropdown-button::after {
  content: '▼';
  padding-left: 5px;
  font-size: 0.8em;
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
  /* Añade esta línea */
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
  top: calc(100% + 10px);
  /* Ajusta el espacio entre la barra de búsqueda y las opciones de filtro */
  left: 50%;
  /* Centra horizontalmente */
  transform: translateX(-50%);
  /* Centra horizontalmente */
  border-radius: 50%;
  background-color: #f7f7f7;
  /* Cambiado a un gris más claro */
  border: 1px solid #ccc;
  border-top: none;
}

.filter-list {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  /* Centra horizontalmente */
}

.filter-list li {
  margin: 0;
  font-size: 1.21em;
  /* Aumenta el tamaño de la letra */
  cursor: pointer;
  padding: 15px;
  /* Aumenta el espacio alrededor de las opciones */
  background-color: #f7f7f7;
  /* Cambiado a un gris más claro */
}

.filter-list li:hover {
  background-color: #e3e3e3;
  /* Ajusta el color de fondo al pasar el cursor */
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

.footer {
  width: 100%;
  background-color: black;
  color: #bdc3c7;
  padding: 50px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 3px solid #eee;
}

.footer-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.logo-text,
.footer-heading {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.footer-description,
.footer-contact {
  margin-bottom: 10px;
}

.socials {
  display: flex;
  justify-content: start;
  padding: 20px 0;
}

.socials a {
  color: #bdc3c7;
  font-size: 1.5em;
  margin-right: 15px;
  transition: color 0.3s ease;
}

.socials a:hover {
  color: #3498db;
}

.contact-form {
  width: calc(33% - 20px); /* Establece el ancho de la sección de formulario de contacto */
}

.contact-input {
  width: 100%;
  margin-bottom: 10px; /* Agrega espacio entre los campos de entrada */
  border-radius: 5px; /* Añade bordes redondeados a los campos de entrada */
}

.contact-btn {
  width: 100%;
  background-color: #007BFF; /* Cambia el color de fondo del botón a azul */
  color: white; /* Cambia el color del texto del botón a blanco */
  border: none; /* Elimina el borde del botón */
  border-radius: 5px; /* Añade bordes redondeados al botón */
}

.footer-bottom {
  margin-top: 20px; /* Agrega espacio entre el contenido del pie de página y el borde inferior */
  border-top: 1px solid #666; /* Agrega una línea divisoria en la parte superior del pie de página */
  padding-top: 10px; /* Añade espacio entre la línea divisoria y el texto inferior */
  text-align: center; /* Centra el texto en la parte inferior */
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
  background-color: black; /* Color de fondo de la barra de navegación en modo oscuro */
  color: white; /* Color del texto en modo oscuro */
}

.dark-mode .nav-button,
.dark-mode .mode-toggle {
  margin-left: 20px;
  padding: 10px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1em;
}

.dark-mode .filter-button {
  background-color: #007BFF; /* Cambia el color de fondo del botón de filtro a azul */
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
  padding: 10px;
  border: none;
  border-radius: 50px;
  width: 350px;
  font-size: 1.2em;
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
  margin-left: 10px;
  background-color: #333;
  cursor: pointer;
  font-size: 1em;
}

.dark-mode .filter-options {
  background-color: #333; /* Cambia el color de fondo de las opciones de filtro a un tono oscuro */
  border: 1px solid #eee; /* Cambia el color del borde a un tono claro */
}

.dark-mode .filter-list li {
  background-color: #333; /* Cambia el color de fondo de los elementos de la lista a un tono oscuro */
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

@media (min-width: 600px) and (max-width: 900px) {

  /* Estilos específicos para tablet */
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
    width: 45%;
  }
  
  .footer {
    flex-direction: row;
    justify-content: space-around;
  }

  .footer-section {
    align-items: flex-start;
  }
}

@media (max-width: 600px) {

  /* Estilos específicos para celular */
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
    flex-direction: row;
    justify-content: space-around;
  }

  .footer-section {
    align-items: flex-start;
  }
}
</style>
