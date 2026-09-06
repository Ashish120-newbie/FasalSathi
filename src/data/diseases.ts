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
  {
    id: 'maize-turcicum-blight', name: 'Turcicum Leaf Blight', cropId: 'maize', severity: 'moderate',
    description: 'A fungal disease common in humid weather that causes long streaks on maize leaves.',
    symptoms: ['Long, boat-shaped grey-green lesions on leaves', 'Lesions turn tan/brown and merge as they spread'],
    treatment: ['Spray Mancozeb 75 WP at 2.5 g per litre of water', 'Remove and destroy crop debris after harvest', 'Rotate with a non-cereal crop next season'],
  },
  {
    id: 'soybean-ymv', name: 'Yellow Mosaic Virus', cropId: 'soybean', severity: 'severe',
    description: 'A whitefly-transmitted virus causing yellow mosaic patterns and yield loss.',
    symptoms: ['Irregular yellow and green mosaic patches on leaves', 'Stunted pods with fewer seeds'],
    treatment: ['Control whitefly population with recommended insecticide', 'Remove and destroy infected plants early', 'Use resistant varieties in the next sowing'],
  },
  {
    id: 'groundnut-tikka', name: 'Tikka Leaf Spot', cropId: 'groundnut', severity: 'moderate',
    description: 'A fungal disease causing dark circular spots that reduce leaf area and pod yield.',
    symptoms: ['Small dark brown to black circular spots with yellow halo', 'Premature leaf drop in severe cases'],
    treatment: ['Spray Chlorothalonil 75 WP at 2 g per litre of water', 'Avoid dense planting to improve airflow', 'Remove fallen infected leaves from the field'],
  },
  {
    id: 'mustard-white-rust', name: 'White Rust', cropId: 'mustard', severity: 'moderate',
    description: 'A fungal disease favoured by cool, humid conditions, affecting leaves and flower stalks.',
    symptoms: ['White, shiny pustules on the underside of leaves', 'Distorted, swollen flower stalks'],
    treatment: ['Spray Metalaxyl + Mancozeb at 2 g per litre of water', 'Remove and destroy infected plant parts', 'Avoid overhead irrigation in cool weather'],
  },
  {
    id: 'chickpea-wilt', name: 'Fusarium Wilt', cropId: 'chickpea', severity: 'severe',
    description: 'A soil-borne fungal disease that blocks water flow, causing sudden wilting.',
    symptoms: ['Sudden drooping and drying of the whole plant', 'Yellowing starting from lower leaves upward'],
    treatment: ['Use Trichoderma-treated seed before sowing next season', 'Remove and destroy wilted plants immediately', 'Avoid growing chickpea in the same field consecutively'],
  },
  {
    id: 'onion-purple-blotch', name: 'Purple Blotch', cropId: 'onion', severity: 'moderate',
    description: 'A fungal disease that thrives in warm, humid weather and damages leaves and bulbs.',
    symptoms: ['Small water-soaked spots that turn purple-brown', 'Concentric rings within the lesion'],
    treatment: ['Spray Mancozeb 75 WP at 2 g per litre of water', 'Avoid overhead irrigation, especially in the evening', 'Ensure good field drainage'],
  },
  {
    id: 'chili-anthracnose', name: 'Anthracnose (Fruit Rot)', cropId: 'chili', severity: 'severe',
    description: 'A fungal disease that causes sunken spots and rot on ripening chili fruits.',
    symptoms: ['Sunken, dark circular spots on fruit', 'Concentric rings with pink spore masses in the center'],
    treatment: ['Spray Carbendazim 50 WP at 1 g per litre of water', 'Remove and destroy infected fruits promptly', 'Avoid water splash onto fruit during irrigation'],
  },
  {
    id: 'banana-panama-wilt', name: 'Panama Wilt', cropId: 'banana', severity: 'severe',
    description: 'A soil-borne fungal disease that blocks the plant\'s water-conducting tissue.',
    symptoms: ['Yellowing of older leaves progressing upward', 'Splitting of the pseudostem at the base'],
    treatment: ['Remove and destroy infected plants along with roots', 'Avoid replanting bananas in the same spot for 2-3 years', 'Use disease-free planting material'],
  },
  {
    id: 'brinjal-shoot-borer', name: 'Fruit and Shoot Borer', cropId: 'brinjal', severity: 'moderate',
    description: 'An insect pest whose larvae bore into shoots and fruits, causing wilting and fruit damage.',
    symptoms: ['Wilted, drooping shoot tips', 'Small entry holes on fruit with larval frass inside'],
    treatment: ['Remove and destroy affected shoots and fruits regularly', 'Spray Spinosad 45 SC at 0.3 ml per litre of water', 'Install pheromone traps to monitor and reduce moth population'],
  },
  {
    id: 'okra-yvmv', name: 'Yellow Vein Mosaic Virus', cropId: 'okra', severity: 'severe',
    description: 'A whitefly-transmitted virus causing yellow veins and reduced fruit quality.',
    symptoms: ['Yellow network pattern along leaf veins', 'Pale, stunted, or malformed fruits'],
    treatment: ['Control whitefly population with recommended insecticide', 'Remove and destroy infected plants early', 'Grow resistant/tolerant varieties where available'],
  },
];

export const diseaseById = (id: string) => diseases.find((disease) => disease.id === id) ?? diseases[0];
export const diseasesByCrop = (cropId: string) => diseases.filter((disease) => disease.cropId === cropId);