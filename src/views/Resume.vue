<template>
    <p>Downloading resume...</p>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed  } from 'vue'

    onMounted(() => {
        const link = document.createElement('a')
        link.href = './Jeiberth_Malagon_FullStack_AI_Developer_Resume.pdf'
        link.download = 'Jeiberth_Malagon_FullStack_AI_Developer_Resume.pdf'
        link.click()

        // Optional: redirect after download
        setTimeout(() => {
            window.location.href = '#/'
        }, 1000)
    })
</script>
