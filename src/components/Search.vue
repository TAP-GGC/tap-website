<script setup>
import { computed, ref, watch, watchEffect } from "vue";
// Components CSS
import "agnostic-vue/dist/index.css";
import "agnostic-vue/dist/common.min.css";
import { Input, Card, Select } from "agnostic-vue";
import { Button } from 'agnostic-vue';

// Component Imports
import AwardCard from "./AwardCard.vue";
import EventCard from "./EventCard.vue";
import PublicationCard from "./PublicationCard.vue";
import Pagination from "./Pagination.vue";

// load content from props
const props = defineProps({
        eventsList: Object,
        filter: Object,
        context: String,
        namesMap: Object
    });
const content = props.eventsList;
const search_text = ref("");
const student = props.filter?.student ? ref([props.filter.student]) : ref(['Any']);
const instructor = props.filter?.instructor ? ref([props.filter.instructor]) : ref(['Any']);
const year =  props.filter?.year ? ref([props.filter.year]) : ref(['Any']);
const semester =  props.filter?.semester ? ref([props.filter.semester]) : ref(['Any']);
const tech = props.filter?.tech ? ref([props.filter.tech]) : ref(['Any']);


// Semester list constant
const semesterList = ref([
    {value:'Any', label:'Any'}
    ,{value: 'fall', label:'Fall'}
    ,{value: 'spring', label:'Spring'}
    ,{value: 'summer', label:'Summer'}]);

function createOptions(items, field) {
    let optionSet = new Set();
    optionSet.add("Any");

    items.forEach(item => {
        const fieldData = item.data[field];
         if(Array.isArray(fieldData)){
            fieldData.forEach(element => optionSet.add(element));
        }else if (fieldData){
            optionSet.add(fieldData);
        }    
    });
    return Array.from(optionSet).filter(option => option !== undefined && option !== null).map(option => ({value: option, label: option}))
}

const yearOptions = createOptions(content, "year");
const techOptions = createOptions(content, "techs");

function matches(item) {
  // Apply filters
  if (year.value != 'Any' && !year.value.includes(item.data.year.toString())) {
    return false;
  }
  if (semester.value != 'Any' && !semester.value.includes(item.data.semester)) {
    return false;
  }
  if (props.context === 'events' && tech.value != 'Any' && 
      !tech.value.some(t => item.data.techs?.includes(t))) {
    return false;
  }

  // Apply search text
  const searchText = search_text.value.toLowerCase();
  if (!searchText) return true;

  // Common search fields
  if (item.data.title?.toLowerCase().includes(searchText) ||
      `${item.data.year}`.includes(searchText)) {
    return true;
  }

  // Content type specific search fields
  if (props.context === 'events') {
    return item.data.techs?.some(t => t.toLowerCase().includes(searchText)) ||
           item.data.instructors?.some(i => i.toLowerCase().includes(searchText)) ||
           item.data.students?.some(s => s.toLowerCase().includes(searchText)) ||
           item.data.curator?.some(c => c.toLowerCase().includes(searchText));
  } else if (props.context === 'publications' || props.context === 'slides') {
    return item.data.abstract?.toLowerCase().includes(searchText) ||
           item.data.students?.some(s => s.toLowerCase().includes(searchText)) ||
           item.data.instructors?.some(i => i.toLowerCase().includes(searchText)) ||
           item.data.projects?.some(p => p.toLowerCase().includes(searchText));
  } else {
    return item.data.desc?.toLowerCase().includes(searchText) ||
           item.data.tags?.some(t => t.toLowerCase().includes(searchText)) ||
           item.data.students?.some(s => s.toLowerCase().includes(searchText)) ||
           item.data.instructors?.some(i => i.toLowerCase().includes(searchText)) ||
           item.data.projects?.some(p => p.toLowerCase().includes(searchText));
  }
}

// Pagination 
const currentPage = ref(1); 
const pageSize = ref(6);

const filteredItems = computed(() => {
  return content.filter(item => matches(item));
});

// Paginated slice
const paginatedItems = ref([]);
watchEffect(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedItems.value = filteredItems.value.slice(start, end);
});

// Total pages
const totalPages = computed(() =>
  Math.max(1, Math.ceil((filteredItems.value.length || 0) / (pageSize.value || 1)))
);

// Clamp page when results shrink
watch([filteredItems, pageSize], () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

const base = import.meta.env.BASE_URL;
const contextLabel = computed(() => {
  if (props.context === 'events') return 'Events';
  if (props.context === 'publications') return 'Publications';
  if (props.context === 'slides') return 'Presentations';
  return 'Awards';
});
</script>

<template>
    <div>
    
    <section class="mbe40">

        <Input 
        id="search-input"
        is-underlined 
        is-underlined-with-background 
        :placeholder="`Enter ${contextLabel.toLowerCase()} name, student, technology…`"
        :label="`Search for ${contextLabel.toLowerCase()}`" 
        type="text" 
        v-model="search_text"/>
        
        <div class="content-filter-container">            
            <div class="content-filter-dropdown">
                <label>Tech:</label>
                <Select unique-id="tech" :options="techOptions" :is-multiple="true" :multiple-size="3" @selected="(value) => { tech = value }">
                </Select>
            </div>

            <div class="content-filter-dropdown">
                <label>Semester</label>
                <Select name="semester" unique-id="sem" @selected="(value) => { semester = value }" 
                    label-copy="Select a semester to filter results" 
                    :options="semesterList" :is-multiple="true" :multiple-size="3">
                </Select>
            </div>

            <div class="content-filter-dropdown">
                <label>Year</label>
                <Select name="year" unique-id="year" @selected="(value) => { year = value }" 
                    label-copy="Select a year to filter results" 
                    :options="yearOptions" :is-multiple="true" :multiple-size="3">
                </Select>
            </div>
            <div class="content-filter-dropdown">
                <a :href="`${base == '/' ? '' : base}/${context}`">
			        <Button mode="primary" isRounded>Reset</button>
			    </a>
            </div>
        </div>        

    </section>

    <h3>
         {{ ((search_text || !semester.includes('Any') || !year.includes('Any') || !tech.includes('Any')) ? 
            `Selected ${contextLabel}` : `All ${contextLabel}`) }} ({{ filteredItems.length }})
    </h3>

    <section class="mbe40 event-cards-flex flex flex-row flex-grow-1 flex-shrink-1 flex-wrap flex-fill">
        <template v-for="item in paginatedItems" :key="item.data.id">
            <EventCard v-if="context === 'events'" :item = "item" :namesMap="namesMap"/>
            <PublicationCard  v-else-if="context === 'publications'" :item="item" :namesMap="namesMap"/> 
            <AwardCard v-else-if="context === 'awards'" :item="item" :namesMap="namesMap"/>
        </template>
    </section>

    <Pagination
      v-model:currentPage="currentPage"
      :totalItems="filteredItems.length"
      :pageSize="pageSize"
    />
    </div>
</template>  
  
<style scoped>
    .content-filter-container {
        justify-content: space-around;
        display: flex;
        flex-flow: row wrap;
        /* align-items: flex-start; */ 
        justify-content: center;
        align-items: center;
    }
    .content-filter-dropdown {
        /* apply grid and flex here */
        min-width: 10rem !important;
        max-width: 20em;
        margin: 0 auto;
        padding: 1em;
        flex: 1;
    }
</style>