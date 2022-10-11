<template>
  <div>byr</div>
  <div ref="container" class="container" />
  <div>hi</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const container = ref();

onMounted(() => {
  let camera, scene, raycaster, renderer;

  let intersected;

  const pointer = new THREE.Vector2();

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera(
      70,
      container.value.getBoundingClientRect().width /
        container.value.getBoundingClientRect().height,
      1,
      10000
    );

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    for (let i = 0; i < 1000; i++) {
      const object = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
      );

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

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      container.value.getBoundingClientRect().width,
      container.value.getBoundingClientRect().height
    );
    container.value.appendChild(renderer.domElement);

    document.addEventListener("mousemove", onPointerMove);
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    camera.aspect =
      container.value.getBoundingClientRect().width /
      container.value.getBoundingClientRect().height;
    camera.updateProjectionMatrix();
    renderer.setSize(
      container.value.getBoundingClientRect().width,
      container.value.getBoundingClientRect().height
    );
  }
  function onPointerMove(e) {
    pointer.x =
      (e.offsetX / container.value.getBoundingClientRect().width) * 2 - 1;
    pointer.y =
      -(e.offsetY / container.value.getBoundingClientRect().height) * 2 + 1;
  }

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    camera.lookAt(scene.position);

    camera.updateMatrixWorld();

    // find intersections
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
      if (intersected != intersects[0].object) {
        if (intersected)
          intersected.material.emissive.setHex(intersected.currentHex);

        intersected = intersects[0].object;
        intersected.currentHex = intersected.material.emissive.getHex();
        intersected.material.emissive.setHex(0xff0000);
      }
    } else {
      if (intersected)
        intersected.material.emissive.setHex(intersected.currentHex);

      intersected = null;
    }

    renderer.render(scene, camera);
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
