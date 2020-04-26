<template lang="pug">
  v-app(:dark="dark")
    nuxt
</template>

<script>
export default {
  data() {
    return {
      dark: false,
    };
  },
};
</script>
