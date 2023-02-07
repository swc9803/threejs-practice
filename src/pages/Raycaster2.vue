<template>
  <div ref="containerRef" class="container" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let camera;
const containerRef = ref();
let intersected;
const pointer = new THREE.Vector2();
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const geometry = new THREE.BoxGeometry(15, 15, 10);
const material = new THREE.MeshLambertMaterial({
  color: Math.random() * 0xffffff,
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

scene.background = new THREE.Color(0xf0f0f0);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

onMounted(() => {
  camera = new THREE.PerspectiveCamera(
    35,
    containerRef.value.offsetWidth / containerRef.value.offsetHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 40);

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  init();
  animate();
});

// init
function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    containerRef.value.offsetWidth,
    containerRef.value.offsetHeight
  );
  containerRef.value.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
}

// animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  //   camera.lookAt(scene.position);
  camera.updateMatrixWorld();

  // find intersections
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0) {
    if (intersected != intersects[0].object) {
      if (intersected) {
        intersected.material.emissive.setHex(intersected.currentHex);
      }
      intersected = intersects[0].object;
      intersected.currentHex = intersected.material.emissive.getHex();
      intersected.material.emissive.setHex(0x0000ff);
    }
  } else {
    if (intersected) {
      intersected.material.emissive.setHex(intersected.currentHex);
    }
    intersected = null;
  }
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
function onPointerMove(e) {
  pointer.x = (e.offsetX / containerRef.value.offsetWidth) * 2 - 1;
  pointer.y = -(e.offsetY / containerRef.value.offsetHeight) * 2 + 1;
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
