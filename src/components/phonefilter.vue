<template>
  <span>
    &nbsp;&nbsp;
    <el-popover
      placement="right"
      width="280"
      trigger="click" >
      <el-radio-group v-model="filtertype" @change="phoneFilterChange"> 
        <el-radio :label="1">全部</el-radio>
        <el-radio :label="2">有电话</el-radio>
        <el-radio :label="3">无电话</el-radio>
      </el-radio-group>
      <el-button slot="reference" size="small">筛选</el-button>
    </el-popover>
  </span>
</template>

<script>
export default {
  name: 'phonefilter',
  data() {
    return {
      filtertype: 1
    };
  },
  props: {
    phoneFilterChangeMethod: {
      type: Function,
      default: null
    }
  },

  methods: {

    phoneFilterChange() {
      var str;
      if (this.filtertype == 1)
        str = "all";
      else if (this.filtertype == 2)
        str = "exist";
      else if (this.filtertype == 3)
        str = "none";
      if (this.phoneFilterChangeMethod != null)
        this.phoneFilterChangeMethod(str);
    }
  }
};
</script>

<style scoped>

</style>
