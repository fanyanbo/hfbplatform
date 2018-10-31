<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>帮助反馈</el-breadcrumb-item>
        <el-breadcrumb-item>反馈查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中" style="margin-top:10px">

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="机芯/机型" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="chip" label="机芯" width="120">
        </el-table-column>
        <el-table-column prop="model" label="机型" width="120">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="100">
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="160" align="center">
        </el-table-column>
        <el-table-column prop="category""" label="案例分类" min-width="120">
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞数">
        </el-table-column>
        <el-table-column prop="dislikeCount" label="踩数">
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_feedback';

  export default {
    data() {
      return {
        loading: false,
        users: [],
        filters: {
          name: ''
        }
      }
    },
    methods: {
        handleSearch() {
            let that = this;
            that.loading = true;

            API.getCase().then(function (result) {
                console.log(result);
                that.loading = false;
                if (result && result.data) {
                    that.total = result.total;
                    that.users = result.data;
                }
            }, function (err) {
                that.loading = false;
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
                that.loading = false;
                console.log(error);
                that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
        }
    }
  }
</script>

<style>

</style>

