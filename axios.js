const axios = require('axios');

const apiUrl = "https://api.themoviedb.org/3";
const apiKey = "0204da4c740bb5ffc6e709be0af7f05f";

async function fetchAllMovies(startPage = 1, endPage = 500) {
    try {
      for (let page = startPage; page <= endPage; page++) {
        const response = await axios.get(`${apiUrl}/discover/movie`, {
          params: {
            api_key: apiKey,
            page: page,
          },
        });
  
        const movies = response.data.results;
        console.log(`Movies from page ${page}:`);
        movies.forEach(movie => {
          console.log(`ID: ${movie.id}, Title: ${movie.title}`);
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  
  // Iniciar la obtención de todas las películas
  fetchAllMovies();
  