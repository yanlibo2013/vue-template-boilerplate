<template>
  <div
    class="group-container"
    :style="!collapsed?collapsedStyle:expandStyle"
    :group="groupItem.id"
    :ref="groupItem.id"
  >
    <div class="title">{{groupItem.id}}</div>
    <div class="del" delete-all @click="delNode(groupItem)"></div>
    <div class="node-collapse" @click="groupCollapse(groupItem.id)"></div>
    <div id="c1_1" class="w" style="left:30px;top:35px">1.1</div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  // watch: {
  //   groupItem(val) {
  //     this.$nextTick(() => {
  //       //this.drawJsplumbChartGroup();
  //       console.log(this.$refs[groupItem.id]);
  //     });
  //   }
  // },
  props: {
    groupItem: {
      type: Object,
      default: {}
    },
    jsplumbInstance: {
      type: Object,
      default: {}
    }
  },
  components: {},
  data: function() {
    return {
      collapsed: true,
      expandStyle:
        "left:" +
        this.groupItem.x +
        "px;top:" +
        this.groupItem.y +
        "px;height:" +
        this.groupItem.subflow.height +
        "px;width:" +
        this.groupItem.subflow.width +
        "px",
      collapsedStyle:
        "left:" + this.groupItem.x + "px;top:" + this.groupItem.y + "px;"
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    this.drawJsplumbChartGroup();
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    // this.$nextTick(() => {
    //   //this.drawJsplumbChartGroup();
    //      console.log(this.$refs[item.id]);
    // });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    delNode(val) {
      this.$emit("delNode", val);
    },
    groupCollapse(val) {
      //console.log(this.$refs[val]);
      let j = this.jsplumbInstance;
      let parentNode = this.$refs[val];

      let g = parentNode.getAttribute("group"),
        collapsed = j.hasClass(parentNode, "collapsed");
      j[collapsed ? "removeClass" : "addClass"](parentNode, "collapsed");
      j[collapsed ? "expandGroup" : "collapseGroup"](g);
      this.collapsed = collapsed;
    },
    drawJsplumbChartGroup() {
      let j=this.jsplumbInstance;
      j.draggable("c1_1");
      j.addGroup({
        el: this.$refs[this.groupItem.id],
        id: this.groupItem.id,
        constrain: true
      });

      j.addToGroup(this.groupItem.id, c1_1);
    }
  }
};
</script>

<style lang="scss">

.group-container {
  position: absolute;
  height: 40px;
  width: 200px;
  border-radius: 12px;
  background-color: WhiteSmoke;
  font-size: 12px;
  cursor: move;

  .w {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 1px solid black;
  font-size: 12px;
  border-radius: 3px;
  text-align: center;
  background-color: WhiteSmoke;
  opacity: 0.7;
  z-index: 10;
  color: black;
  cursor: move;
}
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

// .group-container.collapsed {
//   height: 40px;
//   width: 200px;
// }

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
