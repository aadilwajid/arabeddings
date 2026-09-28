import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await req.prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            images: { take: 1 },
            variants: {
              where: { isActive: true },
              select: { price: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(wishlist);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Toggle wishlist item
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;

    const existing = await req.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    if (existing) {
      await req.prisma.wishlistItem.delete({ where: { id: existing.id } });
      res.json({ action: 'removed' });
    } else {
      const item = await req.prisma.wishlistItem.create({
        data: {
          userId: req.user.id,
          productId
        }
      });
      res.status(201).json({ action: 'added', item });
    }
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    await req.prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user.id,
        productId: req.params.productId
      }
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
