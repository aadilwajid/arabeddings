import { Product, Category, User, Order, DrugOrder, ShippingZone, SiteSettings, Review } from '../types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Bed Sheets', slug: 'bed-sheets', description: 'Premium bed sheets in every size and fabric', sortOrder: 1 },
  { id: 'cat-2', name: 'Duvet Covers', slug: 'duvet-covers', description: 'Luxurious duvet covers for every season', sortOrder: 2 },
  { id: 'cat-3', name: 'Pillowcases', slug: 'pillowcases', description: 'Silky, soft pillowcases for perfect sleep', sortOrder: 3 },
  { id: 'cat-4', name: 'Comforters', slug: 'comforters', description: 'Warm, cozy comforters for every climate', sortOrder: 4 },
  { id: 'cat-5', name: 'Blankets', slug: 'blankets', description: 'Throw blankets and bed blankets', sortOrder: 5 },
  { id: 'cat-6', name: 'Pillow Inserts', slug: 'pillow-inserts', description: 'Quality pillow inserts in all firmness levels', sortOrder: 6 },
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
  { id: 'rev-1', userId: 'u-1', userName: 'Sarah M.', productId: 'prod-1', rating: 5, title: 'Absolutely love these!', body: 'The softest sheets I have ever slept on. Worth every penny. The sateen weave is incredibly smooth.', isApproved: true, createdAt: '2024-11-15T10:00:00Z' },
  { id: 'rev-2', userId: 'u-2', userName: 'James K.', productId: 'prod-1', rating: 4, title: 'Great quality', body: 'Very comfortable, though they wrinkle a bit after washing. Still the best sheets I own.', isApproved: true, createdAt: '2024-11-20T14:30:00Z' },
  { id: 'rev-3', userId: 'u-3', userName: 'Emily R.', productId: 'prod-2', rating: 5, title: 'Cool and breathable', body: 'Perfect for hot sleepers. The bamboo fabric is amazing — temperature regulating all night.', isApproved: true, createdAt: '2024-12-01T09:00:00Z' },
  { id: 'rev-4', userId: 'u-1', userName: 'Sarah M.', productId: 'prod-4', rating: 5, title: 'Hotel luxury at home', body: 'This duvet cover feels like a five-star hotel. The sateen finish is gorgeous.', isApproved: true, createdAt: '2024-12-05T16:00:00Z' },
  { id: 'rev-5', userId: 'u-4', userName: 'Michael T.', productId: 'prod-5', rating: 4, title: 'Warm and cozy', body: 'Great comforter for winter. Not too heavy, perfect warmth level.', isApproved: true, createdAt: '2024-12-10T11:00:00Z' },
  { id: 'rev-6', userId: 'u-5', userName: 'Lisa P.', productId: 'prod-6', rating: 5, title: 'Beautiful craftsmanship', body: 'The herringbone weave is stunning. Gets softer with every wash.', isApproved: true, createdAt: '2024-12-12T08:00:00Z' },
  { id: 'rev-7', userId: 'u-2', userName: 'James K.', productId: 'prod-3', rating: 4, title: 'Crisp and clean', body: 'Love the percale feel. Very breathable for summer months.', isApproved: true, createdAt: '2024-12-15T13:00:00Z' },
];

export const products: Product[] = [
  {
    id: 'prod-1', name: 'ARA Signature Egyptian Cotton Sheet Set', slug: 'ara-signature-egyptian-cotton-sheet-set',
    description: 'Experience the pinnacle of luxury with our ARA Signature Egyptian cotton sheet set. Featuring a 600-thread-count sateen weave, these sheets offer unparalleled softness and durability. Each set includes a flat sheet, fitted sheet with 17" deep pockets, and two pillowcases. Pre-washed for immediate softness and treated with our exclusive ARA StaySoft™ finish that maintains fabric quality wash after wash. OEKO-TEX® certified.',
    shortDesc: '600TC Egyptian cotton, buttery soft sateen weave',
    categoryId: 'cat-1', brand: 'ARA BEDDINGS', material: 'Egyptian Cotton', basePrice: 149.99,
    isActive: true, isFeatured: true, images: productImages.sheets1, createdAt: '2024-01-15T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Twin', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Full', sortOrder: 1 },
        { id: 'ov-3', optionId: 'opt-1', value: 'Queen', sortOrder: 2 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
        { id: 'ov-4b', optionId: 'opt-1', value: 'Cal King', sortOrder: 4 },
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
      { id: 'var-1', productId: 'prod-1', sku: 'ARA-ECS-TW-WH', price: 149.99, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Twin' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-2', productId: 'prod-1', sku: 'ARA-ECS-TW-IV', price: 149.99, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Twin' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-3', productId: 'prod-1', sku: 'ARA-ECS-FU-WH', price: 169.99, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-4', productId: 'prod-1', sku: 'ARA-ECS-FU-NV', price: 169.99, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full' }, { optionId: 'opt-2', optionName: 'Color', value: 'Navy' }] },
      { id: 'var-5', productId: 'prod-1', sku: 'ARA-ECS-QN-WH', price: 189.99, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-6', productId: 'prod-1', sku: 'ARA-ECS-QN-IV', price: 189.99, stock: 22, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-7', productId: 'prod-1', sku: 'ARA-ECS-QN-SG', price: 189.99, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-7b', productId: 'prod-1', sku: 'ARA-ECS-QN-CH', price: 189.99, stock: 10, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Charcoal' }] },
      { id: 'var-8', productId: 'prod-1', sku: 'ARA-ECS-KG-WH', price: 219.99, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-9', productId: 'prod-1', sku: 'ARA-ECS-KG-NV', price: 219.99, stock: 8, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Navy' }] },
      { id: 'var-9b', productId: 'prod-1', sku: 'ARA-ECS-CK-WH', price: 229.99, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Cal King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-1'),
  },
  {
    id: 'prod-2', name: 'ARA Cool Bamboo Lyocell Sheet Set', slug: 'ara-cool-bamboo-lyocell-sheet-set',
    description: 'Sleep cool and sustainably with our ARA Cool bamboo lyocell sheets. Naturally temperature-regulating, moisture-wicking, and hypoallergenic. The 400-thread-count twill weave provides a silky-smooth feel that gets softer with every wash. OEKO-TEX certified and produced using a closed-loop process. Ideal for hot sleepers and sensitive skin.',
    shortDesc: 'Eco-friendly bamboo, naturally cooling & hypoallergenic',
    categoryId: 'cat-1', brand: 'ARA BEDDINGS', material: 'Bamboo Lyocell', basePrice: 129.99,
    isActive: true, isFeatured: true, images: productImages.sheets2, createdAt: '2024-02-01T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Twin', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Full', sortOrder: 1 },
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
      { id: 'var-10', productId: 'prod-2', sku: 'ARA-BLS-TW-NAT', price: 129.99, stock: 35, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Twin' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-11', productId: 'prod-2', sku: 'ARA-BLS-QN-NAT', price: 169.99, stock: 28, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-12', productId: 'prod-2', sku: 'ARA-BLS-QN-EUC', price: 169.99, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Eucalyptus' }] },
      { id: 'var-12b', productId: 'prod-2', sku: 'ARA-BLS-QN-LAV', price: 169.99, stock: 14, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Lavender' }] },
      { id: 'var-13', productId: 'prod-2', sku: 'ARA-BLS-KG-NAT', price: 199.99, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-2'),
  },
  {
    id: 'prod-3', name: 'ARA Crisp Percale Cotton Duvet Cover', slug: 'ara-crisp-percale-cotton-duvet-cover',
    description: 'Crisp, cool, and perfectly tailored. Our ARA Crisp percale cotton duvet cover features a tight one-over-one-under weave that creates a breathable, matte-finish fabric. Corner ties keep your duvet in place, and the hidden button closure gives a clean look. Gets softer and more luxurious with every wash. Made from long-staple cotton for superior strength.',
    shortDesc: 'Crisp percale weave, breathable long-staple cotton',
    categoryId: 'cat-2', brand: 'ARA BEDDINGS', material: 'Percale Cotton', basePrice: 119.99,
    isActive: true, isFeatured: false, images: productImages.duvet1, createdAt: '2024-03-10T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Twin', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Full/Queen', sortOrder: 1 },
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
      { id: 'var-14', productId: 'prod-3', sku: 'ARA-PCD-TW-WH', price: 119.99, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Twin' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-15', productId: 'prod-3', sku: 'ARA-PCD-FQ-WH', price: 149.99, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-16', productId: 'prod-3', sku: 'ARA-PCD-FQ-DB', price: 149.99, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Dusty Blue' }] },
      { id: 'var-16b', productId: 'prod-3', sku: 'ARA-PCD-FQ-TR', price: 149.99, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Terracotta' }] },
      { id: 'var-17', productId: 'prod-3', sku: 'ARA-PCD-KG-WH', price: 179.99, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-3'),
  },
  {
    id: 'prod-4', name: 'ARA Luxe Sateen Duvet Cover Set', slug: 'ara-luxe-sateen-duvet-cover-set',
    description: 'Indulge in the silky smoothness of our ARA Luxe sateen duvet cover set. The four-over-one-under weave creates a lustrous, drapey fabric that feels like sleeping on a cloud. Includes duvet cover and two matching shams. Enzyme-washed for immediate softness. Corner ties and hidden button closure for a polished look.',
    shortDesc: 'Silky sateen, includes matching shams',
    categoryId: 'cat-2', brand: 'ARA BEDDINGS', material: 'Cotton Sateen', basePrice: 159.99,
    isActive: true, isFeatured: true, images: productImages.duvet1, createdAt: '2024-03-15T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-2', optionId: 'opt-1', value: 'Full/Queen', sortOrder: 1 },
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
      { id: 'var-18', productId: 'prod-4', sku: 'ARA-SDC-FQ-WH', price: 159.99, comparePrice: 199.99, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-19', productId: 'prod-4', sku: 'ARA-SDC-FQ-BL', price: 159.99, comparePrice: 199.99, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Blush' }] },
      { id: 'var-19b', productId: 'prod-4', sku: 'ARA-SDC-FQ-CH', price: 159.99, comparePrice: 199.99, stock: 8, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Champagne' }] },
      { id: 'var-20', productId: 'prod-4', sku: 'ARA-SDC-KG-WH', price: 189.99, comparePrice: 229.99, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-4'),
  },
  {
    id: 'prod-5', name: 'ARA Cloud All-Season Down Comforter', slug: 'ara-cloud-all-season-down-comforter',
    description: 'Our signature ARA Cloud all-season comforter filled with 750-fill-power white goose down. Baffle-box construction prevents cold spots, while the 400TC cotton shell is breathable and quiet. Light enough for summer warmth, cozy enough for winter. Comes with a cotton storage bag. RDS (Responsible Down Standard) certified.',
    shortDesc: '750-fill RDS goose down, baffle-box construction',
    categoryId: 'cat-4', brand: 'ARA BEDDINGS', material: 'Goose Down', basePrice: 249.99,
    isActive: true, isFeatured: true, images: productImages.comforter1, createdAt: '2024-04-01T10:00:00Z',
    options: [
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-1', optionId: 'opt-1', value: 'Twin', sortOrder: 0 },
        { id: 'ov-2', optionId: 'opt-1', value: 'Full/Queen', sortOrder: 1 },
        { id: 'ov-4', optionId: 'opt-1', value: 'King', sortOrder: 3 },
      ]},
      { id: 'opt-2', name: 'Color', values: [
        { id: 'ov-5', optionId: 'opt-2', value: 'White', sortOrder: 0 },
        { id: 'ov-6', optionId: 'opt-2', value: 'Ivory', sortOrder: 1 },
      ]},
    ],
    variants: [
      { id: 'var-21', productId: 'prod-5', sku: 'ARA-ADC-TW-WH', price: 249.99, stock: 15, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Twin' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-22', productId: 'prod-5', sku: 'ARA-ADC-FQ-WH', price: 329.99, stock: 20, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-23', productId: 'prod-5', sku: 'ARA-ADC-FQ-IV', price: 329.99, stock: 10, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Full/Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-24', productId: 'prod-5', sku: 'ARA-ADC-KG-WH', price: 399.99, stock: 12, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-5'),
  },
  {
    id: 'prod-6', name: 'ARA Artisan Handwoven Throw Blanket', slug: 'ara-artisan-handwoven-throw-blanket',
    description: 'Artisan-crafted from 100% GOTS-certified organic cotton, this ARA Artisan throw blanket adds texture and warmth to any space. The herringbone weave pattern is timeless, and the hand-knotted fringed edges add a handcrafted touch. Perfect for layering on beds or draping over sofas. Each piece is unique.',
    shortDesc: 'GOTS organic cotton, artisan herringbone weave',
    categoryId: 'cat-5', brand: 'ARA BEDDINGS', material: 'Organic Cotton', basePrice: 79.99,
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
      { id: 'var-25', productId: 'prod-6', sku: 'ARA-HTB-NAT', price: 79.99, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-26', productId: 'prod-6', sku: 'ARA-HTB-CHA', price: 79.99, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Charcoal' }] },
      { id: 'var-27', productId: 'prod-6', sku: 'ARA-HTB-SAG', price: 84.99, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-27b', productId: 'prod-6', sku: 'ARA-HTB-RST', price: 84.99, stock: 18, isActive: true, optionValues: [{ optionId: 'opt-2', optionName: 'Color', value: 'Rust' }] },
    ],
    reviews: reviews.filter(r => r.productId === 'prod-6'),
  },
  {
    id: 'prod-7', name: 'ARA Cloud Hypoallergenic Pillow Pair', slug: 'ara-cloud-hypoallergenic-pillow-pair',
    description: 'Sleep allergy-free with our ARA Cloud premium down-alternative pillows. Filled with advanced cluster fiber that mimics the loft and support of real down without the allergens. The cotton cover is breathable and features gusseted edges for proper neck support. Set of 2 pillows. Machine washable.',
    shortDesc: 'Down-alternative, gusseted edge, set of 2',
    categoryId: 'cat-6', brand: 'ARA BEDDINGS', material: 'Down Alternative', basePrice: 69.99,
    isActive: true, isFeatured: false, images: productImages.pillow1, createdAt: '2024-05-01T10:00:00Z',
    options: [
      { id: 'opt-16', name: 'Firmness', values: [
        { id: 'ov-16', optionId: 'opt-16', value: 'Soft', sortOrder: 0 },
        { id: 'ov-17', optionId: 'opt-16', value: 'Medium', sortOrder: 1 },
        { id: 'ov-18', optionId: 'opt-16', value: 'Firm', sortOrder: 2 },
      ]},
      { id: 'opt-1', name: 'Size', values: [
        { id: 'ov-19', optionId: 'opt-1', value: 'Standard', sortOrder: 0 },
        { id: 'ov-20', optionId: 'opt-1', value: 'Queen', sortOrder: 1 },
        { id: 'ov-21', optionId: 'opt-1', value: 'King', sortOrder: 2 },
      ]},
    ],
    variants: [
      { id: 'var-28', productId: 'prod-7', sku: 'ARA-HPP-SF-STD', price: 69.99, stock: 50, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Soft' }, { optionId: 'opt-1', optionName: 'Size', value: 'Standard' }] },
      { id: 'var-29', productId: 'prod-7', sku: 'ARA-HPP-MD-QN', price: 79.99, stock: 45, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Medium' }, { optionId: 'opt-1', optionName: 'Size', value: 'Queen' }] },
      { id: 'var-30', productId: 'prod-7', sku: 'ARA-HPP-FR-KG', price: 89.99, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-16', optionName: 'Firmness', value: 'Firm' }, { optionId: 'opt-1', optionName: 'Size', value: 'King' }] },
    ],
    reviews: [],
  },
  {
    id: 'prod-8', name: 'ARA French Linen Pillowcase Pair', slug: 'ara-french-linen-pillowcase-pair',
    description: 'French flax linen pillowcases that regulate temperature and wick moisture for the perfect sleep temperature. The natural texture softens beautifully over time. Envelope closure keeps pillows secure. Pre-washed for immediate comfort. Stone-washed for a lived-in softness.',
    shortDesc: 'French flax linen, stone-washed, envelope closure',
    categoryId: 'cat-3', brand: 'ARA BEDDINGS', material: 'French Linen', basePrice: 59.99,
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
      { id: 'var-31', productId: 'prod-8', sku: 'ARA-LPC-STD-NAT', price: 59.99, stock: 60, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Standard' }, { optionId: 'opt-2', optionName: 'Color', value: 'Natural' }] },
      { id: 'var-32', productId: 'prod-8', sku: 'ARA-LPC-QN-IV', price: 64.99, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Ivory' }] },
      { id: 'var-33', productId: 'prod-8', sku: 'ARA-LPC-QN-SG', price: 64.99, stock: 25, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'Sage' }] },
      { id: 'var-34', productId: 'prod-8', sku: 'ARA-LPC-KG-CHA', price: 69.99, stock: 30, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'Charcoal' }] },
    ],
    reviews: [],
  },
  {
    id: 'prod-9', name: 'ARA Hotel Collection Pillowcase Set', slug: 'ara-hotel-collection-pillowcase-set',
    description: 'Bring five-star hotel luxury home with our ARA Hotel Collection pillowcases. 500-thread-count sateen weave with a silky, lustrous finish. Envelope closure. Set of 4 pillowcases. Used in luxury hotels worldwide.',
    shortDesc: '500TC sateen, set of 4, hotel quality',
    categoryId: 'cat-3', brand: 'ARA BEDDINGS', material: 'Cotton Sateen', basePrice: 49.99,
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
      { id: 'var-35', productId: 'prod-9', sku: 'ARA-HPC-STD-WH', price: 49.99, stock: 80, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Standard' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-36', productId: 'prod-9', sku: 'ARA-HPC-QN-WH', price: 54.99, stock: 60, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'Queen' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
      { id: 'var-37', productId: 'prod-9', sku: 'ARA-HPC-KG-WH', price: 59.99, stock: 40, isActive: true, optionValues: [{ optionId: 'opt-1', optionName: 'Size', value: 'King' }, { optionId: 'opt-2', optionName: 'Color', value: 'White' }] },
    ],
    reviews: [],
  },
];

export const currentUser: User = {
  id: 'u-1', name: 'Demo Customer', email: 'demo@arabeddings.com', phone: '+1 (555) 123-4567', role: 'CUSTOMER', createdAt: '2024-01-01T00:00:00Z',
};

export const adminUser: User = {
  id: 'admin-1', name: 'Admin', email: 'admin@arabeddings.com', phone: '+1 (555) 000-0000', role: 'ADMIN', createdAt: '2024-01-01T00:00:00Z',
};

export const shippingZones: ShippingZone[] = [
  {
    id: 'zone-1', name: 'Domestic (US)', countries: ['US'], isActive: true,
    methods: [
      { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Shipping', rate: 9.99, freeOverAmount: 150, minDays: 5, maxDays: 7, isActive: true },
      { id: 'sm-2', zoneId: 'zone-1', name: 'Express Shipping', rate: 19.99, freeOverAmount: 300, minDays: 2, maxDays: 3, isActive: true },
    ],
  },
  {
    id: 'zone-2', name: 'Canada', countries: ['CA'], isActive: true,
    methods: [
      { id: 'sm-3', zoneId: 'zone-2', name: 'Standard International', rate: 24.99, freeOverAmount: 250, minDays: 7, maxDays: 14, isActive: true },
    ],
  },
];

export const siteSettings: SiteSettings = {
  bankTransferDetails: 'Bank: First National Bank\nAccount Name: ARA BEDDINGS LLC\nAccount Number: 1234567890\nRouting Number: 021000021\nSWIFT: FNBKUS33\n\nPlease include your order number in the transfer reference.',
  freeShippingThreshold: 150,
  storeName: 'ARA BEDDINGS',
  storeEmail: 'hello@arabeddings.com',
  storePhone: '+1 (555) 987-6543',
};

export const sampleOrders: Order[] = [
  {
    id: 'ord-1', orderNumber: 'ARA-2024-001', userId: 'u-1', status: 'DELIVERED',
    subtotal: 189.99, shippingFee: 0, taxAmount: 15.20, discountAmount: 0, total: 205.19, currency: 'USD',
    items: [
      { id: 'oi-1', productId: 'prod-1', variantId: 'var-5', productName: 'ARA Signature Egyptian Cotton Sheet Set', variantName: 'Queen / White', sku: 'ARA-ECS-QN-WH', unitPrice: 189.99, quantity: 1, total: 189.99 },
    ],
    payment: { id: 'pay-1', orderId: 'ord-1', method: 'COD', status: 'VERIFIED', amount: 205.19 },
    shippingAddress: { id: 'addr-1', userId: 'u-1', fullName: 'Demo Customer', phone: '+1 (555) 123-4567', line1: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US', isDefault: true },
    shippingMethod: { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Shipping', rate: 9.99, freeOverAmount: 150, isActive: true },
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
    subtotal: 329.99, shippingFee: 0, taxAmount: 26.40, discountAmount: 0, total: 356.39, currency: 'USD',
    items: [
      { id: 'oi-2', productId: 'prod-5', variantId: 'var-22', productName: 'ARA Cloud All-Season Down Comforter', variantName: 'Full/Queen / White', sku: 'ARA-ADC-FQ-WH', unitPrice: 329.99, quantity: 1, total: 329.99 },
    ],
    payment: { id: 'pay-2', orderId: 'ord-2', method: 'BANK_TRANSFER', status: 'VERIFIED', amount: 356.39, reference: 'BT-2024-789', verifiedAt: '2024-12-02T10:00:00Z' },
    shippingAddress: { id: 'addr-1', userId: 'u-1', fullName: 'Demo Customer', phone: '+1 (555) 123-4567', line1: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'US', isDefault: true },
    shippingMethod: { id: 'sm-1', zoneId: 'zone-1', name: 'Standard Shipping', rate: 9.99, freeOverAmount: 150, isActive: true },
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
    id: 'do-1', reference: 'DR-2024-001', userId: 'u-1', fullName: 'Demo Customer', email: 'demo@arabeddings.com', phone: '+1 (555) 123-4567',
    itemType: 'Custom Sheets', size: 'Olympic Queen', quantity: 50, fabric: 'Egyptian Cotton 800TC', color: 'White',
    deliveryAddress: '456 Hotel Blvd, Suite 200, Miami, FL 33101', notes: 'Need custom size for Olympic Queen beds. Hotel chain order.',
    status: 'QUOTED', quotedPrice: 4500.00, createdAt: '2024-12-10T10:00:00Z',
  },
];
