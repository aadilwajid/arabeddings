// Email Notification Service
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configure transporter (using SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email Templates
export const EmailTemplates = {
  orderConfirmation: (order: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C4A265;">Order Confirmed!</h1>
      <p>Thank you for your order, ${order.customer.name}!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> Rs ${order.total.toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
      <p>We'll notify you when your order ships.</p>
      <p style="color: #666; font-size: 12px;">ARA Beddings - Luxury Home Linen</p>
    </div>
  `,

  orderShipped: (order: any, trackingNumber?: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C4A265;">Your Order Has Shipped!</h1>
      <p>Great news! Your order ${order.orderNumber} is on its way.</p>
      ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Summary</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> Rs ${order.total.toLocaleString()}</p>
        <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
      </div>
      <p>Track your order anytime in your account.</p>
      <p style="color: #666; font-size: 12px;">ARA Beddings - Luxury Home Linen</p>
    </div>
  `,

  orderDelivered: (order: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C4A265;">Order Delivered!</h1>
      <p>Your order ${order.orderNumber} has been delivered.</p>
      <p>We hope you love your new bedding!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>How was your experience?</h3>
        <p>We'd love to hear your feedback. Leave a review and help others discover great bedding.</p>
        <a href="${process.env.NEXT_PUBLIC_URL}/review/${order.id}" style="background: #C4A265; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Leave a Review</a>
      </div>
      <p style="color: #666; font-size: 12px;">ARA Beddings - Luxury Home Linen</p>
    </div>
  `,

  passwordReset: (email: string, token: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C4A265;">Password Reset Request</h1>
      <p>You requested a password reset for your ARA Beddings account.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>Click the button below to reset your password:</p>
        <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}" style="background: #C4A265; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 1 hour.</p>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="color: #666; font-size: 12px;">ARA Beddings - Luxury Home Linen</p>
    </div>
  `,

  lowStockAlert: (product: any, variant: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ff6b6b;">Low Stock Alert</h1>
      <p>The following product is running low on stock:</p>
      <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
        <h3>${product.name}</h3>
        <p><strong>Variant:</strong> ${variant.size} - ${variant.type}</p>
        <p><strong>Current Stock:</strong> ${variant.stock} units</p>
        <p><strong>SKU:</strong> ${variant.sku}</p>
      </div>
      <p>Please restock this item soon to avoid running out.</p>
      <p style="color: #666; font-size: 12px;">ARA Beddings Admin Notification</p>
    </div>
  `,

  backInStock: (product: any, email: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C4A265;">Good News! ${product.name} is Back in Stock</h1>
      <p>The item you were waiting for is now available!</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <img src="${product.mainImage}" alt="${product.name}" style="width: 100%; max-width: 300px; border-radius: 8px;" />
        <h3>${product.name}</h3>
        <p>Starting from Rs ${product.priceFrom.toLocaleString()}</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_URL}/product/${product.slug}" style="background: #C4A265; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Shop Now</a>
      <p style="color: #666; font-size: 12px;">ARA Beddings - Luxury Home Linen</p>
    </div>
  `,

  newsletter: (content: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #C4A265; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1>ARA Beddings</h1>
        <p>Luxury Home Linen</p>
      </div>
      <div style="padding: 30px; background: white;">
        ${content}
      </div>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="color: #666; font-size: 12px;">
          You're receiving this because you subscribed to our newsletter.<br>
          <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    </div>
  `,
};

// Send Email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"ARA Beddings" <${process.env.SMTP_FROM || 'noreply@arabeddings.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    // Log email sent
    console.log(`Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Send Order Confirmation
export async function sendOrderConfirmation(order: any): Promise<boolean> {
  return sendEmail({
    to: order.customer.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: EmailTemplates.orderConfirmation(order),
  });
}

// Send Order Shipped
export async function sendOrderShipped(order: any, trackingNumber?: string): Promise<boolean> {
  return sendEmail({
    to: order.customer.email,
    subject: `Your Order ${order.orderNumber} Has Shipped`,
    html: EmailTemplates.orderShipped(order, trackingNumber),
  });
}

// Send Order Delivered
export async function sendOrderDelivered(order: any): Promise<boolean> {
  return sendEmail({
    to: order.customer.email,
    subject: `Your Order ${order.orderNumber} Has Been Delivered`,
    html: EmailTemplates.orderDelivered(order),
  });
}

// Send Password Reset
export async function sendPasswordReset(email: string, token: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Password Reset Request - ARA Beddings',
    html: EmailTemplates.passwordReset(email, token),
  });
}

// Send Low Stock Alert
export async function sendLowStockAlert(product: any, variant: any): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@arabeddings.com';
  return sendEmail({
    to: adminEmail,
    subject: `Low Stock Alert: ${product.name}`,
    html: EmailTemplates.lowStockAlert(product, variant),
  });
}

// Send Back in Stock
export async function sendBackInStock(product: any, subscribers: string[]): Promise<void> {
  for (const email of subscribers) {
    await sendEmail({
      to: email,
      subject: `${product.name} is Back in Stock!`,
      html: EmailTemplates.backInStock(product, email),
    });
  }
}

// Send Newsletter
export async function sendNewsletter(subscribers: string[], content: string): Promise<void> {
  for (const email of subscribers) {
    await sendEmail({
      to: email,
      subject: 'Latest from ARA Beddings',
      html: EmailTemplates.newsletter(content),
    });
  }
}
