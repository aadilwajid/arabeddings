import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `ARA-${year}-${random}`;
};

// Create order (checkout)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      bankReference,
      shippingMethodId,
      notes 
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = await req.prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant || !variant.isActive) {
        return res.status(400).json({ error: `Product ${item.productId} is not available` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${variant.product.name}` });
      }

      const itemTotal = parseFloat(variant.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        productName: variant.product.name,
        variantName: item.variantName || '',
        sku: variant.sku,
        unitPrice: parseFloat(variant.price),
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Get shipping method
    const shippingMethod = await req.prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId }
    });

    const shippingFee = subtotal >= parseFloat(shippingMethod?.freeOverAmount || 5000) 
      ? 0 
      : parseFloat(shippingMethod?.rate || 250);

    const total = subtotal + shippingFee;

    // Create address
    const address = await req.prisma.address.create({
      data: {
        userId: req.user.id,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: 'PK',
        isDefault: false
      }
    });

    // Create order in transaction
    const order = await req.prisma.$transaction(async (prisma) => {
      // Create order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user.id,
          addressId: address.id,
          status: 'PENDING',
          subtotal,
          shippingFee,
          taxAmount: 0,
          discountAmount: 0,
          total,
          currency: 'PKR',
          notes,
          shippingMethodId,
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order placed'
            }
          }
        }
      });

      // Create order items
      await prisma.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: newOrder.id,
          ...item
        }))
      });

      // Create payment
      await prisma.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          status: paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_VERIFICATION' : 'PENDING',
          amount: total,
          reference: bankReference
        }
      });

      // Decrement stock
      for (const item of items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: req.user.id } }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await req.prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
        address: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Transform orders
    const transformedOrders = orders.map(order => ({
      ...order,
      subtotal: parseFloat(order.subtotal),
      shippingFee: parseFloat(order.shippingFee),
      taxAmount: parseFloat(order.taxAmount),
      discountAmount: parseFloat(order.discountAmount),
      total: parseFloat(order.total),
      payment: order.payment ? {
        ...order.payment,
        amount: parseFloat(order.payment.amount)
      } : null
    }));

    res.json(transformedOrders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await req.prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        },
        payment: true,
        address: true,
        shippingMethod: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Transform
    const transformedOrder = {
      ...order,
      subtotal: parseFloat(order.subtotal),
      shippingFee: parseFloat(order.shippingFee),
      taxAmount: parseFloat(order.taxAmount),
      discountAmount: parseFloat(order.discountAmount),
      total: parseFloat(order.total),
      items: order.items.map(item => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.total)
      })),
      payment: order.payment ? {
        ...order.payment,
        amount: parseFloat(order.payment.amount)
      } : null
    };

    res.json(transformedOrder);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
