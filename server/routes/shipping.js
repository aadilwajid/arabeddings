import express from 'express';

const router = express.Router();

// Get all shipping zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await req.prisma.shippingZone.findMany({
      where: { isActive: true },
      include: {
        methods: {
          where: { isActive: true },
          orderBy: { rate: 'asc' }
        }
      }
    });

    res.json(zones.map(zone => ({
      ...zone,
      methods: zone.methods.map(method => ({
        ...method,
        rate: parseFloat(method.rate),
        freeOverAmount: method.freeOverAmount ? parseFloat(method.freeOverAmount) : null
      }))
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipping zones' });
  }
});

// Calculate shipping
router.post('/calculate', async (req, res) => {
  try {
    const { province, subtotal } = req.body;

    // Find zone by province
    const zone = await req.prisma.shippingZone.findFirst({
      where: {
        isActive: true,
        provinces: { has: province }
      },
      include: {
        methods: {
          where: { isActive: true },
          orderBy: { rate: 'asc' }
        }
      }
    });

    if (!zone) {
      return res.status(404).json({ error: 'No shipping available for this region' });
    }

    const methods = zone.methods.map(method => ({
      ...method,
      rate: parseFloat(method.rate),
      freeOverAmount: method.freeOverAmount ? parseFloat(method.freeOverAmount) : null,
      isFree: subtotal >= parseFloat(method.freeOverAmount || 999999)
    }));

    res.json({ zone, methods });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate shipping' });
  }
});

export default router;
