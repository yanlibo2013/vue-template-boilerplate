<template>
  <div class="jsplumb-chart">
    <div class="cavansClass" id="cavans">
      <flowchartNode
        :data="{stepData:stepData,jsplumbInstance:jsplumbInstance}"
        @dblClick="dblClick"
        @copyNode="copyNode"
        @delNode="delNode"
        @modifyStepData="modifyStepData"
        v-show="nodeType=='flowchartnode'"
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
      containerRect: ""
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
      console.log(" this.$nextTick(() => {");
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

      // this type is not group
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
          if (this.enablePanZoom && this.isPanZoomInit) {
            let pan = panzoom.init(this.jsplumbInstance, false);
            if (!pan) {
              return;
            }
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

      let stepGroup = _.filter(this.stepData, val => {
        return val.type == "group";
      });

      if (stepGroup.length != 0) {
        this.drawJsplumbChart(
          {
            ...this.data,
            jsplumbInstance: this.jsplumbInstance,
            self: this,
            flowData: stepGroup[0].subflow.steps,
            links: stepGroup[0].subflow.links
          },
          () => {
            this.getLinksData();
            // if (this.enablePanZoom && this.isPanZoomInit) {
            //   let pan=panzoom.init(this.jsplumbInstance, false);
            //   if(!pan){
            //     return;
            //   }
            //   this.isPanZoomInit = false;

            //   if (!this.data.matrix) {
            //     return;
            //   }

            //   this.canvasMoveTo(this.data.matrix, transformOrigin => {
            //     this.jsplumbInstance.pan.moveTo(
            //       transformOrigin.x,
            //       transformOrigin.y
            //     );
            //     this.jsplumbInstance.pan.zoomAbs(
            //       transformOrigin.x,
            //       transformOrigin.y,
            //       transformOrigin.scale
            //     );
            //   });
            // }
          }
        );
      }
    });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    modifyStepData(val) {
      this.stepData = val;
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
        (val, step) => {
          if (step.type === "group") {
            this.stepData = _.map(this.stepData, item => {
              if (item.id == step.id) {
                return {
                  ...item,
                  subflow: {
                    ...step.subflow,
                    steps: _.map(step.subflow.steps, subitem => {
                      if (subitem.id == val.id) {
                        return {
                          ...subitem,
                          x: val.x,
                          y: val.y
                        };
                      } else {
                        return subitem;
                      }
                    })
                  }
                };
              } else {
                return item;
              }
            });
          } else {
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
          }
        },
        _
      );

      // if(!_.last(data.steps)||_.last(data.steps).type=="group"){
      //   return;
      // }
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
        return item.id != val.id;
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
