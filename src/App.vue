<template>
  <div class="custom-overlay">
    <div class="top-section"></div>
    <div class="border-section"></div>
    <div class="middle-section">
        <div class="content-container">
            <div class="vertical-line"></div>
            <div class="left-column">
                <img src="@/assets/xp_icon.png" alt="Loading" class="loading-image" />
            </div>
            <div class="right-column">
                <div @click="handleUserClick" class="user-container" id="userContainer">
                    <div class="user-image">
                        <img src="@/assets/user.png" alt="User" />
                    </div>
                    <div class="user-label">User</div>
                </div>
            </div>
        </div>
        <div class="instructions">
          <i class="fas fa-mouse-pointer"></i> Click on the user card to continue
        </div>
    </div>
    <div class="border-section"></div>
    <div class="bottom-section"></div>
  </div>
  <div class="windows-xp-container">
    <div class="main-page" @click="deselectAllApps; showStartMenu = false">
      <div
        v-for="app in appDesktop"
        :key="app.id"
        class="desktop-app"
        :class="{ 'selected': selectedAppId === app.id }"
        @click.stop="selectDesktopApp(app.id)"
        @dblclick="openApp(app)"
      >
        <div class="app-icon-container">
          <img :src="app.icon" :alt="app.name" class="desktop-app-icon" />
        </div>
        <div class="app-label">
          {{ app.name }}
        </div>
      </div>
      <div
        v-for="app in pp"
        :key="app.id"
        class="desktop-app"
        :class="{ 'selected': selectedAppId === app.id }"
        @click.stop="selectDesktopApp(app.id)"
        @dblclick="openApp(app)"
      >
        <div class="app-icon-container">
          <img :src="app.icon" :alt="app.name" class="desktop-app-icon" />
        </div>
        <div class="app-label">
          {{ app.name }}
        </div>
      </div>
      <div
        v-for="app in jai"
        :key="app.id"
        class="desktop-app"
        :class="{ 'selected': selectedAppId === app.id }"
        @click.stop="selectDesktopApp(app.id)"
        @dblclick="openApp(app)"
      >
        <div class="app-icon-container">
          <img :src="app.icon" :alt="app.name" class="desktop-app-icon" />
        </div>
        <div class="app-label">
          {{ app.name }}
        </div>
      </div>
    </div>

    <div v-if="showStartMenu" class="start-menu" @click.stop>
      <div class="start-menu-header">
        <img src="@/assets/user.png" alt="User Avatar" class="user-avatar" />
        <span class="user-name">User</span>
      </div>

      <div class="start-menu-content">
        <div class="left-column-l">
          <div v-for="item in degrees" @click="openApp(item)" :key="item.id" class="menu-item">
            <img :src="item.icon" :alt="item.name" class="menu-item-icon" />
            <span class="menu-item-label">{{ item.name }}</span>
          </div>
        </div>
        <div class="right-column-l">
          <div v-for="item in theUsual" :key="item.id" class="menu-item" @click="openApp(err[0])">
            <img :src="item.icon" :alt="item.name" class="menu-item-icon" />
            <span class="menu-item-label">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="start-menu-footer">
        <div class="footer-action" @click="openApp(err[0])">
          <img src="@/assets/logoff.png" alt="Log Off" class="footer-icon"/>
          <span class="footer-label">Log off</span>
        </div>
        <div class="footer-action" @click="openApp(err[0])">
          <img src="@/assets/turnoff.png" alt="Turn Off" class="footer-icon" />
          <span class="footer-label">Turn off Computer</span>
        </div>
      </div>
    </div>

    <div class="taskbar">
      <div class="start-button-container">
        <img
          src="@/assets/start-button.png"
          alt="Start Button"
          class="start-button-image"
          @click.stop="handleStartClick"
        />
      </div>

      <div class="taskbar-buttons-container">
        <div 
          v-for="(app, index) in applicationsWithoutErrors " 
          :key="index"
          class="taskbar-button"
          :class="{ 'active': app.id === activeAppId, 'inactive': app.id !== activeAppId }"
          @click="selectApp(app.id)"
        >
          <img :src="app.icon" :alt="app.name" class="app-icon" />
          <span class="app-name">{{ app.name }}</span>
        </div>
      </div>

      <div class="system-tray">
        <!-- <select 
          v-model="currentLanguage" 
          class="language-selector"
          @change="changeLanguage"
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
        </select> -->

        <div class="clock">
          {{ currentTime }}
        </div>
      </div>
    </div>
  </div>
  <windowS v-for="app in applicationsFromDesktop" :element="app" @click="takeUpfront(app)" @clickeo="takeUpfront(app)" @hide="hide(app)" @kill="kill(app)"/>
  <windowStudies v-for="app in applicationsFromDegrees" :element="app" @click="takeUpfront(app)" @clickeo="takeUpfront(app)" @hide="hide(app)" @kill="kill(app)"/>
  <windowPP v-for="app in applicationsFromPP" :element="app" @click="takeUpfront(app)" @clickeo="takeUpfront(app)" @hide="hide(app)" @kill="kill(app)"/>
  <windowJAI v-for="app in applicationsFromJAI" :element="app" @click="takeUpfront(app)" @clickeo="takeUpfront(app)" @hide="hide(app)" @kill="kill(app)"/>
  <errorxp v-for="app in applicationsFromErrors" :element="app" @click="takeUpfront(app)" @clickeo="takeUpfront(app)" @hide="hide(app)" @kill="kill(app)"/>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed  } from 'vue'
import windowS from "@/components/window.vue"
import windowStudies from "@/components/windowS.vue"
import windowPP from "@/components/windowPP.vue"
import windowJAI from "@/components/windowJAI.vue"
import errorxp from "@/components/errorxp.vue"


// Reactive data
const selectedAppId = ref(null) // For desktop app selection
const currentTime = ref('')
const currentLanguage = ref('en')
const showLoading = ref(true)
const fadeLoading = ref(false)
const showStartMenu = ref(false) // State for Start Menu visibility

const sound = new Audio(new URL('@/assets/error_sound.mp3', import.meta.url).href)

const playSound = () => {
  sound.currentTime = 0 
  sound.play().catch((e) => {
    console.warn('Sound failed to play:', e)
  })
}


function handleUserClick() {
  const audio = new Audio(new URL('@/assets/start_sound.mp3', import.meta.url).href)
  audio.play().catch((err) => {
    console.warn('Audio failed to play automatically:', err)
  })

  // Start fade out
  document.querySelector('.custom-overlay').classList.add('fadeOut');

  // Remove overlay after fade completes
  setTimeout(() => {
      document.querySelector('.custom-overlay').style.display = 'none';
  }, 1000);
}

// // Auto-hide after 8 seconds (optional)
// setTimeout(() => {
//   if (document.querySelector('.custom-overlay').style.display !== 'none') {
//       handleUserClick();
//   }
// }, 8000);

const applicationsWithoutErrors = computed(() => {
  return applications.filter(app => {
    return !err.some(degree => degree.id === app.id);
  });
});

// Add computed properties to filter applications by source
const applicationsFromDesktop = computed(() => {
  return applications.filter(app => {
    return appDesktop.some(desktopApp => desktopApp.id === app.id);
  });
});

const applicationsFromDegrees = computed(() => {
  return applications.filter(app => {
    return degrees.some(degree => degree.id === app.id);
  });
});

const applicationsFromPP = computed(() => {
  return applications.filter(app => {
    return pp.some(degree => degree.id === app.id);
  });
});

const applicationsFromJAI = computed(() => {
  return applications.filter(app => {
    return jai.some(degree => degree.id === app.id);
  });
});

const applicationsFromErrors = computed(() => {
  return applications.filter(app => {
    return err.some(degree => degree.id === app.id);
  });
});

const err = reactive([
  { 
    id: 'error',
    name: 'C:/',
    icon: new URL('@/assets/error.png', import.meta.url).href,
    data: {},
  },
]);

// Data for Start Menu
const pp = reactive([
  {
    id: 'pp2',
    name: 'Pixel Paws Game',
    icon: new URL('@/assets/pp.png', import.meta.url).href,
    data: {},
  },
]);

const jai = reactive([
  {
    id: 'jai1',
    name: 'Jeiberth Ai Chatbot',
    icon: new URL('@/assets/jai.png', import.meta.url).href,
    data: {},
  },
]);


// Data for Start Menu
const degrees = reactive([
  { id: 'd3',
    name: 'Computer Science',
    icon: new URL('@/assets/vanier_icon.png', import.meta.url).href,
    data: {
      "program": "Software Development",
      "institution": "Vanier College",
      "location": "Canada",
      "credential": "College Diploma",
      "focus_areas": [
        "Object-Oriented Programming",
        "Web Development (Frontend & Backend)",
        "Database Management (SQL, NoSQL)",
        "Software Engineering Principles",
        "Version Control (Git/GitHub)",
        "Agile Methodologies",
        "Mobile App Development"
      ],
      "skills_gained": [
        "Full-stack development",
        "Team-based project collaboration",
        "Problem solving through coding",
        "Building scalable software solutions"
      ],
      "description": "This comprehensive program provided hands-on training in modern software development techniques. From front-end design to back-end logic and database integration, I developed full-stack applications using various programming languages and frameworks. Emphasis was placed on collaborative development using Agile and Git, preparing me to work in real-world tech teams and deliver scalable, maintainable code."
    }
  },
  { id: 'd4',
    name: 'Service Excellence for Business',
    icon: new URL('@/assets/ilac_icon.png', import.meta.url).href,
    data: {
      "program": "Diploma in Service Excellence for Business",
      "institution": "ILAC International College",
      "location": "Canada",
      "credential": "Diploma",
      "focus_areas": [
        "Customer Service & Communication",
        "Business Operations",
        "Sales and Marketing Fundamentals",
        "Professional Etiquette",
        "Conflict Resolution",
        "CRM Systems"
      ],
      "skills_gained": [
        "Enhanced interpersonal and communication skills",
        "Customer relationship management",
        "Business professionalism",
        "Teamwork and problem-solving in service settings"
      ],
      "description": "This diploma focused on developing high-level customer service and business communication skills. I gained insight into client interaction, professional conduct, and business process optimization. Through real-case simulations and team projects, I learned how to manage customer relationships effectively, work in dynamic environments, and maintain a professional image aligned with corporate service standards."
    }
  },
  { id: 'd5',
    name: 'Administrative Technician',
    icon: new URL('@/assets/sena_icon.png', import.meta.url).href,
    data: {
      "program": "Technician in Administrative Assistance",
      "institution": "Servicio Nacional de Aprendizaje (SENA)",
      "location": "Colombia",
      "credential": "Technical Diploma",
      "focus_areas": [
        "Office Administration",
        "Document Management",
        "Basic Accounting and Finance",
        "Business Software (Word, Excel, PowerPoint)",
        "Record Keeping and Filing Systems"
      ],
      "skills_gained": [
        "Administrative organization",
        "Clerical and support services",
        "Use of office productivity tools",
        "Data entry and document processing"
      ],
      "description": "This technical program provided foundational training in administrative and clerical support tasks within professional settings. I became proficient in business software, document management, and office coordination. The curriculum emphasized accuracy, organization, and efficiency—key traits needed for effective support in any business environment."
    }
  },
]);

const theUsual = reactive([
  { id: 'u1', name: 'My Documents', icon: new URL('@/assets/mydocuments.png', import.meta.url).href },
  { id: 'u2', name: 'My Recent Documents', icon: new URL('@/assets/myrecentdocuments.png', import.meta.url).href },
  { id: 'u3', name: 'My Pictures', icon: new URL('@/assets/mypictures.png', import.meta.url).href },
  { id: 'u4', name: 'My Computer', icon: new URL('@/assets/mycomputer.png', import.meta.url).href },
  { id: 'u5', name: 'Control Panel', icon: new URL('@/assets/controlpanel.png', import.meta.url).href },
  { id: 'u6', name: 'Help and Support', icon: new URL('@/assets/helpandsupport.png', import.meta.url).href },
  { id: 'u7', name: 'Search', icon: new URL('@/assets/search.png', import.meta.url).href },
  { id: 'u8', name: 'Run', icon: new URL('@/assets/run.png', import.meta.url).href },
]);


function hide(appH) {
  const app = applications.find(app => app.id === appH.id);
  if (app) {
    app.show = false;
  }
}

function kill(appK) {
  const index = applications.findIndex(app => app.id === appK.id);
  if (index !== -1) {
    applications.splice(index, 1);
  }
}

const activeAppId = computed(() => {
  const visibleApps = applications.filter(app => app.show);
  if (visibleApps.length === 0) return null;

  const topApp = visibleApps.reduce((prev, curr) => (curr.z > prev.z ? curr : prev));
  return topApp.id;
});

const appDesktop = reactive([
  {
    "id": 1,
    "name": "D2 Corp",
    "icon": new URL('@/assets/d2-technologie-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/d2-technologie-icon.png', import.meta.url).href,
      "title": "Full-Stack Developer",
      "url": "https://corpo.d2technologie.com/",
      "text": "Designed and developed a scalable e-commerce platform serving over 1,000 users, featuring Stripe payment integration, reCAPTCHA security, Twilio SMS validation, Pinia state management, cookie handling, and indexed storage for seamless multi-platform synchronization and robust order processing. Ensured a responsive, cross-browser-compatible UI using Vue.js, and built a secure, efficient backend with Laravel. Configured and managed a Linux server, including setting up NGINX, PHP, MySQL, and SSL, to host and deploy both frontend and backend applications. Automated deployment and implemented scheduled backups of code and databases to AWS S3, ensuring system reliability and data integrity.",
      "skills": [
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/laravel-icon.png', import.meta.url).href,
        new URL('@/assets/stripe-icon.png', import.meta.url).href,
        new URL('@/assets/captcha-icon.png', import.meta.url).href,
        new URL('@/assets/cookie-icon.png', import.meta.url).href,
        new URL('@/assets/browser-icon.png', import.meta.url).href,
        new URL('@/assets/twilio-icon.png', import.meta.url).href,
        new URL('@/assets/mysql-icon.png', import.meta.url).href,
        new URL('@/assets/pinia-icon.png', import.meta.url).href,
        new URL('@/assets/aws-s3-icon.png', import.meta.url).href,
        new URL('@/assets/i18n_icon.png', import.meta.url).href,
        new URL('@/assets/axios_icon.png', import.meta.url).href,
        new URL('@/assets/linux_icon.png', import.meta.url).href,
        new URL('@/assets/encryptdb_icon.png', import.meta.url).href,
        new URL('@/assets/bootstrap-icon.png', import.meta.url).href
      ]
    }
  },
  {
    "id": 2,
    "name": "Trueque App",
    "icon": new URL('@/assets/trueque-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/trueque-icon.png', import.meta.url).href,
      "title": "Founder & Software Engineer",
      "url": "https://app.trueque.art/",
      "text": "Trueque is a web app with a Tinder-style swipe interface that matches users based on shared interests in services or items. Once matched, users can chat and negotiate deals through a simple interface for sending, accepting, or denying offers. I led development using Vuex and WebSockets to support 1,000+ concurrent users, with 2FA for security. The app uses AWS S3, Photon geolocation, and Railway CI/CD pipelines, cutting deployment time by 50%. I also implemented i18n for multilingual support and boosted MySQL performance by 30% through query optimization and caching.",
      "skills": [
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/vuex-icon.png', import.meta.url).href,
        new URL('@/assets/websockets-icon.png', import.meta.url).href,
        new URL('@/assets/aws-s3-icon.png', import.meta.url).href,
        new URL('@/assets/mysql-icon.png', import.meta.url).href,
        new URL('@/assets/smtp_icon.png', import.meta.url).href,
        new URL('@/assets/railway_icon.png', import.meta.url).href,
        new URL('@/assets/photon_icon.png', import.meta.url).href,
        new URL('@/assets/2fa_icon.png', import.meta.url).href,
        new URL('@/assets/uiux_icon.png', import.meta.url).href,
      ]
    }
  },
  {
    "id": 3,
    "name": "Malgo Real Estate",
    "icon": new URL('@/assets/malgo-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/malgo-icon.png', import.meta.url).href,
      "title": "Lead Software Developer",
      "url": "https://www.malgo.top/",
      "text": "Delivered a comprehensive SaaS platform for tenant management, supporting application processing, rejections, and automated contract generation. Implemented SMTP notifications and robust database encryption to prevent data leaks. Built an applicant ranking algorithm to streamline processing time. Additionally, managed encryption and secure handling of file uploads, updates, and deletions in AWS S3, ensuring end-to-end data security across the platform.",
      "skills": [
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/laravel-icon.png', import.meta.url).href,
        new URL('@/assets/mysql-icon.png', import.meta.url).href,
        new URL('@/assets/i18n_icon.png', import.meta.url).href,
        new URL('@/assets/github_icon.png', import.meta.url).href,
        new URL('@/assets/ssl_icon.png', import.meta.url).href,
        new URL('@/assets/acm_icon.png', import.meta.url).href,
        new URL('@/assets/encryptdb_icon.png', import.meta.url).href,
        new URL('@/assets/axios_icon.png', import.meta.url).href,
        new URL('@/assets/aws-s3-icon.png', import.meta.url).href,
      ]
    }
  },
  {
    "id": 4,
    "name": "D2 Portal",
    "icon": new URL('@/assets/d2-technologie-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/d2-technologie-icon.png', import.meta.url).href,
      "title": "Full-Stack Developer",
      "url": "https://d2portail.com/",
      "text": "I enhanced the pricing system for over 2,500 SKUs by transforming spreadsheet data into a well-structured API and database, which led to a 25% reduction in checkout errors and faster load times. I also automated the Telus trade-in process, handling more than 5,000 assessments with 99.9% accuracy by leveraging reliable microservices architecture. Additionally, I developed management pages for several internal configuration systems, streamlining order processing and enabling corporate customers to efficiently manage enterprise order requests. To ensure seamless user experience, I implemented vee-validate for robust form error handling across these systems.",
      "skills": [
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/laravel-icon.png', import.meta.url).href,
        new URL('@/assets/stripe-icon.png', import.meta.url).href,
        new URL('@/assets/twilio-icon.png', import.meta.url).href,
        new URL('@/assets/mysql-icon.png', import.meta.url).href,
        new URL('@/assets/pinia-icon.png', import.meta.url).href,
        new URL('@/assets/bootstrap-icon.png', import.meta.url).href,
        new URL('@/assets/veevalidate_icon.png', import.meta.url).href
      ]
    }
  },
  {
    "id": 5,
    "name": "Vocabulary.Help",
    "icon": new URL('@/assets/vocabulary-help-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/vocabulary-help-icon.png', import.meta.url).href,
      "title": "Technical Product Developer",
      "url": "https://vocabulary.help/",
      "text": "Launched an offline-capable Progressive Web App (PWA) for language learning with spaced repetition. Implemented dark-light mode to improve usability. Developed with React, Text-to-Speech integration, and LocalStorage for persistence. Deployed via GitHub Pages with version control and commit management on GitHub. Optimized for SEO and accessibility (WCAG-compliant).",
      "skills": [
        new URL('@/assets/react-icon.png', import.meta.url).href,
        new URL('@/assets/localstorage-icon.png', import.meta.url).href,
        new URL('@/assets/seo-icon.png', import.meta.url).href,
        new URL('@/assets/i18n_icon.png', import.meta.url).href,
        new URL('@/assets/github_icon.png', import.meta.url).href,
        new URL('@/assets/ssl_icon.png', import.meta.url).href,
        new URL('@/assets/acm_icon.png', import.meta.url).href,
        new URL('@/assets/ts_icon.png', import.meta.url).href,
      ]
    }
  },
  {
    "id": 6,
    "name": "3Dish",
    "icon": new URL('@/assets/3dish-tech-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/3dish-tech-icon.png', import.meta.url).href,
      "title": "Technical Product Developer",
      "url": "https://3dish.tech/",
      "text": "I developed a web-based platform that allows restaurants to create interactive websites featuring 3D models of their dishes, enhancing the customer dining experience through Augmented Reality. Using Three.js and Google Model-Viewer, the platform enables users to view and explore realistic food models directly in their browsers. The full-stack application was built with Laravel for the backend and RESTful APIs, Vue.js for the frontend, and MySQL for data management. The backend and database are hosted on Railway, while the frontend is deployed via GitHub Pages, providing a seamless and accessible user experience.",
      "skills": [
        new URL('@/assets/three-js-icon.png', import.meta.url).href,
        new URL('@/assets/laravel-icon.png', import.meta.url).href,
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/mysql-icon.png', import.meta.url).href,
        new URL('@/assets/bootstrap-icon.png', import.meta.url).href,
        new URL('@/assets/ar_icon.png', import.meta.url).href,
        new URL('@/assets/railway_icon.png', import.meta.url).href,
      ]
    }
  },
  {
    "id": 7,
    "name": "Trueque Web",
    "icon": new URL('@/assets/trueque-icon.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/trueque-icon.png', import.meta.url).href,
      "title": "Front-end Developer",
      "url": "https://www.trueque.art/",
      "text": "Developed a responsive, cross-browser, and mobile-compatible web application using Vue.js, implementing internationalization (i18n) to support multiple languages and locales. Integrated SSL encryption via AWS Certificate Manager (ACM) to ensure secure HTTPS communication. Automated build, test, and deployment processes using GitHub Actions CI/CD, enabling streamlined and reliable delivery of code updates to production.",
      "skills": [
        new URL('@/assets/vue-js-icon.png', import.meta.url).href,
        new URL('@/assets/i18n_icon.png', import.meta.url).href,
        new URL('@/assets/github_icon.png', import.meta.url).href,
        new URL('@/assets/ssl_icon.png', import.meta.url).href,
        new URL('@/assets/acm_icon.png', import.meta.url).href,
      ]
    }
  },
  {
    "id": 8,
    "name": "Jeiberth.com",
    "icon": new URL('@/assets/jm.png', import.meta.url).href,
    "data": {
      "icon": new URL('@/assets/jm.png', import.meta.url).href,
      "title": "Front-end Developer",
      "url": "https://jeiberth.github.io/my-old-website/",
      "text": "This old website was something I built entirely on my own, back before ChatGPT even existed. I was learning as I went, figuring things out through trial and error, and putting everything I had into it. It’s made purely with HTML, CSS, and JavaScript—no frameworks, no AI, just me learning and building at the same time. There’s a lot of personal effort and growth behind it, and even though it's simple, it holds some nice memories and a few kind appreciations, which is why I’ve kept it here.",
      "skills": [
        new URL('@/assets/html.png', import.meta.url).href,
        new URL('@/assets/css.png', import.meta.url).href,
        new URL('@/assets/js.png', import.meta.url).href,
      ]
    }
  },
]);

// Taskbar applications data
const applications = reactive([]);
const nextZ = ref(1);

// Timer reference for cleanup
let timeInterval = null

// Methods
const selectApp = (appId) => {
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.z = nextZ.value++;
    app.show = !app.show;
    // activeAppId.value = appId;
  }
};

const takeUpfront = (apps) => {
  const app = applications.find(a => a.id === apps.id);
  if (app) {
    app.z = nextZ.value++;
  }
};


const selectDesktopApp = (appId) => {
  selectedAppId.value = appId
}

const deselectAllApps = () => {
  selectedAppId.value = null
}

const openApp = (app) => {
  let existingApp = applications.find(a => a.name === app.name);

  if (!existingApp) {
    const newApp = {
      id: app.id, // Use same ID as desktop app
      icon: app.icon,
      name: app.name,
      data: app.data,
      show: true,
      z: nextZ.value++
    };
    applications.push(newApp);
    activeAppId.value = newApp.id;
  } else {
    existingApp.show = true;
    existingApp.z = nextZ.value++;
    activeAppId.value = existingApp.id;
  }

  if(app.id == "error") {
    playSound();
  }
};


const handleStartClick = () => {
  showStartMenu.value = !showStartMenu.value
}

const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// Lifecycle hooks
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  // const audio = new Audio(new URL('@/assets/start_sound.mp3', import.meta.url).href)
  // audio.play().catch((err) => {
  //   console.warn('Audio failed to play automatically:', err)
  // })

  // // Trigger fade out after 3s
  // setTimeout(() => {
  //   fadeLoading.value = true

  //   // Fully remove the loading screen after fade duration
  //   setTimeout(() => {
  //     showLoading.value = false
  //   }, 1000) // Match this with CSS transition duration
  // }, 3000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* Container to prevent scrolling */
.windows-xp-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

.loading-screen {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 1s ease;
}

.loading-screen.fadeOut {
  opacity: 0;
}

.loading-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

  /* Custom overlay styles */
        .custom-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            transition: opacity 1s ease;
        }

        .custom-overlay.fadeOut {
            opacity: 0;
            pointer-events: none;
        }

        .top-section {
            height: 200px;
            background-color: hsl(221.54deg, 100%, 30.59%);
            position: relative;
            overflow: hidden;
        }

        .top-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .border-section {
            height: 2px;
            background: linear-gradient(to right, 
                transparent 0%, 
                white 10%, 
                white 90%, 
                transparent 100%);
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }

        .middle-section {
            flex: 1;
            background-color: hsl(223.38deg, 65%, 60.78%);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        .middle-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
            pointer-events: none;
        }

        .bottom-section {
            height: 200px;
            background-color: hsl(221.54deg, 100%, 30.59%);
            position: relative;
            overflow: hidden;
        }

        .bottom-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .content-container {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 80%;
            max-width: 800px;
        }

        .vertical-line {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(
                to bottom,
                transparent 0%,
                white 20%,
                white 80%,
                transparent 100%
            );
            z-index: 1;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        }

        .left-column, .right-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .left-column {
            align-items: flex-end;
            padding-right: 30px;
        }

        .right-column {
            align-items: flex-start;
            padding-left: 30px;
        }

        .loading-image {
            height: 200px;
            width: auto;
        }

        /* .user-container {
            display: flex;
            align-items: center;
            padding: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        } */

        .user-container {
            display: flex;
            align-items: center;
            padding: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            width: 100%;

            background: linear-gradient(to right, #13399b 80%, rgba(19, 57, 155, 0) 100%);

            border-top: 1px solid white;
            border-left: 1px solid white;
            border-bottom: 1px solid white;
            border-right: none;
        }


        .user-container::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            width: 30px;
            height: 30px;
            /* background: rgba(255, 255, 255, 0.2); */
            filter: blur(10px);
            z-index: 1;
        }


        .user-image {
            width: 80px;
            height: 80px;
            border: 0px solid rgba(255, 255, 255, 0.7);
            border-radius: 4px;
            padding: 5px;
        }

        .user-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }

        .user-label {
            margin-left: 15px;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
            font-size: 1.4rem;
        }

        .instructions {
            position: absolute;
            bottom: 30px;
            width: 100%;
            text-align: center;
            color: white;
            font-size: 1.1rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
            opacity: 0.9;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .content-container {
                flex-direction: column;
                width: 90%;
            }
            
            .left-column, .right-column {
                padding: 15px 0;
                align-items: center;
            }
            
            .vertical-line {
                left: 0;
                top: 50%;
                width: 100%;
                height: 2px;
                background: linear-gradient(
                    to right,
                    transparent 0%,
                    white 20%,
                    white 80%,
                    transparent 100%
                );
            }
            
            .loading-image {
                height: 150px;
            }
            
            .user-container {
                flex-direction: column;
                text-align: center;
                padding: 15px;
            }
            
            .user-label {
                margin: 10px 0 0 0;
            }
        }

        @media (max-width: 480px) {
            .top-section, .bottom-section {
                height: 150px;
            }
            
            .loading-image {
                height: 120px;
            }
            
            .user-image {
                width: 60px;
                height: 60px;
            }
            
            .user-label {
                font-size: 1.2rem;
            }
            
            .instructions {
                font-size: 0.9rem;
                bottom: 20px;
            }
        }
/* 
.main-page {
  flex: 1;
  background-image: url('@/assets/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #008080; 
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-auto-rows: 90px;
  gap: 36px;
  padding: 20px;
  align-content: start;
  overflow: hidden;
}
*/


.main-page {
    flex: 1;
  background-image: url('@/assets/bg.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #008080; /* Fallback teal color */
    position: relative;
    padding: 20px;
    overflow: hidden;
    
    /* Column layout instead of grid/flex */
    column-width: 120px;
    column-gap: 36px;
    column-fill: auto;
}


 .desktop-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 120px;
  height: 135px;
  cursor: pointer;
  border-radius: 3px;
  padding: 12px 6px 6px 6px;
  user-select: none;
  transition: all 0.1s ease;
} 

.app-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

.desktop-app-icon {
  width: 48px;
  height: 48px;
  transition: filter 0.1s ease;
}

.desktop-app.selected .desktop-app-icon {
    filter: brightness(1) saturate(0.5) hue-rotate(293deg);
}

.app-label {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 16px;
  color: #fff;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  word-wrap: break-word;
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.desktop-app.selected .app-label {
  background-color: rgba(49, 106, 197, 0.9);
  color: #fff;
  border-radius: 2px;
  padding: 1px 3px;
}

/* --- START MENU STYLES --- */
.start-menu {
  position: fixed;
  bottom: 40px; /* Height of the taskbar */
  left: 0;
  width: 400px;
  height: 500px;
  border-left: 3px solid rgb(8, 49, 217);
  border-right: 3px solid rgb(8, 49, 217);
  border-top: 3px solid rgb(8, 49, 217);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  z-index: 2000;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  overflow: hidden;
}

.start-menu-header {
  height: 60px;
  width: 100%;
  background: linear-gradient(
    rgb(24, 104, 206) 0%,
    rgb(14, 96, 203) 12%,
    rgb(14, 96, 203) 20%,
    rgb(17, 100, 207) 32%,
    rgb(22, 103, 207) 33%,
    rgb(27, 108, 211) 47%,
    rgb(30, 112, 217) 54%,
    rgb(36, 118, 220) 60%,
    rgb(41, 122, 224) 65%,
    rgb(52, 130, 227) 77%,
    rgb(55, 134, 229) 79%,
    rgb(66, 142, 233) 90%,
    rgb(71, 145, 235) 100%
  );
  display: flex;
  align-items: center;
  padding: 5px;
  color: white;
}

.user-avatar {
  width: 50px;
  height: 50px;
  margin: 5px;
  border: 2px solid rgba(222, 222, 222, 0.8);
  border-radius: 3px;
}

.user-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-left: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.start-menu-content {
  flex-grow: 1;
  display: flex;
  width: 100%;
  overflow: hidden;
}

.left-column-l, .right-column-l {
  width: 50%;
  padding: 8px 0;
  overflow-y: auto;
}

.left-column-l {
  background-color: rgb(255, 255, 255);
}

.right-column-l {
  background-color: rgb(203, 227, 255);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}

.menu-item:hover {
  background-color: rgb(47, 113, 205);
  color: white;
}

.menu-item-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.menu-item-label {
  font-size: 14px;
}

.start-menu-footer {
  height: 45px;
  width: 100%;
  background: linear-gradient(
    rgb(66, 130, 214) 0%, 
    rgb(59, 133, 224) 3%, 
    rgb(65, 138, 227) 5%, 
    rgb(65, 138, 227) 17%, 
    rgb(60, 135, 226) 21%, 
    rgb(55, 134, 228) 26%, 
    rgb(52, 130, 227) 29%, 
    rgb(46, 126, 225) 39%, 
    rgb(35, 116, 223) 49%, 
    rgb(32, 114, 219) 57%, 
    rgb(25, 110, 219) 62%, 
    rgb(23, 107, 216) 72%, 
    rgb(20, 104, 213) 75%, 
    rgb(17, 101, 210) 83%, 
    rgb(15, 97, 203) 88%
  );
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
  gap: 15px;
}

.footer-action {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
  padding: 4px;
  border-radius: 3px;
  transition: background-color 0.15s ease-in-out;
}

.footer-action:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.footer-icon {
  width: 28px;
  height: 28px;
}

.footer-label {
  font-size: 13px;
  font-weight: 500;
}
/* --- END OF START MENU STYLES --- */


/* Taskbar */
.taskbar {
  height: 40px;
  /* background: linear-gradient(to bottom, #A3C4E5 0%, #3A6EA5 50%, #1C3F72 100%);
  border-top: 1px solid #5A8BD1; */
  background: linear-gradient(rgb(31, 47, 134) 0px, rgb(49, 101, 196) 3%, rgb(54, 130, 229) 6%, rgb(68, 144, 230) 10%, rgb(56, 131, 229) 12%, rgb(43, 113, 224) 15%, rgb(38, 99, 218) 18%, rgb(35, 91, 214) 20%, rgb(34, 88, 213) 23%, rgb(33, 87, 214) 38%, rgb(36, 93, 219) 54%, rgb(37, 98, 223) 86%, rgb(36, 95, 220) 89%, rgb(33, 88, 212) 92%, rgb(29, 78, 192) 95%, rgb(25, 65, 165) 98%);
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;
  z-index: 2001;
}

/* Start Button */
.start-button-container {
  padding: 0px;
  height: 100%;
}

.start-button-image {
  height: 100%;
  cursor: pointer;
  transition: filter 0.1s ease;
}

.start-button-image:hover {
  filter: brightness(1.1);
}

.start-button-image:active {
  filter: brightness(0.9);
  transform: translateY(1px);
}

/* Application Buttons Container */
.taskbar-buttons-container {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 100%;
  flex: 1;
  padding: 0 4px;
  overflow: hidden;
}

/* Taskbar Application Buttons */
.taskbar-button {
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 120px;
  max-width: 180px;
  padding: 2px 6px;
  margin: 0 1px;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 11px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.1s ease;
}

/* Active (pressed) button styling */
.taskbar-button.active {
  /* background: linear-gradient(to bottom, #316AC5 0%, #4A7BC8 20%, #5A8BD1 80%, #6B9BDA 100%);
  border-color: #0F2C5C #4A7BC8 #6B9BDA #0F2C5C;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3), inset -1px -1px 1px rgba(255, 255, 255, 0.1); */
  
  background-color: rgb(30, 82, 183);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.7) 1px 0px 1px inset;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

/* Inactive (normal) button styling */
.taskbar-button.inactive {
  color: rgb(255, 255, 255);
  border-radius: 2px;
  margin-top: 2px;
  padding: 0px 8px;
  /* height: 22px; */
  font-size: 11px;
  background-color: rgb(60, 129, 243);
  box-shadow: rgba(0, 0, 0, 0.3) -1px 0px inset, rgba(255, 255, 255, 0.2) 1px 1px 1px inset;
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}

.taskbar-button.inactive:hover {
  background: rgb(83 163 255);
  border-color: #9CD7FF #B8E2FF #D4EDFF #4A7BC8;
}

.taskbar-button.active:hover {
  background: rgb(53 118 243);
}

/* App icon and name */
.app-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
}

.app-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* Button press animation */
.taskbar-button:active {
  transform: translateY(1px);
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.4);
}

/* System Tray */
.system-tray {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  /* background: linear-gradient(to bottom, #C1D9F0 0%, #629DD1 50%, #325C85 100%);
  border: 1px solid #4A7BC8;
  border-top: 1px solid #7DBEFF;
  border-left: 1px solid #5A8BD1;
  padding: 2px 8px;
  margin: 2px;
  box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.3); */
  background: linear-gradient(rgb(12, 89, 185) 1%, rgb(19, 158, 233) 6%, rgb(24, 181, 242) 10%, rgb(19, 155, 235) 14%, rgb(18, 144, 232) 19%, rgb(13, 141, 234) 63%, rgb(13, 159, 241) 81%, rgb(15, 158, 237) 88%, rgb(17, 155, 233) 91%, rgb(19, 146, 226) 94%, rgb(19, 126, 215) 97%, rgb(9, 91, 201) 100%);
  border-left: 1px solid rgb(16, 66, 175);
  box-shadow: rgb(24, 187, 255) 1px 0px 1px inset;
  padding: 0px 10px;
  margin-left: 10px;
}

/* Language Selector */
.language-selector {
  background: linear-gradient(to bottom, #E6F2FF 0%, #CAE6FF 50%, #A3D1FF 100%);
  border: 1px solid #5A8BD1;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 10px;
  padding: 2px 4px;
  color: #000;
  cursor: pointer;
  border-radius: 2px;
}

.language-selector:focus {
  outline: 1px dotted #000;
  outline-offset: -2px;
}

/* Clock */
.clock {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 11px;
  color: white;
  font-weight: normal;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  min-width: 35px;
  text-align: center;
}

/* Remove body margins and ensure full viewport */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}


</style>

