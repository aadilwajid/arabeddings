import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await req.prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } }
            },
            variant: {
              include: {
                optionValues: {
                  include: {
                    optionValue: {
                      include: { option: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await req.prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: true }
      });
    }

    // Transform cart items
    const transformedItems = cart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        ...item.product,
        basePrice: parseFloat(item.product.basePrice),
        images: item.product.images
      },
      variant: {
        ...item.variant,
        price: parseFloat(item.variant.price),
        comparePrice: item.variant.comparePrice ? parseFloat(item.variant.comparePrice) : null,
        optionValues: item.variant.optionValues.map(ov => ({
          optionId: ov.optionValue.optionId,
          optionName: ov.optionValue.option.name,
          value: ov.optionValue.value
        }))
      }
    }));

    res.json({ ...cart, items: transformedItems });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    // Check stock
    const variant = await req.prisma.productVariant.findUnique({
      where: { id: variantId }
    });

    if (!variant || !variant.isActive) {
      return res.status(400).json({ error: 'Variant not available' });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await req.prisma.cart.findUnique({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await req.prisma.cart.create({
        data: { userId: req.user.id }
      });
    }

    // Check if item already in cart
    const existingItem = await req.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const updatedItem = await req.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
      res.json(updatedItem);
    } else {
      // Add new item
      const newItem = await req.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity
        }
      });
      res.status(201).json(newItem);
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Update cart item quantity
router.put('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const item = await req.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true }
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      // Remove item
      await req.prisma.cartItem.delete({ where: { id: itemId } });
      return res.json({ message: 'Item removed' });
    }

    // Check stock
    if (item.variant.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const updatedItem = await req.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    res.json(updatedItem);
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove from cart
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    await req.prisma.cartItem.delete({
      where: { id: req.params.itemId }
    });
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await req.prisma.cartItem.deleteMany({
      where: { cart: { userId: req.user.id } }
    });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
