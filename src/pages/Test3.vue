<template>
  <div v-show="loading">loading</div>
  <div v-show="!loading" ref="container" class="container" />
  <div>hi</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const container = ref();
const loading = ref(false);

// mount 밖으로
onMounted(() => {
  let mixer;
  let intersected;

  const pointer = new THREE.Vector2();
  const scene = new THREE.Scene();
  const raycaster = new THREE.Raycaster();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 200);

  const gltfLoader = new GLTFLoader();
  function init() {
    loading.value = true;
    scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    );
    object.position.set = (0, 0, 1);
    scene.add(object);

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
      //   setTimeout(() => {
      //   }, 1000);
    });
    animate();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.value.appendChild(renderer.domElement);

    document.addEventListener("mousemove", onPointerMove);
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function onPointerMove(e) {
    pointer.x = (e.offsetX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.offsetY / window.innerHeight) * 2 + 1;
  }

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  function render() {
    camera.lookAt(scene.position);
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

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    let delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    render();
  }

  init();
  animate();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
