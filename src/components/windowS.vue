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
    <div
      ref="header"
      class="xp-header"
      @mousedown="startDrag"
    >
      <img
        :src="element.icon"
        :alt="element.name"
        class="xp-icon"
      />

      <div class="xp-title">{{ element.name }}</div>

      <div class="xp-controls">
        <button
          class="xp-btn xp-btn-minimize"
          @click="minimize"
          title="Minimize"
        >
          <div class="minimize-icon">_</div>
        </button>

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

        <button
          class="xp-btn xp-btn-close"
          @click="close"
          title="Close"
        >
          <div class="close-icon">×</div>
        </button>
      </div>
    </div>

    <div class="xp-content">
      <div class="education-details" v-if="element.data">
        
        <header class="details-header">
          <img :src="element.icon" alt="Institution Logo" class="institution-logo"/>
          <div class="header-text">
            <h1 class="program-title">{{ element.data.program }}</h1>
            <div class="institution-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mortarboard-fill" viewBox="0 0 16 16">
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0l7.5-3a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
              </svg>
              <span>{{ element.data.institution }}, {{ element.data.location }}</span>
            </div>
            <div class="credential-info">{{ element.data.credential }}</div>
          </div>
        </header>

        <p class="description">{{ element.data.description }}</p>

        <div class="details-lists">
          <div class="list-section">
            <h3>Focus Areas</h3>
            <ul>
              <li v-for="area in element.data.focus_areas" :key="area">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                {{ area }}
              </li>
            </ul>
          </div>

          <div class="list-section">
            <h3>Skills Gained</h3>
            <ul>
              <li v-for="skill in element.data.skills_gained" :key="skill">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                {{ skill }}
              </li>
            </ul>
          </div>
        </div>
      </div>
       </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed  } from 'vue'

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

// Device dimensions - ADD THESE TWO LINES
const deviceWidth = ref(window.innerWidth)
const deviceHeight = ref(window.innerHeight)

// Computed properties for maximum dimensions - ADD THESE TWO LINES
const maxWidth = computed(() => deviceWidth.value)
const maxHeight = computed(() => deviceHeight.value)

// State
const position = reactive({ x: 100, y: 100 })
const size = reactive({ width: 650, height: 550 }) // Adjusted default size
const isMaximized = ref(false)
const originalSize = reactive({ width: 650, height: 550 }) // Adjusted default size
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
  display: flex;
  flex-direction: column;

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
  align-items: center;
  cursor:default;
  flex-shrink: 0;
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
  background: rgb(250, 250, 250); /* Slightly cleaner background */
  padding: 16px;
  overflow: auto;
  flex-grow: 1; /* Allow content to fill available space */
  border-left: 3px solid rgb(236, 233, 216);
  border-right: 3px solid rgb(236, 233, 216);
  border-bottom: 3px solid rgb(236, 233, 216);
}

/* ===== START: NEW CONTENT STYLES ===== */
.education-details {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.details-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.institution-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 16px;
  object-fit: contain;
  background: #fff;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.header-text {
  flex-grow: 1;
}

.program-title {
  margin: 0;
  font-size: 1.5em;
  font-weight: 600;
  color: #005A9E; /* A blue that fits the theme */
}

.institution-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1em;
  color: #555;
  margin-top: 4px;
}

.institution-info svg {
  color: #555;
}

.credential-info {
  font-size: 0.9em;
  font-style: italic;
  color: #777;
  margin-top: 4px;
}

.description {
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-size: 0.95em;
  color: #444;
}

.details-lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  flex-grow: 1;
}

.list-section h3 {
  margin: 0 0 12px 0;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #005A9E;
  padding-bottom: 6px;
}

.list-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-section li {
  display: flex;
  align-items: flex-start; /* Align icon to the top of text */
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9em;
  line-height: 1.4;
}

.list-section li svg {
  flex-shrink: 0;
  color: #0078D4; /* A consistent blue */
  width: 16px;
  height: 16px;
  margin-top: 2px; /* Fine-tune vertical alignment */
}

/* Responsive adjustment for smaller modals */
@media (max-width: 600px) {
  .details-lists {
    grid-template-columns: 1fr;
  }
}
/* ===== END: NEW CONTENT STYLES ===== */

/* Responsive adjustments - ADD THIS */
@media (max-width: 768px) {
  .details-lists {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .xp-content {
    padding: 12px;
  }
  
  .program-title {
    font-size: 1.1em;
  }
}

</style>