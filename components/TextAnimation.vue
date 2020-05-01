<template lang="pug">
  .text-animation(:class="classes")
    span(v-for="(char, i) in text.split('')" :class="i < text.length / 2 ? 'left' : 'right'" :style="{ '--delay': charDelay(i) }") {{ char }}
</template>

<style lang="stylus">
.text-animation
  white-space pre
  display inline-block

  > span
    display inline-block
    white-space pre

.text-animation--fade-from-bottom
  > span
    opacity 0
    transform translateY(100px);
    transition opacity 1s, transform 1s cubic-bezier(0, 1, 0, 1)
    transition-delay var(--delay);

  &.text-animation--animate
    > span
      opacity 1
      transform translateY(0)

.text-animation--fade-from-left
  > span
    opacity 0
    transform translateX(-100px);
    transition opacity 1s, transform 1s cubic-bezier(0, 1, 0, 1)
    transition-delay var(--delay);

  &.text-animation--animate
    > span
      opacity 1
      transform translateX(0)

.text-animation--from-left
  > span
    transform translateX(-100vw);
    transition transform 2.5s cubic-bezier(0, 1, 0, 1)
    transition-delay var(--delay);

  &.text-animation--animate
    > span
      transform translateX(0)

.text-animation--to-center
  > span
    transition transform 2.5s cubic-bezier(0, 1, 0, 1)
    transition-delay var(--delay);

  > span.left
    transform translateX(-100vw);

  > span.right
    transform translateX(100vw);

  &.text-animation--animate
    > span
      &.left, &.right
        transform translateX(0)
</style>

<script>
export default {
  name: 'TextAnimation',

  props: {
    startDelay: {
      type: Number,
      default: 0,
    },
    staggerDelay: {
      type: Number,
      default: 0.05,
    },
    mode: {
      type: String,
      default: 'fade-from-bottom',
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      animate: false,
    };
  },

  computed: {
    text() {
      let text = (((this.$slots || {}).default || [])[0] || {}).text || '';
      if (text.length % 2) text += '\u200B';
      return text;
    },
    classes() {
      const classes = [];
      if (this.animate) classes.push('text-animation--animate');
      classes.push('text-animation--' + this.mode)
      return classes;
    },
  },

  mounted() {
    setTimeout(() => (this.animate = true), this.startDelay * 1000);
  },

  methods: {
    charDelay(i) {
      const l = this.text.length;
      let inc = i;
      if (this.mode === 'to-center') {
        inc = i < l / 2 ? l / 2 - i -1 : i - l / 2;
      }
      else if (this.reverse) inc = (l - i - 1);
      const total = inc * this.staggerDelay;
      return total + 's';
    },
  },
};
</script>
