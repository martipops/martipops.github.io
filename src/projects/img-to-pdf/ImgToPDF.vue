<template>
  <div class="p-8">
    <h2 class="mb-2">Images to PDF</h2>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex flex-col grow flex-1">
        <label
          class="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-neutral-500 rounded-lg bg-neutral-800 cursor-pointer hover:border-blue-500 transition mb-4"
          :class="{ 'pointer-events-none opacity-75': isLoading }"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <span v-if="isLoading" class="text-blue-400 text-lg mb-2"
            >Processing {{ loadingProgress }}%...</span
          >
          <span v-else class="text-neutral-300 text-lg mb-2 text-center"
            >Click or Drag & Drop Images Here</span
          >

          <input
            type="file"
            ref="fileInput"
            multiple
            accept="image/*"
            class="hidden"
            @change="onFilesSelected"
            :disabled="isLoading"
          />

          <span v-if="!isLoading" class="text-neutral-400 text-xs"
            >Supported: JPG, PNG, GIF, HEIC, etc.</span
          >

          <div
            v-if="isLoading"
            class="w-32 bg-neutral-700 rounded-full h-1 mt-2"
          >
            <div
              class="bg-blue-500 h-1 rounded-full transition-all duration-200"
              :style="{ width: loadingProgress + '%' }"
            ></div>
          </div>
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
          <Button colorClass="bg-red-500" @click="clearImages" confirm
            >Clear Images</Button
          >
          <Button
            colorClass="bg-green-600"
            @click="expandImages = !expandImages"
          >
            {{ expandImages ? "Shrink Images" : "Expand Images" }}</Button
          >
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
import { defineComponent } from "vue";
import jsPDF from "jspdf";
import DraggableList from "./DraggableList.vue";
import Button from "../../components/Button.vue";

export default defineComponent({
  name: "ImageToPdf",
  components: { DraggableList, Button },
  data() {
    return {
      images: [] as string[],
      draggableItems: [] as any[],
      expandImages: false,
      isLoading: false,
      loadingProgress: 0,
    };
  },
  methods: {
    clearImages() {
      this.images = [];
      this.draggableItems = [];
      const input = this.$refs.fileInput as HTMLInputElement | undefined;
      if (input) input.value = "";
    },
    async handleFiles(files: FileList): Promise<void> {
      this.isLoading = true;
      this.loadingProgress = 0;
      await this.$nextTick();

      const fileArray = Array.from(files);
      const total = fileArray.length;
      const startIdx = this.draggableItems.length;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        if (!file.type.startsWith("image/")) {
          this.loadingProgress = Math.round(((i + 1) / total) * 100);
          continue;
        }

        try {
          const result = await this.readFileAsDataURL(file);
          const newItem = {
            id: startIdx + i + 1,
            image: result,
            header: `Image ${startIdx + i + 1}`,
            description: file.name,
          };

          this.images = [...this.images, result];
          this.draggableItems = [...this.draggableItems, newItem];

          this.loadingProgress = Math.round(((i + 1) / total) * 100);

          await this.$nextTick();
        } catch (error) {
          console.error("Error reading file:", file.name, error);
          this.loadingProgress = Math.round(((i + 1) / total) * 100);
        }
      }

      this.isLoading = false;
    },

    readFileAsDataURL(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            resolve(ev.target.result as string);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(new Error("FileReader error"));
        reader.readAsDataURL(file);
      });
    },
    onFilesSelected(e: Event) {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      this.handleFiles(files);
    },
    handleDrop(e: DragEvent) {
      const files = e.dataTransfer?.files;
      if (files) this.handleFiles(files);
    },
    updateDraggableItems(newItems: any[]) {
      this.draggableItems = newItems;
    },
    async generatePdf(): Promise<void> {
      const pdf = new jsPDF();
      const pageWidth: number = pdf.internal.pageSize.getWidth();
      const pageHeight: number = pdf.internal.pageSize.getHeight();

      const processImage = (
        src: string
      ): Promise<{ dataUrl: string; width: number; height: number }> =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = (): void => {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;

            ctx.drawImage(img, 0, 0);

            resolve({
              dataUrl: canvas.toDataURL("image/jpeg", 0.9),
              width: canvas.width,
              height: canvas.height,
            });
          };
        });

      for (let i = 0; i < this.draggableItems.length; i++) {
        if (i > 0) pdf.addPage();

        const processedImg = await processImage(this.draggableItems[i].image);

        const scaleX: number = pageWidth / processedImg.width;
        const scaleY: number = pageHeight / processedImg.height;
        const scale: number = Math.min(scaleX, scaleY);

        const finalWidth: number = processedImg.width * scale;
        const finalHeight: number = processedImg.height * scale;

        const x: number = (pageWidth - finalWidth) / 2;
        const y: number = (pageHeight - finalHeight) / 2;

        pdf.addImage(
          processedImg.dataUrl,
          "JPEG",
          x,
          y,
          finalWidth,
          finalHeight
        );
      }

      pdf.save("images.pdf");
    },
  },
});
</script>
