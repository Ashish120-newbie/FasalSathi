import type { Disease } from './types';

export const diseases: Disease[] = [
  {
    id: 'wheat-yellow-rust', name: 'Yellow Rust', cropId: 'wheat', severity: 'moderate',
    description: 'A fungal disease that spreads in cool, humid weather and reduces grain yield.',
    symptoms: ['Yellow-orange powdery stripes on leaves', 'Leaves turn pale and dry from the tips'],
    treatment: ['Spray Propiconazole 25 EC at 1 ml per litre of water', 'Remove badly affected leaves and improve field airflow', 'Repeat spray after 15 days if needed'],
  },
  {
    id: 'rice-blast', name: 'Rice Blast', cropId: 'rice', severity: 'severe',
    description: 'A fungal infection that causes diamond-shaped spots and can affect the whole crop.',
    symptoms: ['Spindle-shaped grey spots with brown edges', 'Neck of the panicle turns brown or black'],
    treatment: ['Apply Tricyclazole 75 WP at 0.6 g per litre of water', 'Avoid excess nitrogen fertilizer', 'Maintain proper spacing between plants'],
  },
  {
    id: 'cotton-leaf-curl', name: 'Cotton Leaf Curl Virus', cropId: 'cotton', severity: 'severe',
    description: 'A virus spread by whiteflies that curls leaves and stunts plant growth.',
    symptoms: ['Upward curling of leaves', 'Thickened veins and small leaf size', 'Stunted plant growth'],
    treatment: ['Control whiteflies with recommended insecticide', 'Remove and destroy infected plants early', 'Use certified virus-resistant seeds next season'],
  },
  {
    id: 'tomato-early-blight', name: 'Early Blight', cropId: 'tomato', severity: 'moderate',
    description: 'A common fungal disease causing dark spots on lower leaves first.',
    symptoms: ['Dark brown circular spots with ring patterns', 'Older leaves yellow and fall early'],
    treatment: ['Spray Mancozeb 75 WP at 2 g per litre of water', 'Remove infected leaves and do not water over the leaves', 'Add mulch to prevent soil splash'],
  },
  {
    id: 'potato-late-blight', name: 'Late Blight', cropId: 'potato', severity: 'severe',
    description: 'A fast-spreading disease that thrives in cool, wet conditions.',
    symptoms: ['Water-soaked dark patches on leaves', 'White fungal growth under leaves in humid weather'],
    treatment: ['Spray Metalaxyl + Mancozeb at 2 g per litre immediately', 'Remove infected plant parts and bury them safely', 'Avoid irrigation during cloudy, wet weather'],
  },
  {
    id: 'nitrogen-deficiency', name: 'Nitrogen Deficiency', cropId: 'wheat', severity: 'mild',
    description: 'A nutrient deficiency that makes plants pale and reduces growth.',
    symptoms: ['Uniform yellowing starting from older leaves', 'Slow, thin plant growth'],
    treatment: ['Apply Urea in two split doses as per soil test', 'Add well-rotted farmyard manure', 'Test soil before the next crop'],
  },
];

export const diseaseById = (id: string) => diseases.find((disease) => disease.id === id) ?? diseases[0];
