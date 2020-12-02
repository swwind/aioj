<template>
  <h1>Regions</h1>
  <div class="region-list">
    <el-alert type="warning" v-if="!regionlist.length">No regions yet</el-alert>
    <div class="region-item" v-for="region of regionlist" :key="region.region">
      <router-link :to="`/r/${region.region}`" class="title">{{ region.title }}</router-link>
      <p class="desc">{{ region.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { getRegions } from '@/api/forum';
import { defineComponent, ref } from 'vue';
import { RegionDetail } from '../../app/types';
import { handleNetworkRequestError } from '@/utils';
import { mapState } from 'vuex';

export default defineComponent({
  setup() {
    const regionlist = ref([] as RegionDetail[]);

    return {
      regionlist,
    };
  },
  computed: {
    ...mapState(['i18n']),
  },
  async mounted() {
    const result = await getRegions();
    if (result.status === 200) {
      this.regionlist = result.list;
    } else {
      handleNetworkRequestError(this.i18n.lang, result);
    }
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.region-item {
  padding: 10px 20px;
  border-left: 2px solid #66ccff;

  .title {
    margin: 0;
    font-size: 1.5rem;
  }

  .desc {
    margin: 0;
    margin-top: 10px;
    font-size: .8rem;
  }
}

</style>
