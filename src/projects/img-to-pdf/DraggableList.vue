<template>
  <div class="flex flex-col gap-2">
    <draggable
      v-model="localItems"
      item-key="id"
      class="rounded"
      handle=".drag-handle"
      @update:modelValue="emitUpdate"
    >
      <template #item="{ element }">
        <ThumbnailItem
          :image="element.image"
          :header="element.header"
          :description="element.description"
          :expand="expandImages"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue'
import draggable from 'vuedraggable'
import ThumbnailItem from './ThumbnailItem.vue'

export default defineComponent({
  name: 'DraggableList',
  components: { draggable, ThumbnailItem },
  props: {
    items: {
      type: Array,
      required: true
    },
    expandImages: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localItems: [...this.items]
    }
  },
  watch: {
    items: {
      handler(newItems) {
        this.localItems = [...newItems]
      },
      immediate: true
    }
  },
  methods: {
    emitUpdate() {
      this.$emit('update:items', this.localItems)
    }
  }
})
</script>