import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get addresses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const addresses = await req.prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' }
    });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Create address
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { fullName, phone, line1, line2, city, state, postalCode, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await req.prisma.address.updateMany({
        where: { userId: req.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await req.prisma.address.create({
      data: {
        userId: req.user.id,
        fullName, phone, line1, line2, city, state, postalCode,
        country: 'PK',
        isDefault: isDefault || false
      }
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Update address
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await req.prisma.address.update({
      where: { id: req.params.id, userId: req.user.id },
      data: req.body
    });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete address
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await req.prisma.address.delete({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
