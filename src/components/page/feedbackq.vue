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
      <el-table :data="users.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row v-loading="loading" style="width: 100%;">
        <!-- <el-table-column type="index" width="60">
        </el-table-column> -->
        <el-table-column prop="chip" label="机芯" width="80" align="center">
        </el-table-column>
        <el-table-column prop="model" label="机型" width="80" align="center">
        </el-table-column>
        <el-table-column prop="mac" label="MAC" width="120" align="center">
        </el-table-column>
        <el-table-column prop="activeid" label="激活id" width="120" align="center">
        </el-table-column>
        <el-table-column prop="category" label="类型" width="150" align="center">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="400" align="center">
        </el-table-column>
        <el-table-column prop="content" label="描述" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="optTime" label="提交时间" width="150" align="center">
        </el-table-column>
                <el-table-column label="查看图片" type="expand" width="150">
                <template slot-scope="props">
                  <el-form label-position="right" inline class="demo-table-expand">
                    <el-form-item label="图片地址">
                      <span>{{ props.row.picurl }}</span>
                    </el-form-item>
                    <img :src="props.row.picurl" class="image">
                  </el-form>
                </template>
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
        loading: false,
        users: [],
        total: 5,
        currentPage: 1,
　　　　 pageSize: 10,
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

            API.fetchFeedbackData().then(function (result) {
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
.image {
    display: block;
    width: 50%;
}
</style>

