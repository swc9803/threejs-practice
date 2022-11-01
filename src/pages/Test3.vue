<template>
  <div v-show="loading">loading</div>
  <div v-show="!loading" ref="containerRef" class="container" />
  <div>hi</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref();
const loading = ref(false);
let intersected;
let mixer;
let camera;

const clock = new THREE.Clock();
const pointer = new THREE.Vector2();
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const gltfLoader = new GLTFLoader();
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshLambertMaterial({
  color: Math.random() * 0xffffff,
});
const object = new THREE.Mesh(geometry, material);
object.position.set = (0, 0, 1);
scene.add(object);
scene.background = new THREE.Color(0xf0f0f0);

gltfLoader.load("/models/Fox.gltf", (model) => {
  mixer = new THREE.AnimationMixer(model.scene);
  let action = mixer.clipAction(model.animations[0]);
  action.play();

  const fox = model.scene;
  fox.position.set(0, -30, 0);
  scene.add(fox);
  loading.value = false;
  // fox.position.set(0, -50, 0)
  fox.rotation.set(0, Math.PI / -4, 0);
  console.log(model.animations[0]);
  console.log(model.animations[1]);
  console.log(model.animations[2]);
  document.addEventListener("click", () => {
    action = mixer.clipAction(model.animations[2]);
    action.play();
  });
});

onMounted(() => {
  camera = new THREE.PerspectiveCamera(
    75,
    containerRef.value.offsetWidth / containerRef.value.offsetHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 200);

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  init();
  animate();
});

function render() {
  camera.updateMatrixWorld();

  // find intersections
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0) {
    if (intersected != intersects[0].object) {
      // gltfLoader.load("/models/Fox.gltf", (model) => {
      //   let action = mixer.clipAction(model.animations[0]);
      //   action.play();
      // });
      if (intersected) {
        // object서 object로 이동할 때
        intersected.material.emissive.setHex(intersected.currentHex);
      }
      // object에 닿을 때
      intersected = intersects[0].object;
      intersected.currentHex = intersected.material.emissive.getHex();
      console.log("hi");
      // action = mixer.clipAction(model.animations[1]);
      // action.play();
    }
  } else {
    if (intersected) {
      // 해제
      intersected.material.emissive.setHex(intersected.currentHex);
    }
    intersected = null;
  }
  renderer.render(scene, camera);
}

function init() {
  loading.value = true;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    containerRef.value.offsetWidth,
    containerRef.value.offsetHeight
  );
  containerRef.value.appendChild(renderer.domElement);

  document.addEventListener("mousemove", onPointerMove);
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  let delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  render();
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
