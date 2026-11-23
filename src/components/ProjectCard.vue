<script setup>
import { computed, ref } from "vue";
// Components CSS
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";

// Remove single slash as it causes double slashes in card
const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const projectProp = defineProps({
        item: Object
    });

// Logos
const imageLogoLight = computed(() =>
  projectProp.item.data.imageLogoLight?.src || projectProp.item.data.imageLogoDark?.src
);

const imageLogoDark = computed(() =>
  projectProp.item.data.imageLogoDark?.src || projectProp.item.data.imageLogoLight?.src
);

// Truncate description to a fixed number of characters
const maxDescriptionLength = 100; // Adjust the length as needed
const truncatedDescription = computed(() => {
  const desc = projectProp.item.data.desc || '';
  return desc.length > maxDescriptionLength
    ? desc.substring(0, maxDescriptionLength) + '...'
    : desc;
});

const date_options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
</script>

<template>
    
    <Card css="projectCard" isShadow>
        <a :href="`/projects/${item.data.year}/${item.data.semester}/${item.data.id}`" class="card-link" isShadow></a>
        <div class="projectText">                        

            <img :src="imageLogoLight" alt="Project Image Light" class="projectImage imageLight">
            <img :src="imageLogoDark" alt="Project Image Dark" class="projectImage imageDark">

            <h4 class="projectTitle">{{ item.data.shortTitle ? item.data.shortTitle : item.data.title }}</h4>

            <div class="dateStamp">Updated {{ item.data.publishedDate.toLocaleDateString(undefined, date_options) }}</div>

            <!-- Display Techs as Tags -->
            <p><em>Techs:</em></p>
            <div class="tag-container">
                <a v-for="(tech, index) in item.data.techs" :key="index" :href="`/techs/${tech}`" class="tag" >{{ tech }}</a>
            </div>

            <p class="description">{{ truncatedDescription }}</p>

            <!-- Display students as Tags (disable for now)
            <p><em>Students:</em></p>
            <div class="tag-container">
                <a v-for="(student, index) in item.data.students" :key="index" :href="`/students/${student}`" class="tag">{{ student }}</a>
            </div>-->
        
            <!-- <p>{{ item.data.semester.charAt(0).toUpperCase() + item.data.semester.slice(1) }} {{ item.data.year }}</p> -->

            <!-- <p><a href="`${item.data.github}`">Github link</a></p> -->
        </div>
    </Card>
    
</template>


<style scoped>

.projectImage {
    --project-logo-width: 14em;
    float: left;
    margin-right: 1em;
    width: var(--project-logo-width);
}

.projectText {
    text-align: left; /* or justify? */
    width: calc(100% ); /* - var(--project-logo-width) - 1em  */
}

.projectText p {
    margin-top: 1em;
}

.projectTitle {
    text-align: left;
}

.projectCard {
  min-width: 20rem !important;
  max-width: 35rem;
  margin: 0.5em;
  padding: 1em 1em 1em;
  /*flex: 1; since .card-link  is now the flex component */
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
}

.projectCard:hover{
    transform: translateY(-3px);

}

.projectCard h4 {
    margin-bottom: 0.5em;
}

/* Ensure the card link covers the entire card and removes default anchor styling */
.projectCard .card-link {
  text-decoration: none;
  color: inherit;
  pointer-events: auto; /* Allow the card itself to be clickable */
  display: block;
}

/* expands the clickable area of the main link 
  to fill the parent container, because it's the nearest
  ancestor with "position:relative" */
.projectCard .card-link::before {
  content: '';
  position: absolute;
  inset: 0; 
}

/* .projectCard {
  pointer-events: auto; 
} */

/* Date shown to the right and small */
.dateStamp {
  text-align: left;
  font-style: italic;
  font-size: small;
  height: 0;
  margin: 0;
}

/* Don't remove makes adjusts for mobile */
@media (max-width: 800px) {
    .projectCard {
    min-width: 10rem !important;
    max-width: 20rem;
    margin: 0.5em auto !important;
    padding: 1em 1em 1em;
    background-color: var(--agnostic-gray-mid);
    transition: transform 0.2s ease-in;
  }
  .projectImage {
      --project-logo-width: 7em;
      float: inline-end; /* changed because of weird pacing on some project logos */
      margin-right: 0.5em;
      margin-top: 0.5em;
      width: var(--project-logo-width);
      height: 8em;
  }
  .projectText {
    text-align: left; 
    width: calc(100% ); /* - var(--project-logo-width) - 1em  */
  }
  
}
</style>

// Export the Card components for each project
export { Card };
