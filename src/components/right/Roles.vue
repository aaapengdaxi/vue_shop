<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolesList" style="width: 100%" stripe>
          <!--展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for="item1 in scope.row.children" :key="item1.id" class="level_one">
                    <!-- 一级 -->
                    <el-col :span="6">
                        <el-tag>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 二级跟三级一起 -->
                    <el-col :span="18">
                        <el-row v-for="item2 in item1.children" :key="item2.id" class="level_two">
                            <!-- 二级 -->
                            <el-col :span="6">
                                <el-tag type="success">{{item2.authName}}</el-tag>
                                 <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 三级 -->
                            <el-col :span="18">
                                <el-tag type="danger" v-for="item3 in item2.children" :key="item3.id" closable  @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                             
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: []
    };
  },
  methods: {
    //   获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },
    // 通过id删除权限
    removeRightById(role,rightId){
        // 确认删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            // 确认了删除 
           let {data:res} =   await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
           if(res.meta.status != 200) return this.$message.error('删除权限失败')
            // 重新赋值
            role.children = res.data
            // 删除成功
            this.$message.success('删除权限成功')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>
<style scoped lang="less">
.el-tag {
    margin:10px
}
.level_one {
    border-bottom: 1px solid #ccc
}
.level_two {
    border-bottom: 1px solid #ccc;
}
.level_two:last-child {
    border-bottom: none;
}
</style>