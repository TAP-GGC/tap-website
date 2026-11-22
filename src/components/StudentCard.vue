<script setup>
import { computed, ref } from "vue";
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";
import EmptyImage from '/src/content/students/JohnDoe/johndoe.jpg';

// Remove single slash as it causes double slashes in card
const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const studentProp = defineProps({
        item: Object
    });

const imageSrc = computed(() => studentProp.item.data.image?.src || EmptyImage.src);
const studentName = computed(() => studentProp.item.data.name || 'Unknown Student');


// Truncate description to a fixed number of characters
const maxDescriptionLength = 200; // Adjust the length as needed
const truncatedDescription = computed(() => {
  const desc = studentProp.item.data.desc || '';
  return desc.length > maxDescriptionLength
    ? desc.substring(0, maxDescriptionLength) + '...'
    : desc;
});
</script>

<template>
    <Card css="studentCard" isShadow>
        <a :href="`/students/${item.data.id}`" class="card-link" isShadow></a>
        <div class="studentText">   
            <img :src="imageSrc" alt="Student Image" class="studentImage">
            <h4 class="studentTitle">{{ studentName}}</h4>
            <p class="description">{{ truncatedDescription }}</p>
            <div class="tag-container">
                <!-- Check if the link exists before rendering it -->
                <a v-if="item.data.website" :href="item.data.website" class="tag" target="_blank">Website</a>
                <a v-if="item.data.github" :href="item.data.github" class="tag" target="_blank">GitHub</a>
                <a v-if="item.data.linkedin" :href="item.data.linkedin" class="tag" target="_blank">LinkedIn</a>
            </div>
        </div> 
    </Card>
</template>

<style scoped>
.studentImage {
    --project-logo-width: 14em;
    float: left;
    margin-right: 1em;
    width: var(--project-logo-width);
}

.studentText {
    text-align: left;
    width: calc(100% );
}


.studentText p {
    margin-top: 1em;
}

.studentTitle {
    text-align: left;
}

.studentCard {
  min-width: 20rem !important;
  max-width: 35rem; /** */
  margin: 0.5em;
  padding: 1em 1em 1em;
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
}


.studentCard:hover{
    transform: translateY(-3px);

}

.studentCard h4 {
    margin-bottom: 0.5em;
}

/* Ensure the card link covers the entire card and removes default anchor styling */
.studentCard .card-link {
  text-decoration: none;
  color: inherit;
  pointer-events: auto; /* Allow the card itself to be clickable */
  display: block;
}

/* expands the clickable area of the main link 
  to fill the parent container, because it's the nearest
  ancestor with "position:relative" */
.studentCard .card-link::before {
  content: '';
  position: absolute;
  inset: 0; 
}

/* Don't remove makes adjusts for mobile */
@media (max-width: 800px) {
    .studentCard {
    min-width: 10rem !important;
    max-width: 20rem;
    margin: 0.5em auto;
    padding: 1em 1em 1em;
    background-color: var(--agnostic-gray-mid);
    transition: transform 0.2s ease-in;
  }
  .studentImage {
      --project-logo-width: 10em;
      float: left;
      margin-right: 0.5em;
      margin-top: 0.5em;
      width: var(--project-logo-width);
      height: 10em;
  }
  
}

</style>