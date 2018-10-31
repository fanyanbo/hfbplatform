<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>帮助反馈</el-breadcrumb-item>
        <el-breadcrumb-item>帮助管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" style="margin-top: 30px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="50px">
        <el-form-item prop="chip" label="机芯">
          <el-input v-model="form.chip"></el-input>
        </el-form-item>
        <el-form-item prop="model" label="机型">
          <el-input v-model="form.model"></el-input>
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item prop="category" label="分类">
          <el-input v-model="form.category"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitCase">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_feedback';

  export default {
    data() {
      return {
        form: {
          chip: '',
          model: '',
          title: '',
          content: '',
          category: ''
        },
        rules: {
          chip: [
            {required: true, message: '请输入机芯', trigger: 'blur'}
          ],
          model: [
            {required: true, message: '请输入机型', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请输入分类', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
        submitCase() {
          console.log('call submitCase');
            let params = {
              chip: this.form.chip,
              model: this.form.model,
              title: this.form.title,
              content: this.form.content,
              category: this.form.category
            }
            API.addCase(params).then(
                function (result) {
                    console.log(result);
                }, 
                function (err) {
                    console.log(err);
                }
            ).catch(function (error) {
                console.log(eroor);
            });
        }
    }
  }
</script>

<style>

</style>

