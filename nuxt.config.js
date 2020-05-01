import colors from "vuetify/es5/util/colors";

const title = 'Tremplin - Ce Murmure Festival – Édition 2020';
const description = 'Votez pour le Tremplin de l’édition 2020 du festival Ce Murmure !';
const url = 'https://tremplin2020.cemurmurefestival.com';
const image = url + '/images/share.jpg';

export default {
  mode: "universal",
  /*
   * Server
   */
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
  },
  /*
   * Headers of the page
   */
  head: {
    title: title,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no',
      },
      // favicons
      { name: 'msapplication-TileColor', content: '#d5dbe5' },
      { name: 'theme-color', content: '#ffc61c' },
      // SEO
      { name: 'description', content: description },
      { name: 'keywords', content: 'tremplin, ce murmure festival, cemurmure, festival, 2020, édition 2020, concerts, online, covid, covid-19' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image:src', content: image },
    ],
    link: [
      // favicons
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ffc61c' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
   * Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   * Global CSS
   */
  css: [],
  /*
   * Plugins to load before mounting the App
   */
  plugins: [],
  /*
   * Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   * Nuxt.js modules
   */
  modules: [],
  /*
   * vuetify module configuration
   * https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#ffc61c',
          accent: '#08274C',
          secondary: '#ff8787',
        },
      }
    }
  },
  /*
   * Build configuration
   */
  build: {
    /*
     * You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
