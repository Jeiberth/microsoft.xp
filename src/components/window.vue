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
      height: size.height + 'px'
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
      <div class="skinny-pane">
        <div class="icon-container" @click="takesToNewWebsite">
          <img :src="element.data.icon" :alt="element.data.title" />
        </div>
        <h1 class="content-title">{{ element.data.title }}</h1>
        <p class="content-text">{{ element.data.text }}</p>
        <div v-if="element.data.skills && element.data.skills.length" class="skills-container">
          <img
            v-for="(skill, index) in element.data.skills"
            :key="index"
            :src="skill"
            alt="Skill Icon"
            class="skill-icon"
            title="Skill"
          />
        </div>

      </div>

      <div class="main-pane">
        <iframe
          v-if="element.data.url"
          :src="element.data.url"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <div v-else class="no-url-message">
          No website URL provided.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

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
const size = reactive({ width: 1000, height: 800 }) // Adjusted default size
const isMaximized = ref(false)
const originalSize = reactive({ width: 1000, height: 800 }) // Adjusted default size
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

function takesToNewWebsite(){
  window.open(props.element.data.url, '_blank');
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Handle window resize
const handleResize = () => {
  if (isMaximized.value) {
    size.width = window.innerWidth
    size.height = window.innerHeight - 40
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

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
/* --- Existing Modal Styles --- */
.xp-modal {
  position: fixed;
  background: rgb(236, 233, 216);
  border-left: 3px solid rgb(8, 49, 217);
  border-right: 3px solid rgb(8, 49, 217);
  border-bottom: 3px solid rgb(8, 49, 217);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  user-select: none;
  display: flex; /* Added for content flex behavior */
  flex-direction: column; /* Added for content flex behavior */
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
  flex-shrink: 0; /* Prevent header from shrinking */
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

.xp-btn:hover { filter: brightness(1.1); }
.xp-btn:active { filter: brightness(0.9); }
.xp-btn-minimize {
  box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%);
}
.xp-btn-maximize {
  box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%);
}
.xp-btn-close {
  box-shadow: rgb(218, 70, 0) 0px -1px 2px 1px inset;
  background-image: radial-gradient(circle at 90% 90%, rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, white 100%);
}

.minimize-icon { position: absolute; bottom: 2px; left: 6px; font-size: 12px; font-weight: bold; color: white; text-shadow: none; }
.maximize-icon { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.window-icon { width: 8px; height: 6px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.restore-icon { position: relative; width: 10px; height: 8px; }
.restore-back { position: absolute; top: 0; right: 0; width: 6px; height: 5px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.restore-front { position: absolute; bottom: 0; left: 0; width: 6px; height: 5px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.close-icon { color: white; font-size: 14px; font-weight: bold; text-shadow: none; }

/* --- NEW CONTENT AREA STYLES --- */
.xp-content {
  flex: 1; /* Take up remaining space */
  display: flex;
  background: #f0f0f0;
  overflow: hidden; /* Prevent parent from scrolling */
  margin: 0 3px 3px 3px; /* Match border width */

  /* --- MOBILE FIRST: Two-Row Layout --- */
  flex-direction: column;
}

.skinny-pane {
  background: #ffffff;
  padding: 20px;
  overflow-y: auto; /* Allow scrolling if content is too long */
  text-align: center;

  /* Mobile: Row takes up a fixed height */
  flex: 0 0 auto;
  min-height: 220px; /* Ensure a minimum height */
  border-bottom: 1px solid #dcdcdc;
}

.main-pane {
  flex: 1 1 auto; /* Take remaining space */
  overflow: hidden; /* Hide overflow to contain the iframe */
}

.main-pane iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Styling for content inside the skinny pane */
.icon-container {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
}

.icon-container img {
  max-width: 55%;
  max-height: 55%;
}

.content-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.content-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

.skills-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-icon {
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease-in-out;
}
.skill-icon:hover {
  transform: scale(1.15);
}

.no-url-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-style: italic;
}


/* --- DESKTOP: Two-Column Layout --- */
@media (min-width: 768px) {
  .xp-content {
    flex-direction: row;
  }

  .skinny-pane {
    /* Desktop: Column takes up a fixed width */
    flex: 0 0 280px; /* Skinny column width */
    border-bottom: none;
    border-right: 1px solid #dcdcdc;
  }
}
</style>