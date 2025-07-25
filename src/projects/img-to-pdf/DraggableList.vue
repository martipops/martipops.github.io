<template>
  <div class="">
    <h2 class="mb-2">Drag & Sort List</h2>
    <draggable
      v-model="localItems"
      item-key="id"
      class="rounded"
      :animation="200"
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
import { defineComponent, ref, watch } from 'vue'
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
  setup(props, { emit }) {
    const localItems = ref([...props.items])

    watch(
      () => props.items,
      (newItems) => {
        localItems.value = [...newItems]
      }
    )

    const emitUpdate = (newItems: any[]) => {
      emit('update:items', newItems)
    }

    return { localItems, emitUpdate }
  }
})
</script>