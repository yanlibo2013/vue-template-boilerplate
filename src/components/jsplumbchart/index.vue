<template>
  <div class="jsplumb-chart">
    <div class="cavansClass" id="cavans">
      <flowchartNode
        :data="{stepData:stepData}"
        @dblClick="dblClick"
        @copyNode="copyNode"
        @delNode="delNode"
      ></flowchartNode>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import { mapGetters, mapActions, mapState } from "vuex";
import getInstance from "./lib/getInstance";
import _ from "lodash";
import flowchartNode from "./node/flowchatNode/index.vue";
import panzoom from "./lib/pan";
import DragSelect from "dragselect";
import {
  message,
  filterLinkData,
  nodeClass,
  nodeIcon,
  specialNodeClass,
  origin,
  destination,
  addEndpointToNode,
  getNodeType,
  setClass,
  connect
} from "./lib/flowchart";

export default {
  watch: {
    data(val) {
      this.stepData = this.data.steps;
      this.links = this.data.links;
      this.nodeType = this.data.nodeType;
      this.operationType = val.operationType;
      this.containerRect = val.containerRect;
      this.enablePanZoom = val.enablePanZoom;
    },
    stepData(val) {
      this.$emit("modifyChart", {
        stepData: val,
        links: this.links
      });
    },
    links(val) {
      this.$emit("modifyChart", {
        stepData: this.stepData,
        links: val
      });
    },
    selectableObjects(val) {
      if (val.length == 0) {
        this.stepData = _.map(this.stepData, item => {
          delete item.isSelected;
          return item;
        });
        return;
      }

      _.forEach(val, selecteditem => {
        this.stepData = _.map(this.stepData, step => {
          if (selecteditem == step.id) {
            return {
              ...step,
              isSelected: true
            };
          } else {
            return step;
          }
        });
      });
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {
    flowchartNode
    // cepNode
  },
  data: function() {
    return {
      jsplumbInstance: getInstance({
        // container: "workplace",
        container: this.data.container,
        delConnections: this.delConnections,
        completedConnect: this.completedConnect,
        jsPlumb: this.data.jsPlumb
      }),
      stepData: [],
      links: [],
      nodeClass: nodeClass,
      nodeIcon: nodeIcon,
      setClass: setClass,
      instanceZoom: "",
      nodeType: "",
      isPanZoomInit: true,
      cssText: "",
      containerRect: "",
      isDragSelect: true,
      selectableObjects: [],
      startClient: {},
      endClient: {},
      group: {}
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    //this.containerRect = this.jsplumbInstance.getContainer() ? this.jsplumbInstance.getContainer().getBoundingClientRect() : ""
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$nextTick(() => {
      if (this.enablePanZoom && this.containerRect) {
        let lastStep = _.last(this.stepData);
        let result = this.modifyNodePositon({
          x: lastStep.x,
          y: lastStep.y
        });
        this.stepData = _.map(_.cloneDeep(this.stepData), item => {
          if (lastStep.id == item.id) {
            return {
              ...item,
              x: result.x,
              y: result.y
            };
          } else {
            return item;
          }
        });

        this.$emit("modifyJsplumbchartOption", {
          ...this.data,
          steps: this.stepData,
          links: this.links,
          containerRect: ""
        });
      }

      this.drawJsplumbChart(
        {
          ...this.data,
          jsplumbInstance: this.jsplumbInstance,
          self: this,
          flowData: this.stepData,
          links: this.links
        },
        () => {
          this.getLinksData();
          if (this.isDragSelect) {
            this.initDragSelect();
            this.isDragSelect = false;
          }

          if (this.enablePanZoom && this.isPanZoomInit) {
            panzoom.init(this.jsplumbInstance, false);
            this.isPanZoomInit = false;

            if (!this.data.matrix) {
              return;
            }

            this.canvasMoveTo(this.data.matrix, transformOrigin => {
              this.jsplumbInstance.pan.moveTo(
                transformOrigin.x,
                transformOrigin.y
              );
              this.jsplumbInstance.pan.zoomAbs(
                transformOrigin.x,
                transformOrigin.y,
                transformOrigin.scale
              );
            });
          }
        }
      );
    });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    initDragSelect() {
      new DragSelect({
        //multiSelectMode:true,
        area: document.getElementById("cavans"),
        selectables: document.querySelectorAll(".designIconBig"),
        // selector: document.getElementById("selector"),
        onElementSelect: e => {
          this.selectableObjects.push(e.getAttribute("id"));
        },
        onElementUnselect: e => {
          this.selectableObjects = [];
        },
        onDragStart: e => {
          this.startClient = {
            clientX: e.clientX,
            clientY: e.clientY
          };
        },
        onDragMove: e => {
          this.endClient = {
            clientX: e.clientX,
            clientY: e.clientY
          };

          let dx = Math.abs(this.endClient.clientX - this.startClient.clientX);
          let dy = Math.abs(this.endClient.clientY - this.startClient.clientY);

          //console.log(dx,dy);
          this.group = {
            dx: dx,
            dy: dy
          };
        },
        multiSelectKeys:["shiftKey"]
        //multiSelectKeys: ["ctrlKey", "shiftKey", "metaKey"] // special keys that allow multiselection.
      });
    },
    getScale(instance) {
      let container = instance.getContainer();
      let scale1;
      if (instance.pan) {
        const { scale } = instance.pan.getTransform();
        scale1 = scale;
      } else {
        const matrix = window.getComputedStyle(container).transform;
        scale1 = matrix && matrix.split(", ")[3] * 1;
      }
      instance.setZoom(scale1);
      return scale1;
    },

    modifyNodePositon(val) {
      let jsplumbInstance = this.jsplumbInstance;
      const containerRect = this.containerRect;
      let scale = this.getScale(this.jsplumbInstance);
      let left = (val.x - containerRect.left) / scale;
      let top = (val.y - containerRect.top) / scale;
      left -= 20;
      top -= 25;
      return {
        x: left,
        y: top
      };
    },
    canvasMoveTo(data, fn) {
      fn(data);
    },
    setCavansMatrix(data) {
      let source = _.filter(data, val => {
        return val.type == "source";
      });

      return source[0].stepSettings && source[0].stepSettings.matrix;
    },
    setNodeTemplate(val) {
      switch (val) {
        case "flowchartnode":
          return flowchartNode;
        case "cepNode":
          return cepNode;
        default:
          "";
      }
    },
    drawJsplumbChart(data, connectCallback) {
      addEndpointToNode(
        data.jsplumbInstance,
        data.self,
        data.flowData,
        data.flowType,
        val => {
          this.stepData = _.map(this.stepData, item => {
            if (item.id == val.id) {
              return {
                ...item,
                x: val.x,
                y: val.y
              };
            } else {
              return item;
            }
          });
        },
        _
      );
      connect(data.jsplumbInstance, data.self, data.links, connectCallback);
    },
    completedConnect() {
      this.getLinksData();
    },
    delConnections(val, fn) {
      fn();
      this.getLinksData();
    },
    delNode(val) {
      this.stepData = _.filter(_.cloneDeep(this.stepData), item => {
        return item.id != val;
      });
    },
    dblClick(val) {
      this.$emit("nodedblClick", val);
    },
    getLinksData() {
      this.links = filterLinkData(
        _.map(this.jsplumbInstance.getAllConnections(), item => {
          return {
            name: item.id,
            source: item.sourceId,
            sourceOutput: item.endpoints[0].canvas.nextSibling.textContent,
            target: item.targetId,
            targetInput: item.target.dataset.type,
            input: item.endpoints[1].canvas.nextSibling.textContent
          };
        }),
        _
      );
    },
    reset() {
      this.stepData = [];
      this.links = [];
      this.jsplumbInstance.deleteEveryEndpoint("workplace");
    },

    copyNode(val) {
      let node = {
        ...val,
        x: val.x + 50,
        y: val.y + 50,
        id: val.type + "_" + (this.stepData.length + 1) + "_copy"
        // id: "rtc_" + val.type + "_" + (this.stepData.length + 1)
      };
      this.$emit("handleDrop", node);
    },
    setLineSplit(step) {
      //console.log("setLineSplit(step){", step); //outputConfigurations

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
.jsplumb-chart {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;

  .cavansClass {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>
