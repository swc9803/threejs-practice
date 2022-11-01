<template>
  <div ref="containerRef" class="container" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref();

let camera;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

const geometry = new THREE.IcosahedronGeometry(0.5, 3);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

const color = new THREE.Color();
const white = new THREE.Color().setHex(0xffffff);

const amount = parseInt(window.location.search.slice(1)) || 10;
const count = Math.pow(amount, 3);

const light = new THREE.HemisphereLight(0xffffff, 0x888888);
light.position.set(0, 1, 0);
scene.add(light);
scene.background = new THREE.Color(0x000000);

const mesh = new THREE.InstancedMesh(geometry, material, count);

let i = 0;
const offset = (amount - 1) / 2;
const matrix = new THREE.Matrix4();

for (let x = 0; x < amount; x++) {
  for (let y = 0; y < amount; y++) {
    for (let z = 0; z < amount; z++) {
      matrix.setPosition(offset - x, offset - y, offset - z);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, color);

      i++;
    }
  }
}
scene.add(mesh);

onMounted(() => {
  camera = new THREE.PerspectiveCamera(
    60,
    containerRef.value.offsetWidth / containerRef.value.offsetHeight,
    0.1,
    100
  );
  camera.position.set(amount, amount, amount);
  init();
  animate();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
});

function render() {
  renderer.render(scene, camera);
}

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    containerRef.value.offsetWidth,
    containerRef.value.offsetHeight
  );
  containerRef.value.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  document.addEventListener("mousemove", onMouseMove);
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

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / containerRef.value.offsetWidth) * 2 - 1;
  mouse.y = -(event.clientY / containerRef.value.offsetHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersection = raycaster.intersectObject(mesh);
  if (intersection.length > 0) {
    const instanceId = intersection[0].instanceId;
    mesh.getColorAt(instanceId, color);
    if (color.equals(white)) {
      mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
      mesh.instanceColor.needsUpdate = true;
    }
  }
  render();
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
