import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      size, 
      color, 
      inStock,
      sortBy = 'featured',
      page = 1,
      limit = 20
    } = req.query;

    const where = { isActive: true };

    // Category filter
    if (category) {
      where.category = { slug: category };
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    // Size filter
    if (size) {
      where.variants = {
        some: {
          optionValues: {
            some: {
              optionValue: {
                value: size,
                option: { name: 'Size' }
              }
            }
          }
        }
      };
    }

    // Color filter
    if (color) {
      where.variants = {
        some: {
          optionValues: {
            some: {
              optionValue: {
                value: color,
                option: { name: 'Color' }
              }
            }
          }
        }
      };
    }

    // In stock filter
    if (inStock === 'true') {
      where.variants = {
        some: {
          stock: { gt: 0 },
          isActive: true
        }
      };
    }

    // Sort
    let orderBy = {};
    switch (sortBy) {
      case 'price-low':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price-high':
        orderBy = { basePrice: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = { isFeatured: 'desc' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      req.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: {
            where: { isActive: true },
            include: {
              optionValues: {
                include: {
                  optionValue: {
                    include: { option: true }
                  }
                }
              }
            }
          },
          reviews: {
            where: { isApproved: true }
          }
        }
      }),
      req.prisma.product.count({ where })
    ]);

    // Transform products to match frontend format
    const transformedProducts = products.map(product => ({
      ...product,
      basePrice: parseFloat(product.basePrice),
      images: product.images.map(img => ({
        ...img,
        url: img.url
      })),
      variants: product.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
        optionValues: variant.optionValues.map(ov => ({
          optionId: ov.optionValue.optionId,
          optionName: ov.optionValue.option.name,
          value: ov.optionValue.value
        }))
      })),
      reviews: product.reviews.map(review => ({
        ...review,
        rating: review.rating
      }))
    }));

    res.json({
      products: transformedProducts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await req.prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          include: {
            optionValues: {
              include: {
                optionValue: {
                  include: { option: true }
                }
              }
            }
          }
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform to match frontend format
    const transformedProduct = {
      ...product,
      basePrice: parseFloat(product.basePrice),
      variants: product.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
        optionValues: variant.optionValues.map(ov => ({
          optionId: ov.optionValue.optionId,
          optionName: ov.optionValue.option.name,
          value: ov.optionValue.value
        }))
      })),
      reviews: product.reviews.map(review => ({
        ...review,
        userName: review.user.name,
        rating: review.rating
      }))
    };

    // Extract options from variants
    const optionsMap = new Map();
    product.variants.forEach(variant => {
      variant.optionValues.forEach(ov => {
        if (!optionsMap.has(ov.optionValue.optionId)) {
          optionsMap.set(ov.optionValue.optionId, {
            id: ov.optionValue.optionId,
            name: ov.optionValue.option.name,
            values: []
          });
        }
        const option = optionsMap.get(ov.optionValue.optionId);
        if (!option.values.find(v => v.value === ov.optionValue.value)) {
          option.values.push({
            id: ov.optionValue.id,
            optionId: ov.optionValue.optionId,
            value: ov.optionValue.value,
            sortOrder: ov.optionValue.sortOrder
          });
        }
      });
    });

    transformedProduct.options = Array.from(optionsMap.values());

    res.json(transformedProduct);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await req.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: {
          where: { isActive: true },
          include: {
            optionValues: {
              include: {
                optionValue: {
                  include: { option: true }
                }
              }
            }
          }
        },
        reviews: { where: { isApproved: true } }
      }
    });

    const transformedProducts = products.map(product => ({
      ...product,
      basePrice: parseFloat(product.basePrice),
      variants: product.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
        optionValues: variant.optionValues.map(ov => ({
          optionId: ov.optionValue.optionId,
          optionName: ov.optionValue.option.name,
          value: ov.optionValue.value
        }))
      }))
    }));

    res.json(transformedProducts);
  } catch (err) {
    console.error('Get featured products error:', err);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

export default router;
