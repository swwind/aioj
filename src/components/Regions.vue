<template>
  <h1>Regions</h1>
  <el-alert type="error" v-if="errorMessage" v-text="errorMessage" />
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
import { useRouter } from 'vue-router';
import { RegionDetail } from 'app/db';

export default defineComponent({
  setup() {
    const router = useRouter();

    const errorMessage = ref('');
    const regionlist = ref([] as RegionDetail[]);

    const handleGoto = (region: string) => {
      router.push(`/r/${region}`);
    };

    return {
      errorMessage,
      handleGoto,
      regionlist,
    };
  },
  async mounted() {
    const result = await getRegions();
    if (result.status === 200) {
      this.regionlist = result.list;
    } else {
      this.$notify.error({
        title: 'Network Error',
        message: 'Failed to fetch regions list',
      });
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
