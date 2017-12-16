<template>
  <div class="wh100 menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="header">
        <el-button-group v-if="!edit">
          <el-button type="success" @click="$store.commit('editState', true), $store.commit('addState', true), $emit('add')">添加</el-button>
          <el-button type="primary" @click="$store.commit('editState', true), $emit('edit')" :disabled="!childrenMenuId">编辑</el-button>
          <el-button type="primary" @click="$emit('down')" :disabled="!childrenMenuId">下载</el-button>
          <el-button type="danger" @click="$emit('del')" :disabled="!childrenMenuId">删除</el-button>
        </el-button-group>
        <el-button-group v-if="edit">
          <el-button type="success" @click="$emit('save')">保存</el-button>
          <el-button type="danger" @click=" $emit('cancel')">取消</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <div class="glub" v-for="(item, index) in menuData" :class="{'active' : menuId === item.id}" :key="index" v-show="menuId===null || menuId === item.id"
          @click.stop="menuFunc(item.id)">
          <div class="title">
            <div>
              <i class="el-icon-delete"></i>{{item.name}}</div>
            <div>
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>

          <div class="items" v-show="menuId === item.id">
            <li class="item" v-for="(childern, index) in childrenMenuData" :class="{'active' : childrenMenuId === childern.id}" :key="index"
              @click.stop="childernMenuFunc(childern.id)">
              <i class="el-icon-delete"></i>
              <span>
                {{ childern.name }}
              </span>
            </li>
          </div>
        </div>
      </el-main>
      <el-footer height="33px">
        <el-checkbox-group class="footer">
          <el-checkbox-button v-for="(item, index) in ['未张拉', '张拉中', '已张拉']" :label="item" :key="index">
            {{ item }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'taskmenu',
    props: ['id', 'structureId'],
    data: () => ({
      menuData: [],
      menuId: null,
      childrenMenuData: [],
      childrenMenuId: null,
    }),
    beforeMount() {
      this.getMenuData();
    },
    computed: {
      edit() {
        return this.$store.state.global.editState;
      },
    },
    watch: {
      // 父组件更新数据
      childrenMenuId(nval) {
        this.$emit('update:structureId', this.menuId);
        this.$emit('update:id', nval);
      },
    },
    methods: {
      getMenuData() {
        try {
          const ids = window.tensioningDb.collections.map((item) => {
            return item.name;
          });
          let menuData = [];
          if (ids.length > 0) {
            menuData = window.girderDB.get({
              id: {
                $in: ids,
              },
            }).map((item) => {
              return {
                name: item.name,
                id: item.id,
              };
            });
          }
          console.log(this.childrenMenuId);
          if (menuData.length > 0 && this.childrenMenuId === null) {
            this.childrenMenuId = menuData[0].id;
          }
          this.menuData = menuData;
          this.getChildrenMenuData();
        } catch (error) {}
      },
      getChildrenMenuData() {
        try {
          this.childrenMenuData = window.tensioningDb
            .getCollection(this.menuId).data.map((item) => {
              return {
                name: item.bridgeName,
                id: item.id,
              };
            });
          if (this.childrenMenuId === null) {
            this.childrenMenuId = this.childrenMenuData[0].id;
          }
        } catch (error) {}
      },
      showMenu(id1, id2) {
        console.log(id1, id2);
        this.menuId = id1;
        this.childrenMenuId = id2;
        this.getMenuData();
      },
      menuFunc(id) {
        const state = this.menuId === id;
        if (state) {
          this.menuId = null;
          this.childrenMenuId = null;
        } else {
          this.menuId = id;
          this.getChildrenMenuData();
        }
      },
      childernMenuFunc(id) {
        const state = this.childrenMenuId === id;
        if (!state) {
          if (this.$store.state.global.editState) {
            this.$message('请完成编辑操作才能切换！');
          } else {
            this.$message(`${id}`);
            // this.$emit('update:childrenMenuId', id);
            this.childrenMenuId = id;
          }
          // this.$emit('update:foo', newValue)
        }
      },
    },
  };

</script>

