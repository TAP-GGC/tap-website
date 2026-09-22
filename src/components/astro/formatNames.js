import facultyIds from "./FacultyIds";
import { getStudentIds } from "./StudentIds";

export async function formatIDtoName(id) {
  const studentIds = await getStudentIds();

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