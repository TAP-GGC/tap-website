<script setup>
import { computed, ref, onMounted } from "vue";
// Components CSS
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";
import { formatIDtoName } from './astro/formatNames';
import placeholderLight from "../images/tap-news-placeholder-light.png";
import placeholderDark  from "../images/tap-news-placeholder-dark.png";

// import placeholderLight from '/src/images/tap-news-placeholder-light.png';
// import placeholderDark from '/src/images/tap-news-placeholder-dark.png';

// Remove single slash as it causes double slashes in card
const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const eventProp = defineProps({
        item: Object
    });

    // Dark mode detection
// const isDarkMode = ref(false);

// onMounted(() => {
//   // Check for dark mode preference
//   isDarkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
//   // Listen for changes
//   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//     isDarkMode.value = e.matches;
//   });
// });


// Event Photos
const eventPhoto = computed(() => {
  const v = eventProp.item?.data?.imageEvent;
  return typeof v === "string" ? v : v?.src;
});

const eventPhotoLight = computed(() => eventPhoto.value || placeholderLight.src);
const eventPhotoDark  = computed(() => eventPhoto.value || placeholderDark.src);

// const finalEventPhoto = computed(() => eventPhoto? eventPhoto : eventPhotoLight.value || eventPhotoDark.value);


// Truncate description to a fixed number of characters
const maxDescriptionLength = 125; // Adjust the length as needed
const truncatedDescription = computed(() => {
  const desc = eventProp.item.data.desc || '';
  return desc.length > maxDescriptionLength
    ? desc.substring(0, maxDescriptionLength) + '. Read more'
    : desc;
});

const date_options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
</script>

<template>
    
    <Card css="eventCard" isShadow>
      <a :href="`/posts/${item.data.year}/${item.data.semester}/${item.data.id}`" class="card-link" isShadow></a>
       <div class="eventText">                        
        

          <img :src= "eventPhotoLight" alt="Event Image" class="eventImage imageLight">
          <img :src= "eventPhotoDark" alt="Event Image" class="eventImage imageDark">

          <h4 class="eventTitle">{{ item.data.title }}</h4>

          <h6 class="dateStamp">
            {{ item.data.semester.charAt(0).toUpperCase() + item.data.semester.slice(1) }} {{ item.data.year }} <br />
            Event Date: {{ item.data.eventDate.toLocaleDateString(undefined, date_options) }}
          </h6> 


            <p class="description">{{ truncatedDescription }}</p>

            <!-- Display students as Tags -->
            <div class="tag-container">
              <a v-for="(student, index) in item.data.students" :key="index" :href="`/students/${student}`"> {{ formatIDtoName(student) }}</a>

            </div>
      </div>
    </Card>
</template>


<style scoped>

.eventImage {
    --project-logo-width: 14em;
    float: left;
    margin-right: 1em;
    width: var(--project-logo-width);
    padding-top: 0.5em;
		padding-right: 0.5em;
}

.eventText {
    text-align: left;
    width: calc(100% ); 
}

.description{
  font-size: larger;
}

.eventTitle {
    text-align: left;
    margin: 0;
    flex: 1;
    padding-right: 1em; /* Prevents title from touching date */
    max-width: calc(100% - 2em); /* Prevents title from being too long */
    /* clear: both; */
}

.eventCard {
  min-width: 20rem !important;
  max-width: 40rem;
  margin: 0.75em auto;
  padding: 1.25em;
  /*flex: 1; since .card-link  is now the flex component */
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
  position: relative;
}

.eventCard:hover{
    transform: translateY(-3px);

}

.eventCard h4 {
    margin-bottom: 0.5em;
}

/* Ensure the card link covers the entire card and removes default anchor styling */
.eventCard .card-link {
  text-decoration: none;
  color: inherit;
  pointer-events: auto; /* Allow the card itself to be clickable */
  display: block;
}

/* expands the clickable area of the main link 
  to fill the parent container, because it's the nearest
  ancestor with "position:relative" */
.eventCard .card-link::before {
  content: '';
  position: absolute;
  inset: 0; 
}

/* Date shown to the right and small */
.dateStamp {
  text-align: left;
  font-style: italic;
  font-size: small;
  white-space: nowrap;
  clear: none;
}
</style>
