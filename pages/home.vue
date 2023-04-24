<template>
  <div>
    <div>{{ b }}</div>
    <div>{{ a }}</div>
  </div>
</template>

<script setup>
const b = useState("x", "666");
const a = 666;
</script>

<style>
</style>