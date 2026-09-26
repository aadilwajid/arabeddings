// SMS Notification Service for Pakistan
// Using multiple SMS providers for reliability

interface SMSOptions {
  to: string; // Phone number in format: 03XXXXXXXXX
  message: string;
}

// SMS Templates
export const SMSTemplates = {
  orderConfirmation: (orderNumber: string, total: number) => 
    `ARA Beddings: Your order ${orderNumber} has been confirmed! Total: Rs ${total.toLocaleString()}. Track at arabeddings.com/track`,

  orderShipped: (orderNumber: string, tracking?: string) => 
    `ARA Beddings: Your order ${orderNumber} has shipped!${tracking ? ` Tracking: ${tracking}` : ''}. Expected delivery: 3-5 days.`,

  orderDelivered: (orderNumber: string) => 
    `ARA Beddings: Your order ${orderNumber} has been delivered. Thank you for shopping with us! Rate your experience at arabeddings.com`,

  orderCancelled: (orderNumber: string) => 
    `ARA Beddings: Your order ${orderNumber} has been cancelled. Refund will be processed within 5-7 business days.`,

  lowStockAlert: (productName: string, stock: number) => 
    `Low Stock Alert: ${productName} has only ${stock} units left. Restock soon!`,

  passwordReset: (code: string) => 
    `ARA Beddings: Your password reset code is ${code}. Valid for 10 minutes. Do not share this code.`,

  otpVerification: (code: string) => 
    `ARA Beddings: Your verification code is ${code}. Valid for 5 minutes. Do not share this code.`,

  deliveryUpdate: (orderNumber: string, status: string) => 
    `ARA Beddings: Order ${orderNumber} status update: ${status}. Track at arabeddings.com/track`,

  promotional: (message: string, link: string) => 
    `ARA Beddings: ${message} Shop now: ${link}`,
};

// Send SMS via multiple providers
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  const { to, message } = options;

  // Validate phone number (Pakistan format)
  if (!/^03\d{9}$/.test(to)) {
    console.error('Invalid phone number format. Expected: 03XXXXXXXXX');
    return false;
  }

  // Truncate message if too long (SMS limit is 160 characters)
  const truncatedMessage = message.length > 160 ? message.substring(0, 157) + '...' : message;

  try {
    // Try primary provider (Twilio)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const success = await sendViaTwilio(to, truncatedMessage);
      if (success) return true;
    }

    // Try secondary provider (Nexmo/Vonage)
    if (process.env.NEXMO_API_KEY && process.env.NEXMO_API_SECRET) {
      const success = await sendViaNexmo(to, truncatedMessage);
      if (success) return true;
    }

    // Try local provider (Jazz/4818)
    if (process.env.JAZZ_SMS_API_KEY) {
      const success = await sendViaJazz(to, truncatedMessage);
      if (success) return true;
    }

    // Fallback: Log SMS (for development)
    console.log(`[SMS Fallback] To: ${to}, Message: ${truncatedMessage}`);
    return true;

  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

// Twilio Provider
async function sendViaTwilio(to: string, message: string): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `+92${to.substring(1)}`, // Convert 03XXXXXXXXX to +923XXXXXXXXX
        From: fromNumber!,
        Body: message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Twilio SMS failed:', error);
    return false;
  }
}

// Nexmo/Vonage Provider
async function sendViaNexmo(to: string, message: string): Promise<boolean> {
  try {
    const apiKey = process.env.NEXMO_API_KEY;
    const apiSecret = process.env.NEXMO_API_SECRET;
    const fromNumber = process.env.NEXMO_FROM_NUMBER;

    const response = await fetch('https://rest.nexmo.com/sms/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        api_secret: apiSecret,
        to: `92${to.substring(1)}`,
        from: fromNumber,
        text: message,
      }),
    });

    const data = await response.json();
    return data.messages?.[0]?.status === '0';
  } catch (error) {
    console.error('Nexmo SMS failed:', error);
    return false;
  }
}

// Jazz SMS Provider (Local Pakistan)
async function sendViaJazz(to: string, message: string): Promise<boolean> {
  try {
    const apiKey = process.env.JAZZ_SMS_API_KEY;
    const mask = process.env.JAZZ_SMS_MASK || 'ARA Beddings';

    const response = await fetch('https://api.jazz.com.pk/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: to,
        message: message,
        mask: mask,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Jazz SMS failed:', error);
    return false;
  }
}

// Send Order Confirmation SMS
export async function sendOrderConfirmationSMS(order: any): Promise<boolean> {
  return sendSMS({
    to: order.customer.phone,
    message: SMSTemplates.orderConfirmation(order.orderNumber, order.total),
  });
}

// Send Order Shipped SMS
export async function sendOrderShippedSMS(order: any, trackingNumber?: string): Promise<boolean> {
  return sendSMS({
    to: order.customer.phone,
    message: SMSTemplates.orderShipped(order.orderNumber, trackingNumber),
  });
}

// Send Order Delivered SMS
export async function sendOrderDeliveredSMS(order: any): Promise<boolean> {
  return sendSMS({
    to: order.customer.phone,
    message: SMSTemplates.orderDelivered(order.orderNumber),
  });
}

// Send Order Cancelled SMS
export async function sendOrderCancelledSMS(order: any): Promise<boolean> {
  return sendSMS({
    to: order.customer.phone,
    message: SMSTemplates.orderCancelled(order.orderNumber),
  });
}

// Send Low Stock Alert SMS
export async function sendLowStockAlertSMS(product: any, variant: any): Promise<boolean> {
  const adminPhone = process.env.ADMIN_PHONE || '03160143039';
  return sendSMS({
    to: adminPhone,
    message: SMSTemplates.lowStockAlert(product.name, variant.stock),
  });
}

// Send OTP
export async function sendOTP(phone: string, code: string): Promise<boolean> {
  return sendSMS({
    to: phone,
    message: SMSTemplates.otpVerification(code),
  });
}

// Send Password Reset Code
export async function sendPasswordResetSMS(phone: string, code: string): Promise<boolean> {
  return sendSMS({
    to: phone,
    message: SMSTemplates.passwordReset(code),
  });
}

// Send Delivery Update SMS
export async function sendDeliveryUpdateSMS(order: any, status: string): Promise<boolean> {
  return sendSMS({
    to: order.customer.phone,
    message: SMSTemplates.deliveryUpdate(order.orderNumber, status),
  });
}

// Send Promotional SMS
export async function sendPromotionalSMS(phone: string, message: string, link: string): Promise<boolean> {
  return sendSMS({
    to: phone,
    message: SMSTemplates.promotional(message, link),
  });
}

// Bulk SMS
export async function sendBulkSMS(phones: string[], message: string): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const phone of phones) {
    const result = await sendSMS({ to: phone, message });
    if (result) {
      success++;
    } else {
      failed++;
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { success, failed };
}
