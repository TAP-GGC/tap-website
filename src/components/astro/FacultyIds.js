/* Component for making project searches faster and easier. Returns dictionary/hash of projects by their IDs */
import { getCollection } from 'astro:content';
import { collections } from '../../content/config';

export async function getFacultyIds() {
  const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;

  // Fetch the projects and build the tech counts
  const instructors = await getCollection('instructors');
  let facultyIds = {};

  // Build tech counts from the projects
  instructors.forEach(instructor => {
    // Add the computed slug here
    instructor.data.slug = `${base}/instructors/${instructor.data.id}`;
    facultyIds[instructor.data.id] = instructor;
  });

  // const projects = await getCollection('projects');

  // projects.forEach(project => {
  //   project.data.instructors?.forEach(facultyId =>{
  //     if(facultyId in facultyIds){
  //       facultyIds[facultyId] = {
  //         id: facultyId,
  //         slug: `instructors/${facultyId}`,
  //         collection: 'instructors',
  //         data: {
  //           id: facultyId,
  //           slug: `${base}/instructors/${facultyId}`,
  //           name: facultyId.data.name
  //         }
  //       }
  //     }else{
  //       facultyIds[facultyId] = {
  //         id: facultyId,
  //         slug: `instructors/${facultyId}`,
  //         collection: 'instructors',
  //         data: {
  //           id: facultyId,
  //           slug: `${base}/instructors/${facultyId}`,
  //           name: facultyId.replace(/-/g, ' ')
  //         }
  //       }
  //     }
    
  //   })
  // });
  return facultyIds;
}
