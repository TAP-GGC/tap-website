// 1. Import utilities from `astro:content`
import { z, defineCollection, getCollection, reference } from 'astro:content';
import { withCtx } from 'vue';

// Import our own collections
import { getStudentIds } from "../components/astro/StudentIds";

// Shared cross-collection ID validators
async function isValidStudentId(studentId: string) {
  const students = await getStudentIds();
  return studentId in students;
}

async function isValidInstructorId(instructorId: string) {
  const instructors = await getCollection('instructors');
  const normalizedId = instructorId.toLowerCase();
  return instructors.some(instructor =>
    instructor.data.id?.toLowerCase() === normalizedId
  );
}

async function isValidProjectId(projectId: string) {
  const projects = await getCollection('projects');
  const normalizedId = projectId.toLowerCase();
  return projects.some(project =>
    project.data.id.toLowerCase() === normalizedId
  );
}

const studentIdSchema = z.string().refine(
  isValidStudentId,
  (studentId) => ({ message: `Student '${studentId}' not found.` })
);

const instructorIdSchema = z.string().refine(
  isValidInstructorId,
  (instructorId) => ({ message: `Faculty '${instructorId}' not found.` })
);

const projectIdSchema = z.string().refine(
  isValidProjectId,
  (projectId) => ({ message: `Project ID '${projectId}' not found.` })
);

// 2. Define your collection(s)
const eventCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({ image }) => z.object({
    title: z.string(),
    id: z.string(),
    tags: z.array(z.string()),
    techs: z.array(z.string()).optional(),
    semester: z.string(),
    year: z.number(),
    eventDate: z.date(),
    students: z.array(studentIdSchema).optional(),
    instructors: z.array(instructorIdSchema).optional(),
    projects: z.array(projectIdSchema).optional(),
    awards: z.array(z.string()).optional(),
    desc: z.string().optional().nullable(),
    imageEvent:  image().refine(eventPhotoValidator, eventPhotoValidatorMsg).optional(),
    images: z.array(z.object({
    src: image().refine((img) => img.width <= 1500, (img) => ({
      message: `Image is too large! Convert images to be less than 1500 pixels wide.\n${img.src} is ${img.width}x${img.height}.`,
      path: [ "images" ]
    })),
    alt: z.string() })).optional(),
  }),
});
const photoAspect = (img) => img.width / img.height;
const eventPhotoValidator = (img) => img.width && Math.abs(photoAspect(img) - 0.75) < 0.3;
const eventPhotoValidatorMsg = (img) => ({
  message: `Event photo image must be a 2x3 (0.75) portrait aspect ratio but given image ratio is ${Math.round(photoAspect(img) * 100) / 100}, which is more than 30% different!\n${img.src} is ${img.width}x${img.height}.`,
  path: [ "imageEvent" ]
});

const imageLogoValidator = (img) => Math.abs(img.width / img.height - 1) < 0.2;
const imageLogoValidatorMsg = (img) => ({
  message: `Logo image must be close to square aspect ratio!\n${img.src} is ${img.width}x${img.height}.`
});
const projectCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema:({ image }) => z.object({
    shortTitle: z.string().optional(),
    title: z.string(),
    id: z.string(),
    desc: z.string(),
    github: z.string().optional(),
    students: z.array(z.string()),
    instructors: z.array(z.string()),
    curator: z.array(z.string()).optional(),
    techs: z.array(z.string()),
    videos: z.array(z.object({
      src: z.string(), 
      caption: z.string() }).optional()).optional(),
    tags: z.array(z.string()).optional(),
    levels: z.array(z.string()),      // most projects will be appropriate for all audiences, but otherwise it could be specified
    difficulty: z.array(z.string()), // project could be set up to be at different difficulties
    durationMins: z.array(z.number()),
    events: z.array(z.string()).optional(),
    semester: z.string(),
    year: z.number(),
    publishedDate: z.date(),
    relatedIds: z.array(z.string()).optional(),
    imageLogoLight: image().refine(imageLogoValidator, imageLogoValidatorMsg), // mandatory
    imageLogoDark: image().refine(imageLogoValidator, imageLogoValidatorMsg).optional(),
    imageLogoTrans: image().refine(imageLogoValidator, imageLogoValidatorMsg).optional(), // In case older project does not have logos
    imageTeam: image().refine((img) => img.width >= 500, {
      message: "Cover image must be at least 500 pixels wide!",
      // This part of the config file needs to be reviewed and changed at a later date.
    }).optional(),
    videoAd: z.string().optional(),
    images: z.array(z.object({
      src: image().refine((img) => img.width <= 1500, {
          message: "Image too large! Convert images to be less than 1500 pixels wide.",
        }), 
      alt: z.string() })).optional(),
  }),
});

const studentCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({ image }) => z.object({
    id: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    email: z.string().email().nullable(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    website: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    github: z.string().url().optional().nullable(),
    image: image().refine(imageLogoValidator, imageLogoValidatorMsg).optional().nullable(),
    desc: z.string().optional().nullable(),
    graduationYear: z.string().nullable(),
    relatedProjectIds: z.array(z.string()).optional().nullable(),
    projects: z.array(projectIdSchema).optional().nullable(),
  }),
});

// Define faculty collection
const facultyCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
    affiliation: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    email: z.string().email({ message: "Invalid email address" }).optional().nullable(),
    phone: z.string().optional().nullable(),
    website: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    github: z.string().url().optional().nullable(),
    image: image().refine(imageLogoValidator, imageLogoValidatorMsg).optional().nullable(),
    desc: z.string().optional().nullable(),
    projects: z.array(projectIdSchema).optional().nullable(),
  }),
});

//Define technology collections
const technologyCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: image().optional().nullable(),
  }),
});


const awardCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: ({ image }) => z.object({
    title: z.string(),
    id: z.string(),
    tags: z.array(z.string()),
    semester: z.string(),
    year: z.number(),
    eventDate: z.date().default(() => new Date()),
    desc: z.string().optional().nullable(),
    events: z.array(z.string()).optional(),
    students: z.array(studentIdSchema).optional(),
    instructors: z.array(instructorIdSchema).optional(),
    projects: z.array(projectIdSchema).optional(),
    image: image().refine(eventPhotoValidator, eventPhotoValidatorMsg).optional(),
    images: z.array(z.object({
      src: image().refine((img) => img.width <= 1500, {
          message: "Image too large! Convert images to be less than 1500 pixels wide.",
        }), 
      alt: z.string() })).optional(),
  }),
});
const papersCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    id: z.string(),
    semester: z.string(),
    year: z.number(),
    techs: z.array(z.string()),
    postDate: z.string().datetime().transform((str) => new Date(str)),
    updateDate: z.date().optional(),
    events: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    students: z.array(studentIdSchema),
    instructors: z.array(instructorIdSchema),
    projects: z.array(projectIdSchema),
    image: image().refine((img) => img.width <= 150, {
      message: "Image too large! Convert images to be less than 150 pixels wide.",
    }).optional(),
    abstract: z.string().optional(),
    paperLink: z.string()
  })
});

const slidesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().optional(),
    id: z.string(),
    year: z.number(),
    postDate: z.date(),
    events: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    students: z.array(studentIdSchema).optional(),
    instructors: z.array(instructorIdSchema).optional(),
    projects: z.array(projectIdSchema).optional(),
    image: image().refine((img) => img.width <= 150, {
      message: "Image too large! Convert images to be less than 150 pixels wide.",
    }).optional(),
    abstract: z.string().optional()
  })
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'events': eventCollection,
  'projects': projectCollection,
  'students': studentCollection,
  'instructors': facultyCollection,
  'technologies': technologyCollection,
  'awards': awardCollection,
  'publications' : papersCollection,
  'slides' : slidesCollection
};
