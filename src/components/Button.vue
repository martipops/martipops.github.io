<template>

<div class="text-white rounded p-2 text-center" :class="buttonClass" @click="tryClick">
  {{ pendingConfirm ? 'Confirm ' : '' }}
  <slot>
     {{ label }}
  </slot>
</div>

</template>

<script lang="ts">

export default {
  name: 'Button',
  props: {
    label: {
      type: String,
      required: false
    },
    fluid: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    colorClass: {
      type: String,
      default: 'bg-green-600'
    },
    onClick: {
      type: Function,
      required: false
    },
    confirm: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass() {
      let base = ''
      if (this.fluid) {
        base += ' w-full'
      } else {
        base += ' w-fit'
      }
      if (this.disabled) {
        base += ' opacity-50 cursor-not-allowed'
      } else {
        base += ' cursor-pointer'
      }
      base += ` ${this.colorClass}`
      return base
    }
  },
  data() {
    return {
      pendingConfirm: false
    }
  },
  methods: {
    tryClick() {
      if (this.confirm) {
        if (this.pendingConfirm) {
          this.pendingConfirm = false
          this.onClick && this.onClick()
        } else {
          this.pendingConfirm = true
          setTimeout(() => {
            this.pendingConfirm = false
          }, 2000)
        }
        return
      }
      if (this.onClick && this.disabled === false) {
        this.onClick()
      }
    }
  }
}
</script>