import colors from "vuetify/es5/util/colors";

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
    title: 'Tremplin 2020 - Cemurmure Festival',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,maximum-scale=3.0,user-scalable=yes',
      },
      // favicons
      { name: 'msapplication-TileColor', content: '#d5dbe5' },
      { name: 'theme-color', content: '#ffc61c' },
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
  plugins: ['~/plugins/vue-social-sharing'],
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
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
        },
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3
        // }
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
