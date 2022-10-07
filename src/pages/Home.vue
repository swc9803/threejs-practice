<template>
  <p>init</p>
  <div class="logo">hi</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.logo {
  width: 6em;
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  background: red;
  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
}
</style>
