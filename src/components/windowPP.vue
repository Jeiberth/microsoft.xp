<template>
  <div
    v-if="element.show"
    ref="modal"
    @click="$emit('clickeo')"
    class="xp-modal"
    :style="{
      zIndex: element.z,
      left: position.x + 'px',
      top: position.y + 'px',
      width: size.width + 'px',
      height: size.height + 'px',
      maxWidth: maxWidth + 'px',
      maxHeight: maxHeight + 'px'
    }"
  >
    <!-- Header Bar -->
    <div
      ref="header"
      class="xp-header"
      @mousedown="startDrag"
    >
      <!-- Icon -->
      <img
        :src="element.icon"
        :alt="element.name"
        class="xp-icon"
      />

      <!-- Title -->
      <div class="xp-title">{{ element.name }}</div>

      <!-- Control Buttons -->
      <div class="xp-controls">
        <!-- Minimize Button -->
        <button
          class="xp-btn xp-btn-minimize"
          @click="minimize"
          title="Minimize"
        >
          <div class="minimize-icon">_</div>
        </button>

        <!-- Maximize/Restore Button -->
        <button
          class="xp-btn xp-btn-maximize"
          @click="toggleMaximize"
          :title="isMaximized ? 'Restore Down' : 'Maximize'"
        >
          <div class="maximize-icon">
            <div v-if="!isMaximized" class="window-icon"></div>
            <div v-else class="restore-icon">
              <div class="restore-back"></div>
              <div class="restore-front"></div>
            </div>
          </div>
        </button>

        <!-- Close Button -->
        <button
          class="xp-btn xp-btn-close"
          @click="close"
          title="Close"
        >
          <div class="close-icon">×</div>
        </button>
      </div>
    </div>

    <!-- Modal Content Area -->
    <div class="xp-content">
      <iframe :src="htmlFileUrl" width="100%" height="100%" frameborder="0"></iframe>
  
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
// Device dimensions - ADD THESE TWO LINES
const deviceWidth = ref(window.innerWidth)
const deviceHeight = ref(window.innerHeight)

// Computed properties for maximum dimensions - ADD THESE TWO LINES
const maxWidth = computed(() => deviceWidth.value)
const maxHeight = computed(() => deviceHeight.value)

const htmlFileUrl = ref(new URL('@/assets/Game/index.html', import.meta.url).href)


// Props
const props = defineProps({
  element: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
             typeof value.name === 'string' &&
             typeof value.icon === 'string' &&
             typeof value.show === 'boolean' &&
             typeof value.z === 'number'
    }
  }
})

// Emits
const emit = defineEmits(['hide', 'kill', "clickeo"])

// Template refs
const modal = ref(null)
const header = ref(null)

// State
const position = reactive({ x: 100, y: 100 })
const size = reactive({ width: 500, height: 500 })
const isMaximized = ref(false)
const originalSize = reactive({ width: 500, height: 500 })
const originalPosition = reactive({ x: 100, y: 100 })

// Dragging state
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })
const modalStart = reactive({ x: 0, y: 0 })

// Methods
const minimize = () => {
  emit('hide')
}

const close = () => {
  emit('kill')
}

const toggleMaximize = () => {
  if (isMaximized.value) {
    // Restore
    position.x = originalPosition.x
    position.y = originalPosition.y
    size.width = originalSize.width
    size.height = originalSize.height
    isMaximized.value = false
  } else {
    // Store current position and size
    originalPosition.x = position.x
    originalPosition.y = position.y
    originalSize.width = size.width
    originalSize.height = size.height
    
    // Maximize
    position.x = 0
    position.y = 0
    size.width = window.innerWidth
    size.height = window.innerHeight - 40 // Leave 40px at bottom
    isMaximized.value = true
  }
}

const startDrag = (e) => {
  emit('clickeo') 
  if (isMaximized.value) return // Don't allow dragging when maximized

  isDragging.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  modalStart.x = position.x
  modalStart.y = position.y

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const onDrag = (e) => {
  if (!isDragging.value) return

  const deltaX = e.clientX - dragStart.x
  const deltaY = e.clientY - dragStart.y

  position.x = modalStart.x + deltaX
  position.y = modalStart.y + deltaY

  // Keep modal within viewport bounds
  position.x = Math.max(0, Math.min(position.x, window.innerWidth - size.width))
  position.y = Math.max(0, Math.min(position.y, window.innerHeight - 25)) // At least header visible
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Handle window resize
// const handleResize = () => {
//   if (isMaximized.value) {
//     size.width = window.innerWidth
//     size.height = window.innerHeight - 40
//   }
// }

// Handle window resize - REPLACE this function
const handleResize = () => {
  // Update device dimensions
  deviceWidth.value = window.innerWidth
  deviceHeight.value = window.innerHeight
  
  if (isMaximized.value) {
    size.width = deviceWidth.value
    size.height = deviceHeight.value - 40
  } else {
    // Ensure window doesn't exceed new device dimensions
    size.width = Math.min(size.width, deviceWidth.value)
    size.height = Math.min(size.height, deviceHeight.value - 25)
    
    // Adjust position if window is now outside viewport
    position.x = Math.max(0, Math.min(position.x, deviceWidth.value - size.width))
    position.y = Math.max(0, Math.min(position.y, deviceHeight.value - 25))
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // Update device dimensions - ADD THESE TWO LINES
  deviceWidth.value = window.innerWidth
  deviceHeight.value = window.innerHeight
  
  // Ensure initial size is within bounds - ADD THIS LINE
  size.width = Math.min(size.width, deviceWidth.value)
  size.height = Math.min(size.height, deviceHeight.value - 25)
  
  // Only set random position when not maximized
  if (!isMaximized.value) {
    const maxX = window.innerWidth - size.width
    const maxY = window.innerHeight - size.height

    position.x = Math.floor(Math.random() * Math.max(1, maxX))
    position.y = Math.floor(Math.random() * Math.max(1, maxY))

    // Save original position for restore
    originalPosition.x = position.x
    originalPosition.y = position.y
  }
})


onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})


</script>

<style scoped>
.xp-modal {
  position: fixed;
  background: rgb(236, 233, 216);
  border-left: 3px solid rgb(8, 49, 217);
  border-right: 3px solid rgb(8, 49, 217);
  border-bottom: 3px solid rgb(8, 49, 217);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  user-select: none;

    max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

.xp-header {
  display: flex;
  height: 25px;
  line-height: 25px;
  font-weight: 700;
  font-size: 12px;
  font-family: "Noto Sans", sans-serif;
  text-shadow: rgb(0, 0, 0) 1px 1px;
  color: white;
  background:  linear-gradient(rgb(0, 88, 238) 0%, rgb(53, 147, 255) 4%, rgb(40, 142, 255) 6%, rgb(18, 125, 255) 8%, rgb(3, 111, 252) 10%, rgb(2, 98, 238) 14%, rgb(0, 87, 229) 20%, rgb(0, 84, 227) 24%, rgb(0, 85, 235) 56%, rgb(0, 91, 245) 66%, rgb(2, 106, 254) 76%, rgb(0, 98, 239) 86%, rgb(0, 82, 214) 92%, rgb(0, 64, 171) 94%, rgb(0, 48, 146) 100%); 
  position: absolute;
  left: 0px;
  right: 0px;
  align-items: center;
  cursor:default;
}

.xp-icon {
  width: 15px;
  height: 15px;
  margin-left: 1px;
  margin-right: 3px;
}

.xp-title {
  flex: 1 1 0%;
  pointer-events: none;
  padding-right: 5px;
  letter-spacing: 0.5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.xp-controls {
  align-items: center;
  margin-top: -1px;
  margin-right: 1px;
  display: flex;
}

.xp-btn {
  margin-right: 1px;
  position: relative;
  width: 22px;
  height: 22px;
  border: 1px solid white;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.xp-btn:hover {
  filter: brightness(1.1);
}

.xp-btn:active {
  filter: brightness(0.9);
}

.xp-btn-minimize {
  box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, 
    rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, 
    rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, 
    white 100%);
}

.xp-btn-maximize {
  box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, 
    rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, 
    rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, 
    white 100%);
}

.xp-btn-close {
  box-shadow: rgb(218, 70, 0) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, 
    rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, 
    rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, 
    white 100%);
}

.minimize-icon {
  position: absolute;
  bottom: 2px;
  left: 6px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: none;
}

.maximize-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.window-icon {
  width: 8px;
  height: 6px;
  border: 1px solid white;
  border-top: 2px solid white;
  background: transparent;
}

.restore-icon {
  position: relative;
  width: 10px;
  height: 8px;
}

.restore-back {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 5px;
  border: 1px solid white;
  border-top: 2px solid white;
  background: transparent;
}

.restore-front {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 6px;
  height: 5px;
  border: 1px solid white;
  border-top: 2px solid white;
  background: transparent;
}

.close-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: none;
}

.xp-content {
  position: absolute;
  top: 25px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background: rgb(236, 233, 216);
  padding: 8px;
  overflow: hidden;
}



/*Game styling*/ 

</style>

