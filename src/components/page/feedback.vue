<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>帮助反馈</el-breadcrumb-item>
        <el-breadcrumb-item>反馈管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
        <el-upload
        class="upload-demo"
        ref="upload"
        :action="actionUrl"
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
  </el-row>
</template>

<script>
  import API from '../../api/api_feedback';

  export default {
    data() {
      return {
        actionUrl: '',
        dialogImageUrl: '',
        dialogVisible: false,
        count: 0
      }
    },
    mounted: function() {
        console.log('mounted');
        process.env.NODE_ENV === 'development' ? this.actionUrl = 'http://localhost:3010/help/uploadInfo' : this.actionUrl = 'http://172.20.133.47:3010/help/uploadInfo';
        console.log('actionUrl = ' + this.actionUrl);
    },
    methods: {
        handlePictureCardPreview(file) {
            console.log('callback handlePictureCardPreview');
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        submitUpload() {
            console.log('submitUpload');
            console.log('count = ' + this.count);
            this.$refs.upload.submit();
        },
        beforeUpload(param) {
            console.log('beforeUpload');
            let fd = new FormData();
            fd.append('file', param);
            fd.append('chip', '9S52');
            fd.append('model', 'Q4A');
            fd.append('mac','eeeeeffff');
            fd.append('activeid','1234567');
            fd.append('category','管理平台测试');
            fd.append('title','管理平台测试');
            fd.append('content','管理平台测试');
            fd.append('contact','12345678');
            API.submitFeedbackData(fd).then(
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
            this.count = fileList.length;
        }
    }
  }
</script>

<style>
</style>

