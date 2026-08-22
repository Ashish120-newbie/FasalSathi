import type { CropId } from './types';

export type SchemeCategory =
  | 'income_support'
  | 'insurance'
  | 'credit'
  | 'subsidy'
  | 'soil_health'
  | 'organic_farming'
  | 'irrigation'
  | 'price_support';

export type FarmerCategory =
  | 'all'
  | 'small_marginal'
  | 'large'
  | 'tenant'
  | 'women'
  | 'organic';

export interface SchemeDetail {
  id: string;
  name: string;
  description: string;
  category: SchemeCategory;
  ministry: string;
  applicableStates: string[];
  eligibleCrops: CropId[] | 'all';
  eligibleFarmerCategories: FarmerCategory[];
  farmSizeCriteria: string | null;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationProcess: string[];
  officialUrl: string;
  sourceName: string;
  lastVerifiedDate: string;
  isActive: boolean;
}

export const states = [
  'All India',
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Madhya Pradesh',
  'Gujarat',
  'Andhra Pradesh',
  'Telangana',
  'Rajasthan',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Kerala',
];

export const schemeCategories: { id: SchemeCategory; label: string }[] = [
  { id: 'income_support', label: 'Income Support' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'credit', label: 'Credit & Loans' },
  { id: 'subsidy', label: 'Subsidy' },
  { id: 'soil_health', label: 'Soil Health' },
  { id: 'organic_farming', label: 'Organic Farming' },
  { id: 'irrigation', label: 'Irrigation' },
  { id: 'price_support', label: 'Price Support' },
];

export const farmerCategories: { id: FarmerCategory; label: string }[] = [
  { id: 'all', label: 'All Farmers' },
  { id: 'small_marginal', label: 'Small & Marginal' },
  { id: 'large', label: 'Large Farmers' },
  { id: 'tenant', label: 'Tenant / Sharecropper' },
  { id: 'women', label: 'Women Farmers' },
  { id: 'organic', label: 'Organic Farmers' },
];

export const schemes: SchemeDetail[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description:
      'Income support of ₹6,000 per year to eligible landholding farmer families in three equal instalments of ₹2,000 each, paid directly to bank accounts.',
    category: 'income_support',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    applicableStates: ['All India'],
    eligibleCrops: 'all',
    eligibleFarmerCategories: ['small_marginal', 'large', 'women'],
    farmSizeCriteria: 'Up to 2 hectares (5 acres) of cultivable land',
    benefits: '₹6,000 per year in three instalments, paid directly to bank account via DBT',
    eligibility:
      'Landholding farmer families with cultivable land, excluding institutional farmers, former and current holders of constitutional posts, and persons paying income tax.',
    requiredDocuments: [
      'Aadhaar card',
      'Land ownership records (patwa/khatauni/patta)',
      'Bank account details (passbook or cancelled cheque)',
      'Mobile number linked with Aadhaar',
    ],
    applicationProcess: [
      'Visit the official PM-KISAN portal or nearest Common Service Centre (CSC)',
      'Register with Aadhaar number and land records',
      'Complete e-KYC verification',
      'Names are verified by State/Nodal officers and sent for approval',
      'Approved beneficiaries receive instalments directly to their bank account',
    ],
    officialUrl: 'https://pmkisan.gov.in',
    sourceName: 'pmkisan.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    description:
      'Affordable crop insurance protecting farmers against crop loss due to natural calamities, pests, diseases, and localised risks. Premium is capped for farmers.',
    category: 'insurance',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    applicableStates: ['All India'],
    eligibleCrops: ['wheat', 'rice', 'cotton', 'tomato', 'potato'],
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'tenant', 'women'],
    farmSizeCriteria: null,
    benefits:
      'Crop insurance cover with farmer premium capped at 1.5% for Rabi, 2% for Kharif, and 5% for commercial/horticultural crops. Balance premium shared by Centre and State.',
    eligibility:
      'All farmers growing notified crops in notified areas, including loanee and non-loanee farmers. Tenant farmers and sharecroppers are also eligible.',
    requiredDocuments: [
      'Aadhaar card',
      'Land records or tenancy agreement',
      'Bank account details',
      'Sowing certificate from local agriculture officer',
    ],
    applicationProcess: [
      'Contact your bank, Primary Agricultural Credit Society (PACS), or visit the PMFBY portal',
      'Provide land details and crop information',
      'Pay the applicable farmer premium share',
      'Insurance coverage begins from the date of premium payment',
      'Claims are processed automatically based on yield data assessed by State Government',
    ],
    officialUrl: 'https://pmfby.gov.in',
    sourceName: 'pmfby.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    description:
      'Flexible short-term credit facility for crop cultivation, post-harvest expenses, and allied agricultural activities at concessional interest rates.',
    category: 'credit',
    ministry: 'Department of Financial Services, Ministry of Finance',
    applicableStates: ['All India'],
    eligibleCrops: 'all',
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'tenant', 'women'],
    farmSizeCriteria: null,
    benefits:
      'Credit up to ₹3 lakh at concessional interest rates (approximately 4% with interest subvention and prompt repayment incentive). Higher limits for allied activities.',
    eligibility:
      'All farmers, including individual farmers, tenant farmers, sharecroppers, and Self Help Groups (SHGs) engaged in crop cultivation and allied activities.',
    requiredDocuments: [
      'Aadhaar card',
      'Land ownership or tenancy records',
      'Bank account details',
      'Passport-size photograph',
      'KCC application form (available at banks)',
    ],
    applicationProcess: [
      'Visit your nearest bank branch or cooperative society',
      'Fill out the KCC application form and submit required documents',
      'Bank verifies land records and processes the application',
      'On approval, KCC is issued with an approved credit limit',
      'Use the card for crop loans and withdraw as needed during the cropping season',
    ],
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    sourceName: 'myscheme.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    description:
      'Free soil testing and field-specific nutrient recommendations to help farmers apply the right type and amount of fertilizers, improving yield and reducing costs.',
    category: 'soil_health',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    applicableStates: ['All India'],
    eligibleCrops: 'all',
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'women', 'organic'],
    farmSizeCriteria: null,
    benefits:
      'Free soil health card with test results for 12 parameters (including NPK, pH, micronutrients) and crop-specific fertilizer recommendations, renewed every 2 years.',
    eligibility: 'All farmers with cultivable land, including individual and joint landholders.',
    requiredDocuments: [
      'Aadhaar card',
      'Land ownership records',
      'Soil sample collected from the farm (assisted by local agriculture officer)',
    ],
    applicationProcess: [
      'Contact your village agriculture officer or visit the nearest soil testing laboratory',
      'Submit soil samples from your farm for testing',
      'Samples are analysed at the soil testing laboratory',
      'Soil Health Card is issued with nutrient status and recommendations',
      'Use the card to plan fertilizer application for your specific crops',
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
    sourceName: 'soilhealth.dac.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'fertilizer-subsidy',
    name: 'Nutrient Based Subsidy (NBS) on Fertilizers',
    description:
      'Subsidized phosphatic and potassic (P&K) fertilizers made available to farmers at affordable prices through a nutrient-based subsidy mechanism.',
    category: 'subsidy',
    ministry: 'Department of Fertilizers, Ministry of Chemicals & Fertilizers',
    applicableStates: ['All India'],
    eligibleCrops: 'all',
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'women'],
    farmSizeCriteria: null,
    benefits:
      'Subsidized prices on DAP, SSP, MOP, and complex fertilizers. Urea is separately subsidized at a fixed MRP of ₹268 per 45 kg bag (as of 2025).',
    eligibility: 'All farmers purchasing fertilizers from registered dealers and cooperative societies.',
    requiredDocuments: [
      'Aadhaar card or valid identification',
      'Land records or cultivation proof',
      'Purchase from a registered fertilizer dealer',
    ],
    applicationProcess: [
      'Visit a registered fertilizer dealer or cooperative society',
      'Purchase subsidized fertilizers at the government-fixed MRP',
      'Subsidy is applied automatically — no separate application needed',
      'Ensure purchases are recorded against your Aadhaar/land records for traceability',
    ],
    officialUrl: 'https://www.fert.nic.in',
    sourceName: 'fert.nic.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description:
      'Support for farmers to adopt organic farming through cluster-based training, certification, and market linkage. Promotes chemical-free farming practices.',
    category: 'organic_farming',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    applicableStates: ['All India'],
    eligibleCrops: ['wheat', 'rice', 'cotton', 'tomato', 'potato'],
    eligibleFarmerCategories: ['all', 'small_marginal', 'women', 'organic'],
    farmSizeCriteria: 'Minimum 20 farmers per cluster, each with at least 0.5 acres (0.2 hectares)',
    benefits:
      '₹50,000 per hectare over three years, covering organic inputs, certification, PGS system, and market linkage support.',
    eligibility:
      'Farmer groups or clusters of at least 20 farmers with a minimum of 50 acres total area, willing to adopt organic farming practices.',
    requiredDocuments: [
      'Aadhaar card',
      'Land ownership records',
      'Cluster formation certificate',
      'PGS (Participatory Guarantee System) registration',
    ],
    applicationProcess: [
      'Form a cluster of at least 20 farmers with a minimum 50 acres total area',
      'Register the cluster with the local agriculture department',
      'Enroll in the PGS organic certification system',
      'Receive assistance for organic inputs and training',
      'After 3 years, achieve PGS certification and access organic markets',
    ],
    officialUrl: 'https://pgsindia-ncof.gov.in',
    sourceName: 'pgsindia-ncof.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'pmksy-micro-irrigation',
    name: 'PMKSY — Per Drop More Crop (Micro Irrigation)',
    description:
      'Financial assistance for installing drip and sprinkler irrigation systems to improve water use efficiency and increase crop yields.',
    category: 'irrigation',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    applicableStates: ['All India'],
    eligibleCrops: ['cotton', 'tomato', 'potato', 'sugarcane'],
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'women'],
    farmSizeCriteria: 'Up to 5 hectares per beneficiary for micro irrigation',
    benefits:
      'Subsidy of 55% for small and marginal farmers, 45% for other farmers, on the cost of drip/sprinkler irrigation systems. Shared between Centre and State.',
    eligibility:
      'All farmers with cultivable land, with priority given to small and marginal farmers. Must have a water source suitable for micro irrigation.',
    requiredDocuments: [
      'Aadhaar card',
      'Land ownership records',
      'Bank account details',
      'Water source proof (borewell, well, canal connection)',
      'Quote from empanelled micro-irrigation system supplier',
    ],
    applicationProcess: [
      'Visit the PMKSY portal or your district agriculture office',
      'Register and submit land records and water source details',
      'Obtain a quote from an empanelled micro-irrigation supplier',
      'Submit the quote and application for subsidy approval',
      'On approval, install the system and claim the subsidy through the supplier',
    ],
    officialUrl: 'https://pmksy.gov.in',
    sourceName: 'pmksy.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'sugarcane-frp',
    name: 'Fair and Remunerative Price (FRP) for Sugarcane',
    description:
      'Assured minimum price paid to sugarcane farmers by sugar mills for their produce, ensuring a guaranteed floor price for cane sales.',
    category: 'price_support',
    ministry: 'Department of Food & Public Distribution',
    applicableStates: ['All India'],
    eligibleCrops: ['sugarcane'],
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'tenant'],
    farmSizeCriteria: null,
    benefits:
      'Government-declared FRP of ₹340 per quintal for the 2024-25 season (basic recovery 10.25%), with premiums for higher recovery. State Advisory Prices may be higher in some states.',
    eligibility:
      'Sugarcane growers supplying cane to registered sugar mills or cooperative factories.',
    requiredDocuments: [
      'Aadhaar card',
      'Land records or tenancy agreement',
      'Cane supply agreement with the sugar mill',
      'Bank account details for payment',
    ],
    applicationProcess: [
      'Register with your nearest sugar mill or cooperative factory',
      'Sign a cane supply agreement (indent) for the crushing season',
      'Harvest and supply sugarcane as per the mill schedule',
      'Payment is made directly to your bank account at the FRP or higher',
      'If mill delays payment beyond 14 days, interest is payable under the Sugarcane Control Order',
    ],
    officialUrl: 'https://dfpd.gov.in',
    sourceName: 'dfpd.gov.in (Government of India)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'bhoochetana',
    name: 'Bhoochetana Soil Fertility Program',
    description:
      'A Karnataka state initiative improving soil health and farm productivity through nutrient management, soil testing, and farmer-led demonstrations.',
    category: 'soil_health',
    ministry: 'Karnataka State Department of Agriculture',
    applicableStates: ['Karnataka'],
    eligibleCrops: ['wheat', 'rice', 'cotton', 'tomato', 'potato', 'sugarcane'],
    eligibleFarmerCategories: ['all', 'small_marginal', 'large', 'women'],
    farmSizeCriteria: null,
    benefits:
      'Free soil testing, field-specific nutrient recommendations, and demonstration support for improved farming practices.',
    eligibility: 'Farmers in participating districts of Karnataka with cultivable land.',
    requiredDocuments: [
      'Aadhaar card',
      'Land records (RTC/pahani)',
      'Soil sample from the farm',
    ],
    applicationProcess: [
      'Contact your village agriculture officer or Krishi Vigyan Kendra (KVK)',
      'Submit soil samples for testing',
      'Receive nutrient recommendations and demonstration support',
      'Apply recommended inputs for your crops',
    ],
    officialUrl: 'https://raitamitra.karnataka.gov.in',
    sourceName: 'raitamitra.karnataka.gov.in (Government of Karnataka)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
  {
    id: 'mksp',
    name: 'Mahila Kisan Sashaktikaran Pariyojana (MKSP)',
    description:
      'Empowerment of women farmers through capacity building, sustainable agriculture practices, and access to resources and markets.',
    category: 'income_support',
    ministry: 'Ministry of Rural Development',
    applicableStates: ['All India'],
    eligibleCrops: 'all',
    eligibleFarmerCategories: ['women', 'small_marginal'],
    farmSizeCriteria: null,
    benefits:
      'Training, capacity building, and support for sustainable agriculture practices. Implemented through NGOs and community organizations. Funding shared between Centre and State.',
    eligibility:
      'Women farmers and women Self Help Groups (SHGs) engaged in agriculture and allied activities, particularly from small and marginal holdings.',
    requiredDocuments: [
      'Aadhaar card',
      'SHG membership proof (if applicable)',
      'Land records or tenancy agreement',
      'Bank account details',
    ],
    applicationProcess: [
      'Join or form a women Self Help Group (SHG) in your village',
      'Contact the implementing NGO or State Rural Livelihoods Mission (SRLM)',
      'Enroll in the MKSP program through your SHG',
      'Receive training and capacity building support',
      'Access resources and market linkage through the SHG network',
    ],
    officialUrl: 'https://aajeevika.gov.in',
    sourceName: 'aajeevika.gov.in (Ministry of Rural Development)',
    lastVerifiedDate: '2025-06-15',
    isActive: true,
  },
];
