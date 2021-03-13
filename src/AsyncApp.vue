<template>
  <Suspense>
    <App/>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import App from './App.vue'

export default defineComponent({
  components: {
    App
  }
})
</script>