<template>
  <div>byr</div>
  <div ref="containerRef" class="container" />
  <div>hi</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let camera;
const containerRef = ref();
const intersected = ref();
const pointer = new THREE.Vector2();
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const geometry = new THREE.BoxGeometry(20, 20, 20);
for (let i = 0; i < 1000; i++) {
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
  });
  const object = new THREE.Mesh(geometry, material);

  object.position.x = Math.random() * 800 - 400;
  object.position.y = Math.random() * 800 - 400;
  object.position.z = Math.random() * 800 - 400;

  object.rotation.x = Math.random() * 2 * Math.PI;
  object.rotation.y = Math.random() * 2 * Math.PI;
  object.rotation.z = Math.random() * 2 * Math.PI;

  object.scale.x = Math.random() + 0.5;
  object.scale.y = Math.random() + 0.5;
  object.scale.z = Math.random() + 0.5;
  scene.add(object);
}

scene.background = new THREE.Color(0xf0f0f0);

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
    if (intersected.value != intersects[0].object) {
      if (intersected.value) {
        intersected.value.material.emissive.setHex(
          intersected.value.currentHex
        );
      }
      intersected.value = intersects[0].object;
      intersected.value.currentHex =
        intersected.value.material.emissive.getHex();
      intersected.value.material.emissive.setHex(0x0000ff);
    }
  } else {
    if (intersected.value) {
      intersected.value.material.emissive.setHex(intersected.value.currentHex);
    }
    intersected.value = null;
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
