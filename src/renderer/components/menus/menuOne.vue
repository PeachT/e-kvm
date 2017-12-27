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
          <div class="title" :class="{'active' : menuId === item.id}">
            <div>
              <i class="el-icon-delete"></i>{{item.name}}</div>
            <div>
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
          <!-- :style="{'padding-top': `${pgNo * 52}px`}" -->
          <div class="items" v-show="menuId === item.id"  @scroll="onScroll($event)" >
            <div style="height: 3120px" :style="{'padding-top': `${pgNo * 52}px`}">
              <li class="item" v-for="(childern, index) in childrenMenuData" :class="{'active' : childrenMenuId === childern.id}" :key="index"
                @click.stop="childernMenuFunc(childern.id)">
                <i class="state" :class="`g${childern.state}`"></i>
                <span>
                  {{ childern.name }}
                </span>
              </li>
            </div>
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
    props: ['menuData', 'childrenMenuData', 'childrenMenuId', 'menuId', 'pgNo'],
    computed: {
      edit() {
        return this.$store.state.global.editState;
      },
    },
    methods: {
      menuFunc(id) {
        const state = this.menuId === id;
        if (state) {
          if (this.edit) {
            this.$message('请完成编辑操作才能切换！');
          } else {
            this.$emit('update:menuId', null);
            this.$emit('update:childrenMenuId', null);
          }
        } else {
          this.$emit('update:menuId', id);
        }
      },
      childernMenuFunc(id) {
        const state = this.childrenMenuId === id;
        if (!state && this.edit) {
          this.$message('请完成编辑操作才能切换！');
        } else {
          this.$message(`${id}`);
          this.$emit('update:childrenMenuId', id);
        }
      },
      onScroll() {
        // const offsetHeight = event.currentTarget.offsetHeight;
        // const scrollHeight = event.target.scrollHeight;
        const scrollTop = event.target.scrollTop;
        // const scrollBottom = offsetHeight + scrollTop;
        // console.log(offsetHeight, scrollHeight, scrollTop, scrollBottom);
        this.$emit('update:pgNo', Math.floor(scrollTop / 1300) * 25);
      },
    },
  };

</script>

