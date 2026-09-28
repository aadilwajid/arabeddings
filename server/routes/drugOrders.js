import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create drug order (custom order request)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { 
      fullName, email, phone, itemType, size, quantity, 
      fabric, color, deliveryAddress, notes 
    } = req.body;

    const reference = `ARA-CUSTOM-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

    const drugOrder = await req.prisma.drugOrder.create({
      data: {
        reference,
        userId: req.user?.id || null,
        fullName,
        email,
        phone,
        itemType,
        size,
        quantity,
        fabric,
        color,
        deliveryAddress,
        notes,
        status: 'SUBMITTED'
      }
    });

    res.status(201).json(drugOrder);
  } catch (err) {
    console.error('Create drug order error:', err);
    res.status(500).json({ error: 'Failed to create custom order' });
  }
});

// Get drug order by reference
router.get('/:reference', async (req, res) => {
  try {
    const drugOrder = await req.prisma.drugOrder.findUnique({
      where: { reference: req.params.reference }
    });

    if (!drugOrder) {
      return res.status(404).json({ error: 'Custom order not found' });
    }

    res.json({
      ...drugOrder,
      quotedPrice: drugOrder.quotedPrice ? parseFloat(drugOrder.quotedPrice) : null
    });
  } catch (err) {
    console.error('Get drug order error:', err);
    res.status(500).json({ error: 'Failed to fetch custom order' });
  }
});

// Get user's drug orders
router.get('/user/orders', authenticateToken, async (req, res) => {
  try {
    const drugOrders = await req.prisma.drugOrder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(drugOrders.map(order => ({
      ...order,
      quotedPrice: order.quotedPrice ? parseFloat(order.quotedPrice) : null
    })));
  } catch (err) {
    console.error('Get user drug orders error:', err);
    res.status(500).json({ error: 'Failed to fetch custom orders' });
  }
});

export default router;
