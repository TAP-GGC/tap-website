<script setup>
import { computed } from "vue";
import "agnostic-vue/dist/common.min.css";
import "agnostic-vue/dist/index.css";
import { Card } from "agnostic-vue";
import { formatIDtoName } from './astro/formatNames';
import placeholderLight from "../images/tap-news-placeholder-light.png";
import placeholderDark from "../images/tap-news-placeholder-dark.png";

const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

const awardProp = defineProps({
  item: Object
});

const awardPhoto = computed(() => {
  const image = awardProp.item?.data?.image;
  return typeof image === "string" ? image : image?.src;
});

const awardPhotoLight = computed(() => awardPhoto.value || placeholderLight.src);
const awardPhotoDark = computed(() => awardPhoto.value || placeholderDark.src);

const maxDescriptionLength = 125;
const truncatedDescription = computed(() => {
  const desc = awardProp.item?.data?.desc || '';
  return desc.length > maxDescriptionLength
    ? desc.substring(0, maxDescriptionLength) + '… Read more'
    : desc;
});

const dateOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};
</script>

<template>
  <Card css="awardCard" isShadow>
    <a :href="`${base}/awards/${item.data.year}/${item.data.semester}/${item.data.id}`" class="card-link"></a>
    <div class="awardText">
      <img :src="awardPhotoLight" alt="Award Image" class="awardImage imageLight">
      <img :src="awardPhotoDark" alt="Award Image" class="awardImage imageDark">

      <h4 class="awardTitle">{{ item.data.title }}</h4>

      <h6 class="dateStamp">
        {{ item.data.semester.charAt(0).toUpperCase() + item.data.semester.slice(1) }} {{ item.data.year }} <br />
        Award Date: {{ item.data.eventDate.toLocaleDateString(undefined, dateOptions) }}
      </h6>

      <p class="description">{{ truncatedDescription }}</p>

      <div v-if="item.data.students?.length" class="tag-container">
        <a
          v-for="student in item.data.students"
          :key="student"
          :href="`${base}/students/${student}`"
          class="tag"
        >{{ formatIDtoName(student) }}</a>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.awardImage {
  --award-image-width: 14em;
  float: left;
  margin-right: 1em;
  width: var(--award-image-width);
  padding-top: 0.5em;
  padding-right: 0.5em;
}

.awardText {
  text-align: left;
  width: 100%;
}

.description {
  font-size: larger;
}

.awardTitle {
  text-align: left;
  margin: 0;
  flex: 1;
  padding-right: 1em;
  max-width: calc(100% - 2em);
}

.awardCard {
  min-width: 20rem !important;
  max-width: 40rem;
  margin: 0.75em auto;
  padding: 1.25em;
  background-color: var(--agnostic-gray-mid);
  transition: transform 0.2s ease-in;
  position: relative;
}

.awardCard:hover {
  transform: translateY(-3px);
}

.awardCard h4 {
  margin-bottom: 0.5em;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

.tag {
  display: inline-block;
  padding: 0.25em 0.75em;
  font-size: 0.875em;
  color: var(--agnostic-btn-primary-color, var(--agnostic-light));
  border-radius: var(--agnostic-btn-radius, var(--agnostic-radius, .25rem));
  text-decoration: none;
}

.tag:hover {
  color: var(--agnostic-btn-hover-color, white);
}

.awardCard .card-link {
  text-decoration: none;
  color: inherit;
  pointer-events: auto;
  display: block;
}

.awardCard .card-link::before {
  content: '';
  position: absolute;
  inset: 0;
}

.dateStamp {
  text-align: left;
  font-style: italic;
  font-size: small;
  white-space: nowrap;
  clear: none;
}

@media (max-width: 40rem) {
  .awardImage {
    float: none;
    display: block;
    width: min(100%, 14em);
    margin: 0 auto 0.75em;
  }
}
</style>
