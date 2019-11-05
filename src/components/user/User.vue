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
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditForm(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
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
    <!-- 添加用户对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetAddForm"
      ref="addFormRef"
    >
      <!--  主体区域 -->
      <el-form ref="addFormRef" :model="addFormData" label-width="70px" :rules="addFormRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" :model="editFormData">
      <!-- 主体内容区域 -->
      <el-form
        ref="editFormRef"
        :model="editFormData"
        label-width="70px"
        :rules="editFormRules"
        @close="resetEditForm"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFormData.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      //验证通过
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      // 验证通过
      if (regMobile.test(value)) {
        return cb();
      }
      // 验证失败
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "", //查询关键字
        pagenum: 1, // 当前页数
        pagesize: 2 //每一页几个数据
      },
      usersList: [],
      total: 0, //数据总条数
      dialogVisible: false,
      // 添加用户数据
      addFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度在3~15个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6到16位", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 修改用户对话框
      editDialogVisible: false,
      // 修改用户表单数据
      editFormData: {},
      // 修改用户表单规则
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度在3~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
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
    },
    // 重置添加用户对话框
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    // 实现添加用户
    addUser() {
      // 实现表单预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单验证未通过");
        // 发送请求添加用户
        let { data: res } = await this.$http.post("users", this.addFormData);
        if (res.meta.status != 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        // 重新获取数据
        this.getUserList();
        // 关闭对话框
        this.dialogVisible = false;
      });
    },
    // 展示修改对话框
    async showEditForm(id) {
      this.editDialogVisible = true;
      // 发送请求获取对应id的数据
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200) return this.$message.error("获取用户失败");
      this.editFormData = res.data;
    },
    // 重置修改用户表单
    resetEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    // 实现修改用户
    editUser() {
      // 修改用户预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("验证未通过");
        // 获取这个用户的id
        var id = this.editFormData.id;
        // 发送请求修改用户
        let { data: res } = await this.$http.put(
          `users/${id}`,
          this.editFormData
        );
        if (res.meta.status != 200) return this.$message.error("修改用户失败");
        // 成功
        this.$message.success("修改用户成功");
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    // 实现删除用户
    async delUser(id) {
       const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>console.log(err))
      if(confirmResult!='confirm')return this.$message.info('已取消了删除')
      console.log('确定了删除')
      //  发送请求删除用户
      let { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status != 200) return this.$message.error("删除用户失败");
      this.$message.success("删除成功");
      // 解决删除最后一页的bug
      this.queryInfo.pagenum = 1 
      // 重新获取数据
      this.getUserList()
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