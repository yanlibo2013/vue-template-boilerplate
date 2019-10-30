<template>
  <div class="page1">
    <h1>page1</h1>
    <div class="box .hairlines"></div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  name: "page1",
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: {},
  data: function() {
    return {};
  },
  computed: {
    ...mapState([""])
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
.page1 {
  .box{
    height: 150px;
    background: red;
  }
}
</style>
