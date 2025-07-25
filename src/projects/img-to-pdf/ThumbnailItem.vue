<template>
  <div class="flex items-center mb-2 p-2 bg-neutral-700 rounded cursor-move">
    <img
      :src="image"
      :alt="header"
      :class="expand
        ? 'w-20 h-20 object-cover rounded mr-3'
        : 'w-12 h-12 object-cover rounded mr-3'"
    />
    <div class="flex-1 min-w-0">
      <div class="font-bold text-neutral-100 truncate">{{ header }}</div>
      <div class="text-neutral-300 text-xs truncate">{{ description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThumbnailItem',
  props: {
    image: { type: String, required: true },
    header: { type: String, required: true },
    description: { type: String, required: true },
    expand: { type: Boolean, default: false }
  }
})
</script>