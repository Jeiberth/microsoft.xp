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

    <!-- Windows XP Menu Bar -->
    <div class="xp-menu-bar">
      <div class="menu-item">File</div>
      <div class="menu-item">Edit</div>
      <div class="menu-item">View</div>
      <div class="menu-item">Favorites</div>
      <div class="menu-item">Tools</div>
      <div class="menu-item">Help</div>
    </div>

    <!-- Windows XP Toolbar -->
    <div class="xp-toolbar">
      <button class="toolbar-btn" title="Back">
        <span class="btn-icon">←</span>
      </button>
      <button class="toolbar-btn" title="Forward">
        <span class="btn-icon">→</span>
      </button>
      <div class="toolbar-separator"></div>
      <button class="toolbar-btn" title="Stop">
        <span class="btn-icon">◼</span>
      </button>
      <button class="toolbar-btn" title="Refresh">
        <span class="btn-icon">↻</span>
      </button>
      <button class="toolbar-btn" title="Home">
        <span class="btn-icon">⌂</span>
      </button>
      <div class="toolbar-separator"></div>
      <div class="address-bar">
        <span class="address-label">Address:</span>
        <div class="address-input">Jeiberth AI ChatBot</div>
      </div>
    </div>

    <div class="xp-content chat-container">
      <div ref="messagesContainerRef" class="chat-messages">
        <p class="chat-disclaimer">Note: I'm an AI, so some info might not be 100% accurate.</p>
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender, { 'error': message.error }]">
            <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-if="isTyping" class="message ai typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
      </div>

      <div class="chat-input-area">
        <input 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            type="text" 
            class="chat-input"
            placeholder="Type your message here..." 
            maxlength="150"
        />
        <button @click="sendMessage" class="chat-send-btn">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'

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
const size = reactive({ width: 550, height: 450 }) // Adjusted default size for chatbot
const isMaximized = ref(false)
const originalSize = reactive({ width: 550, height: 450 }) // Adjusted default size for chatbot
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
const handleResize = () => {
  if (isMaximized.value) {
    size.width = window.innerWidth
    size.height = window.innerHeight - 40
  }
}

// --- CHATBOT LOGIC ---

// State
const messages = ref([
  {
    sender: 'ai',
    content: "Hi! I'm Jeiberth AI, your friendly assistant. Got any questions? I'm here to help!",
    error: false
  }
]);
const userInput = ref('');
const isTyping = ref(false);
const messagesContainerRef = ref(null);

// ⚠️ IMPORTANT: Replace with your actual API key
const API_ENDPOINT = "https://api.cohere.ai/v1/generate";
const API_KEY = "z6wAUeahaiHmtJgO7rzFJtOoSXWyx6Dc505xsIZ1";
// const DATA_CONTEXT = "Impersonate Jeiberth Malagon. Brief, concise, direct, informal, add a touch of humor. No need for extra context—just give answer what they ask with a smile in a text NO MORE THAN 50 words! Jeiberth's Profile: email: jeiberth_camilo@hotmail.com | phoneNumber: +14372559193 Full-stack Developer | Montreal Skilled: HTML, CSS, PHP, JS (React, Vue), Laravel, Firebase, AWS Experience: D2Technologie (Sep2024-Present) - Backend (Laravel, PHP), Frontend (Vue/React), API integration, code reviews. Languages: English, Spanish, French (B1) Projects: Web & Game Design, Service/Product Exchange MobileApp (Quasar, Laravel). Passions: Programming, tech learning, outdoor activities, music, global travel, BoyScouts since 10. Availability: Mon-Fri after 4:30PM, weekends. Core Strengths: Teamwork, adaptability, perfectionism, and problem-solving. (ANSWER UNDER 50 WORDS)Question AI:";
const DATA_CONTEXT = "Impersonate Jeiberth Malagon. Brief, concise, direct, informal, add a touch of humor. No need for extra context—just give answer what they ask with a smile in a text NO MORE THAN 50 words! Jeiberth's Profile: jeiberth_camilo@hotmail.com | +1 (437) 255-9193 | Montreal | Full-Stack Developer with 3+ years of experience building scalable, cloud-native applications and real-time systems. Skilled in HTML5, CSS3, JavaScript (React, Vue, Node.js), PHP (Laravel), Tailwind, GraphQL, MySQL, MongoDB, PostgreSQL, Firebase, AWS (Lambda, S3), CI/CD (Railway, Docker, Kubernetes), and testing (Jest, Cypress, PHPUnit). Experience includes: D2Technologie (Sep 2024–Present) – architected e-commerce platforms with Stripe, Pinia, Twilio, microservices, optimized APIs reducing checkout errors by 25%, automated Telus trade-in system with 99.9% accuracy; Trueque (Startup, 2024–Present) – designed cross-platform marketplace with Vuex, WebSockets, 2FA, AWS storage, i18n, and caching strategies; Malgo Real Estate (2024) – developed SaaS for property management, contract automation, and applicant ranking for 500+ properties. Projects include Vocabulary PWA (spaced repetition), AR Menu Platform (3D dining), Game & AI Chatbot. Languages: English, Spanish, French (B1). Passions: programming, continuous learning, outdoor activities, music, travel, Boy Scouts since age 10. Availability: weekdays after 4:30 PM and weekends. Core strengths: teamwork, adaptability, critical thinking, problem-solving, and delivering scalable solutions. (ANSWER UNDER 50 WORDS) Question AI:";

// Methods
const sendMessage = () => {
  const prompt = userInput.value.trim();
  if (!prompt || isTyping.value) return;

  messages.value.push({ sender: 'user', content: prompt, error: false });
  userInput.value = '';
  isTyping.value = true;

  fetchResponse(prompt);
};

const fetchResponse = async (prompt) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: DATA_CONTEXT + prompt,
        max_tokens: 120,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.generations && data.generations.length > 0) {
      messages.value.push({ sender: 'ai', content: data.generations[0].text.trim(), error: false });
    } else {
      messages.value.push({ sender: 'ai', content: "Sorry, I didn't understand that.", error: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    messages.value.push({ sender: 'ai', content: "Sorry, an error occurred. Please try again later.", error: true });
  } finally {
    isTyping.value = false;
  }
};

const scrollToBottom = async () => {
    await nextTick(); // Wait for the DOM to update
    const container = messagesContainerRef.value;
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
};

// Watch for new messages and scroll to the bottom
watch(messages, scrollToBottom, { deep: true });


onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (!isMaximized.value) {
    const maxX = window.innerWidth - size.width
    const maxY = window.innerHeight - size.height
    position.x = Math.floor(Math.random() * Math.max(1, maxX))
    position.y = Math.floor(Math.random() * Math.max(1, maxY))
    originalPosition.x = position.x
    originalPosition.y = position.y
  }

  // Chatbot: scroll to bottom on initial mount
  scrollToBottom();
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
  display: flex;
  flex-direction: column;
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
.xp-icon { width: 15px; height: 15px; margin-left: 1px; margin-right: 3px; }
.xp-title { flex: 1 1 0%; pointer-events: none; padding-right: 5px; letter-spacing: 0.5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.xp-controls { align-items: center; margin-top: -1px; margin-right: 1px; display: flex; }
.xp-btn { margin-right: 1px; position: relative; width: 22px; height: 22px; border: 1px solid white; border-radius: 3px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; }
.xp-btn:hover { filter: brightness(1.1); }
.xp-btn:active { filter: brightness(0.9); }
.xp-btn-minimize { box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset; background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%); }
.xp-btn-maximize { box-shadow: rgb(70, 70, 255) 0px -1px 2px 1px inset; background-image: radial-gradient(circle at 90% 90%, rgb(0, 84, 233) 0%, rgb(34, 99, 213) 55%, rgb(68, 121, 228) 70%, rgb(163, 187, 236) 90%, white 100%); }
.xp-btn-close { box-shadow: rgb(218, 70, 0) 0px -1px 2px 1px inset; background-image: radial-gradient(circle at 90% 90%, rgb(204, 70, 0) 0%, rgb(220, 101, 39) 55%, rgb(205, 117, 70) 70%, rgb(255, 204, 178) 90%, white 100%); }
.minimize-icon { position: absolute; bottom: 2px; left: 6px; font-size: 12px; font-weight: bold; color: white; text-shadow: none; }
.maximize-icon { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.window-icon { width: 8px; height: 6px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.restore-icon { position: relative; width: 10px; height: 8px; }
.restore-back { position: absolute; top: 0; right: 0; width: 6px; height: 5px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.restore-front { position: absolute; bottom: 0; left: 0; width: 6px; height: 5px; border: 1px solid white; border-top: 2px solid white; background: transparent; }
.close-icon { color: white; font-size: 14px; font-weight: bold; text-shadow: none; }
.xp-content { flex: 1; overflow: hidden; }

/* Windows XP Menu Bar */
.xp-menu-bar {
  display: flex;
  height: 22px;
  background: linear-gradient(to bottom, #f6f6f6, #e2e2e2);
  border-bottom: 1px solid #d0d0d0;
  padding: 0 4px;
  font-family: "Tahoma", sans-serif;
  font-size: 11px;
  align-items: center;
}

.menu-item {
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: default;
  border: 1px solid transparent;
}

.menu-item:hover {
  background-color: #316ac5;
  color: white;
  border: 1px solid;
  border-color: #316ac5 #2a4d7c #2a4d7c #316ac5;
}

/* Windows XP Toolbar */
.xp-toolbar {
  display: flex;
  height: 42px;
  background: linear-gradient(to bottom, #f6f6f6, #e2e2e2);
  border-bottom: 1px solid #d0d0d0;
  padding: 4px 6px;
  align-items: center;
  gap: 4px;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.toolbar-btn:hover {
  border: 1px solid;
  border-color: #316ac5 #2a4d7c #2a4d7c #316ac5;
  background: linear-gradient(to bottom, #abc6e8, #7db3e8);
}

.toolbar-btn:active {
  border-color: #2a4d7c #316ac5 #316ac5 #2a4d7c;
  background: linear-gradient(to bottom, #7db3e8, #abc6e8);
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: linear-gradient(to bottom, #f0f0f0, #c0c0c0);
  margin: 0 4px;
}

.address-bar {
  display: flex;
  align-items: center;
  height: 26px;
  background: white;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 0 6px;
  margin-left: 4px;
  flex: 1;
  font-family: "Tahoma", sans-serif;
  font-size: 11px;
}

.address-label {
  color: #666;
  margin-right: 6px;
}

.address-input {
  flex: 1;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* --- CHATBOT STYLES --- */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ece9d8;
  font-family: "Tahoma", "Noto Sans", sans-serif;
  font-size: 11px;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background-color: #ffffff;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-right: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  margin: 5px;
}
.chat-messages::-webkit-scrollbar { width: 17px; }
.chat-messages::-webkit-scrollbar-track { background: #dfdfdf; }
.chat-messages::-webkit-scrollbar-thumb {
  background-color: #d4d0c8;
  border: 1px solid;
  border-color: #f1f1f1 #b1b1b1 #b1b1b1 #f1f1f1;
}
.chat-messages::-webkit-scrollbar-button {
  display: block;
  height: 16px;
  width: 16px;
  background-color: #d4d0c8;
  border: 1px solid;
  border-color: #f1f1f1 #808080 #808080 #f1f1f1;
}
.chat-disclaimer {
  text-align: center;
  font-size: 10px;
  color: #808080;
  margin: -4px 0 10px 0;
  padding: 3px;
  background-color: #f0f0f0;
  border: 1px solid #d0d0d0;
}
.message {
  margin-bottom: 8px;
  max-width: 85%;
  display: flex;
  word-wrap: break-word;
}
.message-content {
  padding: 6px 10px;
  border-radius: 3px;
  line-height: 1.4;
}
.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}
.message.user .message-content {
  background-color: #E1F0FF;
  border: 1px solid #a8d0ff;
  text-align: left;
}
.message.ai .message-content {
  background-color: #F0F0F0;
  border: 1px solid #dcdcdc;
}
.message.error .message-content {
  background-color: #FFEBEB;
  border: 1px solid #FFCACA;
  color: #a00;
}
.chat-input-area {
  display: flex;
  padding: 5px;
  border-top: 1px solid #ffffff;
  background-color: #ece9d8;
}
.chat-input {
  flex: 1;
  padding: 3px 4px;
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  font-family: "Tahoma", sans-serif;
  font-size: 11px;
  margin-right: 5px;
}
.chat-input:focus { outline: none; }
.chat-send-btn {
  padding: 0 12px;
  height: 23px;
  font-family: "Tahoma", sans-serif;
  font-size: 11px;
  background-color: #d4d0c8;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: pointer;
}
.chat-send-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}
.typing-indicator { align-items: center; }
.typing-indicator .dot {
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #888;
  border-radius: 50%;
  animation: typing-blink 1.4s infinite both;
}
.typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>