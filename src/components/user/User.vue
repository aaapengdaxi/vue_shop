<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 如果是布尔值 是渲染不出来的 -->
        <el-table-column prop="mg_state" label="状态">
          <!-- element ui 写好了后台 直接使用就可以了 -->
          <template slot-scope="scope">
            <!-- scope.row 就是这一行的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="editSwtich(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 设置按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <!-- size-change 设置每页条数 -->
      <!-- current-change 当前页面 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户区域 -->
     <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
          >
            <!--  主体区域 -->
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "", //查询关键字
        pagenum: 1, // 当前页数
        pagesize: 2 //每一页几个数据
      },
      usersList: [],
      total: 0, //数据总条数
      dialogVisible:false
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败");
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    // 监听分页条数
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      // 重新获取数据
      this.getUserList();
    },
    // 实现页码切换
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      // 重新获取数据
      this.getUserList();
    },
    // 修改用户状态
    async editSwtich(res) {
      console.log(res);
      // 发送请求
      let { data: result } = await this.$http.put(
        `users/${res.id}/state/${res.mg_state}`
      );
      console.log(result);
      if (result.meta.status != 200) {
        res.mg_state = !res.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    }

  },
    // 生命周期钩子函数
  created() {
    this.getUserList();
  }
};
</script>
<style scoped lang="less">
</style>