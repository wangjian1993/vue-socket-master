<template>
  <section>
    <div class='mock'>
      <div class='main'>
        loading...
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style lang='less' scoped>
section{
        width:100vh;
        height:100vh;
        position:relative;
    }
    .mock{
        width:100vh;
        height:100vh;
        position:absolute;
         z-index:100;
        background-color:#abb2bf;
    }
    .main{
       margin:200px auto;
       text-align:center:
    }
</style>
