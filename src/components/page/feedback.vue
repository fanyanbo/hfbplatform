<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>数据</el-breadcrumb-item>
        <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
        <el-upload
        class="upload-demo"
        ref="upload"
        action="" 
        :on-change="handleChanged"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :auto-upload="false"
        :multiple="true"
        :limit="5"
        list-type="picture">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </el-col>
   <!-- action="http://localhost:3010/test/uploadPic"     -->
    <el-col :span="24" class="warp-main" style="margin-top:30px">
        <el-upload
            ref="upload2"
            action="http://172.20.133.47:3010/test/uploadPic"    
            list-type="picture-card"
            :http-request="submitUpload2"
            :auto-upload="false"
            :on-progress="handleProgress"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中" style="margin-top:50px">

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
        <el-table-column prop="issueType" label="问题类型" width="100">
        </el-table-column>
        <el-table-column prop="issueContent" label="问题描述" min-width="160" align="center">
        </el-table-column>
        <!-- <el-table-column prop="picList" label="图片名称" min-width="120">
        </el-table-column> -->
        <el-table-column prop="optTime" label="提交时间">
        </el-table-column>
                <el-table-column label="查看图片" type="expand" width="150">
                <template slot-scope="props">
                  <el-form label-position="rigth" inline class="demo-table-expand">
                    <el-form-item label="图片地址">
                      <span>{{ props.row.picList }}</span>
                    </el-form-item>
                    <img :src="props.row.picList" class="image">
                  </el-form>
                </template>
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
        dialogImageUrl: '',
        dialogVisible: false,
        loading: false,
        users: [],
        filters: {
          name: ''
        }
      }
    },
    methods: {
        handleSearch(){
            let that = this;
            that.loading = true;

            API.getIssue().then(function (result) {
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
        handlePictureCardPreview(file) {
            console.log('callback handlePictureCardPreview');
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        submitUpload() {
            console.log('submitUpload');
            this.$refs.upload.submit();
        },
        submitUpload2(param) {
            console.log('submitUpload2');
            let fd = new FormData();
            fd.append('file', param.file);
            fd.append('chip', '9S52');
            fd.append('model', 'Q4A');
            fd.append('issueType','a');
            fd.append('issueContent','b');
            fd.append('contact','1382345930');
            API.submitIssue(fd).then(
                function (result) {
                    console.log(result);
                }, 
                function (err) {
                    console.log(err);
                }
            ).catch(function (error) {
                console.log(eroor);
            });
        },
        beforeUpload(param) {
            console.log('beforeUpload');
            let fd = new FormData();
            fd.append('file', param);
            fd.append('chip', '9S52');
            fd.append('model', 'Q4A');
            fd.append('issueType','a');
            fd.append('issueContent','b');
            fd.append('contact','1382345930');
            API.submitIssue(fd).then(
                function (result) {
                    console.log(result);
                }, 
                function (err) {
                    console.log(err);
                }
            ).catch(function (error) {
                console.log(eroor);
            });
            return true;
        },
        handleRemove(file, fileList) {
            console.log('handleRemove file = ' + file);
        },
        handlePreview(file) {
            console.log('handlePreview file = ' + file);
        },
        handleSuccess(response,file,fileList) {
            console.log('handleSuccess response = ' + response);
        },
        handleError(err,file,fileList) {
            console.log('handleError err = ' + err);
        },
        handleProgress(event,file,fileList) {
            console.log('handleProgress percent = ' + event.percent);
        },
        handleChanged(file, fileList) {
            console.log('handleChanged file = ' + JSON.stringify(file));
            console.log('handleChanged fileList = ' + JSON.stringify(fileList));
        }
    },
    mounted() {
        console.log('upload mounted')
    }
  }
</script>

<style>
.image {
    display: block;
    width: 50%;
}
</style>

