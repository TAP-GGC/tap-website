<script setup>
import { computed, ref} from "vue";
// Components CSS
import "agnostic-vue/dist/index.css";
import "agnostic-vue/dist/common.min.css";
import { Input, Card, Select, Tag } from "agnostic-vue";


// load blog content: news, etc.
import { getCollection } from 'astro:content';
import { getStudentIds } from "./astro/StudentIds";
import facultyIds from "./astro/FacultyIds";

const projects = await getCollection('projects');  //list of projects
const studentIds = await getStudentIds();

function createOptions(projects, x) {
    let optionSet = new Set();
    projects.forEach(arrayContainer =>{
        if(Array.isArray(arrayContainer.data[x])){
            arrayContainer.data[x].forEach(element =>{
            optionSet.add(String(element).toLowerCase());
        });
        }else{
            optionSet.add(String(arrayContainer.data[x]).toLowerCase());
        }
        
    });
    return Array.from(optionSet);
}

let projectShortTitle = ref('');
let projectName = ref('');
let projectDescrip = ref('');
let github = ref('');

//student related
let selectedStudents = ref([]);
let studentTerm = ref('');
const studentList = Array.from(new Set(
                                Object.values(studentIds).map(student => student.data.id.toLowerCase())
                            )
                        ).sort();

//instructors related
let instructorTerm = ref('');
let selectedInstructors = ref([]);
const instructorList = Array.from(new Set(
                            Object.values(facultyIds).map(inst => ({
                                name: inst.data.name,
                                id: inst.data.id.toLowerCase()}))
        )).sort();

//Tech related
let techTerm = ref('');
let selectedTech = ref('');
const techList = createOptions(projects, "techs");

//video url
let vidUrl = ref('');
let selectedVids = ref([]);

//Semester related
let selectedSemester = ref('');
let semesters =[{value:'Any', label:'Any'},{value: 'fall', label:'Fall'}, {value: 'spring', label:'Spring'}, {value: 'summer', label:'Summer'}];

//tag related
const techTags = ref([]);
const newTag = ref('');

//event related
let eventTerm = ref('');
let selectedEvents = ref([]);
const eventList = Array.from(createOptions(projects, "events")).map(option =>({value:option, label:option}));

//year related
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth()+1;
let day = date.getDate();
const todayDate = `${year}-${day}-${month}`;
let selectedYear = ref('');

//published date
let publishedDate = ref(todayDate);

//level related
let levelTerm = ref('');
let selectedLevels = ref([]);
const levelList = createOptions(projects,"levels");

//difficulty related
let diffTerm = ref('');
let selectedDiffs = ref([]);
const diffList = createOptions(projects, "difficulty");

//Duration related
let durationTerm = ref();
let selectedDurations = ref([]);
const durationList = createOptions(projects, "durationMins");

//related Ids
let relatedIdTerm = ref('');
let selRelatedIds = ref([]);  //stores all the selected related ids
const relatedIdList = createOptions(projects, "relatedIds");
//console.log(projects);

//failed reusable method
const addItem = (inputField, category)=>{
    switch(category){
        case 'student':
            selectedStudents.value.push(inputField);
            break;
        case 'event':

    }
    if(inputField!= ''){
        inputField ='';
        
        category.value.push(inputField);
        inputField="hello";
    }
    
}
//Add terms for input with options {levels, events, student, ||duration, difficulty, tech}
function addTerm(termRef, inputField){
    let category;
    switch(termRef){
        case "levelTerm":
            category = selectedLevels;
            break;
        case "eventTerm":
            category = selectedEvents;
            break;
        case "studentTerm":
            category = selectedStudents;
            break;
        case "diffTerm":
            category = selectedDiffs;
            break;
        case "durationTerm":
            category = selectedDurations;
            break;
        case "instructorTerm":
            category = selectedInstructors;
            break;
        case "relatedIdTerm":
            category = selRelatedIds;
            break;
        // case "vidUrl":
        //     category = selectedVids;
        //     break;
    }
    inputField = inputField.toLowerCase(); // Convert input to lowercase

    if (termRef === "studentTerm" && /\s/.test(inputField)) {
        //alert("Student name must not contain spaces. Use hyphens or camelCase (e.g., alex-lee or alexLee).");
        inputField = inputField.replace(/\s+/g, '-');
    }

    if (termRef === "instructorTerm") {
        const match = this.instructorList.find(inst =>
            inst.name.toLowerCase() === inputField.trim().toLowerCase()
        );

        if (match) {
            inputField = match.id;
        } else {
            console.warn(`Instructor not found for input: ${inputField}`);
            return;
        }
    }

    //this is a debug code, ask for removal?
    if(inputField != ''&& !category.value.includes(inputField)){
        console.log(typeof inputField);
        category.value.push(inputField);
        this[termRef] = '';
    }
}

function removeTag2(arrayRef, index){
    arrayRef.splice(index, 1);
}

// const addTerm = (arrayRef, termRef) =>{
//     return (item) => {
//         if(item != ''){
//             arrayRef.value.push(termRef);
//             console.log(arrayRef.value);
//             termRef.value ='';
//         }
//     };
// };


// const addStudent = (student) =>{
//     if(student != ''){
//         selectedStudents.value.push(student);
//         studentTerm.value = '';
//     }
// }
// const addEvent = (event) =>{
//     if(event != '' && !selectedEvents.value.includes(event)){
//         selectedEvents.value.push(event);
//         eventTerm.value='';
//     }
// }
const addTag = (tag) =>{
    tag = tag.toLowerCase(); // Convert to lowercase
    if(tag != ''&& !techTags.value.includes(tag)){
        techTags.value.push(tag);
        techTerm.value= '';
    }
    techTerm.value='';

}
const removeTag = (index) =>{
    techTags.value.splice(index, 1);
}
const searchTech = computed(() =>{
    if(techTerm == ''){
        return [];
    }

    // we need to find matches 
    let matches = 0;
    let optionsList = techList.filter(tech =>{
        if(tech.toLowerCase().includes(techTerm.value.toLowerCase()) && matches < 10){
            matches++;
            return tech;
        }

    });
    return optionsList.map(val => ({value:val, label:val}));
    //filter
    //matches to 10
    //populates the options with that

});

</script>
<template>
    <section class="mbe40">
        <div>
            <h1>Create Metadata Block for New Project</h1>
            <ul>
                <li>See the <a href="https://github.com/TAP-GGC/tap-ws1-astro-agnosticui/blob/main/README.md" target="_blank">project README file</a> for detailed instructions.</li>
                <li>Fill the input boxes below that will automatically populate the metadata block at the bottom of the page.</li>
                <li>Some boxes allow entering multiple items. Start typing or press the down arrow to see options. 
                    Make sure to press Enter in the input boxes to save them. 
                    They will show up as tags below the input box. You can click on the X to remove tags.</li>
                <li>Once you're done, make sure all the fields in the block is filled. Then copy-paste it into the top of your project Markdown (.mdx) file.</li>
            </ul>
        
        </div>
        <br />
        <div>
            <Input id="4" size="" v-model="projectShortTitle" label="Enter project short name" placeholder="The short name of the project. Example: Ball is Life" type="text"></Input>
        </div>
        <div>
            <Input id="4" size="" v-model="projectName" label="Enter project name" placeholder="Complete titile as research page title. Example: Using Sphero to Teach Programming Fundamentals" type="text"></Input>
        </div>
        <div>
            <Input size="medium" v-model="projectDescrip" label="Enter project description" placeholder="One or two phrases that succinctly describe the project" type="text"></Input>
        </div>
        <div>
            <Input type="text" id="tech" list="techData" label="Enter technology keywords" placeholder="Type tech to complete from list or insert a new one. Press enter to add it to the list." v-model="techTerm"
             @keydown.enter="addTag(techTerm)" @keydown.delete="techTerm.length||removeTag(techTags.length-1)">
            </Input>
            <datalist id="techData">
                <option v-for="tech of techList" :value="tech">{{ tech }}</option>
            </datalist>
            <ul class="tagList">
                    <Tag v-for="(tag, index) in techTags" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag(index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
            
        </div>
        <div>
            <Input type="text" label="Enter Github link" v-model="github"/>
        </div>
        <div>
            <Input type="text" list="instructorData" label="Enter instructors" v-model="instructorTerm" @keydown.enter.stop="addTerm('instructorTerm',instructorTerm )"
                    placeholder="Type instructor name to complete from list or insert a new one. Press enter to add it to add it to the list."/>
            <datalist id="instructorData"><option v-for="instructor in instructorList" :key="instructor.id" :value="instructor.name">{{ instructor.name }}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedInstructors" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedInstructors,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
        <div>
            <Input type="text" list="studentData" label="Enter student names" v-model="studentTerm" @keydown.enter.stop="addTerm('studentTerm',studentTerm )"
                    placeholder="Type student name to complete from list or insert a new one. Press enter to add it to add it to the list. Use hyphens or camelCase. No spaces allowed"/>
            <datalist id="studentData"><option v-for="student in studentList" :value="student">{{ student }}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedStudents" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedStudents,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         
         <br>
         <div> <!--events-->
            <label>Select events that are associated with this project (TAP Expo, conferences, etc). First create a blog post if not listed.</label>
            <!-- <Input type="text" list="eventData" label="Enter Events" v-model="eventTerm" @keydown.enter="addTerm('eventTerm',eventTerm)"/> -->
            <Select default-option-label="Choose Event" :options="eventList" @selected="(value) => { addTerm('eventTerm',value) }">
            </Select>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedEvents" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedEvents,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         <br>
         <div>
            <label>Semester</label>
            <Select default-option-label="Choose Semester" :options="semesters" @selected="(value) => { selectedSemester = value }">
            </Select>
         </div>
         <div> <!--levels-->
            <Input type="text" list="levelData" label="Enter audience levels (K-12, college, etc)" v-model="levelTerm" @keydown.enter.stop="addTerm('levelTerm',levelTerm)"/>
            <datalist id="levelData"><option v-for="level in levelList" :value="level">{{ level }}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedLevels" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedLevels,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         <div> <!--difficulty-->
            <Input type="text" list="difficultyData" label="Enter difficulty levels. Project can have multiple difficulties." v-model="diffTerm" 
                    @keydown.enter.stop="addTerm('diffTerm',diffTerm)" placeholder="beginner, intermediate, advanced"/>
            <datalist id="difficultyData"><option v-for="diff in diffList" :value="diff">{{ diff}}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedDiffs" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedDiffs,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         <div> <!--duration-->
            <Input type="number" list="durationData" label="Enter duration of project activities in minutes. You can enter multiple values." 
                    v-model="durationTerm" @keydown.enter.stop="addTerm('durationTerm',durationTerm)" placeholder="30, 60, 90"/>
            <datalist id="durationData"><option v-for="dur in durationList" :value=dur>{{ dur}}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selectedDurations" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selectedDurations,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         <div>
            <Input type="date" label="Enter Published Date" v-model="publishedDate"/>
         </div>
         <div> <!--Related ID-->
            <Input type="text" list="relProjectData" label="Enter related project IDs (projects that build on the same idea, etc)" 
                    v-model="relatedIdTerm" @keydown.enter.stop="addTerm('relatedIdTerm',relatedIdTerm)"/>
            <datalist id="relProjectData"><option v-for="rel in relatedIdList" :value="rel">{{ rel}}</option></datalist>
            <ul class="tagList">
                <Tag v-for="(tag, index) in selRelatedIds" :key="tag" class="mie6" shape="round" type="info" is-uppercase>{{tag}}
                    <button @click="removeTag2(selRelatedIds,index)" class="delete">&#x2718;</button>
                </Tag>
            </ul>
         </div>
         <br>
         <h4>Resulting Markdown File:</h4>
         <pre>
---
shortTitle: {{ projectShortTitle }}
title: {{ projectName }}
id: {{ projectShortTitle.trim().toLowerCase().replace(/\s+/g, '-') }}
desc : {{ projectDescrip }}
github: {{ github }}
students: {{ selectedStudents }}
instructors: {{ selectedInstructors }} 
techs: {{ techTags }}
events: {{selectedEvents}}
semester: {{ selectedSemester }}
year: {{ selectedYear? selectedYear : year }}
levels: {{ selectedLevels }} 
difficulty: {{ selectedDiffs }} 
durationMins: {{ selectedDurations.map(str => parseInt(str)) }}
publishedDate: {{ publishedDate }}
relatedIds: {{ selRelatedIds }}
image: ""
---
         </pre>
         <!--Propose a id, User can write id, use a placeholder-->
         <!--Input Dropdown, Value: id, label: project title-->
         <!-- Project tags:  -->

        <!--To get the students from dropdown menu or to manually enter the students by email-->
        
        <!--Autocomplete input form to show students available-->
        <div>
            
        </div>
        <!--published date : optional text input, javascript data function-->
        
    
        


    </section>

</template>
  
  
  
<style scoped>
.tagList {
    list-style: none;
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    gap:7px;
    margin:0;
    padding:0;
}
.tag{
    background: rgb(250,104,104);
    padding: 5px;
    border-radius: 4px;
    color:white;
    white-space: nowrap;
    transition: 0.1s ease backgroung;
}
.delete{
    color:white;
    background:none;
    outline:none;
    border:none;
    cursor: pointer;
}
</style>
  