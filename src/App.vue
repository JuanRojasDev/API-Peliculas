<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <Home />
  </div>
</template>

<script>
import Home from './components/Home.vue';

export default {
  name: 'App',
  components: {
    Home
  },
  data() {
    return {
      isDarkMode: false 
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    }
  }
};
</script>

<style>
#app.dark-mode {
  background-color: #222; 
  color: #eee; 
}
</style>
