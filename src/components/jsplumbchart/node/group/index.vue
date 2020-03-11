<template>
  <!-- <div class="group">
    <div
      class="group-container"
      v-for="(item,index) in groupData"
      :key="index"
      :style="'left:'+item.x+'px;top:'+item.y+'px;'"
    >
      <div class="title">{{item.id}}</div>
      <div class="del" @click="delNode(item)"></div>
      <div class="collapsed node-collapse"></div>
    </div>
  </div>-->

  <div class="group-container" :style="'left:'+groupItem.x+'px;top:'+groupItem.y+'px;'">
    <div class="title">{{groupItem.id}}</div>
    <div class="del" @click="delNode(groupItem)"></div>
    <div class="collapsed node-collapse"></div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
//   watch: {
//     data(val) {
//     }
//   },
  props: {
    groupItem: {
      type: Object,
      default: {}
    }
  },
  components: {},
  data: function() {
    return {
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
  }
};
</script>

<style lang="scss">
  .group-container {
    position: absolute;
    width: 250px;
    height: 70px;
    .collapsed {
      height: 40px;
    }
  }

  .title {
    background-color: #abc1bb;
    padding: 0 16px;
    font-size: 13px;
    height: 30px;
    line-height: 30px;
  }

  .del,
  .node-collapse {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: white;
    padding: 1px;
    cursor: pointer;
    font-size: 13px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    display: block;
  }

  .del:after {
    content: "X";
  }

  .node-collapse {
    right: 29px;
    text-align: center;

    &:after {
      content: "-";
    }
  }

  .group-container.collapsed .node-collapse:after {
    content: "+";
  }

  .del[delete-all] {
    background-color: pink;
  }

  .jtk-connector path {
    stroke-width: 1;
  }

  .jtk-group-collapsed {
    .w,
    ul,
    .container,
    .name {
      display: none;
    }
  }

  .jtk-drag-hover {
    outline: 4px solid cornflowerblue;
  }
</style>
