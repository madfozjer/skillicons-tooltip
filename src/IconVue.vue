<script setup>
import { defineProps, ref, computed, onMounted } from "vue";

const props = defineProps({
    skill: String,
    position: {
        type: String,
        default: "top"
    }
});

const data = ref({});

onMounted(async () => {
    try {
        const res = await fetch("/data.json");
        data.value = await res.json();
    } catch (error) {
        console.error("An error occurred while loading data.json:", error);
    }
});

const positionComputed = computed(() => {
    let style = "position: absolute;";
    if (props.position == "top") {
        style += "bottom: calc(100% + 0.5rem); right: 25%;";
    } else if (props.position == "bottom") {
        style += "top: calc(100% + 0.5rem); left: 75%;";
    } else if (props.position == "bottom-left") {
        style += "top: calc(100% + 0.5rem); right: 100%;";
    } else if (props.position == "bottom-right") {
        style += "top: calc(100% + 0.5rem); left: 100%;";
    } else if (props.position == "top-right") {
        style += "bottom: calc(100% + 0.5rem); left: 100%;";
    } else if (props.position == "top-left") {
        style += "bottom: calc(100% + 0.5rem); right: 100%;";
    }
    return style;
});

function markdownConvert(string) {
    return string?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const imageLink = `https://skills.syvixor.com/api/icons?i=${props.skill}`;
const isHovered = ref(false);
</script>

<template>
    <div style="position: relative">
        <img :src="imageLink" :alt="skill + ' icon'" style="width: fit-content; height: fit-content; cursor: pointer"
            @mouseover="isHovered = true" @mouseleave="isHovered = false" />
        <Transition name="tooltip-fade">
            <div v-if="isHovered" style="
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
            background-color: rgb(31 41 55);
            color: rgb(255 255 255);
            font-size: 0.675rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            z-index: 10;
            white-space: normal;
            overflow-wrap: break-word;
            max-width: 75%;
            min-width: 200px;" :style="positionComputed"
                v-html="markdownConvert(data[props.skill] || 'Description coming soon...')">
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Transition styles for the tooltip */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
    transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
    opacity: 0;
}
</style>