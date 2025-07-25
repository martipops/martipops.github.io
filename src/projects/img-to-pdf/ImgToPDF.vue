<template>
  <div class="p-4">
    <h2 class="mb-2">Images to PDF</h2>
    <div class="grid grid-cols-2 grid-rows-1 gap-8">
      <div class="flex flex-col">
        
        <label
          class="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-500 rounded-lg bg-neutral-800 cursor-pointer hover:border-blue-500 transition mb-4"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <span class="text-neutral-300 text-lg mb-2">Click or Drag & Drop Images Here</span>
          <input
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="onFilesSelected"
          />
          <span class="text-neutral-400 text-xs">Supported: JPG, PNG, GIF, etc.</span>
        </label>
        <div class="flex gap-2">
          <button
            class="p-2 bg-blue-600 text-white rounded"
            :disabled="draggableItems.length === 0"
            @click="generatePdf"
            >
            Download PDF
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <button
            class="p-2 bg-green-600 text-white rounded grow"
            @click="expandImages = !expandImages"
          >Toggle Image Expansion</button>
        <DraggableList
          v-if="images.length"
          :items="draggableItems"
          :expandImages="expandImages"
          @update:items="updateDraggableItems"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import jsPDF from 'jspdf'
import DraggableList from './DraggableList.vue'

export default defineComponent({
  name: 'ImageToPdf',
  components: { DraggableList },
  setup() {
    const images = ref<string[]>([])
    const expandImages = ref(false)
    const draggableItems = ref<any[]>([])

    const onFilesSelected = (e: Event) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      handleFiles(files)
    }

    const handleDrop = (e: DragEvent) => {
      const files = e.dataTransfer?.files
      if (files) handleFiles(files)
    }

    const handleFiles = (files: FileList) => {
      images.value = []
      draggableItems.value = []
      Array.from(files).forEach((file, idx) => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          if (ev.target?.result) {
            images.value.push(ev.target.result as string)
            draggableItems.value.push({
              id: idx + 1,
              image: ev.target.result as string,
              header: `Image ${idx + 1}`,
              description: file.name
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }

    const updateDraggableItems = (newItems: any[]) => {
      draggableItems.value = newItems
    }

    const generatePdf = async () => {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = () => resolve(img)
        })

      for (let i = 0; i < draggableItems.value.length; i++) {
        if (i > 0) pdf.addPage()
        const img = await loadImage(draggableItems.value[i].image)
        const imgWidth = img.width
        const imgHeight = img.height
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
        const displayWidth = imgWidth * ratio
        const displayHeight = imgHeight * ratio
        const x = (pageWidth - displayWidth) / 2
        const y = (pageHeight - displayHeight) / 2
        pdf.addImage(draggableItems.value[i].image, 'JPEG', x, y, displayWidth, displayHeight)
      }
      pdf.save('images.pdf')
    }

    return {
      images,
      draggableItems,
      expandImages,
      onFilesSelected,
      handleDrop,
      updateDraggableItems,
      generatePdf
    }
  }
})
</script>