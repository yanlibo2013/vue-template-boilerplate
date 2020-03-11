<template>
  <div class="group-container" :style="'left:'+groupItem.x+'px;top:'+groupItem.y+'px;'">
    <div class="title">{{groupItem.id}}</div>
    <div class="del" @click="delNode(groupItem)"></div>
    <div class="node-collapse"></div>
    <!-- <div id="c1_1" class="w" style="left:30px;top:35px">1.1</div> -->
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
    return {};
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
    delNode(val) {
      console.log('delNode(val) {',val)
      this.$emit("delNode", val);
    }
  }
};
</script>

<style lang="scss">
.group-container {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  background-color: WhiteSmoke;
  font-size: 12px;
  cursor: move;
}

.group-container ul {
  margin-left: 25px;
  padding: 0;
}

.group-container ul li {
  list-style-type: circle;
  margin-bottom: 7px;
}

/* .large {
  width: 600px;
  height: 600px;
} */

.group-container.collapsed {
  height: 40px;
}

.title {
  background-color: #abc1bb;
  padding-right: 16px;
  font-size: 13px;
  height: 30px;
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
}

.node-collapse:after {
  content: "-";
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

.jtk-group-collapsed .w,
.jtk-group-collapsed ul,
.jtk-group-collapsed .container,
.jtk-group-collapsed .name {
  display: none;
}

.jtk-drag-hover {
  outline: 4px solid cornflowerblue;
}
</style>
