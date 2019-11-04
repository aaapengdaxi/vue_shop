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
      <el-aside :width="isCollapse?'64px':'200px'">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="blue"  unique-opened :collapse="isCollapse" :collapse-transition="false" router 
        :default-active="activePath">
            <div class="changeCollapse" @click="toggleCollapse" >|||</div>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePath(subItem.path)">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                </template>
                </el-menu-item>
            </el-submenu>
        
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
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
        iconsObj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        },
        //是否折叠
        isCollapse:false,
        // 激活链接
        activePath:''
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
        
    },
    // 切换列表 折叠状态
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存 连接激活状态
    savePath(path){
      this.activePath = '/' +path 
      // 持久存储
      window.sessionStorage.setItem('path',this.activePath)
    }
 
  },
  created(){
      //请求列表数据
    this.getMenuList()
      //页面刷新时获取 path值
      this.activePath = window.sessionStorage.getItem('path')
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
    .el-menu {
      border-right: 0;
    }
    .changeCollapse {
      text-align: center;
      color:#fff;
      cursor: pointer;
      background: #4A5064;
      font-size: 14px;
      height: 24px;
      line-height: 24px;
      letter-spacing: 2px
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.iconfont {
  margin-right: 10px;
  
}
</style>