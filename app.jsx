import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, Settings, LogOut, Plus, Trash2, Eye, EyeOff, Menu, X, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const PiCashShoppingApp = () => {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [authError, setAuthError] = useState('');

  // App States
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin States
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });

  // Customer States
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [shoppingCart, setShoppingCart] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form visibility
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Admin Form
  const [newOrder, setNewOrder] = useState({
    productLink: '',
    description: '',
    estimatedPrice: '',
  });

  // Pi Authentication Simulator
  const handlePiAuth = () => {
    setAuthError('');
    if (!piUsername.trim()) {
      setAuthError('Please enter your Pi username');
      return;
    }

    // Simulate Pi Network authentication
    const adminUsername = 'Polaris2021';
    const isAdminUser = piUsername === adminUsername;

    setCurrentUser({
      username: piUsername,
      uid: `pi_${Date.now()}`,
      authenticatedAt: new Date().toLocaleString(),
    });
    setIsAdmin(isAdminUser);
    setIsAuthenticated(true);
    setPiUsername('');

    if (!isAdminUser) {
      setShowCustomerForm(true);
    }
  };

  // Handle Customer Information
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Customer Info
  const submitCustomerInfo = () => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all information fields');
      return;
    }
    setShowCustomerForm(false);
    setCurrentPage('shopping');
  };

  // Add Product to Cart
  const addProductToCart = () => {
    if (!newOrder.productLink || !newOrder.description || !newOrder.estimatedPrice) {
      alert('Please fill in all fields');
      return;
    }

    const product = {
      id: Date.now(),
      link: newOrder.productLink,
      description: newOrder.description,
      price: parseFloat(newOrder.estimatedPrice),
      addedAt: new Date().toLocaleString(),
    };

    setShoppingCart([...shoppingCart, product]);
    setNewOrder({ productLink: '', description: '', estimatedPrice: '' });
  };

  // Remove Product from Cart
  const removeFromCart = (id) => {
    setShoppingCart(shoppingCart.filter(item => item.id !== id));
  };

  // Calculate Total
  const cartTotal = shoppingCart.reduce((sum, item) => sum + item.price, 0);

  // Process Cash Payment
  const processCashPayment = async () => {
    if (!paymentAmount) {
      alert('Please enter payment amount');
      return;
    }

    if (shoppingCart.length === 0) {
      alert('Please add products to your cart');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount < cartTotal) {
      alert(`Payment amount (${amount} EGP) is less than total (${cartTotal} EGP)`);
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const order = {
        id: `ORD-${Date.now()}`,
        customerId: currentUser.uid,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        products: shoppingCart,
        totalAmount: cartTotal,
        paidAmount: amount,
        change: amount - cartTotal,
        status: 'pending',
        paymentMethod: 'VF Cash',
        createdAt: new Date().toLocaleString(),
      };

      if (isAdmin) {
        setOrders([order, ...orders]);
      } else {
        setOrders([order, ...orders]);
      }

      // Reset form
      setShoppingCart([]);
      setPaymentAmount('');
      setIsProcessing(false);

      alert(`Payment successful!\nOrder ID: ${order.id}\nChange: ${order.change} EGP`);
      setCurrentPage(isAdmin ? 'admin-orders' : 'orders');
    }, 2000);
  };

  // Update Order Status (Admin Only)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Delete Order (Admin Only)
  const deleteOrder = (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // Calculate Dashboard Stats
  useEffect(() => {
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };
    setDashboardStats(stats);
  }, [orders]);

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
    setCustomerInfo({ fullName: '', email: '', phone: '', address: '' });
    setShoppingCart([]);
    setShowCustomerForm(true);
    setOrders([]);
  };

  // ============ RENDER LOGIN ============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full mb-4">
              <ShoppingCart size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">PiCash Shopping</h1>
            <p className="text-gray-600 mt-2">Buy anything in Pi Network without Pi coins</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pi Username</label>
              <input
                type="text"
                placeholder="e.g., Polaris2021"
                value={piUsername}
                onChange={(e) => setPiUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePiAuth()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
              />
            </div>

            {authError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {authError}
              </div>
            )}

            <button
              onClick={handlePiAuth}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
            >
              Sign in with Pi
            </button>

            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 text-sm">
              <p className="font-semibold">Demo Account:</p>
              <p>Admin: Polaris2021</p>
              <p>Customer: any other username</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ RENDER CUSTOMER INFO FORM ============
  if (showCustomerForm && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={customerInfo.fullName}
              onChange={handleCustomerInfoChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customerInfo.email}
              onChange={handleCustomerInfoChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={handleCustomerInfoChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={customerInfo.address}
              onChange={handleCustomerInfoChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />

            <button
              onClick={submitCustomerInfo}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
            >
              Continue to Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ MAIN APP LAYOUT ============
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} />
            <h1 className="text-2xl font-bold">PiCash Shopping</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="text-sm">
              <p>Welcome, <span className="font-bold">{currentUser.username}</span></p>
              <p className="text-xs opacity-80">{isAdmin ? 'Admin' : 'Customer'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white border-opacity-20 p-4 space-y-3">
            <p className="font-bold">{currentUser.username}</p>
            <p className="text-sm">{isAdmin ? 'Admin' : 'Customer'}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto px-4 py-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentPage === 'dashboard'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('admin-orders')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentPage === 'admin-orders'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📦 All Orders
              </button>
              <button
                onClick={() => setCurrentPage('admin-settings')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentPage === 'admin-settings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ⚙️ Settings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentPage('shopping')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentPage === 'shopping'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🛒 Shopping
              </button>
              <button
                onClick={() => setCurrentPage('orders')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  currentPage === 'orders'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 My Orders
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ============ ADMIN DASHBOARD ============ */}
        {isAdmin && currentPage === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalOrders}</p>
                  </div>
                  <Package className="text-purple-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalRevenue.toFixed(2)} EGP</p>
                  </div>
                  <DollarSign className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-gray-800">{dashboardStats.completedOrders}</p>
                  </div>
                  <TrendingUp className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-gray-800">{dashboardStats.pendingOrders}</p>
                  </div>
                  <Users className="text-orange-600" size={32} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono">{order.id}</td>
                          <td className="py-3 px-4">{order.customerName}</td>
                          <td className="py-3 px-4 font-bold">{order.totalAmount} EGP</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              order.status === 'completed' ? 'bg-green-200 text-green-800' :
                              order.status === 'pending' ? 'bg-orange-200 text-orange-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ ADMIN ORDERS MANAGEMENT ============ */}
        {isAdmin && currentPage === 'admin-orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Manage Orders</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                        <p className="text-gray-600"><strong>Customer:</strong> {order.customerName}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {order.customerEmail}</p>
                        <p className="text-gray-600"><strong>Phone:</strong> {order.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{order.totalAmount} EGP</p>
                        <p className="text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        <p className="text-gray-600"><strong>Paid:</strong> {order.paidAmount} EGP</p>
                        <p className="text-gray-600"><strong>Change:</strong> {order.change} EGP</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-bold text-gray-800 mb-2">Products:</h4>
                      <ul className="space-y-2">
                        {order.products.map(product => (
                          <li key={product.id} className="text-sm text-gray-600">
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {product.description}
                            </a>
                            <span className="ml-2 font-bold">{product.price} EGP</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ ADMIN SETTINGS ============ */}
        {isAdmin && currentPage === 'admin-settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-600 text-sm">Admin Username</label>
                    <p className="font-bold text-gray-800">{currentUser.username}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">User ID</label>
                    <p className="font-mono text-gray-800 text-sm">{currentUser.uid}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Authenticated</label>
                    <p className="text-gray-800">{currentUser.authenticatedAt}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-600 text-sm">Payment Method</label>
                    <p className="font-bold text-gray-800">VF Cash</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Currency</label>
                    <p className="font-bold text-gray-800">Egyptian Pound (EGP)</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Status</label>
                    <p className="text-green-600 font-bold">✓ Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ CUSTOMER SHOPPING ============ */}
        {!isAdmin && currentPage === 'shopping' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>

            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add Product from Pi Ecosystem</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="url"
                  placeholder="Product Link (e.g., https://...)"
                  value={newOrder.productLink}
                  onChange={(e) => setNewOrder({...newOrder, productLink: e.target.value})}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <input
                  type="text"
                  placeholder="Product Description"
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({...newOrder, description: e.target.value})}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Price (EGP)"
                  value={newOrder.estimatedPrice}
                  onChange={(e) => setNewOrder({...newOrder, estimatedPrice: e.target.value})}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                onClick={addProductToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add to Cart
              </button>
            </div>

            {/* Cart Items */}
            {shoppingCart.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2">
                      <tr>
                        <th className="text-left py-4 px-4 font-semibold">Product</th>
                        <th className="text-left py-4 px-4 font-semibold">Link</th>
                        <th className="text-right py-4 px-4 font-semibold">Price</th>
                        <th className="text-center py-4 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shoppingCart.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{item.description}</td>
                          <td className="py-4 px-4">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              View Link
                            </a>
                          </td>
                          <td className="py-4 px-4 text-right font-bold">{item.price} EGP</td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center gap-1 mx-auto transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-bold">{cartTotal} EGP</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-lg font-bold text-gray-800">Total:</span>
                          <span className="text-2xl font-bold text-purple-600">{cartTotal} EGP</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Cash Payment (EGP)</h3>
                      <input
                        type="number"
                        placeholder="Enter cash amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 mb-4"
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={processCashPayment}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Complete Payment'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============ CUSTOMER ORDERS ============ */}
        {!isAdmin && currentPage === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>

            {orders.filter(o => o.customerId === currentUser.uid).length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">You haven't placed any orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.filter(o => o.customerId === currentUser.uid).map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Order ID</p>
                        <p className="font-mono font-bold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Total Amount</p>
                        <p className="text-2xl font-bold text-purple-600">{order.totalAmount} EGP</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${
                          order.status === 'completed' ? 'bg-green-200 text-green-800' :
                          order.status === 'pending' ? 'bg-orange-200 text-orange-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-800 mb-2">Products Ordered:</h4>
                      <ul className="space-y-2">
                        {order.products.map(product => (
                          <li key={product.id} className="text-sm text-gray-600">
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {product.description}
                            </a>
                            <span className="ml-2 font-bold">{product.price} EGP</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t mt-4 pt-4 text-sm text-gray-600">
                      <p><strong>Order Date:</strong> {order.createdAt}</p>
                      <p><strong>Delivery Address:</strong> {order.customerAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PiCashShoppingApp;
