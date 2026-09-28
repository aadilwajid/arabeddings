import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      pendingPayments
    ] = await Promise.all([
      req.prisma.order.count(),
      req.prisma.order.count({ where: { status: 'PENDING' } }),
      req.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
      }),
      req.prisma.product.count(),
      req.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      req.prisma.payment.count({ where: { status: 'AWAITING_VERIFICATION' } })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.total ? parseFloat(totalRevenue._sum.total) : 0,
      totalProducts,
      totalCustomers,
      pendingPayments
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await req.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        payment: true,
        address: true
      }
    });

    res.json(orders.map(order => ({
      ...order,
      subtotal: parseFloat(order.subtotal),
      shippingFee: parseFloat(order.shippingFee),
      total: parseFloat(order.total),
      payment: order.payment ? {
        ...order.payment,
        amount: parseFloat(order.payment.amount)
      } : null
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await req.prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note,
            changedBy: req.user.id
          }
        }
      }
    });

    // If payment is bank transfer and status is CONFIRMED, verify payment
    if (status === 'CONFIRMED') {
      const payment = await req.prisma.payment.findUnique({
        where: { orderId: order.id }
      });

      if (payment && payment.method === 'BANK_TRANSFER' && payment.status === 'AWAITING_VERIFICATION') {
        await req.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
            verifiedById: req.user.id
          }
        });
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Verify payment
router.put('/payments/:orderId/verify', async (req, res) => {
  try {
    const payment = await req.prisma.payment.update({
      where: { orderId: req.params.orderId },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
        verifiedById: req.user.id
      }
    });

    // Update order status to CONFIRMED
    await req.prisma.order.update({
      where: { id: req.params.orderId },
      data: {
        status: 'CONFIRMED',
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: 'Payment verified',
            changedBy: req.user.id
          }
        }
      }
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const products = await req.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: { include: { option: true } }
              }
            }
          }
        }
      }
    });

    res.json(products.map(p => ({
      ...p,
      basePrice: parseFloat(p.basePrice),
      variants: p.variants.map(v => ({
        ...v,
        price: parseFloat(v.price),
        comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null
      }))
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const product = await req.prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await req.prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await req.prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all drug orders (admin)
router.get('/drug-orders', async (req, res) => {
  try {
    const drugOrders = await req.prisma.drugOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(drugOrders.map(order => ({
      ...order,
      quotedPrice: order.quotedPrice ? parseFloat(order.quotedPrice) : null
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drug orders' });
  }
});

// Update drug order
router.put('/drug-orders/:id', async (req, res) => {
  try {
    const drugOrder = await req.prisma.drugOrder.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(drugOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update drug order' });
  }
});

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await req.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: {
          select: { total: true, status: true }
        }
      }
    });

    res.json(customers.map(c => ({
      ...c,
      totalSpent: c.orders.reduce((sum, o) => sum + parseFloat(o.total), 0),
      orderCount: c.orders.length
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

export default router;
