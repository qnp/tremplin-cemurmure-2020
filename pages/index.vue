<template lang="pug">
  v-layout.main
    .scene(:class="sceneClass")
      .flyer-color-layer
      .flyer-pink-glow
      .flyer-groups(:class="{ 'flyer-groups--show': showGroups }")
        template(v-for="group in groups")
          .flyer-group(tabindex="0" @keypress.enter.space="showGroup(group)" @click="showGroup(group)")
            .flyer-group__container
              span {{ group.name }}
              v-icon.ml-3(v-if="!voteClosed" color="accent") mdi-youtube
              template(v-else)
                span.mx-1 –
                b(v-html="ladderText(group.name)")
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
        .flyer-title__catchline(:class="{ show: showCatchline }")
          span(v-if="!voteClosed") <b>Écoutez</b>, <b class="emph-text">votez</b> et élisez le gagnant pour<br/>l’édition du&nbsp;<b>21-22 Août 2020</b>&nbsp;!
          template(v-else)
            p Les votes sont terminés ! Le grand gagnant est
            h3 {{ groups[0].name }}

      v-btn.vote__button(
        v-if="!voteClosed"
        color="primary"
        x-large
        @click="showVoteDialog = true"
        :class="{ 'vote__button--show': showVoteButton }"
      )
        .vote__button__text VOTER
        v-icon.ml-2 mdi-vote

    transition(name="t-fade-out")
      v-layout.loader(v-if="loading")
        v-progress-linear.loader__progress(:value="loadProgress" height="8")
        .loader__text(v-if="loading") Chargement

    template(v-if="showGroupVideo")
      .dialog__control.dialog__control--prev(v-if="prevGroup" @click="prev")
        .dialog__control__text précédent
        .dialog__control__group {{ prevGroup.name }}

      .dialog__control.dialog__control--next(v-if="nextGroup" @click="next")
        .dialog__control__text suivant
        .dialog__control__group {{ nextGroup.name }}

    v-dialog(v-model="showGroupVideo")
      v-card.group__dialog(color="accent" dark)
        v-card-title.dialog__group-name.primary.accent--text {{ selectedGroup.name }}
          v-btn.dialog__close(icon absolute @click="showGroupVideo = false")
            v-icon mdi-close
        v-card-text.group__description(ref="groupDescription")
          b.white--text {{ selectedGroup.styles ? selectedGroup.styles.join(', ') : '' }}&nbsp;–&nbsp;
          span(v-html="selectedGroup.description")
        youtube-video(:width="videoWidth" :height="videoHeight" :code="selectedGroup.code")

    v-dialog(v-model="showVoteDialog" width="580")
      v-card.vote__dialog(color="accent" dark)
        v-card-title.secondary.justify-center.accent--text {{ voteError ? butNotConfirmed ? 'Attention' : 'Erreur' : doneVote ? 'Vous avez voté' : $vuetify.breakpoint.xs ? 'Votez' : 'Votez pour votre groupe préféré' }}
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
              p.mt-4.primary--text Le groupe heureux élu de votre&nbsp;
                v-icon.mr-2(color="secondary") mdi-heart
                span est&nbsp;:
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
              p.primary--text.mb-2 Renseignez votre adresse&nbsp;email&nbsp;:
              v-text-field.vote__email(
                outlined
                label="email"
                name="email"
                color="primary"
                :rules="emailRules"
                required
                validate-on-blur
                v-model="voteEmail"
              )
              small Nous avons besoin de votre adresse pour vous envoyer un email afin de valider ce vote. Aucun email n’est stocké, ni partagé à des fins publicitaires.
          v-card-actions
            v-spacer
            v-btn(large text color="secondary" @click="showVoteDialog = false") Annuler
            v-btn(large color="primary" @click="submitVote" :loading="voteLoading") VOTER

        template(v-else-if="doneVote && !voteError")
          v-card-text.dialog__thank-you
            h1.primary--text.mt-6.mb-4 Merci !
            h3.mt-8.mb-4
              span.secondary--text Vérifiez votre boîte mail
            h4 Nous vous avons envoyé un mail de confirmation. N’oubliez pas de cliquer sur le lien pour valider votre vote afin qu’il soit comptabilisé. Si vous n’avez rien reçu, <span class="white--text"> pensez à verifier vos <i>spams</i></span> (courier indésiable).
            p.mt-4.mb-12 Les résultats du vote seront annoncés le 17 mai sur notre <a href="https://www.facebook.com/cemurmure" target="_blank" rel="noopener">page Facebook</a>.
            p.white--text Partagez ce tremplin
            .dialog__social-sharing.mb-6
              v-btn(icon color="primary" @click="share('facebook')")
                v-icon mdi-facebook
              v-btn(icon color="primary" @click="share('twitter')")
                v-icon mdi-twitter
              v-btn(icon color="primary" @click="share('whatsapp')")
                v-icon mdi-whatsapp
            v-btn(icon color="primary" :href="shareMailto")
              v-icon mdi-email
            p Vous pouvez aussi&nbsp;
            a(href="https://www.helloasso.com/associations/association-raspatakouet-promotion-de-la-culture-en-milieu-rural/adhesions/formulaire-d-adhesion-a-l-association-raspatakouet" target="_blank" rel="noopener")
              p faire un don à l’asso

        template(v-else)
          v-card-text.dialog__error.secondary__text
            p.mt-5(:class="{ 'white--text': butNotConfirmed }") {{ alreadyVoted ? 'Vous avez déjà vôté avec cette adresse' : 'Une erreur est survenue' }}
              v-icon.ml-1(v-if="!butNotConfirmed" color="secondary") {{ alreadyVoted ? 'mdi-emoticon-kiss' : 'mdi-emoticon-sad' }}
              span(v-if="!alreadyVoted") ... veuillez réessayer plus tard ou nous contacter sur <a href="https://www.facebook.com/cemurmure">facebook</a> ou par <a href="mailto:raspatakouet@gmail.com">email</a>
              span(v-if="butNotConfirmed") &nbsp;mais votre vote n’a pas été confirmé. Avez-vous cliqué sur le lien reçu dans l’email de confirmation ?
            template(v-if="butNotConfirmed")
              small.mb-2 Rien reçu ? Vérifiez vos spam ou
              v-btn(small color="primary" text :loading="resendEmailLoading" @click="resendEmail" :disabled="resendEmailOk")
                span Renvoyer l’email
                v-icon.ml-1(v-if="resendEmailOk") mdi-check


</template>

<style lang="stylus">
@import '../assets/font.styl'
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

make-sun($size)
  width $size
  height $size
  border-radius 0.5 * $size

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
  padding 24px 48px !important

.v-dialog
  overflow visible !important

b
  font-weight 900

.emph-text
  color $color-accent
  font-weight 900

// main
.main, .v-application
  font-family 'FashionFetish', Helvetica, sans-serif

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
  white-space pre

  &::before, &::after
    content ''
    display inline-block
    height 24px
    margin 0 8px
    animation dots 3s linear infinite alternate

.loader__progress
  position absolute
  top 0

// scene
.scene
  absolute-full()
  background-image url('/images/sky.jpg')
  background-position 0% 0%
  background-size cover
  overflow hidden

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
    make-sun($sun-size)
    background-color $color-primary
    top 120%
    left 50%
    transform translate(-50%, -50%)
    animation sunside 12s $ease forwards
    animation-play-state paused

  .flyer-image-tremplin
    absolute-full()
    background-image url('/images/tremplin.png')
    background-position 50% 50%
    background-size 140%
    pointer-events none

  .flyer-image-water
    position absolute
    bottom 0
    left 0
    right 0
    width 100%
    height 17%
    background-position 0 0
    background-size cover
    background-image url('/images/water.png')
    animation slide-water 8s ease-in-out infinite alternate
    animation-play-state paused

  .flyer-title
    margin-top 24px
    z-index 2
    text-align center
    height 260px
    position absolute
    left 50%
    transform translateX(-50%)
    width 100%
    pointer-events none

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

    &:hover, &:focus
      outline none

      .flyer-group__container
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

.v-dialog > .v-card > .v-card__text.group__description
  padding-top 24px !important

  @media (max-width: 460px)
    padding-top 18px !important
    font-size 11px
    max-height 160px
    overflow scroll

.dialog__close
  right 12px
  top 11px

.dialog__control
  width auto
  position fixed
  top calc(100% - 80px)
  z-index 900
  color $color-accent
  background-color $color-primary
  transition transform 0.1s $bounce
  padding 8px
  cursor pointer
  box-shadow 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

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
  font-weight 900 !important
  color $color-accent !important

  .v-btn__content
    display flex
    text-align center

.v-btn.vote__button
  position absolute

.vote__button
  right 24px
  bottom calc(17% + 24px)
  opacity 0
  transform scale(0.5)
  transition opacity 0.5s, transform 0.5s $bounce

  &--show
    opacity 1
    transform scale(1)

  .vote__button__text
    margin-top 4px

.vote__dialog
  .v-card__text
    max-height calc(100vh - 166px)
    overflow scroll

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

@media (max-height: 800px)
  .scene
    .flyer-title
      height 168px

    .flyer-title__cemurmure
      font-size 18px

    .flyer-title__presente
      font-size 14px

    .flyer-title__tremplin
      margin-top 8px
      make-title(50px)

    .flyer-title__catchline
      margin-top 4px
      font-size 14px

    .flyer-image-sun
      make-sun(0.85 * $sun-size)

@media (max-width: 760px)
  .scene
    .flyer-image-tremplin
      background-size 280%
      background-position 64% 58%

    .flyer-image-sun
      left 25%

    .flyer-title__tremplin
      make-title(50px)

    .flyer-groups
      width 75%

@media (max-width: 460px)
  .scene
    .flyer-image-tremplin
      background-size 380%
      background-position 61% 70%

    .flyer-image-sun
      left 9%
      make-sun(0.75 * $sun-size)

    .flyer-title
      height 168px

    .flyer-title__cemurmure
      font-size 16px

    .flyer-title__presente
      font-size 12px

    .flyer-title__tremplin
      margin-top 16px
      make-title(38px)

    .flyer-title__catchline
      margin-top 8px
      font-size 12px

    .flyer-groups
      width 100%

  .vote__button
    right 24px

  .dialog__control
    top calc(100% - 64px)

  .v-dialog > .v-card.vote__dialog > .v-card__title
    font-size 16px

  .v-dialog > .v-card > .v-card__text
    padding 0 24px 18px !important

  .vote__email
    font-size 12px

@media (max-width: 370px)
  .scene
    .flyer-title
      margin-top 16px

    .flyer-title__cemurmure
      font-size 14px

    .flyer-title__tremplin
      margin-top 12px
      line-height 1

    .flyer-title__catchline
      p
        font-size 80%
        margin-bottom 4px

    .flyer-image-sun
      left 7%

    .flyer-group
      font-size 14px

  .v-dialog > .v-card.group__dialog > .v-card__title
    font-size 16px

  .vote__email
    font-size 12px

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
import to from 'await-to-js';
import axios from 'axios';
import TextAnimation from '@/components/TextAnimation';
import YoutubeVideo from '@/components/YoutubeVideo';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const shareEmailSubject = 'Votez pour le templin Cemurmure 2020 !';
const shareEmailBody = 'http://tremplin2020.cemurmurefestival.com';

function encode(str) {
  if (global.encodeURIComponent) {
    return global.encodeURIComponent(str);
  } else {
    return str;
  }
}

const DEV_CLOUD_FUNCTION = false;
const REGION = 'europe-west1';
const PROJECT = 'ce-murmure-festival';
const FUNCTION_NAME = 'voteTremplin2020';
const CLOUD_FUNCTION_URL = DEV_CLOUD_FUNCTION
  ? `http://localhost:5001/${PROJECT}/${REGION}/${FUNCTION_NAME}`
  : `https://${REGION}-${PROJECT}.cloudfunctions.net/${FUNCTION_NAME}`;

const voteCloudFnUrl = CLOUD_FUNCTION_URL + '/vote';
const resendEmailCloudFnUrl = CLOUD_FUNCTION_URL + '/resendEmail';

const shareMailto =
  'mailto:?subject=' +
  encode(shareEmailSubject) +
  '&body=' +
  encode(shareEmailBody);

const k = 1;
const fakeLoadingDelay = k * 1500;

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
      extraLoadSteps: 1,
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
        {
          name: 'Electrik Cellar',
          code: '5uAjhrlTEFg',
          styles: ['Rock'],
          votes: 47,
          description:
            'Sorti tout droit d’une cave humide et sombre, le trio Auxerrois d’<span class="primary--text">Electrik Cellar</span> remonte à la surface terrestre pour partager un rock brut, sauvage, psychédélique et aérien. Leur isolement nourri à coups de guitares venues tout droit du désert californien, de basses lourdes et de batteries hypnotiques sont complétées par un mélange de voix aux mélodies Anglo-saxonnes.',
        },
        {
          name: 'San-Seyha',
          code: '9QN-PzN5qKs',
          styles: ['Chanson'],
          votes: 33,
          description:
            '<span class="primary--text">San-Seyha</span> questionne son identité à travers l’exil, qu’il soit géographique ou existentiel, et nous embarque dans une traversée entre chant, slam et poésie. Sa voix est sincère et contagieuse et la musique accomplit le reste du voyage. Avec Vincent Loyer (machines/basse) et Damien Saint-Loup (guitare, oud, choeurs), pour une atmosphère citadine, mécanique et envoûtante et des mélodies électriques et puissantes.',
        },
        {
          name: 'The Boys Friends',
          code: 'AZLsy70g--4',
          styles: ['Rock', 'Jazz', 'Pop'],
          votes: 86,
          description:
            'Slook, Pippin, Lapin et Jamo ont uni leurs humours et leurs passions de la musique afin de créer le goupe <span class="primary--text">The Boys Friends</span>. Groupe atypique, dont le but est de magnifier vos tubes préférés des années 70s, 80s en allant même jusqu’aux années 90s. C’est avec un set totalement acoustique que nous nous produisons tout en mêlant humour, ambiance et chanson. Jazz, Blues, Folk, Rock, Bossa, etc... il y en aura pour tout les goûts.',
        },
      ],
      showVoteButton: false,
      showVoteDialog: false,
      votedGroup: null,
      validVote: false,
      voteEmail: null,
      emailRules: [
        v => !!v || 'Adresse email requise',
        v => emailRegex.test(v) || 'Format d’email invalide',
      ],
      voteLoading: false,
      alreadyVoted: false,
      butNotConfirmed: false,
      voteError: false,
      doneVote: false,
      shareMailto,
      resendEmailLoading: false,
      resendEmailOk: false,
      // share
      networks: {
        twitter: 'https://twitter.com/intent/tweet?text=@title&url=@url',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=@url&title=@title&description=@description', // prettier-ignore
        whatsapp: 'https://api.whatsapp.com/send?text=@description%0D%0A@url',
      },
      title: encodeURIComponent(
        'Votez pour le Tremplin – Ce Murmurmure Festival – Édition 2020'
      ),
      description: encodeURIComponent(
        'Votez pour le Tremplin – Ce Murmurmure Festival – Édition 2020'
      ),
      popup: {
        status: false,
        resizable: true,
        toolbar: false,
        menubar: false,
        scrollbars: false,
        location: false,
        directories: false,
        width: 626,
        height: 436,
        top: 0,
        left: 0,
        window: undefined,
        interval: null,
      },
      voteClosed: true,
    };
  },
  mounted() {
    this.load();
    setTimeout(() => this.loadedImages++, fakeLoadingDelay);
    /**
     * Center the popup on dual screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : screen.left;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : screen.top;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    this.popup.left = width / 2 - this.popup.width / 2 + dualScreenLeft;
    this.popup.top = height / 2 - this.popup.height / 2 + dualScreenTop;

    // set ladder if vote closed
    if (this.voteClosed) this.setLadder();
  },
  computed: {
    loadProgress() {
      return (
        (this.loadedImages / (this.imageSources.length + this.extraLoadSteps)) *
        100
      );
    },
    sceneClass() {
      return !this.loading ? 'scene--started' : null;
    },
    loading() {
      // return false;
      return (
        !this.finishLoading ||
        this.loadedImages < this.imageSources.length + this.extraLoadSteps
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
      setTimeout(() => {
        this.videoWidth = window.innerWidth - 48;
        const descElem = this.$refs.groupDescription;
        if (!descElem) this.videoHeight = window.innerHeight - 48 - 58 * 3;
        else {
          const rect = descElem.getBoundingClientRect();
          this.videoHeight = window.innerHeight - 48 - 58 * 2 - rect.height;
        }
      }, 250);
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
        const [error, response] = await to(
          axios.post(
            voteCloudFnUrl,
            { email: this.voteEmail, group: this.votedGroup },
            { timeout: 10000 }
          )
        );
        this.voteLoading = false;
        if (error) {
          if (error.response && error.response.status === 409) {
            this.alreadyVoted = true;
          }
          if (error.response && error.response.status === 418) {
            this.alreadyVoted = true;
            this.butNotConfirmed = true;
          }
          this.voteError = true;
        } else this.doneVote = true;
      }
    },
    async resendEmail() {
      this.resendEmailLoading = true;
      const [error, response] = await to(
        axios.post(
          resendEmailCloudFnUrl,
          { email: this.voteEmail, group: this.votedGroup },
          { timeout: 10000 }
        )
      );
      this.resendEmailLoading = false;
      if (error) this.voteError = true;
      else {
        this.voteError = false;
        this.doneVote = true;
      }
    },
    openSharer(url) {
      // If a popup window already exist it will be replaced, trigger a close event.
      let popupWindow = null;
      if (popupWindow && this.popup.interval) {
        clearInterval(this.popup.interval);
        popupWindow.close(); // Force close (for Facebook)
      }

      popupWindow = window.open(
        url,
        'sharer',
        /* prettier-ignore */
        'status=' + (this.popup.status ? 'yes' : 'no') +
        ',height=' + this.popup.height +
        ',width=' + this.popup.width +
        ',resizable=' + (this.popup.resizable ? 'yes' : 'no') +
        ',left=' + this.popup.left +
        ',top=' + this.popup.top +
        ',screenX=' + this.popup.left +
        ',screenY=' + this.popup.top +
        ',toolbar=' + (this.popup.toolbar ? 'yes' : 'no') +
        ',menubar=' + (this.popup.menubar ? 'yes' : 'no') +
        ',scrollbars=' + (this.popup.scrollbars ? 'yes' : 'no') +
        ',location=' + (this.popup.location ? 'yes' : 'no') +
        ',directories=' + (this.popup.directories ? 'yes' : 'no')
      );

      popupWindow.focus();

      // Create an interval to detect popup closing event
      this.popup.interval = setInterval(() => {
        if (!popupWindow || popupWindow.closed) {
          clearInterval(this.popup.interval);
          popupWindow = undefined;
        }
      }, 500);
    },
    share(network) {
      const siteUrl = encodeURIComponent(window.location.href);
      if (!this.networks[network]) return;
      const shareUrl = this.networks[network]
        .replace('@url', siteUrl)
        .replace('@title', this.title)
        .replace('@description', this.description);
      this.openSharer(shareUrl);
    },
    setLadder() {
      this.groups.sort((groupA, groupB) => {
        if (groupA.votes > groupB.votes) return -1;
        else if (groupA.votes < groupB.votes) return 1;
        else return 0;
      });
    },
    ladderText(groupName) {
      const number =
        this.groups.findIndex(({ name }) => name === groupName) + 1;
      switch (number) {
        case 1:
          return '1<sup>er</sup>';
        case 2:
          return '2<sup>e</sup>';
        case 3:
          return '3<sup>e</sup>';
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
        setTimeout(() => (this.showGroups = true), k * 5500);
        setTimeout(() => (this.showVoteButton = true), k * 7500);
      }
    },
    showGroupVideo() {
      if (!this.showGroupVideo) {
        setTimeout(() => (this.selectedGroup = {}), 500);
      }
    },
    showVoteDialog() {
      if (!this.showVoteDialog) {
        setTimeout(() => {
          this.doneVote = false;
          this.voteError = false;
          this.alreadyVoted = false;
          this.butNotConfirmed = false;
        }, 500);
      }
    },
  },
};
</script>
