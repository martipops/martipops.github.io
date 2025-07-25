<template>
  <div class="flex justify-between items-stretch p-2 gap-2 bg-neutral-700 rounded mb-2">
    <div class="flex items-center gap-2">
      <img
        :src="image"
        :alt="header"
        :class="expand
          ? 'w-20 h-20 object-cover rounded mr-3'
          : 'w-12 h-12 object-cover rounded mr-3'"
      />
      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <div class="font-bold text-neutral-100 truncate">{{ header }}</div>
        <div class="text-neutral-300 text-xs truncate">{{ description }}</div>
      </div>
    </div>
    <div class="flex items-center justify-center self-stretch px-2 cursor-move">
      <IconHamburger class="drag-handle stroke-current text-neutral-200 w-12 h-full"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconHamburger from '../../components/svg/IconHamburger.vue';

export default defineComponent({
  name: 'ThumbnailItem',
  components: { IconHamburger },
  props: {
    image: { type: String, required: true },
    header: { type: String, required: true },
    description: { type: String, required: true },
    expand: { type: Boolean, default: false }
  }
})
</script>