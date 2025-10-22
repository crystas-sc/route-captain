import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Home, ShoppingCart, Package, Filter, Trash2, CreditCard, ArrowRight, ArrowLeft, Search, User, ChevronDown, Star,
  Truck, ChevronUp, Heart, Bookmark // Added Heart and Bookmark icons
} from 'lucide-react';

// --- MOCK DATA ---
// ... (Mock data remains unchanged)
const mockProducts = [
  { id: 'p1', name: 'Premium Smartwatch', category: 'Electronics', subcategory: 'Wearable Tech', brand: 'TechPro', price: 249.99, rating: 4.5, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Smartwatch' },
  { id: 'p2', name: 'Noise-Cancelling Headphones', category: 'Electronics', subcategory: 'Audio', brand: 'SoundCore', price: 179.99, rating: 4.8, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Headphones' },
  { id: 'p3', name: 'Espresso Machine', category: 'Appliances', subcategory: 'Kitchen', brand: 'BrewMaster', price: 399.99, rating: 4.7, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Espresso+Machine' },
  { id: 'p4', name: 'High-Speed Blender', category: 'Appliances', subcategory: 'Kitchen', brand: 'BlendIt', price: 89.99, rating: 4.3, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Blender' },
  { id: 'p5', name: 'Men\'s Trail Running Shoes', category: 'Fashion', subcategory: 'Men\'s Shoes', brand: 'TrailPeak', price: 119.99, rating: 4.6, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Running+Shoes' },
  { id: 'p6', name: 'Women\'s Winter Parka', category: 'Fashion', subcategory: 'Women\'s Outerwear', brand: 'ArcticNorth', price: 199.99, rating: 4.5, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Winter+Parka' },
  { id: 'p7', name: 'Professional Yoga Mat', category: 'Sports', subcategory: 'Fitness', brand: 'YogaFlex', price: 49.99, rating: 4.9, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Yoga+Mat' },
  { id: 'p8', name: 'Adjustable Dumbbell Set', category: 'Sports', subcategory: 'Strength Training', brand: 'IronGrip', price: 299.99, rating: 4.7, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Dumbbells' },
  { id: 'p9', name: '"The Art of Code" Book', category: 'Books', subcategory: 'Programming', brand: 'CodePress', price: 29.99, rating: 4.8, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Book' },
  { id: 'p10', name: 'Organic Coffee Beans (1kg)', category: 'Grocery', subcategory: 'Beverages', brand: 'JavaJoy', price: 22.99, rating: 4.6, imageUrl: 'https://placehold.co/300x300/e2e8f0/334155?text=Coffee+Beans' },
];

const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  defaultShipping: {
    name: 'Alex Johnson',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA',
  },
  defaultBilling: {
    cardType: 'Visa',
    lastFour: '1234',
    expiry: '12/26',
  }
};

const initialOrders = [
  {
    id: 'ORDER-1001',
    date: '2025-10-15',
    total: 369.98,
    status: 'Delivered',
    items: [
      { ...mockProducts[0], quantity: 1 },
      { ...mockProducts[4], quantity: 1 },
    ],
    shippingAddress: mockUser.defaultShipping,
  },
  {
    id: 'ORDER-1002',
    date: '2025-10-18',
    total: 449.98,
    status: 'Shipped',
    items: [
      { ...mockProducts[2], quantity: 1 },
      { ...mockProducts[6], quantity: 1 },
    ],
    shippingAddress: mockUser.defaultShipping,
    deliveryMethod: 'Standard Shipping', // Added for consistency
  },
];

const mockReviews = [
  { id: 'r1', productId: 'p1', author: 'Jane D.', rating: 5, date: '2025-10-01', text: 'Amazing watch! Does everything I wanted and more. Battery life is great.' },
  { id: 'r2', productId: 'p1', author: 'Mark T.', rating: 4, date: '2025-09-28', text: 'Really good, but the strap feels a bit cheap. Overall happy with it.' },
  { id: 'r3', productId: 'p2', author: 'Sarah L.', rating: 5, date: '2025-10-05', text: 'Best headphones I have ever owned. The noise cancelling is magical.' },
  { id: 'r4', productId: 'p3', author: 'Tom B.', rating: 4, date: '2025-10-02', text: 'Makes a great cup of espresso. A bit loud, but worth it.' },
  { id: 'r5', productId: 'p5', author: 'Alex G.', rating: 5, date: '2025-09-20', text: 'Perfect for trail running. Very comfortable and great grip.' },
  { id: 'r6', productId: 'p7', author: 'Emily R.', rating: 5, date: '2025-10-10', text: 'Love this mat! The grip is fantastic and it feels very high quality.' },
  { id: 'r7', productId: 'p7', author: 'Mike P.', rating: 4, date: '2025-10-08', text: 'Good mat, but it had a slight smell at first. Went away after a day.' },
];

const deliveryOptions = [
  { id: 'standard', name: 'Standard Shipping', price: 0.00, time: '5-7 business days' },
  { id: 'expedited', name: 'Expedited Shipping', price: 9.99, time: '2-3 business days' },
  { id: 'priority', name: 'Priority Shipping', price: 19.99, time: '1 business day' },
];

// --- UTILITY COMPONENTS ---

const StarRating = ({ rating, size = 4 }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-${size} w-${size} ${rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
        fill={rating > i ? 'currentColor' : 'none'}
      />
    ))}
  </div>
);

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FormSelect = ({ id, label, value, onChange, children, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {children}
    </select>
  </div>
);

// --- HEADER & NAVIGATION ---

const Header = ({ setPage, cartCount }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => setPage('home')} className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">E-Clone</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search E-Clone..."
                className="w-full pl-3 pr-10 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-blue-500 hover:bg-blue-600 rounded-r-md flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setPage('home')} className="flex items-center space-x-1 hover:text-blue-300 transition duration-150">
              <Home className="h-5 w-5" />
              <span className="hidden lg:inline">Home</span>
            </button>
            <button onClick={() => setPage('orders')} className="flex items-center space-x-1 hover:text-blue-300 transition duration-150">
              <Package className="h-5 w-5" />
              <span className="hidden lg:inline">My Orders</span>
            </button>
            <button onClick={() => setPage('cart')} className="relative flex items-center space-x-1 hover:text-blue-300 transition duration-150">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Account Button & Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center space-x-1 hover:text-blue-300 transition duration-150"
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline">Account</span>
                {isAccountMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {/* Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-md shadow-lg bg-white text-gray-800 ring-1 ring-black ring-opacity-5 divide-x divide-gray-200 flex">
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-2">Your Lists</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2 text-gray-500" />
                        <button
                          onClick={() => { setPage('wishlist'); setIsAccountMenuOpen(false); }}
                          className="hover:text-blue-600 hover:underline"
                        >
                          Your Wish List
                        </button>
                      </li>
                      <li><a href="#" className="pl-6 block hover:text-blue-600 hover:underline text-gray-600 cursor-not-allowed" title="Coming soon">Baby Wishlist</a></li>
                      <li><a href="#" className="pl-6 block hover:text-blue-600 hover:underline text-gray-600 cursor-not-allowed" title="Coming soon">Discover Your Style</a></li>
                    </ul>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg mb-2">Your Account</h3>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <button
                          onClick={() => { setPage('orders'); setIsAccountMenuOpen(false); }}
                          className="hover:text-blue-600 hover:underline"
                        >
                          Your Orders
                        </button>
                      </li>
                      <li><a href="#" className="hover:text-blue-600 hover:underline text-gray-600 cursor-not-allowed" title="Coming soon">Your Recommendations</a></li>
<li><a href="#" className="hover:text-blue-600 hover:underline text-gray-600 cursor-not-allowed" title="Coming soon">Your Prime Membership</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// --- HOME/PRODUCTS PAGE ---

const FilterSidebar = ({
  selectedCategory, setSelectedCategory,
  selectedSubCategory, setSelectedSubCategory,
  selectedBrand, setSelectedBrand,
  selectedRating, setSelectedRating,
  priceRange, setPriceRange,
  categories, subCategories, brands,
  onResetFilters
}) => {
  return (
    <aside className="w-full p-4 bg-white rounded-lg shadow-md h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Category</h4>
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sub-Category Filter (Conditional) */}
      {subCategories.length > 1 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-700">Sub-Category</h4>
          <div className="space-y-1">
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`block w-full text-left px-3 py-1.5 rounded-md text-sm ${
                  selectedSubCategory === sub
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Brand</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1"> {/* Added scroll for long lists */}
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm ${
                selectedBrand === brand
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
      
      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-700">Rating</h4>
        <div className="space-y-1">
          {[4, 3, 0].map(rating => {
            const text = rating === 0 ? 'All Ratings' : `${rating} Stars & Up`;
            return (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`flex items-center w-full text-left px-3 py-1.5 rounded-md text-sm ${
                  selectedRating === rating
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {rating > 0 ? <StarRating rating={rating} /> : <span className="w-20"></span>}
                <span className={rating > 0 ? 'ml-2' : ''}>{text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
        <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
          <span>$0</span>
          <span>${priceRange}</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
        />
      </div>
    </aside>
  );
};

const ProductCard = ({ product, onAddToCart, setPage, setSelectedProduct, onToggleWishlist, wishlist }) => {
  const isInWishlist = useMemo(() => 
    wishlist.some(item => item.id === product.id),
    [wishlist, product.id]
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 relative">
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-all duration-150 backdrop-blur-sm"
        title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart 
          className={`h-5 w-5 ${isInWishlist ? 'text-red-500' : 'text-gray-500'}`}
          fill={isInWishlist ? 'currentColor' : 'none'}
        />
      </button>

      <div className="h-48 w-full overflow-hidden cursor-pointer" onClick={() => {
          setSelectedProduct(product);
          setPage('productDetail');
        }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/300x300/e2e8f0/334155?text=Image+Error'; }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <button
          onClick={() => {
            setSelectedProduct(product);
            setPage('productDetail');
          }}
          className="text-lg font-semibold text-gray-800 mb-1 truncate text-left hover:text-blue-600 focus:outline-none"
        >
          {product.name}
        </button>
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <p className="text-sm text-gray-500 mb-2">{product.category} / {product.subcategory}</p>
        <div className="flex items-center mb-3">
          <StarRating rating={product.rating} />
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        <div className="flex-grow"></div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-600 transition duration-150 flex items-center"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ onAddToCart, setPage, setSelectedProduct, wishlist, onToggleWishlist }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedRating, setSelectedRating] = useState(0); // 0 = all
  const [priceRange, setPriceRange] = useState(500);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedBrand('All');
    setSelectedRating(0);
    setPriceRange(500);
  };

  // Effect to reset sub-category when main category changes
  React.useEffect(() => {
    setSelectedSubCategory('All');
  }, [selectedCategory]);

  // Derive lists for filters
  const subCategories = useMemo(() => {
    if (selectedCategory === 'All') {
      return []; // No sub-categories to show
    }
    const subs = mockProducts
      .filter(p => p.category === selectedCategory)
      .map(p => p.subcategory);
    return ['All', ...new Set(subs)];
  }, [selectedCategory]);

  const brands = useMemo(() => {
    return ['All', ...new Set(mockProducts.map(p => p.brand))];
  }, []); // Empty dependency, brands list is static

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const subCategoryMatch = selectedCategory === 'All' || selectedSubCategory === 'All' || product.subcategory === selectedSubCategory;
      const brandMatch = selectedBrand === 'All' || product.brand === selectedBrand;
      const ratingMatch = selectedRating === 0 || product.rating >= selectedRating;
      const priceMatch = product.price <= priceRange;
      return categoryMatch && subCategoryMatch && brandMatch && ratingMatch && priceMatch;
    });
  }, [selectedCategory, selectedSubCategory, selectedBrand, selectedRating, priceRange]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            subCategories={subCategories}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            brands={brands}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
            onResetFilters={handleResetFilters}
          />
        </div>
        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  setPage={setPage}
                  setSelectedProduct={setSelectedProduct}
                  onToggleWishlist={onToggleWishlist}
                  wishlist={wishlist}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products found matching your criteria.</p>
          )}
        </main>
      </div>
    </div>
  );
};

// --- PRODUCT DETAIL PAGE ---

const ProductDetailPage = ({ product, setPage, onAddToCart, wishlist, onToggleWishlist }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Simulate fetching reviews for the product
    setReviews(mockReviews.filter(review => review.productId === product.id));
  }, [product.id]);
  
  const isInWishlist = useMemo(() => 
    wishlist.some(item => item.id === product.id),
    [wishlist, product.id]
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => setPage('home')}
        className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to products
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain rounded-lg max-h-96"
              onError={(e) => { e.target.src = 'https://placehold.co/600x600/e2e8f0/334155?text=Image+Error'; }}
            />
          </div>

          {/* Product Info & Actions */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <div className="flex items-center mb-4">
                <StarRating rating={product.rating} size={5} />
                <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{product.category} / {product.subcategory}</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-700 mb-6">
                This is a mock description for the {product.name}. It highlights the key features and benefits of this fantastic product. Built with quality and performance in mind.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-600 transition duration-150 flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-full bg-white text-gray-700 px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition duration-150 flex items-center justify-center border border-gray-300 ${isInWishlist ? 'text-red-500' : ''}`}
              >
                <Heart 
                  className={`h-5 w-5 mr-2 ${isInWishlist ? 'text-red-500' : 'text-gray-500'}`}
                  fill={isInWishlist ? 'currentColor' : 'none'}
                />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} />
                  <span className="ml-3 font-semibold text-gray-800">{review.author}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews for this product yet.</p>
        )}
      </div>
    </div>
  );
};

// --- CART PAGE ---
// ... (CartPage components remain unchanged)
const CartItem = ({ item, onRemove, onUpdateQuantity }) => (
  <div className="flex items-center py-4 border-b border-gray-200">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="h-24 w-24 object-cover rounded-md mr-4"
      onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/334155?text=Image+Error'; }}
    />
    <div className="flex-grow">
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.brand}</p>
      <p className="text-lg font-bold text-gray-800 mt-1">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center space-x-3 mx-4">
      <button
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
      >
        -
      </button>
      <span className="font-medium text-lg">{item.quantity}</span>
      <button
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
      >
        +
      </button>
    </div>
    <div className="text-right w-24">
      <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
    <button onClick={() => onRemove(item.id)} className="ml-4 text-gray-500 hover:text-red-500">
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
);

const CartSummary = ({ cart, setPage }) => {
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="w-full lg:w-1/3 h-fit bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
          <span>Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={() => setPage('checkout')}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-600 transition duration-150 flex items-center justify-center"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Proceed to Checkout
      </button>
    </div>
  );
};

const CartPage = ({ cart, onRemove, onUpdateQuantity, setPage }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <button
            onClick={() => setPage('home')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-150"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Cart Items ({cart.length})</h2>
            <div className="divide-y divide-gray-200">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={onRemove}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          </div>
          <CartSummary cart={cart} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

// --- CHECKOUT PAGE ---
// ... (CheckoutPage components remain unchanged)
const CheckoutStep = ({ number, title, isActive, isComplete }) => (
  <div className="flex items-center">
    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
      isActive ? 'bg-blue-500 text-white' : isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
    }`}>
      {isComplete ? '✓' : number}
    </div>
    <span className={`ml-3 font-medium ${
      isActive ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-500'
    }`}>{title}</span>
  </div>
);

const ShippingForm = ({ shippingData, setShippingData, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
      <FormInput id="name" label="Full Name" value={shippingData.name} onChange={handleChange} required />
      <FormInput id="address" label="Address" value={shippingData.address} onChange={handleChange} required />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput id="city" label="City" value={shippingData.city} onChange={handleChange} required />
        <FormInput id="state" label="State" value={shippingData.state} onChange={handleChange} required />
        <FormInput id="zip" label="ZIP Code" value={shippingData.zip} onChange={handleChange} required />
      </div>
      <FormInput id="country" label="Country" value={shippingData.country} onChange={handleChange} required />
      <button type="submit" className="w-full bg-blue-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-600 transition duration-150 flex items-center justify-center mt-4">
        Continue to Delivery
        <ArrowRight className="h-5 w-5 ml-2" />
      </button>
    </form>
  );
};

const DeliveryOptions = ({ selectedOption, setSelectedOption, onNext, onBack }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Options</h2>
      <div className="space-y-4 mb-6">
        {deliveryOptions.map(option => (
          <label
            key={option.id}
            className={`flex items-center p-4 border rounded-md cursor-pointer ${
              selectedOption.id === option.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="deliveryOption"
              checked={selectedOption.id === option.id}
              onChange={() => setSelectedOption(option)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 flex-grow">
              <span className="block font-medium text-gray-800">{option.name}</span>
              <span className="block text-sm text-gray-500">{option.time}</span>
            </div>
            <span className="font-medium text-gray-800">
              {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-150 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-150 flex items-center"
        >
          Continue to Payment
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

const PaymentForm = ({ billingData, setBillingData, onBack, onPlaceOrder, useSameAsShipping, setUseSameAsShipping, shippingData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h2>
      <FormInput id="cardName" label="Name on Card" value={billingData.cardName} onChange={handleChange} required />
      <FormInput id="cardNumber" label="Card Number" type="tel" value={billingData.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• 1234" required />
      <div className="grid grid-cols-2 gap-4">
        <FormInput id="expiry" label="Expiry (MM/YY)" value={billingData.expiry} onChange={handleChange} placeholder="MM/YY" required />
        <FormInput id="cvv" label="CVV" type="tel" value={billingData.cvv} onChange={handleChange} placeholder="123" required />
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Billing Address</h3>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={useSameAsShipping}
          onChange={(e) => setUseSameAsShipping(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-700">
          Same as shipping address
        </label>
      </div>

      {!useSameAsShipping && (
        <div className="space-y-4">
          <FormInput id="billingName" label="Full Name" value={billingData.billingName} onChange={handleChange} required />
          <FormInput id="billingAddress" label="Address" value={billingData.billingAddress} onChange={handleChange} required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput id="billingCity" label="City" value={billingData.billingCity} onChange={handleChange} required />
            <FormInput id="billingState" label="State" value={billingData.billingState} onChange={handleChange} required />
            <FormInput id="billingZip" label="ZIP Code" value={billingData.billingZip} onChange={handleChange} required />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-150 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-green-600 transition duration-150 flex items-center justify-center"
        >
          Place Your Order
          <Package className="h-5 w-5 ml-2" />
        </button>
      </div>
    </form>
  );
};

const CheckoutOrderSummary = ({ cart, deliveryOption }) => {
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const tax = subtotal * 0.08; // 8% tax
  const shipping = deliveryOption.price;
  const total = subtotal + tax + shipping;

  return (
    <div className="w-full lg:w-1/3 h-fit bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Order</h2>
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover mr-2" />
              <div>
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = ({ cart, onPlaceOrder, user, setPage }) => {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment
  const [shippingData, setShippingData] = useState(user.defaultShipping);
  const [billingData, setBillingData] = useState({
    cardName: user.name,
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingName: user.name,
    billingAddress: user.defaultShipping.address,
    billingCity: user.defaultShipping.city,
    billingState: user.defaultShipping.state,
    billingZip: user.defaultShipping.zip,
  });
  const [useSameAsShipping, setUseSameAsShipping] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
  
  const handlePlaceOrderClick = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = selectedDelivery.price;
    const total = subtotal + tax + shipping;

    const newOrder = {
      id: `ORDER-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      total: total,
      status: 'Processing',
      items: cart,
      shippingAddress: shippingData,
      deliveryMethod: selectedDelivery.name,
    };
    onPlaceOrder(newOrder);
  };
  
  useEffect(() => {
    if (useSameAsShipping) {
      setBillingData(prev => ({
        ...prev,
        billingName: shippingData.name,
        billingAddress: shippingData.address,
        billingCity: shippingData.city,
        billingState: shippingData.state,
        billingZip: shippingData.zip,
      }));
    } else {
      setBillingData(prev => ({
        ...prev,
        billingName: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
      }))
    }
  }, [useSameAsShipping, shippingData]);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <p className="text-xl text-gray-600 mb-4">Your cart is empty. Please add items to your cart before checking out.</p>
        <button
          onClick={() => setPage('home')}
          className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-150"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      
      {/* Checkout Steps Navigator */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
        <CheckoutStep number={1} title="Shipping" isActive={step === 1} isComplete={step > 1} />
        <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
        <CheckoutStep number={2} title="Delivery" isActive={step === 2} isComplete={step > 2} />
        <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
        <CheckoutStep number={3} title="Payment" isActive={step === 3} isComplete={false} />
      </div>

      <div className="flex flex-col lg:flex-row-reverse gap-8">
        <CheckoutOrderSummary cart={cart} deliveryOption={selectedDelivery} />
        
        <div className="flex-grow">
          {step === 1 && (
            <ShippingForm 
              shippingData={shippingData} 
              setShippingData={setShippingData} 
              onNext={() => setStep(2)} 
            />
          )}
          {step === 2 && (
            <DeliveryOptions
              selectedOption={selectedDelivery}
              setSelectedOption={setSelectedDelivery}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <PaymentForm 
              billingData={billingData} 
              setBillingData={setBillingData}
              shippingData={shippingData}
              useSameAsShipping={useSameAsShipping}
              setUseSameAsShipping={setUseSameAsShipping}
              onBack={() => setStep(2)}
              onPlaceOrder={handlePlaceOrderClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// --- ORDERS PAGE ---
// ... (OrdersPage components remain unchanged)
const OrderDetails = ({ order, setPage, setSelectedProduct }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
    {/* Order Header */}
    <div className="bg-gray-100 p-4 border-b border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-gray-500 uppercase">Order Placed</span>
          <p className="text-sm font-medium text-gray-800">{order.date}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase">Total</span>
          <p className="text-sm font-medium text-gray-800">${order.total.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase">Ship To</span>
          <p className="text-sm font-medium text-gray-800 truncate" title={order.shippingAddress.name}>
            {order.shippingAddress.name}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase">Order #</span>
          <p className="text-sm font-medium text-gray-800">{order.id}</p>
        </div>
      </div>
    </div>

    {/* Order items and status */}
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{order.status}</h3>
      {order.deliveryMethod && (
        <p className="text-sm text-gray-600 mb-4">Delivery Method: {order.deliveryMethod}</p>

      )}
      {order.items.map(item => (
        <div key={item.id} className="flex items-start py-4 border-b border-gray-200 last:border-b-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-20 w-20 object-cover rounded-md mr-4"
            onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/334155?text=Image+Error'; }}
          />
          <div className="flex-grow">
            <button
              onClick={() => {
                setSelectedProduct(item);
                setPage('productDetail');
              }}
              className="text-lg font-medium text-blue-600 hover:underline text-left"
            >
              {item.name}
            </button>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            <p className="text-lg font-semibold text-gray-800">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => {
                setSelectedProduct(item);
                setPage('productDetail');
              }}
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md font-medium text-sm hover:bg-gray-200 transition duration-150"
            >
              View item
             </button>
            <button
              onClick={() => {
                setSelectedProduct(item);
                setPage('productDetail');
              }}
              className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-md font-medium text-sm hover:bg-yellow-500 transition duration-150"
            >
              Write review
             </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersPage = ({ orders, setPage, setSelectedProduct }) => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>
    {orders.length === 0 ? (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <p className="text-xl text-gray-600 mb-4">You have not placed any orders yet.</p>
        <button
          onClick={() => setPage('home')}
          className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-150"
        >
          Start Shopping
        </button>
      </div>
    ) : (
      <div>
        {orders.map(order => (
          <OrderDetails
            key={order.id}
            order={order}
            setPage={setPage}
            setSelectedProduct={setSelectedProduct}
          />
        ))}
      </div>
    )}
  </div>
);


// --- WISHLIST PAGE (Rebuilt) ---

const WishlistItem = ({ item, onRemove, onMoveToCart, setPage, setSelectedProduct }) => (
  <div className="flex items-center py-4 border-b border-gray-200">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="h-24 w-24 object-cover rounded-md mr-4 cursor-pointer"
      onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/334155?text=Image+Error'; }}
      onClick={() => {
        setSelectedProduct(item);
        setPage('productDetail');
      }}
    />
    <div className="flex-grow">
      <button
        onClick={() => {
          setSelectedProduct(item);
          setPage('productDetail');
        }}
        className="text-lg font-semibold text-gray-800 hover:text-blue-600 text-left"
      >
        {item.name}
      </button>
      <p className="text-sm text-gray-500">{item.brand}</p>
      <p className="text-lg font-bold text-gray-800 mt-1">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
      <button 
        onClick={() => onMoveToCart(item)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-600 transition duration-150 flex items-center justify-center w-36"
      >
        <ShoppingCart className="h-4 w-4 mr-1" />
        Move to Cart
      </button>
      <button 
        onClick={() => onRemove(item.id)} 
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-200 transition duration-150 flex items-center justify-center w-36 sm:w-auto"
      >
        <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
        <span className="sm:hidden">Remove</span>
      </button>
    </div>
  </div>
);

const WishlistPage = ({ wishlist, onRemoveFromWishlist, onMoveToCart, setPage, setSelectedProduct }) => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Wish List</h1>
    {wishlist.length === 0 ? (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <p className="text-xl text-gray-600 mb-4">Your wish list is empty.</p>
        <button
          onClick={() => setPage('home')}
          className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-150"
        >
          Discover Items
        </button>
      </div>
    ) : (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Saved Items ({wishlist.length})</h2>
        <div className="divide-y divide-gray-200">
          {wishlist.map(item => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={onRemoveFromWishlist}
              onMoveToCart={onMoveToCart}
              setPage={setPage}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'cart', 'checkout', 'orders', 'productDetail', 'wishlist'
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [user, setUser] = useState(mockUser);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePlaceOrder = (newOrder) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    setPage('orders');
  };

  const handleToggleWishlist = (product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some(item => item.id === product.id);
      if (isInWishlist) {
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };
  
  const handleRemoveFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };
  
  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product.id);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage
          onAddToCart={handleAddToCart}
          setPage={setPage}
          setSelectedProduct={setSelectedProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />;
      case 'cart':
        return <CartPage 
                 cart={cart} 
                 onRemove={handleRemoveFromCart} 
                 onUpdateQuantity={handleUpdateCartQuantity} 
                 setPage={setPage} 
               />;
      case 'checkout':
        return <CheckoutPage 
                 cart={cart} 
                 onPlaceOrder={handlePlaceOrder} 
                 user={user} 
                 setPage={setPage} 
               />;
      case 'orders':
        return <OrdersPage
          orders={orders}
          setPage={setPage}
          setSelectedProduct={setSelectedProduct}
        />;
      case 'productDetail':
        return <ProductDetailPage
          product={selectedProduct}
          setPage={setPage}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />;
      case 'wishlist':
        return <WishlistPage 
                 wishlist={wishlist}
                 onRemoveFromWishlist={handleRemoveFromWishlist}
                 onMoveToCart={handleMoveToCart}
                 setPage={setPage}
                 setSelectedProduct={setSelectedProduct}
               />;
      default:
        return <HomePage
          onAddToCart={handleAddToCart}
          setPage={setPage}
          setSelectedProduct={setSelectedProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header setPage={setPage} cartCount={cartCount} />
      <main>
        {renderPage()}
      </main>
      <footer className="bg-gray-800 text-gray-400 mt-12 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2025 E-Clone. All rights reserved.</p>
            <p className="text-sm mt-1">This is a demo application for illustrative purposes.</p>
        </div>
      </footer>
    </div>
  );
}

