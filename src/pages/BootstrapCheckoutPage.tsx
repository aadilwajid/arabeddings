import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatPKR, pakistanProvinces, getCitiesByProvince } from '../data/pakistan';
import { Order } from '../types';

export default function BootstrapCheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder, user, settings } = useStore();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [bankReference, setBankReference] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('PUNJAB');
  const [availableCities, setAvailableCities] = useState(getCitiesByProvince('PUNJAB'));
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: 'Punjab',
    postalCode: '',
    country: 'PK'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartTotal();
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : 250;
  const total = subtotal + shipping;

  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    const province = pakistanProvinces.find(p => p.code === provinceCode);
    setAvailableCities(getCitiesByProvince(provinceCode));
    setAddress({ ...address, state: province?.name || '', city: '' });
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = 'Name is required';
    if (!address.phone.trim()) errs.phone = 'Phone is required';
    if (!address.line1.trim()) errs.line1 = 'Address is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state.trim()) errs.state = 'Province is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'BANK_TRANSFER' && !bankReference.trim()) {
      setErrors({ bankReference: 'Payment reference is required for bank transfer' });
      return;
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ARA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

    const order = {
      id: orderId,
      orderNumber,
      userId: user?.id,
      status: 'PENDING',
      subtotal,
      shippingFee: shipping,
      taxAmount: 0,
      discountAmount: 0,
      total,
      currency: 'PKR',
      notes: orderNotes,
      items: cart.map(item => ({
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product?.name || 'Product',
        variantName: item.variant?.optionValues.map((ov: any) => ov.value).join(' / ') || '',
        sku: item.variant?.sku || '',
        unitPrice: item.variant?.price || 0,
        quantity: item.quantity,
        total: (item.variant?.price || 0) * item.quantity,
      })),
      payment: {
        id: `pay-${Date.now()}`,
        orderId,
        method: paymentMethod,
        status: paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_VERIFICATION' : 'PENDING',
        amount: total,
        reference: paymentMethod === 'BANK_TRANSFER' ? bankReference : undefined,
      },
      shippingAddress: {
        id: `addr-${Date.now()}`,
        userId: user?.id || '',
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: 'PK',
        isDefault: true,
      },
      shippingMethod: {
        id: 'sm-1',
        zoneId: 'zone-1',
        name: 'Standard Delivery',
        rate: 250,
        isActive: true
      },
      statusHistory: [{
        id: `sh-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
    };

    addOrder(order as Order);
    clearCart();
    navigate(`/checkout/confirmation/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="mb-3">Your cart is empty</h2>
        <Button as="a" href="/products" variant="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Checkout</h2>

      {/* Progress Steps */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="text-center">
                <div 
                  className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                    step >= s ? 'bg-primary text-white' : 'bg-light text-muted'
                  }`}
                  style={{width: '40px', height: '40px'}}
                >
                  {step > s ? <i className="bi bi-check"></i> : s}
                </div>
                <small className={`d-block ${step >= s ? 'text-primary fw-medium' : 'text-muted'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </small>
              </div>
              {s < 3 && (
                <div className={`flex-grow-1 mx-2 ${step > s ? 'bg-primary' : 'bg-light'}`} style={{height: '2px'}}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Row>
        <Col lg={8}>
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">
                  <i className="bi bi-truck me-2"></i>
                  Shipping Address
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={address.fullName}
                          onChange={(e) => setAddress({...address, fullName: e.target.value})}
                          isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control 
                          type="tel" 
                          placeholder="+92 3XX XXXXXXX"
                          value={address.phone}
                          onChange={(e) => setAddress({...address, phone: e.target.value})}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address Line 1 *</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="House/Plot #, Street #"
                      value={address.line1}
                      onChange={(e) => setAddress({...address, line1: e.target.value})}
                      isInvalid={!!errors.line1}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.line1}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Area, Society, Sector"
                      value={address.line2}
                      onChange={(e) => setAddress({...address, line2: e.target.value})}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Province *</Form.Label>
                        <Form.Select 
                          value={selectedProvince}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                        >
                          {pakistanProvinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Select 
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          isInvalid={!!errors.city}
                        >
                          <option value="">Select city...</option>
                          {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Order Notes (optional)</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      placeholder="Delivery instructions, landmark, etc."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => {
                      if (validateAddress()) {
                        setStep(2);
                      }
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  Payment Method
                </h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      id="cod"
                      label={
                        <div>
                          <strong>Cash on Delivery (COD)</strong>
                          <div className="small text-muted">Pay when you receive your order. No additional fees.</div>
                        </div>
                      }
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="border rounded-3 p-3 mb-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      id="bank"
                      label={
                        <div>
                          <strong>Bank Transfer</strong>
                          <div className="small text-muted">Transfer directly to our bank account. Order will be processed after verification.</div>
                        </div>
                      }
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="border rounded-3 p-3 mb-2"
                    />
                  </Form.Group>

                  {paymentMethod === 'BANK_TRANSFER' && (
                    <Alert variant="warning" className="mt-3">
                      <Alert.Heading className="h6">Bank Details</Alert.Heading>
                      <pre className="small mb-2" style={{whiteSpace: 'pre-wrap'}}>
                        {settings.bankTransferDetails}
                      </pre>
                      <Form.Group>
                        <Form.Label>Payment Reference / Transaction ID *</Form.Label>
                        <Form.Control 
                          type="text"
                          placeholder="Enter your transfer reference number"
                          value={bankReference}
                          onChange={(e) => setBankReference(e.target.value)}
                          isInvalid={!!errors.bankReference}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.bankReference}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Alert>
                  )}

                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Review Your Order
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="bg-light border-0 mb-3">
                      <Card.Body>
                        <h6 className="mb-2">Shipping Address</h6>
                        <p className="small mb-0">
                          {address.fullName}<br />
                          {address.line1}{address.line2 && `, ${address.line2}`}<br />
                          {address.city}, {address.state}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-light border-0 mb-3">
                      <Card.Body>
                        <h6 className="mb-2">Payment</h6>
                        <p className="small mb-0">
                          {paymentMethod === 'COD' ? 'Cash on Delivery' : `Bank Transfer (Ref: ${bankReference})`}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Card className="bg-light border-0 mb-3">
                  <Card.Body>
                    <h6 className="mb-2">Items ({cart.length})</h6>
                    {cart.map(item => (
                      <div key={item.id} className="d-flex justify-content-between small py-1">
                        <span>{item.product?.name} × {item.quantity}</span>
                        <span className="fw-medium">{formatPKR((item.variant?.price || 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handlePlaceOrder}
                  >
                    <i className="bi bi-lock me-2"></i>
                    Place Order — {formatPKR(total)}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Order Summary Sidebar */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{top: '20px'}}>
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">{item.product?.name} × {item.quantity}</span>
                  <span className="fw-medium">{formatPKR((item.variant?.price || 0) * item.quantity)}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? <Badge bg="success">FREE</Badge> : formatPKR(shipping)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="h5 mb-0">{formatPKR(total)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
