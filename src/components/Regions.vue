<template>
  <h1>Regions</h1>
  <el-alert type="error" v-if="errorMessage" v-text="errorMessage" />
  <div class="region-list">
    <el-alert type="warning" v-if="!forums.regionList.length">No regions yet</el-alert>
    <div class="region-item" v-for="region of forums.regionList" :key="region.region">
      <p v-text="region.title" @click="handleGoto(region.region)" class="title" />
      <p v-text="region.description" class="desc" />
    </div>
  </div>
</template>

<script lang="ts">
import { getRegions } from "@/api/forum";
import { defineComponent, ref } from "vue";
import { mapState, useStore } from "vuex";
import * as MutationTypes from '@/store/mutation-types';
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    const errorMessage = ref('');

    const handleGoto = (region: string) => {
      router.push(`/r/${region}`);
    }

    return {
      errorMessage,
      handleGoto,
    }
  },
  computed: {
    ...mapState(['forums']),
  },
  async mounted() {
    const result = await getRegions();
    if (result.status === 200) {
      this.$store.commit(MutationTypes.UPDATE_REGIONS_LIST, result.list);
    } else {
      this.$notify.error({
        title: 'Network Error',
        message: 'Failed to fetch regions list'
      });
    }
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.region-item {
  padding: 10px 20px;
  border-left: 2px solid #66ccff;

  .title {
    margin: 0;
    font-size: 1.2rem;
    transition: color .2s;
    cursor: pointer;

    &:hover {
      color: #66ccff;
    }
  }

  .desc {
    margin: 0;
    margin-top: 10px;
    font-size: .8rem;
  }
}

</style>
