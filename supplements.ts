export interface Supplement {
  id: string;
  name: string;
  category: string;
  brand?: string;
  description?: string;
}

export type SupplementCategory = 'Vitamins' | 'Minerals' | 'Amino Acids' | 'Herbal / Natural' | 'Branded Products';

export const SUPPLEMENT_CATEGORIES: SupplementCategory[] = [
  'Vitamins',
  'Minerals',
  'Amino Acids',
  'Herbal / Natural',
  'Branded Products',
];

export const VITAMINS: Supplement[] = [
  { id: 'vit_a', name: 'Vitamin A', category: 'Vitamins', description: 'Vision, immune function, skin health' },
  { id: 'vit_b1', name: 'Vitamin B1 (Thiamine)', category: 'Vitamins', description: 'Energy metabolism, nerve function' },
  { id: 'vit_b2', name: 'Vitamin B2 (Riboflavin)', category: 'Vitamins', description: 'Energy production, cell growth' },
  { id: 'vit_b3', name: 'Vitamin B3 (Niacin)', category: 'Vitamins', description: 'Energy, DNA repair, cholesterol' },
  { id: 'vit_b5', name: 'Vitamin B5 (Pantothenic Acid)', category: 'Vitamins', description: 'Hormone synthesis, energy' },
  { id: 'vit_b6', name: 'Vitamin B6', category: 'Vitamins', description: 'Protein metabolism, mood regulation' },
  { id: 'vit_b7', name: 'Vitamin B7 (Biotin)', category: 'Vitamins', description: 'Hair, nails, fat metabolism' },
  { id: 'vit_b9', name: 'Vitamin B9 (Folate)', category: 'Vitamins', description: 'Cell division, DNA synthesis' },
  { id: 'vit_b12', name: 'Vitamin B12', category: 'Vitamins', description: 'Nerve health, red blood cells' },
  { id: 'vit_c', name: 'Vitamin C', category: 'Vitamins', description: 'Immune support, collagen, antioxidant' },
  { id: 'vit_d3', name: 'Vitamin D3', category: 'Vitamins', description: 'Bone health, immune function, mood' },
  { id: 'vit_e', name: 'Vitamin E', category: 'Vitamins', description: 'Antioxidant, skin, immune support' },
  { id: 'vit_k1', name: 'Vitamin K1', category: 'Vitamins', description: 'Blood clotting, bone metabolism' },
  { id: 'vit_k2', name: 'Vitamin K2', category: 'Vitamins', description: 'Cardiovascular health, bone density' },
];

export const MINERALS: Supplement[] = [
  { id: 'min_ca', name: 'Calcium', category: 'Minerals', description: 'Bone strength, muscle contraction' },
  { id: 'min_mg', name: 'Magnesium', category: 'Minerals', description: 'Muscle recovery, sleep, 300+ enzymes' },
  { id: 'min_zn', name: 'Zinc', category: 'Minerals', description: 'Immune function, testosterone, healing' },
  { id: 'min_fe', name: 'Iron', category: 'Minerals', description: 'Oxygen transport, energy production' },
  { id: 'min_k', name: 'Potassium', category: 'Minerals', description: 'Heart rhythm, fluid balance, muscles' },
  { id: 'min_se', name: 'Selenium', category: 'Minerals', description: 'Thyroid function, antioxidant defense' },
  { id: 'min_cr', name: 'Chromium', category: 'Minerals', description: 'Blood sugar regulation, insulin sensitivity' },
  { id: 'min_i', name: 'Iodine', category: 'Minerals', description: 'Thyroid hormones, metabolism' },
  { id: 'min_cu', name: 'Copper', category: 'Minerals', description: 'Iron metabolism, connective tissue' },
  { id: 'min_mn', name: 'Manganese', category: 'Minerals', description: 'Bone formation, enzyme activation' },
  { id: 'min_b', name: 'Boron', category: 'Minerals', description: 'Testosterone, bone density, cognition' },
];

export const AMINO_ACIDS: Supplement[] = [
  { id: 'aa_bcaa', name: 'BCAA', category: 'Amino Acids', description: 'Muscle protein synthesis, recovery' },
  { id: 'aa_glut', name: 'L-Glutamine', category: 'Amino Acids', description: 'Gut health, muscle recovery, immunity' },
  { id: 'aa_carn', name: 'L-Carnitine', category: 'Amino Acids', description: 'Fat metabolism, energy transport' },
  { id: 'aa_arg', name: 'L-Arginine', category: 'Amino Acids', description: 'Nitric oxide, blood flow, pump' },
  { id: 'aa_cit', name: 'L-Citrulline', category: 'Amino Acids', description: 'Better NO2 than Arginine, endurance' },
  { id: 'aa_creat', name: 'Creatine', category: 'Amino Acids', description: 'Strength, power output, muscle gain' },
  { id: 'aa_beta', name: 'Beta-Alanine', category: 'Amino Acids', description: 'Endurance, lactic acid buffer' },
  { id: 'aa_tau', name: 'Taurine', category: 'Amino Acids', description: 'Heart health, hydration, focus' },
  { id: 'aa_lys', name: 'Lysine', category: 'Amino Acids', description: 'Collagen, calcium absorption, immunity' },
];

export const HERBAL_NATURAL: Supplement[] = [
  { id: 'herb_shil', name: 'Shilajit', category: 'Herbal / Natural', description: 'Testosterone, energy, minerals' },
  { id: 'herb_ashw', name: 'Ashwagandha', category: 'Herbal / Natural', description: 'Stress reduction, cortisol, sleep' },
  { id: 'herb_turm', name: 'Turmeric', category: 'Herbal / Natural', description: 'Anti-inflammatory, joint health' },
  { id: 'herb_resv', name: 'Resveratrol', category: 'Herbal / Natural', description: 'Anti-aging, cardiovascular, longevity' },
  { id: 'herb_nad', name: 'NAD+', category: 'Herbal / Natural', description: 'Cellular energy, DNA repair, aging' },
  { id: 'herb_berb', name: 'Berberine', category: 'Herbal / Natural', description: 'Blood sugar, metabolism, gut' },
  { id: 'herb_tong', name: 'Tongkat Ali', category: 'Herbal / Natural', description: 'Testosterone, libido, stress' },
  { id: 'herb_maca', name: 'Maca', category: 'Herbal / Natural', description: 'Energy, fertility, hormonal balance' },
  { id: 'herb_gins', name: 'Ginseng', category: 'Herbal / Natural', description: 'Energy, immunity, cognitive function' },
  { id: 'herb_coq', name: 'CoQ10', category: 'Herbal / Natural', description: 'Cellular energy, heart health' },
  { id: 'herb_om3', name: 'Omega-3', category: 'Herbal / Natural', description: 'Heart, brain, inflammation' },
  { id: 'herb_col', name: 'Collagen', category: 'Herbal / Natural', description: 'Joints, skin, tendons, hair' },
  { id: 'herb_mel', name: 'Melatonin', category: 'Herbal / Natural', description: 'Sleep onset, circadian rhythm' },
  { id: 'herb_milk', name: 'Milk Thistle', category: 'Herbal / Natural', description: 'Liver detox and protection' },
];

export interface BrandedProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Branded Products';
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  products: BrandedProduct[];
}

export const BRANDS: Brand[] = [
  {
    id: 'force_factor',
    name: 'Force Factor',
    products: [
      { id: 'ff_score', name: 'Score!', brand: 'Force Factor', category: 'Branded Products', description: 'Pre-workout energy & pump' },
      { id: 'ff_lf', name: 'Lean Fire', brand: 'Force Factor', category: 'Branded Products', description: 'Thermogenic fat burner' },
      { id: 'ff_ts', name: 'TestoSmart', brand: 'Force Factor', category: 'Branded Products', description: 'Testosterone support' },
      { id: 'ff_pb', name: 'ProbioSlim', brand: 'Force Factor', category: 'Branded Products', description: 'Probiotic + weight management' },
      { id: 'ff_fb', name: 'Forebrain', brand: 'Force Factor', category: 'Branded Products', description: 'Cognitive function support' },
      { id: 'ff_ak', name: 'Alpha King', brand: 'Force Factor', category: 'Branded Products', description: 'Testosterone & vitality' },
    ],
  },
  {
    id: 'optimum_nutrition',
    name: 'Optimum Nutrition',
    products: [
      { id: 'on_gsw', name: 'Gold Standard Whey', brand: 'Optimum Nutrition', category: 'Branded Products', description: 'Premium whey protein' },
      { id: 'on_sm', name: 'Serious Mass', brand: 'Optimum Nutrition', category: 'Branded Products', description: 'Mass gainer' },
      { id: 'on_mc', name: 'Micronized Creatine', brand: 'Optimum Nutrition', category: 'Branded Products', description: 'Pure creatine monohydrate' },
      { id: 'on_om', name: 'Opti-Men', brand: 'Optimum Nutrition', category: 'Branded Products', description: "Men's multivitamin" },
      { id: 'on_ow', name: 'Opti-Women', brand: 'Optimum Nutrition', category: 'Branded Products', description: "Women's multivitamin" },
    ],
  },
  {
    id: 'garden_of_life',
    name: 'Garden of Life',
    products: [
      { id: 'gol_sp', name: 'Sport Organic Protein', brand: 'Garden of Life', category: 'Branded Products', description: 'Certified organic plant protein' },
      { id: 'gol_ro', name: 'Raw Organics', brand: 'Garden of Life', category: 'Branded Products', description: 'Raw whole food supplement' },
      { id: 'gol_drp', name: 'Dr. Formulated Probiotics', brand: 'Garden of Life', category: 'Branded Products', description: 'High-potency probiotic blend' },
    ],
  },
  {
    id: 'nature_made',
    name: 'Nature Made',
    products: [
      { id: 'nm_fo', name: 'Fish Oil', brand: 'Nature Made', category: 'Branded Products', description: 'Omega-3 EPA+DHA' },
      { id: 'nm_d3', name: 'Vitamin D3', brand: 'Nature Made', category: 'Branded Products', description: '2000 IU D3' },
      { id: 'nm_b12', name: 'B12', brand: 'Nature Made', category: 'Branded Products', description: '1000mcg methylcobalamin' },
      { id: 'nm_mg', name: 'Magnesium', brand: 'Nature Made', category: 'Branded Products', description: '250mg magnesium oxide' },
      { id: 'nm_coq', name: 'CoQ10', brand: 'Nature Made', category: 'Branded Products', description: '200mg ubiquinone' },
    ],
  },
  {
    id: 'thorne',
    name: 'Thorne',
    products: [
      { id: 'th_bn', name: 'Basic Nutrients', brand: 'Thorne', category: 'Branded Products', description: 'Complete multivitamin' },
      { id: 'th_mgb', name: 'Magnesium Bisglycinate', brand: 'Thorne', category: 'Branded Products', description: 'Highly absorbable magnesium' },
      { id: 'th_cr', name: 'Creatine', brand: 'Thorne', category: 'Branded Products', description: 'NSF certified creatine' },
      { id: 'th_om3', name: 'Omega-3', brand: 'Thorne', category: 'Branded Products', description: 'High-potency fish oil' },
    ],
  },
  {
    id: 'now_foods',
    name: 'NOW Foods',
    products: [
      { id: 'nf_adam', name: 'ADAM Men\'s', brand: 'NOW Foods', category: 'Branded Products', description: "Men's super multivitamin" },
      { id: 'nf_eve', name: 'EVE Women\'s', brand: 'NOW Foods', category: 'Branded Products', description: "Women's super multivitamin" },
      { id: 'nf_vc', name: 'Vitamin C', brand: 'NOW Foods', category: 'Branded Products', description: '1000mg vitamin C' },
      { id: 'nf_zn', name: 'Zinc', brand: 'NOW Foods', category: 'Branded Products', description: '50mg zinc gluconate' },
      { id: 'nf_mg', name: 'Magnesium', brand: 'NOW Foods', category: 'Branded Products', description: 'Magnesium citrate' },
    ],
  },
  {
    id: 'ritual',
    name: 'Ritual',
    products: [
      { id: 'rit_men', name: 'Essential for Men', brand: 'Ritual', category: 'Branded Products', description: 'Traceable men\'s multivitamin' },
      { id: 'rit_wom', name: 'Essential for Women', brand: 'Ritual', category: 'Branded Products', description: "Traceable women's multivitamin" },
      { id: 'rit_pro', name: 'Protein', brand: 'Ritual', category: 'Branded Products', description: 'Clean protein blend' },
    ],
  },
  {
    id: 'ag1',
    name: 'Athletic Greens / AG1',
    products: [
      { id: 'ag1_orig', name: 'AG1', brand: 'Athletic Greens / AG1', category: 'Branded Products', description: 'All-in-one daily greens drink' },
    ],
  },
];
