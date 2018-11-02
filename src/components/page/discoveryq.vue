<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>帮助反馈</el-breadcrumb-item>
        <el-breadcrumb-item>探索发现查询</el-breadcrumb-item>
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
      <el-table :data="users.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="category_desc" label="分类" width="200" align="center">
        </el-table-column>
        <el-table-column prop="title_desc" label="标题" min-width="300" align="center">
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞数" align="center">
        </el-table-column>
        <el-table-column prop="dislikeCount" label="踩数" align="center">
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          style="margin-top:10px">
    </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_feedback';

  export default {
    data() {
      return {
        currentPage: 1,
　　　　 pageSize: 10,
        loading: false,
        total: 0,
        users: [],
        filters: {
          name: ''
        }
      }
    },
    created: function() {
        console.log('created');
        this.fetchData();
    },
    methods: {
        handleSearch() {
            let that = this;
            that.loading = true;

            API.fetchDiscoveryData().then(function (result) {
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
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;
        },
        fetchData() {
          this.handleSearch();
        }
    }
  }
</script>

<style>

</style>

