import { getFacultyIds } from "./FacultyIds";
import { getStudentIds } from "./StudentIds";

const required = (name) => { throw new Error(`Missing parameter: ${name}`); };

export async function formatIDtoName({id = required('id'), studentIds = undefined, facultyIds = undefined}) {
  if (!studentIds) 
    studentIds = await getStudentIds();
  if (!facultyIds) 
    facultyIds = await getFacultyIds();

  if (id in studentIds){
    return studentIds[id].data.name;

  } 
  else if (id in facultyIds){
    return facultyIds[id].data.name;

  } 
  else{
    return id
      .split('-') // Split by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join with spaces
  } 
}