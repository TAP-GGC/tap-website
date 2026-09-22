/* Component for making project searches faster and easier. Returns dictionary/hash of projects by their IDs */
import { getCollection } from 'astro:content';

export async function getStudentIds() {
  const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

  // Fetch the projects and build the tech counts
  const students = await getCollection('students');
  let studentIds = {};

  // Build tech counts from the projects
  students.forEach(student => {
    // Add the computed slug here
    student.data.slug = `${base}/students/${student.data.id}`;
    studentIds[student.data.id] = student;
  });


  // Fetch the projects
  const projects = await getCollection('projects');


  projects.forEach(project => {
    //search every project for studentIDs
    project.data.students?.forEach(studentId => {
      if (!(studentId in studentIds)){
        //name convection if id doesn't exit
        studentIds[studentId] = { 
          id: studentId,
          slug: `students/${studentId}`,
          collection: 'students',
          data: {
            id: studentId,
            slug: `${base}/students/${studentId}`,
            name: studentId.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Convert ID back to readable name
            projects: [project.data.id],
            fallback: true
          },
          body: '', 
        }
      }
    })
  });


  return studentIds;
}