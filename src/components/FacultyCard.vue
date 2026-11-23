<script setup>
import { computed, ref } from "vue";
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";

// Remove single slash as it causes double slashes in card
const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const facultyProp = defineProps({
        item: Object
    });

const imageSrc = computed(() => facultyProp.item.data.image?.src || '/public/images/placeholder.png');
const facultyName = computed(() => facultyProp.item.data.name || 'Unknown faculty');


// Truncate description to a fixed number of characters
const maxDescriptionLength = 100; // Adjust the length as needed
const truncatedDescription = computed(() => {
  const desc = facultyProp.item.data.desc || '';
  return desc.length > maxDescriptionLength
    ? desc.substring(0, maxDescriptionLength) + '...'
    : desc;
});
</script>

<template>
    <Card css="facultyCard" isShadow>
        <a :href="`/instructors/${item.data.id}`" class="card-link" isShadow></a>
        <div class="facultyText">   
            <img :src="imageSrc" alt="Faculty Image" class="facultyImage">
            <h4 class="facultyTitle">{{ facultyName}}</h4>
            <p class="description">{{ truncatedDescription }}</p>
            <div class="tag-container">
                <!-- Check if the link exists before rendering it -->
                <a v-if="item.data.website" :href="item.data.website" class="tag">Website</a>
                <a v-if="item.data.github" :href="item.data.github" class="tag">GitHub</a>
                <a v-if="item.data.linkedin" :href="item.data.linkedin" class="tag">LinkedIn</a>
            </div>
        </div> 
    </Card>
</template>


<style scoped>
.facultyImage {
    --project-logo-width: 14em;
    float: left;
    margin-right: 1em;
    width: var(--project-logo-width);
}

.facultyText {
    text-align: left;
    width: calc(100% );
}


.facultyText p {
    margin-top: 1em;
}

.facultyTitle {
    text-align: left;
}

.facultyCard {
  min-width: 20rem !important;
  max-width: 35rem;
  margin: 0.5em;
  padding: 1em ;
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
}

.facultyCard:hover{
    transform: translateY(-3px);

}

.facultyCard h4 {
    margin-bottom: 0.5em;
}

/* Ensure the card link covers the entire card and removes default anchor styling */
.facultyCard .card-link {
  text-decoration: none;
  color: inherit;
  pointer-events: auto; /* Allow the card itself to be clickable */
  display: block;
}

.facultyCard .card-link::before {
  content: '';
  position: absolute;
  inset: 0; 
}

/* Don't remove makes adjusts for mobile */
@media (max-width: 800px) {
    .facultyCard {
    min-width: 10rem !important;
    max-width: 20rem;
    margin: 0.5em auto;
    padding: 1em 1em 1em;
    background-color: var(--agnostic-gray-mid);
    transition: transform 0.2s ease-in;
  }
  .facultyImage {
      --project-logo-width: 7em;
      float: left;
      margin-right: 0.5em;
      width: var(--project-logo-width);
      height: 8em;
  }
  
}

</style>