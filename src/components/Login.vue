<template>
  <div class="login_container">
    
    <div class="login_box">
        <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域  -->
      <el-form  label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!-- 用户名 -->
        <el-form-item prop="username">
                <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
                <el-input  prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
          <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
        loginForm:{
            username:'admin',
            password:'123456'
        },
        // 验证规则
        loginFormRules:{
          username:[
            {required:true,message:'请输入用户名',trigger:'blur'},
            {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:'blur'},
            {min:6,max:16,message:'长度在6到16个字符',trigger:'blur'}

          ]
        }
    };
  },
  methods: {
    resetLoginForm(){
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid)return 
        var {data:res}=await this.$http.post('login',this.loginForm)
        if(res.meta.status != 200){
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功');
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push('/home')
      })
    }
  }
};
</script>
<style scoped lang="less">
.login_container {
  height: 100%;
  background: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      position: absolute;
      padding: 10px;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      //添加阴影效果
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
  }
}
.login_form {
    position: absolute;
    bottom:0;
    width: 100%;
    box-sizing: border-box;
    padding:0 20px;
    .btns {
    display: flex;
    justify-content: flex-end;
    }
}

</style>