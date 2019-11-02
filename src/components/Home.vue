<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="left">
        <img src="../assets/heima.png" alt />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{subItem.authName}}</span>
                </template>
                </el-menu-item>
            </el-submenu>
        
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
        //左侧菜单数据
        menuList:[],

    };
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenuList(){
      //请求列表数据
        const {data:res} = await this.$http.get('menus')
        // console.log(res)
        if(res.meta.status !=200)return this.$message.error('获取列表失败')
        this.menuList = res.data
        console.log(this.menuList)
        
    }
  },
  created(){
      //请求列表数据
    this.getMenuList()
  }
};
</script>
<style scoped lang="less">
.home-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    padding-left: 0;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
     h3 {
        color: #fff;
        margin-left: 10px;
        font-weight: 400;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>