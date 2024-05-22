<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <h1 class="logo">2 Type</h1>
      <div class="search-bar">
        <input type="text" placeholder="Search..." v-model="searchText">
        <button @click="filterMovies">Search</button>
        <button @click="toggleDarkMode" class="mode-toggle">{{ isDarkMode ? '☀️' : '🌙' }}</button>
      </div>
      <div class="filter-section">
        <button @click="toggleFilterOptions" class="filter-button">Filter</button>
        <div v-if="showFilterOptions" class="filter-options">
          <select v-model="selectedGenre" class="select">
            <option value="">All Genres</option>
            <!-- Assuming genre options are available -->
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <!-- Add more genres as needed -->
          </select>
        </div>
      </div>
    </nav>
    <div class="movie-container">
      <div class="movie-card" v-for="movie in filteredMovies" :key="movie.id">
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
      selectedGenre: '',
      isDarkMode: false,
      showFilterOptions: false, // To control the display of filter options
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
      let filteredMovies = this.movies.slice(); // Create a copy to avoid mutating original data
      if (this.searchText) {
        filteredMovies = filteredMovies.filter(
          (movie) => movie.title.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      if (this.selectedGenre) {
        // Implement genre filtering here (assuming you have genre data)
        filteredMovies = filteredMovies.filter((movie) => movie.genre_ids.includes(parseInt(this.selectedGenre)));
      }
      this.filteredMovies = filteredMovies;
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
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
      if (this.selectedGenre) {
        filteredMovies = filteredMovies.filter((movie) => movie.genre_ids.includes(parseInt(this.selectedGenre)));
      }
      return filteredMovies;
    },
  },
};
</script>

<style scoped>
#app {
  background-color: white;
  color: black;
}

.navbar {
  background-color: black;
  color: white;
  padding: 20px;
  text-align: center;
}

.logo {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 300px;
}

.search-bar button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #333;
  color: white;
  margin-right: 10px;
}

.mode-toggle {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #333;
  color: white;
}

.filter-section {
  text-align: center;
  margin-bottom: 20px;
}

.filter-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007BFF;
  color: white;
}

.filter-options {
  margin-top: 10px;
}

.select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
}

/* Movie container and card styles */
.movie-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 auto;
  width: 80%;
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
</style>

