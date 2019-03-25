<template>
    <el-container style="border: 1px solid">
      <el-header>
        <div class="topbar-logos">
        <img src="../assets/logo1.png"  />
        </div>
      </el-header>
      <el-main>Main

      </el-main>
    </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg1: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
</style>
