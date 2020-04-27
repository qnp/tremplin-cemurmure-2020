<template lang="pug">
  .youtube-video
    iframe(
      v-if="code"
      :width="width"
      :height="height"
      :src="'https://www.youtube.com/embed/' + code"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    )
</template>

<style lang="stylus">
.youtube-video
  display flex
</style>

<script>
export default {
  name: 'YoutubeVideo',

  props: {
    width: {
      type: Number,
      default: 560,
    },
    height: {
      type: Number,
      default: 315,
    },
    code: {
      type: String,
      default: '',
    },
  },
};
</script>
