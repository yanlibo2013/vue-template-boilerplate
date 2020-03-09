<template>
  <div>
    <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
    <i
      id="changeSte"
      :class="nodeIcon(item.type) == 'iconTrue'?'icon iconfont icon-ir-d-'+item.type:'icon iconfont icon-ir-d-default'"
    ></i>
    <h4 :title="item.name">{{item.name}}</h4>
    <h5>ID:{{item.id}}</h5>
    <em
      id="copeDes"
      class="icon iconfont icon-ir-copy"
      title="复制"
      @click.prevent="copyNode(item)"
      v-show="itemType!='group'"
    ></em>
    <em
      id="removeDes"
      class="fa fa-trash-o"
      title="删除"
      @click="delNode(item)"
      v-show="itemType!='group'"
    ></em>

    <div class="line-split" v-show="item.type=='split'" :style="setLineSplit(item)"></div>

    <div v-show="item.isSelected" class="resize top"></div>
    <div v-show="item.isSelected" class="resize left"></div>
    <div v-show="item.isSelected" class="resize bottom"></div>
    <div v-show="item.isSelected" class="resize right"></div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { setClass, nodeClass, nodeIcon } from "../../lib/flowchart";
export default {
  watch: {
    // data(val) {
    //   console.log(' data(val) { item',val);
    //   this.item = val.item;
    // }
  },
  props: {
    item: {
      type: Object,
      default: false
    },
    itemType: {
      type: String
    }
  },
  components: {},
  data: function() {
    return {
      //   item: "",
      nodeIcon: nodeIcon
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
  updated() {
    //  this.$nextTick(() => {
    //    console.log(" updated() { this.$nextTick(() => { item");
    //  });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    copyNode(val) {
      this.$emit("copyNode", val);
    },
    delNode(val) {
      this.$emit("delNode", val);
    },
    setLineSplit(val) {
      this.$emit("setLineSplit", val);
    }
  }
};
</script>

<style lang="scss">
</style>
