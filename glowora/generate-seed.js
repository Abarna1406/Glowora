import fs from 'fs';
import { categories, brands, salons, spas, services, products } from './src/lib/data.js';

const data = {
  categories, brands, salons, spas, services, products
};

fs.writeFileSync('../glowora-backend/seed.json', JSON.stringify(data, null, 2));
console.log('Seed data successfully written to ../glowora-backend/seed.json');
