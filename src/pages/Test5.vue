<template>
  <div ref="containerRef" class="container" />
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import { ref } from "vue";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { gsap } from "gsap";

const containerRef = ref();

let camera;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);
const cubes = {
  pink: createCube({ color: 0xff00ce, x: -1, y: -1 }),
  purple: createCube({ color: 0x9300fb, x: 1, y: -1 }),
  blue: createCube({ color: 0x0065d9, x: 1, y: 1 }),
  cyan: createCube({ color: 0x00d7d0, x: -1, y: 1 }),
};

function createCube({ color, x, y }) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);

  return cube;
}

for (const [name, object] of Object.entries(cubes)) {
  object.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log(`${name} cube was clicked`);
    const cube = event.target;
    camera.position.set(cube.position.x, cube.position.y, camera.position.z);
  });
  interactionManager.add(object);
  scene.add(object);
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

onMounted(() => {
  camera = new THREE.PerspectiveCamera(
    70,
    containerRef.value.offsetWidth / containerRef.value.offsetHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 10);
  init();
  animate();
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

// animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //   camera.lookAt(scene.position);
  camera.updateMatrixWorld();
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
</script>

<style lang="scss" scoped></style>
