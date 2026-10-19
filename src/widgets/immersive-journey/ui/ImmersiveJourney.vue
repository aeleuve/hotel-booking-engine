<template>
  <section ref="root" class="journey" :aria-label="t('immersive.label')">
    <div class="journey__scene" aria-hidden="true">
      <img
        v-for="(image, index) in sceneImages"
        :key="`${index}-${image}`"
        class="journey__poster"
        :class="{ 'journey__poster--active': activeChapter === index }"
        :src="image"
        alt=""
      />
      <canvas ref="canvas" class="journey__canvas" />
      <div class="journey__shade" />
      <div class="journey__readout">
        <strong>{{ t(currentReadout.title) }}</strong>
        <span>{{ t(currentReadout.detail) }}</span>
      </div>
      <div class="journey__horizon">
        <span><i />{{ t('immersive.location') }}</span>
        <span>{{
          `0${activeChapter + 1} — ${t(chapterLabels[activeChapter] ?? chapterLabels[0]!)}`
        }}</span>
      </div>
    </div>

    <ol class="journey__index" :aria-label="t('immersive.chapters')">
      <li
        v-for="(chapter, index) in chapterIds"
        :key="chapter"
        :aria-current="activeChapter === index ? 'step' : undefined"
        :class="{
          'journey__dot--active': activeChapter === index,
          'journey__dot--complete': activeChapter > index,
        }"
      >
        <span class="journey__index-node" aria-hidden="true">
          <q-icon :name="chapterIcons[index] ?? chapterIcons[0]" />
        </span>
        <span>{{ t(chapterSigns[index] ?? chapterSigns[0]!) }}</span>
      </li>
    </ol>

    <div class="journey__chapters">
      <article id="journey-start" class="journey__chapter" data-chapter="0">
        <div class="journey__copy">
          <p class="journey__eyebrow">{{ t('immersive.eyebrow') }}</p>
          <h1>{{ t('immersive.title') }}</h1>
          <p class="journey__lede">{{ t('immersive.lede') }}</p>
          <a class="journey__hint" href="#journey-route">
            <span aria-hidden="true" />{{ t('immersive.scroll') }}
          </a>
        </div>
      </article>

      <article id="journey-route" class="journey__chapter" data-chapter="1">
        <div class="journey__copy journey__copy--right">
          <p class="journey__eyebrow">{{ t('immersive.routeEyebrow') }}</p>
          <h2>{{ t('immersive.routeTitle') }}</h2>
          <p class="journey__lede">{{ t('immersive.routeLede') }}</p>
          <div class="journey__route-chip">
            <b>{{ t('immersive.hotel') }}</b
            ><span>···········</span><b>T4</b><i>06 min</i>
          </div>
        </div>
      </article>

      <article id="journey-rest" class="journey__chapter" data-chapter="2">
        <div class="journey__copy">
          <p class="journey__eyebrow">{{ t('immersive.restEyebrow') }}</p>
          <h2>{{ t('immersive.restTitle') }}</h2>
          <p class="journey__lede">{{ t('immersive.restLede') }}</p>
          <div class="journey__detail">
            <strong>05:00</strong><span>{{ t('immersive.breakfast') }}</span>
          </div>
        </div>
      </article>

      <article id="booking" class="journey__chapter journey__chapter--booking" data-chapter="3">
        <div class="journey__copy journey__copy--booking">
          <p class="journey__eyebrow">{{ t('immersive.bookingEyebrow') }}</p>
          <h2>{{ t('immersive.bookingTitle') }}</h2>
          <p class="journey__lede">{{ t('immersive.bookingLede') }}</p>
          <BookingSign class="journey__booking-form" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type * as ThreeTypes from 'three'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from 'src/entities/hotel'
import { BookingSign } from 'src/features/check-availability'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const activeChapter = ref(0)
const hotel = useHotelStore()
const { profile, rooms } = storeToRefs(hotel)
const chapterIds = ['journey-start', 'journey-route', 'journey-rest', 'booking']
const chapterLabels = [
  'immersive.chapterFlight',
  'immersive.chapterRoute',
  'immersive.chapterRest',
  'immersive.chapterHotel',
]
const chapterSigns = [
  'immersive.signFlight',
  'immersive.signRoute',
  'immersive.signRest',
  'immersive.signHotel',
]
const chapterIcons = ['flight_takeoff', 'airport_shuttle', 'bed', 'hotel']
const terminalImageUrl =
  'https://images.unsplash.com/photo-1642551669512-2f03916e3b26?auto=format&fit=crop&fm=jpg&q=78&w=2400'
const roomImages = computed(() => rooms.value.flatMap((room) => room.photoUrls).filter(Boolean))
const sceneImages = computed(() => {
  const fallback = profile.value?.heroImageUrl ?? terminalImageUrl
  const roomImage = roomImages.value[0] ?? fallback
  const hotelImage = roomImages.value.at(-1) ?? roomImage
  return [fallback, terminalImageUrl, roomImage, hotelImage]
})
const readouts = [
  { title: 'immersive.readoutFlight', detail: 'immersive.readoutFlightDetail' },
  { title: 'immersive.readoutRoute', detail: 'immersive.readoutRouteDetail' },
  { title: 'immersive.readoutRest', detail: 'immersive.readoutRestDetail' },
  { title: 'immersive.readoutHotel', detail: 'immersive.readoutHotelDetail' },
]
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const currentReadout = computed(() => readouts[activeChapter.value] ?? readouts[0]!)
let observer: IntersectionObserver | undefined
let resizeObserver: ResizeObserver | undefined
let three: typeof import('three') | undefined
let renderer: ThreeTypes.WebGLRenderer | undefined
let scene: ThreeTypes.Scene | undefined
let camera: ThreeTypes.PerspectiveCamera | undefined
let routeLine: ThreeTypes.Line<ThreeTypes.BufferGeometry, ThreeTypes.LineDashedMaterial> | undefined
let beacon: ThreeTypes.Mesh<ThreeTypes.SphereGeometry, ThreeTypes.MeshBasicMaterial> | undefined
let animationFrame = 0
let animationTime = 0

const createJourneyScene = () => {
  const target = canvas.value
  const THREE = three
  if (!target || !THREE) return

  try {
    renderer = new THREE.WebGLRenderer({ canvas: target, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 8

    const points = [
      new THREE.Vector3(-4.2, -1.15, 1),
      new THREE.Vector3(-2.2, -0.5, 1.1),
      new THREE.Vector3(-0.2, 0.08, 1.2),
      new THREE.Vector3(1.7, 0.48, 1.2),
      new THREE.Vector3(3.65, 1.2, 1.1),
    ]
    routeLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineDashedMaterial({
        color: 0xefb923,
        dashSize: 0.16,
        gapSize: 0.13,
        transparent: true,
        opacity: 0.82,
      }),
    )
    routeLine.computeLineDistances()
    scene.add(routeLine)

    points.slice(0, -1).forEach((point) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 10),
        new THREE.MeshBasicMaterial({ color: '#e9f1ed' }),
      )
      dot.position.copy(point)
      scene?.add(dot)
    })
    beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xefb923 }),
    )
    const terminal = points[points.length - 1]!
    beacon.position.copy(terminal)
    scene.add(beacon)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.15, 32),
      new THREE.MeshBasicMaterial({
        color: 0xefb923,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      }),
    )
    ring.position.copy(terminal)
    ring.position.z += 0.01
    scene.add(ring)

    resizeScene()
    animateScene()
  } catch {
    target.classList.add('journey__canvas--fallback')
  }
}

const resizeScene = () => {
  const THREE = three
  if (!THREE || !renderer || !camera || !canvas.value) return
  const { clientWidth: width, clientHeight: height } = canvas.value
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

const animateScene = () => {
  const THREE = three
  if (!THREE || !renderer || !scene || !camera) return
  animationTime += 0.008
  const chapter = activeChapter.value
  const positions = [
    { x: 0, y: 0, z: 8, tilt: 0 },
    { x: 0, y: 0, z: 7.8, tilt: 0 },
    { x: 0, y: 0, z: 7.55, tilt: 0 },
    { x: 0, y: 0, z: 7.35, tilt: 0 },
  ]
  const targets = positions[chapter] ?? positions[0]!
  const ease = prefersReducedMotion.matches ? 1 : 0.035
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, targets.x, ease)
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, targets.y, ease)
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, targets.z, ease)
  camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targets.tilt, ease)
  if (beacon && !prefersReducedMotion.matches)
    beacon.scale.setScalar(1 + Math.sin(animationTime * 2.5) * 0.12)
  if (routeLine) routeLine.material.opacity = 0.48 + Math.min(0.35, chapter * 0.1)
  renderer.render(scene, camera)
  animationFrame = requestAnimationFrame(animateScene)
}

const observeChapters = () => {
  observer?.disconnect()
  if (!root.value) return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible)
        activeChapter.value = Number((visible.target as HTMLElement).dataset.chapter ?? 0)
    },
    { rootMargin: '-18% 0px -18% 0px', threshold: [0.1, 0.35, 0.6] },
  )
  root.value
    .querySelectorAll<HTMLElement>('[data-chapter]')
    .forEach((chapter) => observer?.observe(chapter))
}

onMounted(() => {
  observeChapters()
  if (canvas.value) {
    resizeObserver = new ResizeObserver(resizeScene)
    resizeObserver.observe(canvas.value)
  }
  void import('three').then((module) => {
    three = module
    if (!renderer) createJourneyScene()
  })
})

onBeforeUnmount(() => {
  const THREE = three
  observer?.disconnect()
  resizeObserver?.disconnect()
  cancelAnimationFrame(animationFrame)
  scene?.traverse((object) => {
    if (THREE && (object instanceof THREE.Mesh || object instanceof THREE.Line)) {
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => {
        material.map?.dispose()
        material.dispose()
      })
    }
  })
  renderer?.dispose()
})
</script>

<style scoped lang="scss">
.journey {
  position: relative;
  isolation: isolate;
  overflow: clip;
  margin-top: -6.5rem;
  background: #10191f;
  color: #eaf0ed;

  &__scene {
    position: sticky;
    z-index: -1;
    top: 0;
    height: 100svh;
    margin-bottom: -100svh;
    overflow: hidden;
    background: #536b75;
  }

  &__poster,
  &__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  &__poster {
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 700ms ease;
  }
  &__poster--active {
    opacity: 1;
  }
  &__canvas--fallback {
    display: none;
  }
  &__canvas {
    pointer-events: none;
  }

  &__shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgb(16 25 31 / 78%), rgb(16 25 31 / 33%) 52%, transparent 85%),
      linear-gradient(0deg, #10191f 0%, transparent 32%, rgb(16 25 31 / 38%) 100%);
  }

  &__readout {
    position: absolute;
    top: 50%;
    right: max(5vw, 1.5rem);
    display: grid;
    gap: 0.35rem;
    width: 10rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgb(255 255 255 / 50%);
    color: #d3dfdc;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    line-height: 1.6;
    transform: translateY(-50%);
    text-transform: uppercase;
    strong {
      color: var(--c-signal);
      font-size: 0.7rem;
      font-weight: 700;
    }
    span {
      white-space: pre-line;
    }
  }

  &__horizon {
    position: absolute;
    right: 5vw;
    bottom: 1.75rem;
    left: 5vw;
    display: flex;
    justify-content: space-between;
    color: rgb(255 255 255 / 72%);
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    i {
      display: inline-block;
      width: 2rem;
      margin: 0 0.55rem 0.2rem 0;
      border-top: 1px solid var(--c-signal);
    }
  }

  &__index {
    position: sticky;
    z-index: 3;
    top: calc((100svh - 14rem) / 2);
    display: grid;
    width: 10rem;
    margin: 0 0 -14rem clamp(1rem, 2.8vw, 3rem);
    padding: 0;
    list-style: none;
    &::before {
      position: absolute;
      top: 1.1rem;
      bottom: 1.1rem;
      left: 1rem;
      width: 1px;
      background: linear-gradient(
        to bottom,
        rgb(239 185 35 / 78%),
        rgb(239 243 239 / 32%) 65%,
        rgb(239 243 239 / 12%)
      );
      content: '';
    }
    li {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      min-width: 0;
      min-height: 3.25rem;
      padding: 0.45rem 0;
      color: rgb(239 243 239 / 76%);
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.075em;
      text-transform: uppercase;
      transition: color 0.2s;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-node {
      position: relative;
      z-index: 1;
      display: grid;
      flex: 0 0 2rem;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border: 1px solid rgb(239 243 239 / 48%);
      border-radius: 50%;
      background: #152429;
      color: var(--c-signal);
      .q-icon {
        font-size: 1rem;
      }
    }
    .journey__dot--active {
      color: #fff;
      .journey__index-node {
        border-color: var(--c-signal);
        background: var(--c-signal);
        box-shadow: 0 0 0 3px rgb(239 185 35 / 20%);
        color: #152429;
      }
    }
    .journey__dot--complete {
      color: rgb(239 243 239 / 90%);
      .journey__index-node {
        border-color: rgb(239 243 239 / 65%);
        color: #d3dfdc;
      }
    }
  }

  &__chapters {
    position: relative;
    z-index: 1;
  }

  &__chapter {
    min-height: 100svh;
    display: flex;
    align-items: center;
    padding: clamp(7rem, 13vh, 10rem) 15vw clamp(5rem, 10vh, 8rem);
    scroll-margin-top: 0;
  }

  &__copy {
    max-width: 54rem;
  }
  &__copy--right {
    margin-left: auto;
  }
  &__copy--booking {
    width: min(100%, 75rem);
    max-width: 75rem;
    margin-inline: auto;
  }
  &__eyebrow {
    margin-bottom: 1.5rem;
    color: var(--c-signal);
    font-size: 0.64rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  h1,
  h2 {
    max-width: 17ch;
    color: #f4f5f1;
    font-family: 'Archivo', system-ui, sans-serif;
    font-size: clamp(3rem, 7vw, 6.25rem);
    font-weight: 600;
    letter-spacing: -0.055em;
    line-height: 0.99;
    text-wrap: balance;
  }
  &__lede {
    max-width: 32rem;
    margin-top: 1.4rem;
    color: #e3e9e6;
    font-size: clamp(1rem, 1.7vw, 1.25rem);
    line-height: 1.55;
  }
  &__hint {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 3.4rem;
    color: #e3e9e6;
    font-size: 0.63rem;
    letter-spacing: 0.1em;
    text-decoration: none;
    text-transform: uppercase;
    span {
      display: grid;
      place-items: center;
      width: 1.65rem;
      height: 2.35rem;
      border: 1px solid rgb(255 255 255 / 50%);
      border-radius: 1rem;
      &::after {
        content: '';
        width: 2px;
        height: 7px;
        background: var(--c-signal);
        animation: wheel 1.5s infinite;
      }
    }
  }
  &__route-chip {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: max-content;
    margin-top: 2rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgb(255 255 255 / 35%);
    background: rgb(14 28 33 / 55%);
    color: #e6efeb;
    font-size: 0.68rem;
    backdrop-filter: blur(12px);
    b {
      color: var(--c-signal);
      font-weight: 700;
    }
    i {
      font-style: normal;
    }
  }
  &__detail {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    color: #e2e7e4;
    font-size: 0.75rem;
    strong {
      color: var(--c-signal);
      font-size: 1.6rem;
      font-weight: 500;
    }
  }
  &__booking-form {
    margin-top: 2rem;
  }

  @keyframes wheel {
    0% {
      transform: translateY(-3px);
      opacity: 0;
    }
    45% {
      opacity: 1;
    }
    100% {
      transform: translateY(4px);
      opacity: 0;
    }
  }

  @media (max-width: 700px) {
    &__readout {
      top: 5.5rem;
      right: 1.25rem;
      bottom: auto;
      width: 7.5rem;
      transform: none;
      font-size: 0.53rem;
    }
    &__horizon {
      right: 1.25rem;
      bottom: 1.3rem;
      left: 1.25rem;
      font-size: 0.5rem;
    }
    &__index {
      top: calc((100svh - 12rem) / 2);
      width: 6.25rem;
      margin: 0 0 -12rem 0.55rem;
      li {
        gap: 0.4rem;
        min-height: 2.85rem;
        font-size: 0.46rem;
        letter-spacing: 0.025em;
      }
      &::before {
        left: 0.85rem;
      }
      &-node {
        flex-basis: 1.7rem;
        width: 1.7rem;
        height: 1.7rem;
      }
    }
    &__chapter {
      min-height: 90svh;
      padding: 8rem 8vw 6rem 29vw;
    }
    &__copy--right {
      margin-left: 0;
    }
    &__copy--booking {
      margin-left: 0;
    }
    &__route-chip {
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.58rem;
    }
    &__hint {
      margin-top: 2.2rem;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .journey__poster {
    transition: none;
  }
  .journey__hint span::after {
    animation: none;
  }
}
</style>
