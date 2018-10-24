<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="12" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="oldPwd" label="原密码">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认新密码">
          <el-input v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangepwd">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user';
  export default{
    data(){
      return {
        form: {
          username: '',
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        rules: {
          oldPwd: [
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          confirmPwd: [
            {required: true, message: '请输入确认新密码', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      handleChangepwd() {
        // this.$message({message: "此功能只是让你看看，不会开发！", duration: 2000});
        let that = this;
        that.$refs.form.validate((valid) => {
          if(valid){
            that.loading = true;
            console.log("==>username="+that.form.username);
            if(that.form.newPwd !== that.form.confirmPwd) {
              that.$message.error({showClose: true, message: "两次输入的新密码不一致！", duration: 2000});
              return;
            }
            let args = {
              username: that.form.username,
              oldPwd: that.form.oldPwd,
              newPwd: that.form.newPwd
            };
            API.changePwd(args).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                //修改成功
                let user = JSON.parse(window.localStorage.getItem('access-user'));
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
              } else {
                that.$message.error({showClose: true, message: result.errmsg, duration: 2000});
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
        });
      }
    },
    mounted() {
      let user = localStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        console.log("==>changepwd user=" + JSON.stringify(user));
        this.form.username = user.username;
      }
    }
  }
</script>
