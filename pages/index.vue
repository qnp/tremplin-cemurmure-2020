<template lang="pug">
  v-layout.main
    v-layout.scene(:class="sceneClass")
      .flyer-color-layer
      .flyer-pink-glow
      .flyer-groups(:class="{ 'flyer-groups--show': showGroups }")
        template(v-for="group in groups")
          .flyer-group(@click="showGroup(group)")
            .flyer-group__container
              span {{ group.name }}
              v-icon.ml-3(color="accent") mdi-youtube
      .flyer-image-sun
      .flyer-image-water
      .flyer-image-tremplin
      .flyer-title(v-if="!loading")
        .flyer-title__cemurmure
          text-animation CE MURMURE FESTIVAL
        .flyer-title__presente
          text-animation(:start-delay="1") présente
        .flyer-title__tremplin
          text-animation(:start-delay="2.5" :stagger-delay="0.2" mode="to-center" reverse) LE TREMPLIN
        .flyer-title__catchline(:class="{ show: showCatchline }") <b>Écoutez</b>, <b class="emph-text">votez</b> et élisez le gagant pour l’édition <b>2020</b> !

      v-btn.vote__button(color="primary" x-large @click="showVoteDialog = true" :disabled="doneVote")
        .vote__button__text VOTER
        v-icon.ml-2 {{ doneVote ? 'mdi-check' : 'mdi-vote' }}

    transition(name="t-fade-out")
      v-layout.loader(v-if="loading")
        v-progress-linear.loader__progress(:value="loadProgress" height="8")
        .loader__text(v-if="loading") Chargement

    v-dialog(v-model="showGroupVideo")
      .dialog__control.dialog__control--prev(v-if="prevGroup" @click="prev")
        .dialog__control__text précédent
        .dialog__control__group {{ prevGroup.name }}

      .dialog__control.dialog__control--next(v-if="nextGroup" @click="next")
        .dialog__control__text suivant
        .dialog__control__group {{ nextGroup.name }}

      v-card(color="accent")
        v-card-title.dialog__group-name.primary.accent--text {{ selectedGroup.name }}
          v-btn.dialog__close(icon absolute @click="showGroupVideo = false")
            v-icon mdi-close
        youtube-video(:width="videoWidth" :height="videoHeight" :code="selectedGroup.code")

    v-dialog(v-model="showVoteDialog" width="580")
      v-card.vote__dialog(color="accent" dark)
        v-card-title.secondary.justify-center.accent--text {{ voteError ? 'Erreur' : doneVote ? 'Vous avez voté' : 'Votez pour votre groupe préféré' }}
          v-btn.dialog__close(icon absolute @click="showVoteDialog = false" color="accent")
            v-icon mdi-close
        template(v-if="!doneVote && !voteError")
          v-card-text
            v-form(
              ref="form"
              v-model="validVote"
              @submit="e => e.preventDefault()"
              lazy-validation
            )
              p.mt-6.primary--text Le groupe heureux élu de votre
                v-icon.mx-2(color="secondary") mdi-heart
                span est :
              v-radio-group(
                :rules="[v => !!v || 'Choix du groupe requis']"
                v-model="votedGroup"
                required
              )
                v-radio.mb-3(
                  v-for="(group, i) in groups"
                  :key="'checkbox-' + i"
                  :label="group.name"
                  :value="group.name"
                  color="primary"
                )
              p.primary--text.mb-2 Renseignez votre adresse email :
              v-text-field(
                outlined
                label="email"
                name="email"
                color="primary"
                :rules="emailRules"
                required
                validate-on-blur
                v-model="voteEmail"
              )
              small Nous avons besoin de votre adresse pour vous envoyer un email afin de valider votre vote. Aucun email n’est stocké, ni partagé à des fins publicitaires.
          v-card-actions
            v-spacer
            v-btn(large text color="secondary" @click="showVoteDialog = false") Annuler
            v-btn(large color="primary" @click="submitVote" :loading="voteLoading") VOTER

        template(v-else-if="doneVote && !voteError")
          v-card-text.dialog__thank-you
            h1.primary--text.mt-12.mb-4 Merci !
            p.mb-12 Les résultats du vote seront annoncés le xxx sur Facebook.
            p.white--text Partagez ce tremplin
            social-sharing(url='https://vuejs.org/' inline-template)
              .dialog__social-sharing
                network(network='facebook')
                  v-btn(icon color="primary")
                    v-icon mdi-facebook
                network(network='twitter')
                  v-btn(icon color="primary")
                    v-icon mdi-twitter
                network(network='whatsapp')
                  v-btn(icon color="primary")
                    v-icon mdi-whatsapp
            v-btn(icon color="primary" :href="shareMailto")
              v-icon mdi-email

        template(v-else)
          v-card-text.dialog__error.secondary__text
            p.mt-5 Une erreur est survenue
              v-icon.ml-1(color="secondary") mdi-emoticon-sad
              |... veuillez réessayer plus tard ou nous contacter sur <a href="https://www.facebook.com/cemurmure">facebook</a> ou par <a href="mailto:raspatakouet@gmail.com">email</a>

</template>

<style lang="stylus">
/*
 * variables
 */
$color-primary := #ffc61c
$color-accent := #08274C
$color-secondary := #ff8787
$sun-size := 300px
$ease := cubic-bezier(0, 0.6, 0.4, 1)
$bounce := cubic-bezier(0.64, 0.57, 0.67, 1.53)

/*
 * mixins
 */
make-title($size)
  font-size $size
  text-shadow (0.05 * $size) (0.05 * $size) 0 $color-accent

absolute-full()
  position absolute
  top 0
  left 0
  right 0
  bottom 0

/*
 * transitions
 */
.t-fade-out
  &-leave-active
    transition opacity 1s

  &-leave-to
    opacity 0
/*
 * styles
 */
// generic
html, body
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus
  border none
  -webkit-text-fill-color $color-primary
  -webkit-box-shadow 0 0 0px 1000px transparent inset
  transition background-color 5000s ease-in-out 0s

.v-dialog > .v-card > .v-card__text
  padding 24px 48px

.emph-text
  color $color-accent
  font-family 'FashionFetishHeavy'

// main
.main, .v-application
  font-family 'FashionFetish'

// loader
.loader
  absolute-full()
  background-color $color-secondary

.loader__text
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  color $color-primary
  text-shadow 2px 2px 0 $color-accent
  font-weight bold
  font-size 24px

  &::before, &::after
    content ''
    display inline-block
    height 24px
    margin 0 8px
    animation dots 3s linear infinite alternate

.loader__progress
  position absolute
  bottom 0

// scene
.scene
  absolute-full()
  background-image url('/images/sky.jpg')
  background-position 0% 0%
  background-size cover

  .flyer-color-layer
    absolute-full()
    animation sunside-bg 18s $ease forwards
    animation-play-state paused

  .flyer-pink-glow
    absolute-full()
    opacity 0.6
    background-image url('/images/pink-glow.jpg')
    background-position center center
    background-size cover

  .flyer-image-sun
    position absolute
    width $sun-size
    height $sun-size
    border-radius 0.5 * $sun-size
    background-color $color-primary
    top 120%
    left 50%
    transform translate(-50%, -50%)
    animation sunside 12s $ease forwards
    animation-play-state paused

  .flyer-image-tremplin
    absolute-full()
    background-image url('/images/tremplin.png')
    background-position center center
    background-size 140%
    pointer-events none

  .flyer-image-water
    position fixed
    bottom 0
    width 100%
    height 17%
    background-position 0 0
    background-size cover
    background-image url('/images/water.png')
    animation slide-water 8s ease-in-out infinite alternate
    animation-play-state paused

  .flyer-title
    margin 24px auto 0
    z-index 2
    text-align center
    height 260px

  .flyer-title__cemurmure
    font-size 20px
    font-weight bold

  .flyer-title__presente
    font-size 16px

  .flyer-title__tremplin
    margin-top 24px
    color $color-primary
    make-title(70px)

  .flyer-title__catchline
    opacity 0
    transition opacity 1s

    &.show
      opacity 1

  .flyer-groups
    position absolute
    width 50%
    top 50%
    right 0
    transform translate(0, -50%)
    color $color-accent
    opacity 0
    transition opacity 0.3s

  .flyer-group
    width 0
    font-size 18px
    margin 24px 0
    text-align right
    will-change width
    transition width 0.4s $ease
    overflow hidden
    white-space pre
    cursor pointer

    .flyer-group__container
      padding 8px 16px 4px
      background-color alpha($color-primary, 40%)
      transform-origin 100% 50%
      transition transform 0.1s $bounce

      &:hover
        background-color $color-primary
        transform scale(1.07)

  &--started
    .flyer-color-layer,
    .flyer-image-sun,
    .flyer-image-water
      animation-play-state running

  .flyer-groups--show
    opacity 1

    .flyer-group
      width 100%

    .flyer-group:nth-child(1)
      transition-delay 0

    .flyer-group:nth-child(2)
      transition-delay 0.5s

    .flyer-group:nth-child(3)
      transition-delay 1s

// group dialog
.dialog__group-name
  justify-content center

.dialog__close
  right 12px
  top 11px

.dialog__control
  width auto
  position fixed
  top 50%
  z-index 2
  color $color-accent
  background-color $color-primary
  transition transform 0.1s $bounce
  padding 8px
  cursor pointer

  &:hover
    background-color $color-primary
    transform scale(1.07)

  &--prev
    left 0
    transform-origin 0% 50%

    .dialog__control__text
      text-align right

  &--next
    right 0
    transform-origin 100% 50%

.dialog__control__text
  font-size 10px

.dialog__control__group
  font-size 14px

// vote
.v-btn
  font-family 'FashionFetishHeavy'
  font-weight 900
  color $color-accent !important

  .v-btn__content
    display flex
    text-align center

.vote__button
  position fixed
  right 24px
  bottom calc(17% + 24px)

  .vote__button__text
    margin-top 4px

.vote__dialog
  .v-input--selection-controls .v-radio > .v-label
    padding-top 6px

  .v-btn:not(.v-btn--icon)
    .v-btn__content
      margin-top 5px

  .v-radio
    .v-input--selection-controls__input
      margin-right 4px

    .v-label
      padding-left 4px

  .v-radio.v-item--active
    .v-label
      color $color-accent
      background-color $color-primary

  .v-input--radio-group.error--text
    margin-bottom 16px

  .v-messages__message
    margin-top 4px

  .v-text-field input
    line-height 32px

.dialog__thank-you, .dialog__error
  text-align center

.dialog__social-sharing
  display inline-block

@media (max-width: 760px)
  .scene
    .flyer-image-tremplin
      background-size 280%

    .flyer-image-water
      height 25%

    .flyer-title__tremplin
      make-title(50px)

@media (max-width:460px)
  .scene
    .flyer-image-tremplin
      background-size 380%

    .flyer-title__tremplin
      make-title(40px)

@keyframes slide-water
  0%
    background-position 0 0

  100%
    background-position 100% 0

@keyframes sunside
  0%
    top 120%

  100%
    top 50%

@keyframes sunside-bg
  0%
    background-color rgba(255, 0, 0, 0.8)

  100%
    background-color transparent

@keyframes dots
  0%
    content ''

  25%
    content '·'

  50%
    content '· ·'

  100%
    content '· · ·'
</style>

<script>
import TextAnimation from '@/components/TextAnimation';
import YoutubeVideo from '@/components/YoutubeVideo';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const shareEmailSubject = 'Votez pour le templin Cemurmure 2020 !'
const shareEmailBody = 'http://tremplin2020.cemurmurefestival.com';

function encode(str) {
  if (global.encodeURIComponent) {
    return global.encodeURIComponent(str)
  } else {
    return str;
  }
}

const shareMailto = 'mailto:?subject=' + encode(shareEmailSubject) +'&body=' + encode(shareEmailBody);

export default {
  components: {
    TextAnimation,
    YoutubeVideo,
  },
  data() {
    return {
      showCatchline: false,
      finishLoading: false,
      loadedImages: 0,
      showGroups: false,
      imageSources: [
        '/images/sky.jpg',
        '/images/pink-glow.jpg',
        '/images/tremplin.png',
        '/images/water.png',
      ],
      showGroupVideo: false,
      selectedGroup: {},
      videoWidth: 600,
      videoHeight: 300,
      groups: [
        { name: 'Electrik Cellar', code: '2e8x3fFZP3Q' },
        { name: 'San-Seyha', code: 'iPGgnzc34tY' },
        { name: 'The Boys Friends', code: 'Tj2m42KEHwo' },
      ],
      showVoteDialog: false,
      votedGroup: null,
      validVote: false,
      voteEmail: null,
      emailRules: [v => !!v || 'Adresse email requise', v => emailRegex.test(v) || 'Format d’email invalide'],
      voteLoading: false,
      voteError: false,
      doneVote: false,
      shareMailto,
    };
  },
  created() {
    this.load();
    setTimeout(() => this.loadedImages++, 1500);
  },
  computed: {
    loadProgress() {
      return (this.loadedImages / (this.imageSources.length + 1)) * 100;
    },
    sceneClass() {
      return !this.loading ? 'scene--started' : null;
    },
    loading() {
      return false;
      return (
        !this.finishLoading || this.loadedImages < this.imageSources.length + 1
      );
    },
    prevGroup() {
      const index = this.groups.findIndex(
        group => group.name === this.selectedGroup.name
      );
      return 0 < index ? this.groups[index - 1] : null;
    },
    nextGroup() {
      const index = this.groups.findIndex(
        group => group.name === this.selectedGroup.name
      );
      return index < this.groups.length - 1 ? this.groups[index + 1] : null;
    },
  },
  methods: {
    resolveWithProgress(resolve) {
      return () => {
        this.loadedImages++;
        resolve();
      };
    },
    preloadImage(src) {
      return new Promise(resolve => {
        const image = new Image();
        image.onload = this.resolveWithProgress(resolve);
        image.onerror = this.resolveWithProgress(resolve);
        image.src = src;
      });
    },
    load() {
      Promise.all(this.imageSources.map(src => this.preloadImage(src)));
    },
    showGroup(group) {
      this.showGroupVideo = true;
      this.selectedGroup = group;
      this.videoWidth = window.innerWidth - 48;
      this.videoHeight = window.innerHeight - 48 - 58 * 2;
    },
    prev() {
      this.selectedGroup = this.prevGroup;
    },
    next() {
      this.selectedGroup = this.nextGroup;
    },
    async submitVote() {
      this.validVote = this.$refs.form.validate();
      if (this.validVote) {
        this.voteLoading = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.voteLoading = false;
        this.doneVote = true;
      }
    },
  },
  watch: {
    loadedImages() {
      if (this.loadedImages === this.imageSources.length + 1) {
        setTimeout(() => (this.finishLoading = true), 250);
      }
    },
    finishLoading() {
      if (this.finishLoading) {
        setTimeout(() => (this.showCatchline = true), 4000);
        setTimeout(() => (this.showGroups = true), 0 /* 5500 */);
      }
    },
    showGroupVideo() {
      if (!this.showGroupVideo) this.selectedGroup = {};
    },
  },
};
</script>
