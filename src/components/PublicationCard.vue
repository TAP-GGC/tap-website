<script setup>
import { computed, ref, watchEffect } from "vue";
// Components CSS
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";
import { formatIDtoName } from './astro/formatNames';

// Remove single slash as it causes double slashes in card
const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const publicationProp = defineProps({
        item: Object
    });

// publication Photos
let publicationPhoto = publicationProp.item.data.image?.src;

// Truncate abstract to a fixed number of characters
const truncatedAbstract = computed(() => {
  const abstract = publicationProp.item.data.abstract || '';
  return abstract.length > 250
    ? abstract.substring(0, 250)
    : abstract;
});
const showReadMore = computed(() => {
  return (publicationProp.item.data.abstract || '').length > 250;});

const date_options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const openPaper = () => {
  if (publicationProp.item.data.paperLink) {
    window.open(publicationProp.item.data.paperLink, '_blank');
  }
};

const studentIds = publicationProp.item?.data?.students.concat(publicationProp.item?.data?.instructors || []);
const studentNames = await Promise.all(studentIds.map((studentId) => formatIDtoName(studentId)));
const studentMap = new Map(studentIds.entries().map(([index, studentId]) => [studentId, studentNames[index]]));

</script>

<template>
  <Card css="publicationCard" isShadow>
    
    <div class="publicationText">                        
      <img :src= "publicationPhoto" alt="publication Image" class="publicationImage imageLight imageDark">

      <h4 class="publicationTitle">{{ item.data.title }}</h4>

      <h6 class="dateStamp">
        {{ item.data.semester +', '+ item.data.year }} <br />
        publication Date: {{ item.data.postDate.toLocaleDateString(undefined, date_options) }}
      </h6> 


      <p class="abstract">
        {{ truncatedAbstract }}<a :href="`item.data.paperLink`" 
        class="card-link" isShadow
        target="_blank" rel="noopener noreferrer">
          ... Read More!
        </a>
      </p>

      <div class="tag-container">
        <a v-for="(student, index) in item.data.students" :key="index" :href="`/students/${student}`" class="tag"> {{ studentMap.get(student) }}</a>
        <a v-for="(instructor, index) in item.data.instructors" :key="index" :href="`/instructors/${instructor}`" class="tag"> {{ studentMap.get(instructor) }}</a>

      </div>
    </div>
  </Card>
</template>


<style scoped>

.publicationImage {
    --project-logo-width: 14em;
    float: left;
    margin-right: 1em;
    width: var(--project-logo-width);
    padding-top: 0.5em;
		padding-right: 0.5em;
}

.publicationText {
    text-align: left;
    width: calc(100% ); 
}

.abstract{
  font-size: larger;
}

.publicationTitle {
    text-align: left;
    margin: 0;
    flex: 1;
    padding-right: 1em; /* Prpublications title from touching date */
    max-width: calc(100% - 2em); /* Prpublications title from being too long */
}

.publicationCard {
  width: 90% !important;
  margin: 0 auto;
  padding: 1.25em;
  /*flex: 1; since .card-link  is now the flex component */
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
  position: relative;
}

.publicationCard:hover{
    transform: translateY(-3px);

}

.publicationCard h4 {
    margin-bottom: 0.5em;
}

/* Ensure the card link covers the entire card and removes default anchor styling */
.publicationCard .card-link {
  text-decoration: underline;
  pointer-publications: auto; /* Allow the card itself to be clickable */
}

/* expands the clickable area of the main link 
  to fill the parent container, because it's the nearest
  ancestor with "position:relative" */
.publicationCard .card-link::before {
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

export { Card };
