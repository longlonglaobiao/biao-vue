<template>
  <div class="con">
    {{ msg }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "hello world",
    };
  },
};
</script>
<style lang="less">
.con {
  color: red;
}
</style>
