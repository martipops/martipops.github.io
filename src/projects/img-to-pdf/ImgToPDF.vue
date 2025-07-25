<template>
  <div class="p-8">
    <h2 class="mb-2">Images to PDF</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex flex-col grow flex-1">
        <label
          class="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-500 rounded-lg bg-neutral-800 cursor-pointer hover:border-blue-500 transition mb-4"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <span class="text-neutral-300 text-lg mb-2 text-center">Click or Drag & Drop Images Here</span>
          <input
            type="file"
            ref="fileInput"
            multiple
            accept="image/*"
            class="hidden"
            @change="onFilesSelected"
          />
          <span class="text-neutral-400 text-xs">Supported: JPG, PNG, GIF, etc.</span>
        </label>
        <div class="flex gap-2">
          <Button
            colorClass="bg-blue-600"
            :disabled="draggableItems.length === 0"
            @click="generatePdf"
            fluid
            >
            Download PDF
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-4 flex-1" v-if="images.length">
        <div class="flex justify-between">
          <Button
            colorClass="bg-red-500"
            @click="clearImages"
            confirm
            >Clear Images</Button>
          <Button
            colorClass="bg-green-600"
            @click="expandImages = !expandImages"
          > {{ expandImages ? 'Shrink Images' : 'Expand Images' }}</Button>
        </div>
        <DraggableList
          :expand-images="expandImages"
          :items="draggableItems"
          @update:items="updateDraggableItems"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue'
import jsPDF from 'jspdf'
import DraggableList from './DraggableList.vue'
import Button from '../../components/Button.vue'

export default defineComponent({
  name: 'ImageToPdf',
  components: { DraggableList, Button },
  data() {
    return {
      images: [] as string[],
      draggableItems: [] as any[],
      expandImages: false
    }
  },
  methods: {
    clearImages() {
      this.images = []
      this.draggableItems = []
      const input = this.$refs.fileInput as HTMLInputElement | undefined
      if (input) input.value = ''
      
    },
    handleFiles(files: FileList) {
      const images: string[] = []
      const draggableItems: any[] = []
      let loaded = 0
      const total = files.length
      // Always use current length (will be 0 after clear)
      const startIdx = this.draggableItems.length

      Array.from(files).forEach((file, idx) => {
        if (!file.type.startsWith('image/')) {
          loaded++
          return
        }
        const reader = new FileReader()
        reader.onload = (ev) => {
          if (ev.target?.result) {
            images[idx] = ev.target.result as string
            draggableItems[idx] = {
              id: startIdx + idx + 1,
              image: ev.target.result as string,
              header: `Image ${startIdx + idx + 1}`,
              description: file.name
            }
          }
          loaded++
          if (loaded === total) {
            this.images = [...this.images, ...images.filter(Boolean)]
            this.draggableItems = [...this.draggableItems, ...draggableItems.filter(Boolean)]
          }
        }
        reader.readAsDataURL(file)
      })
    },
    onFilesSelected(e: Event) {
      const files = (e.target as HTMLInputElement).files
      if (!files) return
      this.handleFiles(files)
    },
    handleDrop(e: DragEvent) {
      const files = e.dataTransfer?.files
      if (files) this.handleFiles(files)
    },
    updateDraggableItems(newItems: any[]) {
      this.draggableItems = newItems
    },
    async generatePdf() {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = () => resolve(img)
        })

      for (let i = 0; i < this.draggableItems.length; i++) {
        if (i > 0) pdf.addPage()
        const img = await loadImage(this.draggableItems[i].image)
        const imgWidth = img.width
        const imgHeight = img.height
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
        const displayWidth = imgWidth * ratio
        const displayHeight = imgHeight * ratio
        const x = (pageWidth - displayWidth) / 2
        const y = (pageHeight - displayHeight) / 2
        pdf.addImage(this.draggableItems[i].image, 'JPEG', x, y, displayWidth, displayHeight)
      }
      pdf.save('images.pdf')
    }
  }
})
</script>