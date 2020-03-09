<template>
  <div class="flowchart-node" id="flowchartnode">
    <div
      v-for="(item,index) in stepData"
      :id="item.id"
      :key="index"
      :group="item.type==='group'?item.id:''"
      :class="item.type==='group'?'group-container':'designIconBig '+setClass(nodeClass(item.type))"
      :data-sign="item.name"
      :data-type="item.type"
      :style="'left:'+item.x+'px;top:'+item.y+'px;position:absolute;margin:0'"
      @dblclick="dblClick(item)"
      @click.ctrl="multSe3lectStep(item)"
      @mouseup="mouseUpStep"
    >
      <!-- node -->

      <vitem
        v-if="item.type!='group'"
        :item="item"
        @copyNode="copyNode"
        @delNode="delNode"
        @setLineSplit="setLineSplit"
      ></vitem>

      <!-- group -->

      <div v-else>
        <!-- <div class="title">{{item.id}}</div>
        <div class="del" @click="delNode(item.id)"></div>
        <div class="node-collapse"></div>-->

        <div class="title">{{item.id}}</div>
        <div class="del" @click="delNode(item)"></div>
        <!-- <div class="node-collapse"></div> -->
        <div class="collapsed node-collapse"></div>
        <div
          v-for="(subitem,index) in item.subflow.steps"
          :id="subitem.id"
          :key="index"
          :class="subitem.type==='group'?'group-container':'designIconBig '+setClass(nodeClass(subitem.type))"
          :data-sign="subitem.name"
          :data-type="subitem.type"
          :style="'left:'+subitem.x+'px;top:'+subitem.y+'px;position:absolute;margin:0'"
          @dblclick="dblClick(subitem)"
        >
          <vitem
            :item="subitem"
            :itemType="'group'"
            @copyNode="copyNode"
            @delNode="delNode"
            @setLineSplit="setLineSplit"
          ></vitem>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import _ from "lodash";
import { setClass, nodeClass, nodeIcon } from "../../lib/flowchart";
import vitem from "./item";
export default {
  watch: {
    data(val) {
      this.stepData = val.stepData;
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {
    vitem
  },
  data: function() {
    return {
      stepData: [],
      nodeClass: nodeClass,
      nodeIcon: nodeIcon,
      setClass: setClass,
      mulSelect: false
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    this.$nextTick(() => {
      this.initEvent();
    });
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),

    initEvent() {
      document.getElementById("cavans").onmousedown = e => {
        this.mousedownBody(e);
      };
    },
    mousedownBody(event) {
      if (this.mouserOverConnect) {
        return;
      }

      this.stepData = _.map(this.stepData, item => {
        delete item.isSelected;
        return item;
      });
    },
    delAllselected(data) {
      this.stepData = _.filter(data, item => {
        return !item.isSelected;
      });
    },

    mouseUpStep() {
      this.mulSelect = false;
    },
    multSe3lectStep(val) {
      this.mulSelect = true;
      this.selectCurrentStep(val);
      this.$emit("modifyStepData", this.stepData);
    },
    selectCurrentStep(val) {
      if (this.isDeleCopyStep) {
        return;
      }
      this.stepData = _.map(this.stepData, item => {
        if (val.id == item.id) {
          return {
            ...item,
            isSelected: true
          };
        } else {
          if (!this.mulSelect) {
            delete item.isSelected;
          }

          return item;
        }
      });
    },
    // delGroup(jsplumbInstance,id) {
    //   jsplumbInstance.removeGroup(id, true);
    // },jsplumbInstance
    delNode(val) {
      // console.log(' delNode(val) {',val);
      // console.log('this.jsplumbInstance',this.data.jsplumbInstance);
      // // //jsplumbInstance.removeGroup(dataIndex, true);if (_.isEmpty(jsplumbInstance._groups && jsplumbInstance._groups[dataIndex])) {
      if(val.type=="group"){
       this.data.jsplumbInstance.removeGroup(val.id, true);
      }
      this.$emit("delNode", val.id);
    },
    dblClick(val) {
      if(val.type=="group"){
        return;
      }
      this.$emit("dblClick", val);
    },
    copyNode(val) {
      this.$emit("copyNode", val);
    },

    setLineSplit(step) {
      if (step.type == "split") {
        let outputConfigurations = _.toArray(step.outputConfigurations);

        switch (outputConfigurations.length) {
          case 21:
          case 20:
            return "height: 280px; top: -100px;";
          case 19:
          case 18:
          case 17:
            return "height: 270px; top: -95px;";

          case 16:
          case 15:
            return "height: 270px; top: -90px;";
          case 14:
          case 13:
          case 12:
            return "height: 190px; top: -50px;";
          case 11:
          case 10:
            return "height: 155px; top: -43px;";
          case 9:
          case 8:
            // case 7:
            return "height: 120px; top: -35px;";
          case 7:
          case 6:
          case 5:
            return "height: 120px; top: -25px;";
          default:
            return "height: 70px; top: 0px;";
        }
      }
    }
  }
};
</script>

<style lang="scss">
.flowchart-node {
  height: 100%;
  width: 100%;
  position: relative;
  // ////////////////////////node style begin///////////////////
  .designIconBig {
    height: 70px;
    width: 150px;
    margin: 0 auto;
    padding: 12px;
    box-sizing: border-box;
    box-shadow: 0 10px 18px -9px rgba(0, 0, 0, 0.5);
    background: #ffffff;
    text-align: center;
    position: absolute;
    margin-right: 15px;
    margin-bottom: 20px;
    float: left;
    cursor: pointer;
  }

  .designIconBig i {
    float: none !important;
    position: absolute;
    left: 5px;
    top: 8px;
    width: 30px !important;
    height: 30px !important;
    line-height: 30px !important;
    font-size: 30px !important;
  }

  .designIconBig h4 {
    position: absolute;
    top: 5px;
    left: 38px;
    margin: 0px;
    padding: 2px 0;
    width: 110px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .designIconBig h5 {
    position: absolute;
    top: 25px;
    left: 38px;
    margin: 0px;
    padding: 0px;
    width: 110px;
    text-align: left;
    font-size: 12px;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .designIconBig #removeDes {
    position: absolute;
    top: 46px;
    right: 15px;
    font-size: 14px;
    color: #b9c0d8;
    margin: 0px;
    padding: 0px;
  }

  .designIconBig #copeDes {
    position: absolute;
    top: 45px;
    right: 35px;
    font-size: 14px;
    color: #b9c0d8;
    margin: 0px;
    padding: 0px;
  }
  .designIconBig #pitchOnDes {
    position: absolute;
    top: 47px;
    right: 60px;
    font-size: 14px;
    color: #b9c0d8;
    margin: 0px;
    padding: 0px;
  }
  .desingIconBig #markDes {
    position: absolute;
    top: 45px;
    right: 20px;
    font-size: 14px;
    color: #b9c0d8;
    margin: 0px;
    padding: 0px;
  }

  .t1Style {
    border: 2px solid #48c038;
    color: #48c038;
    border-radius: 2px;
  }
  .t2Style {
    border: 2px solid #4586f3;
    color: #4586f3;
    border-radius: 2px;
  }
  .t3Style {
    border: 2px solid #8367df;
    color: #8367df;
    border-radius: 2px;
  }

  .redStyle {
    border: 2px solid red;
  }
  .designIconBg {
    position: absolute;
    color: #ffffff !important;
  }

  .designIconBig #removeDes:hover {
    color: #ff4e4e;
  }

  .designIconBig #copeDes:hover {
    color: #ff4e4e;
  }

  .designIconBig #pitchOnDes:hover {
    color: #ff4e4e;
  }

  // ////////////////////////node style end///////////////////

  .line-split {
    position: absolute;
    height: 100px;
    width: 2px;
    background: #4586f3;
    right: -2px;
    top: 0;
  }

  .jtk-endpoint {
    // z-index: 12;
    // opacity: 0.8;
    cursor: default;
  }

  .resize {
    width: 8px;
    height: 8px;
    background-color: #ddd;
    border: 1px solid #000;
    position: absolute;
    &.left {
      top: 50%;
      left: -4px;
      cursor: ew-resize;
    }
    &.right {
      top: 50%;
      right: -4px;
      cursor: ew-resize;
    }
    &.top {
      top: -4px;
      left: 50%;
      margin-left: -4px;
      cursor: ns-resize;
    }
    &.bottom {
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
      cursor: ns-resize;
    }
  }

  ////////////////////////////////group start//////////////////////

.group-container {
  position: absolute;
  width: 1000px;
  height: 700px;
  border-radius: 12px;
  background-color: WhiteSmoke;
  font-size: 12px;
  cursor: move;
      z-index: 9999;

  ul {
    margin-left: 25px;
    padding: 0;

    li {
      list-style-type: circle;
      margin-bottom: 7px;
    }
  }
}

.large {
  width: 600px;
  height: 600px;
}

.group-container.collapsed {
  height: 40px;
}

.title {
  background-color: #abc1bb;
  padding-right: 16px;
  font-size: 13px;
  height: 30px;
}

.del, .node-collapse {
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
  .w, ul, .container, .name {
    display: none;
  }
}

.jtk-drag-hover {
  outline: 4px solid cornflowerblue;
}

.katavorio-ghost-proxy {
  outline: 2px solid red;
}

.events {
  position: absolute;
  right: 0;
  top: 0;
  border-left: 4px solid #58775d;
  bottom: 0;
  width: 156px;
  font-size: 11px;
  padding-left: 11px;
  background-color: white;
}

#events {
  position: absolute;
  right: 0;
  top: 0;
  border-left: 1px solid #58775d;
  bottom: 0;
  width: 256px;
  font-size: 11px;
  padding-left: 11px;
  background-color: white;
}

.events h3 {
  font-size: 20px;
  margin-top: 10px;
}
}
</style>
