import { Product, Category, User, Order, DrugOrder, ShippingZone, SiteSettings, Review } from '../types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Bed Sheets', slug: 'bed-sheets', description: 'Premium bed sheets in every size and fabric', sortOrder: 1 },
  { id: 'cat-2', name: 'Duvet Covers', slug: 'duvet-covers', description: 'Luxurious duvet covers for every season', sortOrder: 2 },
  { id: 'cat-3', name: 'Pillowcases', slug: 'pillowcases', description: 'Silky, soft pillowcases for perfect sleep', sortOrder: 3 },
  { id: 'cat-4', name: 'Comforters', slug: 'comforters', description: 'Warm, cozy comforters for every climate', sortOrder: 4 },
  { id: 'cat-5', name: 'Blankets', slug: 'blankets', description: 'Throw blankets and bed blankets', sortOrder: 5 },
  { id: 'cat-6', name: 'Pillows', slug: 'pillows', description: 'Quality pillows in all firmness levels', sortOrder: 6 },
];

const productImages = {
  sheets1: [
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', alt: 'Egyptian Cotton Sheet Set', sortOrder: 0 },
    { id: 'img-2', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', alt: 'Sheet detail', sortOrder: 1 },
    { id: 'img-3', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', alt: 'Sheet on bed', sortOrder: 2 },
  ],
  sheets2: [
    { id: 'img-4', url: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=80', alt: 'Bamboo Sheet Set', sortOrder: 0 },
    { id: 'img-5', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', alt: 'Bamboo detail', sortOrder: 1 },
  ],
  duvet1: [
    { id: 'img-6', url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80', alt: 'Sateen Duvet Cover', sortOrder: 0 },
    { id: 'img-7', url: 'https://images.unsplash.com/photo-1617325247660-6e192a39b74b?w=800&q=80', alt: 'Duvet on bed', sortOrder: 1 },
  ],
  comforter1: [
    { id: 'img-8', url: 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=800&q=80', alt: 'Down Comforter', sortOrder: 0 },
    { id: 'img-9', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', alt: 'Comforter detail', sortOrder: 1 },
  ],
  blanket1: [
    { id: 'img-10', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', alt: 'Woven Throw Blanket', sortOrder: 0 },
    { id: 'img-11', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', alt: 'Blanket on sofa', sortOrder: 1 },
  ],
  pillow1: [
    { id: 'img-12', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80', alt: 'Luxury Pillow Set', sortOrder: 0 },
    { id: 'img-13', url: 'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=800&q=80', alt: 'Pillow detail', sortOrder: 1 },
  ],
};

const reviews: Review[] = [
  { id: 'rev-1', userId: 'u-1', userName: 'Ayesha S.', productId: 'prod-1', rating: 5, title: 'Best sheets ever!', body: 'The softest sheets I have ever slept on. Worth every rupee. The sateen weave is incredibly smooth.', isApproved: true, createdAt: '2024-11-15T10:00:00Z' },
  { id: 'rev-2', userId: 'u-2', userName: 'Bilal K.', productId: 'prod-1', rating: 4, title: 'Great quality', body: 'Very comfortable, though they wrinkle a bit after washing. Still the best sheets I own.', isApproved: true, createdAt: '2024-11-20T14:30:00Z' },
  { id: 'rev-3', userId: 'u-3', userName: 'Fatima R.', productId: 'prod-2', rating: 5, title: 'Cool and breathable', body: 'Perfect for hot summers in Karachi. The bamboo fabric is amazing — temperature regulating all night.', isApproved: true, createdAt: '2024-12-01T09:00:00Z' },
  { id: 'rev-4', userId: 'u-1', userName: 'Ayesha S.', productId: 'prod-4', rating: 5, title: 'Hotel luxury at home', body: 'This duvet cover feels like a five-star hotel. The sateen finish is gorgeous.', isApproved: true, createdAt: '2024-12-05T16:00:00Z' },
  { id: 'rev-5', userId: 'u-4', userName: 'Hassan T.', productId: 'prod-5', rating: 4, title: 'Warm and cozy', body: 'Great comforter for winter in Islamabad. Not too heavy, perfect warmth level.', isApproved: true, createdAt: '2024-12-10T11:00:00Z' },
  { id: 'rev-6', userId: 'u-5', userName: 'Zainab P.', productId: 'prod-6', rating: 5, title: 'Beautiful craftsmanship', body: 'The herringbone weave is stunning. Gets softer with every wash.', isApproved: true, createdAt: '2024-12-12T08:00:00Z' },
];

// Pakistani bed sizes: Single (3x6.5ft), Double (4x6.5ft), Queen (5x6.5ft), King (6x6.5ft)
export const products: Product[] = [
  {
    id: 'prod-1', name: 'ARA Signature Egyptian Cotton Sheet Set', slug: 'ara-signature-egyptian-cotton-sheet-set',
    description: 'Experience the pinnacle of luxury with our ARA Signature Egyptian cotton sheet set. Featuring a 600-thread-count sateen weave, these sheets offer unparalleled softness and durability. Each set includes a flat sheet, fitted sheet with deep pockets, and two pillowcases. Pre-washed for immediate softness and treated with our exclusive ARA StaySoft finish.',
    shortDesc: '600TC Egyptian cotton, buttery soft sateen weave',
    categoryId: 'cat-1', brand: 'ARA BEDDINGS', material: 'Egyptian Cotton', basePrice: 8500,
    isActive: true, isFeatured: true, images: productImages.sheets1, createdAt: '2024-01-15T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Single', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Double', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
        { id: 'ov-7', optionId: 'opt-2', value: 'Navy', sortOrder: 2 },
        { id: 'ov-8', optionId: 'opt-2', value: 'Sage', sortOrder: 3 },
        { id: 'ov-8b', optionId: 'opt-2', value: 'Charcoal', sortOrder: 4 },
      ]},
    ],
    variants: [
      { id: 'var-1', productId: 'prod-1', sku: 'ARA-ECS-SN-WH', price: 8500, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Single' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-2', productId: 'prod-1', sku: 'ARA-ECS-SN-IV', price: 8500, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Single' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-3', productId: 'prod-1', sku: 'ARA-ECS-DB-WH', price: 10500, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Double' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-4', productId: 'prod-1', sku: 'ARA-ECS-DB-NV', price: 10500, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Double' }, { optionId: 'opt-2', optionName: 'Color', value: 'Navy' }] },
      { id: 'var-5', productId: 'prod-1', sku: 'ARA-ECS-QN-WH', price: 12500, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-6', productId: 'prod-1', sku: 'ARA-ECS-QN-IV', price: 12500, stock: 22, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-7', productId: 'prod-1', sku: 'ARA-ECS-QN-SG', price: 12500, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-8', productId: 'prod-1', sku: 'ARA-ECS-KG-WH', price: 15500, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-9', productId: 'prod-1', sku: 'ARA-ECS-KG-NV', price: 15500, stock: 8, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Navy' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-1'),
  },
  {
    id: 'prod-2', name: 'ARA Cool Bamboo Lyocell Sheet Set', slug: 'ara-cool-bamboo-lyocell-sheet-set',
    description: 'Sleep cool and sustainably with our ARA Cool bamboo lyocell sheets. Naturally temperature-regulating, moisture-wicking, and hypoallergenic. Ideal for Pakistani summers.',
    shortDesc: 'Eco-friendly bamboo, naturally cooling & hypoallergenic',
    categoryId: 'cat-1', brand: 'ARA BEDDINGS', material: 'Bamboo Lyocell', basePrice: 9500,
    isActive: true, isFeatured: true, images: productImages.sheets2, createdAt: '2024-02-01T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Single', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Double', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-9', optionId: 'opt-2', value: 'Natural', sortOrder: 0 },
        { id: 'ov-10', optionId: 'opt-2', value: 'Cloud', sortOrder: 1 },
        { id: 'ov-11', optionId: 'opt-2', value: 'Eucalyptus', sortOrder: 2 },
        { id: 'ov-11b', optionId: 'opt-2', value: 'Lavender', sortOrder: 3 },
      ]},
    ],
    variants: [
      { id: 'var-10', productId: 'prod-2', sku: 'ARA-BLS-SN-NAT', price: 9500, stock: 35, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Single' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-11', productId: 'prod-2', sku: 'ARA-BLS-QN-NAT', price: 13500, stock: 28, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-12', productId: 'prod-2', sku: 'ARA-BLS-QN-EUC', price: 13500, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Eucalyptus' }] },
      { id: 'var-13', productId: 'prod-2', sku: 'ARA-BLS-KG-NAT', price: 16500, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-2'),
  },
  {
    id: 'prod-3', name: 'ARA Crisp Percale Cotton Duvet Cover', slug: 'ara-crisp-percale-cotton-duvet-cover',
    description: 'Crisp, cool, and perfectly tailored. Our ARA Crisp percale cotton duvet cover features a tight weave that creates a breathable, matte-finish fabric.',
    shortDesc: 'Crisp percale weave, breathable long-staple cotton',
    categoryId: 'cat-2', brand: 'ARA BEDDINGS', material: 'Percale Cotton', basePrice: 7500,
    isActive: true, isFeatured: false, images: productImages.duvet1, createdAt: '2024-03-10T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Single', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Double', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-12', optionId: 'opt-2', value: 'Light Gray', sortOrder: 1 },
        { id: 'ov-13', optionId: 'opt-2', value: 'Dusty Blue', sortOrder: 2 },
        { id: 'ov-13b', optionId: 'opt-2', value: 'Terracotta', sortOrder: 3 },
      ]},
    ],
    variants: [
      { id: 'var-14', productId: 'prod-3', sku: 'ARA-PCD-SN-WH', price: 7500, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Single' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-15', productId: 'prod-3', sku: 'ARA-PCD-QN-WH', price: 10500, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-16', productId: 'prod-3', sku: 'ARA-PCD-QN-DB', price: 10500, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Dusty Blue' }] },
      { id: 'var-17', productId: 'prod-3', sku: 'ARA-PCD-KG-WH', price: 13500, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-3'),
  },
  {
    id: 'prod-4', name: 'ARA Luxe Sateen Duvet Cover Set', slug: 'ara-luxe-sateen-duvet-cover-set',
    description: 'Indulge in the silky smoothness of our ARA Luxe sateen duvet cover set. Includes duvet cover and two matching shams.',
    shortDesc: 'Silky sateen, includes matching shams',
    categoryId: 'cat-2', brand: 'ARA BEDDINGS', material: 'Cotton Sateen', basePrice: 11500,
    isActive: true, isFeatured: true, images: productImages.duvet1, createdAt: '2024-03-15T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-2', optionId: 'opt-1', value: 'Double', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
        { id: 'ov-14', optionId: 'opt-2', value: 'Blush', sortOrder: 2 },
        { id: 'ov-14b', optionId: 'opt-2', value: 'Champagne', sortOrder: 3 },
      ]},
    ],
    variants: [
      { id: 'var-18', productId: 'prod-4', sku: 'ARA-SDC-QN-WH', price: 11500, comparePrice: 14500, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-19', productId: 'prod-4', sku: 'ARA-SDC-QN-BL', price: 11500, comparePrice: 14500, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Blush' }] },
      { id: 'var-20', productId: 'prod-4', sku: 'ARA-SDC-KG-WH', price: 14500, comparePrice: 17500, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-4'),
  },
  {
    id: 'prod-5', name: 'ARA Cloud All-Season Comforter', slug: 'ara-cloud-all-season-comforter',
    description: 'Our signature ARA Cloud all-season comforter filled with premium microfiber. Perfect for Pakistani weather — light enough for summer, warm enough for winter.',
    shortDesc: 'Premium microfiber fill, all-season comfort',
    categoryId: 'cat-4', brand: 'ARA BEDDINGS', material: 'Microfiber', basePrice: 15000,
    isActive: true, isFeatured: true, images: productImages.comforter1, createdAt: '2024-04-01T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Single', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Double', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
      ]},
    ],
    variants: [
      { id: 'var-21', productId: 'prod-5', sku: 'ARA-ACC-SN-WH', price: 15000, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Single' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-22', productId: 'prod-5', sku: 'ARA-ACC-QN-WH', price: 24000, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-23', productId: 'prod-5', sku: 'ARA-ACC-QN-IV', price: 24000, stock: 10, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-24', productId: 'prod-5', sku: 'ARA-ACC-KG-WH', price: 29000, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-5'),
  },
  {
    id: 'prod-6', name: 'ARA Artisan Handwoven Throw Blanket', slug: 'ara-artisan-handwoven-throw-blanket',
    description: 'Artisan-crafted from 100% organic cotton, this ARA Artisan throw blanket adds texture and warmth to any space. The herringbone weave pattern is timeless.',
    shortDesc: 'Organic cotton, artisan herringbone weave',
    categoryId: 'cat-5', brand: 'ARA BEDDINGS', material: 'Organic Cotton', basePrice: 4500,
    isActive: true, isFeatured: false, images: productImages.blanket1, createdAt: '2024-04-15T10:00:00Z',
    options: [
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'Natural', sortOrder: 0 },
        { id: 'ov-15', optionId: 'opt-2', value: 'Charcoal', sortOrder: 1 },
        { id: 'ov-8', optionId: 'opt-2', value: 'Sage', sortOrder: 2 },
        { id: 'ov-15b', optionId: 'opt-2', value: 'Rust', sortOrder: 3 },
      ]},
    ],
    variants: [
      { id: 'var-25', productId: 'prod-6', sku: 'ARA-HTB-NAT', price: 4500, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-26', productId: 'prod-6', sku: 'ARA-HTB-CHA', price: 4500, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Charcoal' }] },
      { id: 'var-27', productId: 'prod-6', sku: 'ARA-HTB-SAG', price: 4900, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-27b', productId: 'prod-6', sku: 'ARA-HTB-RST', price: 4900, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Rust' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-6'),
  },
  {
    id: 'prod-7', name: 'ARA Cloud Hypoallergenic Pillow Pair', slug: 'ara-cloud-hypoallergenic-pillow-pair',
    description: 'Sleep allergy-free with our ARA Cloud premium down-alternative pillows. Filled with advanced cluster fiber. Set of 2 pillows. Machine washable.',
    shortDesc: 'Down-alternative, gusseted edge, set of 2',
    categoryId: 'cat-6', brand: 'ARA BEDDINGS', material: 'Down Alternative', basePrice: 3500,
    isActive: true, isFeatured: false, images: productImages.pillow1, createdAt: '2024-05-01T10:00:00Z',
    options: [
      { id: 'opt-16', name: 'Firmness', values: [
        { id: 'ov-16', optionId: 'opt-16', value: 'Soft', sortOrder: 0 },
        { id: 'ov-17', optionId: 'opt-16', value: 'Medium', sortOrder: 1 },
        { id: 'ov-18', optionId: 'opt-16', value: 'Firm', sortOrder: 2 },
      ]},
    ],
    variants: [
      { id: 'var-28', productId: 'prod-7', sku: 'ARA-HPP-SF', price: 3500, stock: 50, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Soft' }] },
      { id: 'var-29', productId: 'prod-7', sku: 'ARA-HPP-MD', price: 3900, stock: 45, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Medium' }] },
      { id: 'var-30', productId: 'prod-7', sku: 'ARA-HPP-FR', price: 4200, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Firm' }] },
    ],
    reviews: [],
  },
  {
    id: 'prod-8', name: 'ARA French Linen Pillowcase Pair', slug: 'ara-french-linen-pillowcase-pair',
    description: 'French flax linen pillowcases that regulate temperature and wick moisture. Envelope closure keeps pillows secure. Pre-washed for immediate comfort.',
    shortDesc: 'French flax linen, stone-washed, envelope closure',
    categoryId: 'cat-3', brand: 'ARA BEDDINGS', material: 'French Linen', basePrice: 3200,
    isActive: true, isFeatured: false, images: productImages.sheets1, createdAt: '2024-05-15T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-19', optionId: 'opt-1', value: 'Standard', sortOrder: 0 },
        { id: 'ov-20', optionId: 'opt-1', value: 'Queen', sortOrder: 1 },
        { id: 'ov-21', optionId: 'opt-1', value: 'King', sortOrder: 2 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'Natural', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
        { id: 'ov-15', optionId: 'opt-2', value: 'Charcoal', sortOrder: 2 },
        { id: 'ov-8', optionId: 'opt-2', value: 'Sage', sortOrder: 3 },
      ]},
    ],
    variants: [
      { id: 'var-31', productId: 'prod-8', sku: 'ARA-LPC-STD-NAT', price: 3200, stock: 60, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Standard' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-32', productId: 'prod-8', sku: 'ARA-LPC-QN-IV', price: 3600, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-33', productId: 'prod-8', sku: 'ARA-LPC-QN-SG', price: 3600, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-34', productId: 'prod-8', sku: 'ARA-LPC-KG-CHA', price: 4000, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Charcoal' }] },
    ],
    reviews: [],
  },
  {
    id: 'prod-9', name: 'ARA Hotel Collection Pillowcase Set', slug: 'ara-hotel-collection-pillowcase-set',
    description: 'Bring five-star hotel luxury home with our ARA Hotel Collection pillowcases. 500-thread-count sateen weave. Set of 4 pillowcases.',
    shortDesc: '500TC sateen, set of 4, hotel quality',
    categoryId: 'cat-3', brand: 'ARA BEDDINGS', material: 'Cotton Sateen', basePrice: 2800,
    isActive: true, isFeatured: true, images: productImages.pillow1, createdAt: '2024-06-01T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-19', optionId: 'opt-1', value: 'Standard', sortOrder: 0 },
        { id: 'ov-20', optionId: 'opt-1', value: 'Queen', sortOrder: 1 },
        { id: 'ov-21', optionId: 'opt-1', value: 'King', sortOrder: 2 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
      ]},
    ],
    variants: [
      { id: 'var-35', productId: 'prod-9', sku: 'ARA-HPC-STD-WH', price: 2800, stock: 80, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Standard' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-36', productId: 'prod-9', sku: 'ARA-HPC-QN-WH', price: 3200, stock: 60, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-37', productId: 'prod-9', sku: 'ARA-HPC-KG-WH', price: 3600, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: [],
  },
];

export const currentUser: User = {
  id: 'u-1', name: 'Ahmed Khan', email: 'demo@arabeddings.com', phone: '+92 321 1234567', role: 'CUSTOMER', createdAt: '2024-01-01T00:00:00Z',
};

export const adminUser: User = {
  id: 'admin-1', name: 'Admin', email: 'admin@arabeddings.com', phone: '+92 300 0000000', role: 'ADMIN', createdAt: '2024-01-01T00:00:00Z',
};

export const shippingZones: ShippingZone[] = [
  {
    id: 'zone-1', name: 'Punjab', countries: ['PK'], isActive: true,
    methods: [
      { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Delivery', rate: 250, freeOverAmount: 5000, minDays: 3, maxDays: 5, isActive: true },
      { id: 'sm-2', zoneId: 'zone-1', name: 'Express Delivery', rate: 500, freeOverAmount: 10000, minDays: 1, maxDays: 2, isActive: true },
    ],
  },
  {
    id: 'zone-2', name: 'Sindh', countries: ['PK'], isActive: true,
    methods: [
      { id: 'sm-3', zoneId: 'zone-2', name: 'Standard Delivery', rate: 300, freeOverAmount: 5000, minDays: 3, maxDays: 5, isActive: true },
      { id: 'sm-4', zoneId: 'zone-2', name: 'Express Delivery', rate: 550, freeOverAmount: 10000, minDays: 1, maxDays: 2, isActive: true },
    ],
  },
  {
    id: 'zone-3', name: 'Khyber Pakhtunkhwa', countries: ['PK'], isActive: true,
    methods: [
      { id: 'sm-5', zoneId: 'zone-3', name: 'Standard Delivery', rate: 350, freeOverAmount: 5000, minDays: 4, maxDays: 6, isActive: true },
      { id: 'sm-6', zoneId: 'zone-3', name: 'Express Delivery', rate: 600, freeOverAmount: 10000, minDays: 2, maxDays: 3, isActive: true },
    ],
  },
  {
    id: 'zone-4', name: 'Balochistan', countries: ['PK'], isActive: true,
    methods: [
      { id: 'sm-7', zoneId: 'zone-4', name: 'Standard Delivery', rate: 400, freeOverAmount: 5000, minDays: 5, maxDays: 7, isActive: true },
    ],
  },
  {
    id: 'zone-5', name: 'Gilgit-Baltistan & AJK', countries: ['PK'], isActive: true,
    methods: [
      { id: 'sm-8', zoneId: 'zone-5', name: 'Standard Delivery', rate: 450, freeOverAmount: 5000, minDays: 5, maxDays: 7, isActive: true },
    ],
  },
];

export const siteSettings: SiteSettings = {
  bankTransferDetails: 'Bank: Meezan Bank Limited\nAccount Title: ARA BEDDINGS\nAccount Number: 0123-4567-8901-2345\nIBAN: PK36MEZN0012345678901234\nBranch: Main Branch, Karachi\n\nPlease include your order number in the transfer reference.',
  freeShippingThreshold: 5000,
  storeName: 'ARA BEDDINGS',
  storeEmail: 'hello@arabeddings.com',
  storePhone: '+92 321 1234567',
};

export const sampleOrders: Order[] = [
  {
    id: 'ord-1', orderNumber: 'ARA-2024-001', userId: 'u-1', status: 'DELIVERED',
    subtotal: 12500, shippingFee: 0, taxAmount: 0, discountAmount: 0, total: 12500, currency: 'PKR',
    items: [
      { id: 'oi-1', productId: 'prod-1', variantId: 'var-5', productName: 'ARA Signature Egyptian Cotton Sheet Set', variantName: 'Queen / White', sku: 'ARA-ECS-QN-WH', unitPrice: 12500, quantity: 1, total: 12500 },
    ],
    payment: { id: 'pay-1', orderId: 'ord-1', method: 'COD', status: 'VERIFIED', amount: 12500 },
    shippingAddress: { id: 'addr-1', userId: 'u-1', fullName: 'Ahmed Khan', phone: '+92 321 1234567', line1: 'House 45, Street 12', line2: 'DHA Phase 5', city: 'Lahore', state: 'Punjab', postalCode: '54000', country: 'PK', isDefault: true },
    shippingMethod: { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Delivery', rate: 250, freeOverAmount: 5000, isActive: true },
    statusHistory: [
      { id: 'sh-1', status: 'PENDING', createdAt: '2024-11-15T10:00:00Z' },
      { id: 'sh-2', status: 'CONFIRMED', createdAt: '2024-11-15T12:00:00Z' },
      { id: 'sh-3', status: 'SHIPPED', createdAt: '2024-11-16T09:00:00Z' },
      { id: 'sh-4', status: 'DELIVERED', createdAt: '2024-11-20T14:00:00Z' },
    ],
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'ord-2', orderNumber: 'ARA-2024-002', userId: 'u-1', status: 'SHIPPED',
    subtotal: 24000, shippingFee: 0, taxAmount: 0, discountAmount: 0, total: 24000, currency: 'PKR',
    items: [
      { id: 'oi-2', productId: 'prod-5', variantId: 'var-22', productName: 'ARA Cloud All-Season Comforter', variantName: 'Queen / White', sku: 'ARA-ACC-QN-WH', unitPrice: 24000, quantity: 1, total: 24000 },
    ],
    payment: { id: 'pay-2', orderId: 'ord-2', method: 'BANK_TRANSFER', status: 'VERIFIED', amount: 24000, reference: 'BT-2024-789', verifiedAt: '2024-12-02T10:00:00Z' },
    shippingAddress: { id: 'addr-1', userId: 'u-1', fullName: 'Ahmed Khan', phone: '+92 321 1234567', line1: 'House 45, Street 12', line2: 'DHA Phase 5', city: 'Lahore', state: 'Punjab', postalCode: '54000', country: 'PK', isDefault: true },
    shippingMethod: { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Delivery', rate: 250, freeOverAmount: 5000, isActive: true },
    statusHistory: [
      { id: 'sh-5', status: 'PENDING', createdAt: '2024-12-01T10:00:00Z' },
      { id: 'sh-6', status: 'CONFIRMED', createdAt: '2024-12-02T11:00:00Z' },
      { id: 'sh-7', status: 'SHIPPED', createdAt: '2024-12-03T09:00:00Z' },
    ],
    createdAt: '2024-12-01T10:00:00Z',
  },
];

export const sampleDrugOrders: DrugOrder[] = [
  {
    id: 'do-1', reference: 'ARA-CUSTOM-2024-001', userId: 'u-1', fullName: 'Ahmed Khan', email: 'demo@arabeddings.com', phone: '+92 321 1234567',
    itemType: 'Custom Sheets', size: 'King Extra Long', quantity: 50, fabric: 'Egyptian Cotton 800TC', color: 'White',
    deliveryAddress: 'Pearl Continental Hotel, Club Road, Karachi, Sindh', notes: 'Hotel chain order. Need custom size for King Extra Long beds.',
    status: 'QUOTED', quotedPrice: 450000, createdAt: '2024-12-10T10:00:00Z',
  },
];
