<template>
  <div ref="containerRef" class="container" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref();

onMounted(() => {
  let renderer, scene, camera;
  let pointclouds;
  let raycaster;
  let intersection = null;
  let spheresIndex = 0;
  let clock;
  let toggle = 0;

  const pointer = new THREE.Vector2();
  const spheres = [];

  const threshold = 0.1;
  const pointSize = 0.05;
  const width = 80;
  const length = 160;

  init();
  animate();

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  function generatePointCloudGeometry(color, width, length) {
    const geometry = new THREE.BufferGeometry();
    const numPoints = width * length;

    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    let k = 0;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        const u = i / width;
        const v = j / length;
        const x = u - 0.5;
        const y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
        const z = v - 0.5;

        positions[3 * k] = x;
        positions[3 * k + 1] = y;
        positions[3 * k + 2] = z;

        const intensity = (y + 0.1) * 5;
        colors[3 * k] = color.r * intensity;
        colors[3 * k + 1] = color.g * intensity;
        colors[3 * k + 2] = color.b * intensity;

        k++;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingBox();

    return geometry;
  }

  function generatePointcloud(color, width, length) {
    const geometry = generatePointCloudGeometry(color, width, length);
    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
    });

    return new THREE.Points(geometry, material);
  }

  function generateIndexedPointcloud(color, width, length) {
    const geometry = generatePointCloudGeometry(color, width, length);
    const numPoints = width * length;
    const indices = new Uint16Array(numPoints);

    let k = 0;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        indices[k] = k;
        k++;
      }
    }

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
    });

    return new THREE.Points(geometry, material);
  }

  function generateIndexedWithOffsetPointcloud(color, width, length) {
    const geometry = generatePointCloudGeometry(color, width, length);
    const numPoints = width * length;
    const indices = new Uint16Array(numPoints);

    let k = 0;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        indices[k] = k;
        k++;
      }
    }

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.addGroup(0, indices.length);

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
    });

    return new THREE.Points(geometry, material);
  }

  function init() {
    scene = new THREE.Scene();

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(
      45,
      containerRef.value.offsetWidth / containerRef.value.offsetHeight,
      1,
      10000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);
    camera.updateMatrix();

    //

    const pcBuffer = generatePointcloud(
      new THREE.Color(1, 0, 0),
      width,
      length
    );
    pcBuffer.scale.set(5, 10, 10);
    pcBuffer.position.set(-5, 0, 0);
    scene.add(pcBuffer);

    const pcIndexed = generateIndexedPointcloud(
      new THREE.Color(0, 1, 0),
      width,
      length
    );
    pcIndexed.scale.set(5, 10, 10);
    pcIndexed.position.set(0, 0, 0);
    scene.add(pcIndexed);

    const pcIndexedOffset = generateIndexedWithOffsetPointcloud(
      new THREE.Color(0, 1, 1),
      width,
      length
    );
    pcIndexedOffset.scale.set(5, 10, 10);
    pcIndexedOffset.position.set(5, 0, 0);
    scene.add(pcIndexedOffset);

    pointclouds = [pcBuffer, pcIndexed, pcIndexedOffset];

    //

    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    for (let i = 0; i < 40; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);
      spheres.push(sphere);
    }

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.value.offsetWidth,
      containerRef.value.offsetHeight
    );
    containerRef.value.appendChild(renderer.domElement);

    //

    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    //

    window.addEventListener("resize", onWindowResize);
    document.addEventListener("pointermove", onPointerMove);
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / containerRef.value.offsetWidth) * 2 - 1;
    pointer.y = -(event.clientY / containerRef.value.offsetHeight) * 2 + 1;
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
    camera.updateMatrixWorld();

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(pointclouds, false);
    intersection = intersections.length > 0 ? intersections[0] : null;

    if (toggle > 0.02 && intersection !== null) {
      spheres[spheresIndex].position.copy(intersection.point);
      spheres[spheresIndex].scale.set(1, 1, 1);
      spheresIndex = (spheresIndex + 1) % spheres.length;

      toggle = 0;
    }

    for (let i = 0; i < spheres.length; i++) {
      const sphere = spheres[i];
      sphere.scale.multiplyScalar(0.98);
      sphere.scale.clampScalar(0.01, 1);
    }

    toggle += clock.getDelta();

    renderer.render(scene, camera);
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: fixed;
}
</style>
