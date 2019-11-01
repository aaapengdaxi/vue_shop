<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域  -->
      <el-form  label-width="0px" class="login_form" :model="loginForm">
          <!-- 用户名 -->
        <el-form-item >
                <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item >
                <el-input  prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
          <el-form-item class="btns">
                <el-button type="primary">登录</el-button>
                <el-button type="info">重置</el-button>
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
        }
    };
  },
  methods: {}
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