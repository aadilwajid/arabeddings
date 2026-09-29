import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Nav, Tab, Tabs, Modal, Form, Alert } from 'react-bootstrap';
import { useStore } from '../store';
import { formatPKR } from '../data/pakistan';

export default function BootstrapAdminDashboard() {
  const { user, orders, products, drugOrders, settings } = useStore();
  const [key, setKey] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You need admin privileges to access this page.</p>
        </Alert>
      </Container>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const pendingPayments = orders.filter(o => o.payment.status === 'AWAITING_VERIFICATION').length;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">Admin Dashboard</h1>
          <p className="text-muted mb-0">Welcome back, {user.name}</p>
        </Col>
      </Row>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || 'overview')}
        className="mb-4"
      >
        {/* Overview Tab */}
        <Tab eventKey="overview" title="Overview">
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Revenue</p>
                      <h3 className="mb-0 fw-bold">{formatPKR(totalRevenue)}</h3>
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                      <i className="bi bi-currency-dollar text-primary fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Orders</p>
                      <h3 className="mb-0 fw-bold">{orders.length}</h3>
                    </div>
                    <div className="bg-success bg-opacity-10 rounded-3 p-3">
                      <i className="bi bi-bag text-success fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Pending Orders</p>
                      <h3 className="mb-0 fw-bold text-warning">{pendingOrders}</h3>
                    </div>
                    <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                      <i className="bi bi-clock text-warning fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Pending Payments</p>
                      <h3 className="mb-0 fw-bold text-danger">{pendingPayments}</h3>
                    </div>
                    <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                      <i className="bi bi-credit-card text-danger fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Recent Orders</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td className="fw-medium">{order.orderNumber}</td>
                          <td>{order.shippingAddress.fullName}</td>
                          <td>
                            <Badge bg={
                              order.status === 'DELIVERED' ? 'success' :
                              order.status === 'SHIPPED' ? 'info' :
                              order.status === 'PENDING' ? 'warning' :
                              'secondary'
                            }>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="fw-medium">{formatPKR(order.total)}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Quick Stats</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">Products</span>
                      <span className="fw-medium">{products.length}</span>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-primary" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">Custom Orders</span>
                      <span className="fw-medium">{drugOrders.length}</span>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-success" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">Categories</span>
                      <span className="fw-medium">6</span>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-info" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Orders Tab */}
        <Tab eventKey="orders" title="Orders">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Orders</h5>
              <Badge bg="primary" className="fs-6">{orders.length}</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="fw-medium">{order.orderNumber}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.shippingAddress.fullName}</td>
                      <td>
                        <Badge bg={
                          order.status === 'DELIVERED' ? 'success' :
                          order.status === 'SHIPPED' ? 'info' :
                          order.status === 'PENDING' ? 'warning' :
                          order.status === 'CANCELLED' ? 'danger' :
                          'secondary'
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={order.payment.status === 'VERIFIED' ? 'success' : 'warning'}>
                          {order.payment.status}
                        </Badge>
                      </td>
                      <td className="fw-medium">{formatPKR(order.total)}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Products Tab */}
        <Tab eventKey="products" title="Products">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Products</h5>
              <Button variant="primary" size="sm" onClick={() => setShowProductModal(true)}>
                + Add Product
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price Range</th>
                    <th>Variants</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const prices = product.variants.map(v => v.price);
                    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.images[0]?.url} 
                              alt={product.name}
                              className="rounded me-2"
                              style={{width: '40px', height: '40px', objectFit: 'cover'}}
                            />
                            <div>
                              <div className="fw-medium">{product.name}</div>
                              <small className="text-muted">{product.brand}</small>
                            </div>
                          </div>
                        </td>
                        <td>{useStore.getState().categories.find(c => c.id === product.categoryId)?.name}</td>
                        <td>{formatPKR(Math.min(...prices))} - {formatPKR(Math.max(...prices))}</td>
                        <td>{product.variants.length}</td>
                        <td>
                          <Badge bg={totalStock < 20 ? 'danger' : 'success'}>
                            {totalStock}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={product.isActive ? 'success' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Custom Orders Tab */}
        <Tab eventKey="custom-orders" title="Custom Orders">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Custom Order Requests</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {drugOrders.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No custom orders yet</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Item Type</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Quoted Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drugOrders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-medium">{order.reference}</td>
                        <td>{order.fullName}</td>
                        <td>{order.itemType}</td>
                        <td>{order.quantity}</td>
                        <td>
                          <Badge bg={
                            order.status === 'APPROVED' ? 'success' :
                            order.status === 'REJECTED' ? 'danger' :
                            order.status === 'QUOTED' ? 'info' :
                            'warning'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td>{order.quotedPrice ? formatPKR(order.quotedPrice) : '-'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Settings Tab */}
        <Tab eventKey="settings" title="Settings">
          <Row className="g-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Store Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Store Name</Form.Label>
                      <Form.Control type="text" defaultValue={settings.storeName} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Store Email</Form.Label>
                      <Form.Control type="email" defaultValue={settings.storeEmail} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Store Phone</Form.Label>
                      <Form.Control type="tel" defaultValue={settings.storePhone} />
                    </Form.Group>
                    <Button variant="primary">Save Changes</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Shipping Settings</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Free Shipping Threshold (PKR)</Form.Label>
                      <Form.Control type="number" defaultValue={settings.freeShippingThreshold} />
                      <Form.Text className="text-muted">
                        Orders above this amount get free shipping
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Transfer Details</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={6} 
                        defaultValue={settings.bankTransferDetails}
                      />
                    </Form.Group>
                    <Button variant="primary">Save Changes</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Order Details Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {selectedOrder?.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted small mb-2">Customer Information</h6>
                  <p className="mb-1"><strong>{selectedOrder.shippingAddress.fullName}</strong></p>
                  <p className="mb-1 text-muted small">{selectedOrder.shippingAddress.phone}</p>
                  <p className="mb-0 text-muted small">
                    {selectedOrder.shippingAddress.line1}, {selectedOrder.shippingAddress.city}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted small mb-2">Order Status</h6>
                  <Badge bg={
                    selectedOrder.status === 'DELIVERED' ? 'success' :
                    selectedOrder.status === 'SHIPPED' ? 'info' :
                    selectedOrder.status === 'PENDING' ? 'warning' :
                    'secondary'
                  } className="mb-2">
                    {selectedOrder.status}
                  </Badge>
                  <p className="mb-0 text-muted small">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </Col>
              </Row>

              <h6 className="text-muted small mb-2">Order Items</h6>
              <Table responsive size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.variantName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPKR(item.unitPrice)}</td>
                      <td className="fw-medium">{formatPKR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Row className="mt-3">
                <Col md={6}>
                  <h6 className="text-muted small mb-2">Payment Information</h6>
                  <p className="mb-1">
                    <strong>Method:</strong> {selectedOrder.payment.method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{' '}
                    <Badge bg={selectedOrder.payment.status === 'VERIFIED' ? 'success' : 'warning'}>
                      {selectedOrder.payment.status}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted small mb-2">Order Summary</h6>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Subtotal:</span>
                    <span>{formatPKR(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatPKR(selectedOrder.shippingFee)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total:</span>
                    <span>{formatPKR(selectedOrder.total)}</span>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter product name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select>
                    <option>Select category</option>
                    <option value="cat-1">Bed Sheets</option>
                    <option value="cat-2">Duvet Covers</option>
                    <option value="cat-3">Pillowcases</option>
                    <option value="cat-4">Comforters</option>
                    <option value="cat-5">Blankets</option>
                    <option value="cat-6">Pillows</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter product description" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control type="text" placeholder="Enter brand name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Control type="text" placeholder="Enter material" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price (PKR)</Form.Label>
                  <Form.Control type="number" placeholder="0" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control type="number" placeholder="0" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
