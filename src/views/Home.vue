<template>
  <div class="home">
    <h1>Hello {{ accounts.username || 'werid guest' }}!</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  setup() {
    // TODO
  },
  computed: {
    ...mapState(['accounts']),
  },
});
</script>
