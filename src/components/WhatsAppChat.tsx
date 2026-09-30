import React, { useState } from 'react';
import { Button, Offcanvas, Form, Badge } from 'react-bootstrap';
import { useStore } from '../store';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function WhatsAppChat() {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Assalam o Alaikum! Welcome to ARA BEDDINGS. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useStore();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMsg]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
      return 'You can track your order by visiting the Track Order page. Do you have your order number ready?';
    }
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
      return 'We offer free shipping on orders above Rs. 5,000. Standard delivery takes 3-5 business days across Pakistan.';
    }
    if (lowerMsg.includes('return') || lowerMsg.includes('exchange')) {
      return 'We have a 30-day return policy for unused items in original packaging. Would you like to initiate a return?';
    }
    if (lowerMsg.includes('size') || lowerMsg.includes('measurement')) {
      return 'Please check our Size Guide on each product page for detailed measurements. Need help with a specific product?';
    }
    if (lowerMsg.includes('payment') || lowerMsg.includes('cod')) {
      return 'We accept Cash on Delivery (COD) and Bank Transfer. COD is available across all major cities in Pakistan.';
    }
    if (lowerMsg.includes('custom') || lowerMsg.includes('bulk')) {
      return 'We specialize in custom orders for hotels and bulk purchases. Please visit our Custom Order page or call us at +92 321 1234567.';
    }
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('salam')) {
      return 'Hello! How can I assist you today? Feel free to ask about our products, orders, or shipping.';
    }
    
    return 'Thank you for your message! Our team will get back to you shortly. For immediate assistance, please call us at +92 321 1234567 or email hello@arabeddings.com.';
  };

  const openWhatsApp = () => {
    const phoneNumber = '923211234567'; // Pakistan format
    const message = encodeURIComponent('Hello! I need help with my order.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        <Button
          variant="success"
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: '60px', height: '60px' }}
          onClick={handleShow}
        >
          <i className="bi bi-whatsapp" style={{ fontSize: '2rem' }}></i>
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-0 translate-middle"
            style={{ fontSize: '0.7rem' }}
          >
            1
          </Badge>
        </Button>
      </div>

      {/* Chat Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
        <Offcanvas.Header closeButton className="bg-success text-white">
          <Offcanvas.Title className="d-flex align-items-center">
            <i className="bi bi-whatsapp me-2" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <div className="fw-bold">ARA BEDDINGS Support</div>
              <div className="small opacity-75">
                <span className="badge bg-light text-success me-1">●</span>
                Online
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column">
          {/* Messages */}
          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{
              backgroundColor: '#e5ddd5',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`rounded-3 px-3 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-success text-white'
                      : 'bg-white text-dark'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  <div className="small">{msg.text}</div>
                  <div
                    className={`text-end mt-1 ${
                      msg.sender === 'user' ? 'text-white-50' : 'text-muted'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-top p-2 bg-light">
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-success" size="sm" onClick={() => setNewMessage('Track my order')}>
                Track Order
              </Button>
              <Button variant="outline-success" size="sm" onClick={() => setNewMessage('Shipping info')}>
                Shipping
              </Button>
              <Button variant="outline-success" size="sm" onClick={() => setNewMessage('Return policy')}>
                Returns
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="border-top p-3 bg-white">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="success" onClick={handleSendMessage}>
                <i className="bi bi-send"></i>
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button
                variant="link"
                size="sm"
                className="text-success p-0"
                onClick={openWhatsApp}
              >
                <i className="bi bi-whatsapp me-1"></i>
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
