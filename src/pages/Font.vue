<template>
  <p v-if="loadingRef" class="loading">loading</p>
  <div ref="containerRef" class="container" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const loadingRef = ref(true);
const containerRef = ref();

let camera;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const light = new THREE.HemisphereLight(0xffffff, 0x888888);
light.position.set(0, 1, 0);
scene.add(light);
scene.background = new THREE.Color(0x000000);

const loader = new FontLoader();
// FontFace.js
loader.load("CHAB.json", (font) => {
  const geometry = new TextGeometry("글자\n테스트.", {
    font: font,
    size: 0.2,
    height: 0.01,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.001,
    bevelOffset: 0.001,
    // bevelSegments: 24,
  });
  geometry.center();
  const material = new THREE.MeshPhongMaterial({
    color: "#FFFFFF",
    // roughness: 0.3,
    // metalness: 0.7,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  loadingRef.value = false;
});

const stats = new Stats();
// const gui = new GUI();
// gui.add(mesh, "count", 0, count);

onMounted(() => {
  camera = new THREE.PerspectiveCamera(
    60,
    containerRef.value.offsetWidth / containerRef.value.offsetHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 1);
  init();
  animate();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  containerRef.value.appendChild(stats.domElement);
});

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    containerRef.value.offsetWidth,
    containerRef.value.offsetHeight
  );
  containerRef.value.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect =
    containerRef.value.offsetWidth / containerRef.value.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    containerRef.value.offsetWidth,
    containerRef.value.offsetHeight
  );
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 1;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: red;
  z-index: 2;
}
</style>
