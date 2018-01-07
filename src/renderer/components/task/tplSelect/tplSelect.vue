<template>
  <div>
    <el-dialog title="模板选择" :visible="true" width="80%">
      <div>
        选择构件
        <el-radio-group v-model="menuId" size="medium">
          <el-radio-button :label="item.id" v-for="(item, index) in menuData" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
        <div v-if="getChildrenMenuData">
          <hr> 选择模板
          <el-radio-group v-model="nowData" size="medium">
            <el-radio-button :label="item.data" v-for="(item, index) in getChildrenMenuData" :key="index">{{item.name.split('-')[0]}}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="nowData">
          <hr>
          梁号：
          <el-input v-model="nowData.bridgeName"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:show', false), $emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="$emit('addOk')">不使用模板</el-button>
        <el-button type="primary" @click="$emit('addOk', nowData, menuId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'tplSelect',
    props: ['show'],
    computed: {
      menuData() {
        try {
          const tplData = window.tplDB.reverseGetAll().map((item) => {
            return item.structureId;
          });
          console.log(tplData);
          const menuData = [];
          window.girderDB.reverseGetAll().map((item) => {
            console.log(tplData.indexOf(item.id), item.id);
            if (tplData.indexOf(item.id) > -1) {
              menuData.push({
                name: item.name,
                id: item.id,
              });
            }
            return null;
          });
          // console.log(this.menuData);
          return menuData;
        } catch (error) { return []; }
      },
      getChildrenMenuData() {
        this.nowData = null;
        try {
          return window.tplDB.get({
            structureId: this.menuId,
          });
        } catch (error) { return []; }
      },
    },
    data() {
      return {
        menuId: null,
        nowData: null,
        name: '',
      };
    },
    methods: {
    },
  };

</script>

