<template>
    
        <Card
            isStacked
            isShadow
            isAnimated
            class=card-main
            style=" background-image: url('./images/list-cards/tap-awards-board.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
            <div class="overlay">
                <div class="h4 p16 card-title">
                    TAP Awards
                </div>
                <div>
                    <ul> <!-- order recent projects by date? -->
                        <li v-for="awardEntry in awardEntries">
                            <a :href="`${base}/awards/${awardEntry.data.year}/${awardEntry.data.semester}/${awardEntry.data.id}`">{{ awardEntry.data.title }}</a> &nbsp;
                            {{ awardEntry.data.eventDate.toDateString() }}
                        </li>
                        <li>
                            <a :href="`${base}/awards/`">More Awards . . .</a>
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    
  </template>
  
  <script setup>
  import { computed, ref } from "vue";
  // Components CSS
  import "agnostic-vue/dist/index.css";
  import { Card } from "agnostic-vue";
  
  // load blog content: news, etc.
  import { getCollection } from 'astro:content';
  const awardEntries = (await getCollection('awards')).sort( (p1, p2) => p2.data.eventDate - p1.data.eventDate ).slice(0,6);
  // Remove single slash as it causes double slashes in card
  const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;
  </script>
  
  <style scoped>
  </style>
  