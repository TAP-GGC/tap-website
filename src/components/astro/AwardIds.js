import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL == '/' ? '' : import.meta.env.BASE_URL;
const awards = await getCollection('awards');
const awardIds = {};

awards.forEach((award) => {
  award.data.slug = `${base}/awards/${award.data.year}/${award.data.semester}/${award.data.id}`;
  awardIds[award.data.id] = award;
});

export default awardIds;
