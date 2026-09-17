import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Egyptian Cotton Sheet Set',
    category: 'Sheets',
    price: 189,
    originalPrice: 249,
    description: 'Indulge in the ultimate luxury of 800-thread-count Egyptian cotton. These sheets become softer with every wash, offering a smooth, lustrous surface for the most restful sleep.',
    details: [
      '800 thread count Egyptian cotton',
      'Includes fitted sheet, flat sheet, and 2 pillowcases',
      'Deep pocket design fits mattresses up to 16"',
      'OEKO-TEX certified, free from harmful substances',
      'Machine washable, tumble dry low'
    ],
    image: 'https://image.qwenlm.ai/generated-images/230d8008-c279-4987-a47d-99be32d2d591/_result.png',
    rating: 4.8,
    reviews: 234,
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Mulberry Silk Pillowcase Set',
    category: 'Pillows',
    price: 129,
    description: 'Crafted from 100% Grade 6A mulberry silk, these pillowcases protect your hair and skin while you sleep. The smooth surface reduces friction and helps maintain natural moisture.',
    details: [
      '100% Grade 6A mulberry silk, 22 momme',
      'Hidden zipper closure',
      'Hypoallergenic and temperature regulating',
      'Reduces hair frizz and skin creasing',
      'Set of 2 pillowcases, standard size 20" x 26"'
    ],
    image: 'https://image.qwenlm.ai/generated-images/d4472daf-a793-4371-93e9-966e3cbad118/_result.png',
    rating: 4.9,
    reviews: 189,
    badge: 'New'
  },
  {
    id: 3,
    name: 'Cashmere Blend Throw Blanket',
    category: 'Blankets',
    price: 245,
    originalPrice: 320,
    description: 'A sumptuous blend of cashmere and merino wool, this throw blanket provides unparalleled warmth without weight. Perfect for cool evenings on the sofa or as an elegant bed accent.',
    details: [
      '70% cashmere, 30% merino wool blend',
      'Generous 50" x 70" size',
      'Hand-finished fringe edges',
      'Naturally temperature regulating',
      'Dry clean recommended'
    ],
    image: 'https://image.qwenlm.ai/generated-images/12ee1122-7bb4-4088-a76f-530be1e93471/_result.png',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: 'Stonewashed Linen Duvet Cover',
    category: 'Duvets',
    price: 275,
    description: 'Made from premium European flax linen, this duvet cover is stonewashed for an effortlessly soft, lived-in feel from the very first night. Linen naturally breathes, keeping you cool in summer and warm in winter.',
    details: [
      '100% European flax linen',
      'Pre-stonewashed for immediate softness',
      'Includes duvet cover and 2 shams',
      'Hidden button closure with internal corner ties',
      'Gets softer with every wash'
    ],
    image: 'https://image.qwenlm.ai/generated-images/c5b0b1bd-6950-403d-a328-1567c0f4e540/_result.png',
    rating: 4.6,
    reviews: 98,
    badge: 'Eco-Friendly'
  },
  {
    id: 5,
    name: 'Organic Bamboo Bath Towel Set',
    category: 'Bath',
    price: 95,
    description: 'Ultra-absorbent and naturally antibacterial, these bamboo towels are gentle on sensitive skin. The plush loops dry you quickly while feeling like a cloud against your skin.',
    details: [
      '60% bamboo viscose, 40% organic cotton',
      'Set includes 2 bath towels, 2 hand towels, 4 washcloths',
      'Naturally antibacterial and odor resistant',
      'Highly absorbent, quick-drying',
      'GOTS certified organic'
    ],
    image: 'https://image.qwenlm.ai/generated-images/185a8521-fbd2-4c6d-81a8-f6c308a43995/_result.png',
    rating: 4.5,
    reviews: 312
  },
  {
    id: 6,
    name: 'Velvet Cushion Cover Set',
    category: 'Decor',
    price: 79,
    originalPrice: 109,
    description: 'Add a touch of opulence to any room with these crushed velvet cushion covers. The rich texture catches light beautifully, creating depth and warmth in your living space.',
    details: [
      'Premium crushed velvet fabric',
      'Set of 2 cushion covers, 18" x 18"',
      'Hidden zipper closure',
      'Insert not included',
      'Spot clean or gentle machine wash'
    ],
    image: 'https://image.qwenlm.ai/generated-images/67d2b654-5de3-4b88-ab14-d035002e2001/_result.png',
    rating: 4.4,
    reviews: 87,
    badge: 'Sale'
  }
];

export const categories = ['All', 'Sheets', 'Pillows', 'Blankets', 'Duvets', 'Bath', 'Decor'];
