import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import { useStore } from '../store';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const product = getProduct(slug || '');

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find(v => {
      return v.isActive && v.optionValues.every(ov => selectedOptions[ov.optionId] === ov.value);
    }) || null;
  }, [product, selectedOptions]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Not Found</h1>
        <Link to="/products" className="mt-4 text-amber-600 dark:text-amber-400 hover:underline">← Back to products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product.id, selectedVariant.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length : 0;

  const category = useStore.getState().categories.find(c => c.id === product.categoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-gray-700">Products</Link>
        <ChevronRight size={14} />
        {category && <><Link to={`/products?category=${category.slug}`} className="hover:text-gray-700">{category.name}</Link><ChevronRight size={14} /></>}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
            <img
              src={product.images[activeImage]?.url || 'https://via.placeholder.com/600x600?text=Product'}
              alt={product.images[activeImage]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-amber-500' : 'border-transparent'}`}
                >
                  <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.brand && <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">{product.brand}</p>}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4">
            {selectedVariant ? (
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${selectedVariant.price.toFixed(2)}</span>
                {selectedVariant.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">${selectedVariant.comparePrice.toFixed(2)}</span>
                )}
              </div>
            ) : (
              <p className="text-lg text-gray-500 dark:text-gray-400">Select options to see price</p>
            )}
          </div>

          {/* Short Description */}
          {product.shortDesc && <p className="mt-4 text-gray-600">{product.shortDesc}</p>}

          {/* Variant Selectors */}
          <div className="mt-8 space-y-6">
            {product.options.map(option => (
              <div key={option.id}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {option.name}: {selectedOptions[option.id] && <span className="font-normal text-gray-600">{selectedOptions[option.id]}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map(val => {
                    const isSelected = selectedOptions[option.id] === val.value;
                    return (
                      <button
                        key={val.id}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.id]: val.value }))}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        {val.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Stock Status */}
          {selectedVariant && (
            <div className="mt-4">
              {selectedVariant.stock > 0 ? (
                <p className="text-sm text-green-600 flex items-center"><Check size={14} className="mr-1" /> In Stock ({selectedVariant.stock} available)</p>
              ) : (
                <p className="text-sm text-red-600">Out of Stock</p>
              )}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:text-gray-900"><Minus size={16} /></button>
              <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-600 hover:text-gray-900"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : selectedVariant && selectedVariant.stock > 0
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {addedToCart ? <><Check size={18} className="mr-2" /> Added!</> : <><ShoppingCart size={18} className="mr-2" /> Add to Cart</>}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-lg border-2 transition-all ${inWishlist ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-10 border-t pt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            {product.material && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-500">Material:</span> <span className="text-sm font-medium text-gray-900">{product.material}</span></div>
                {selectedVariant && <div><span className="text-sm text-gray-500">SKU:</span> <span className="text-sm font-medium text-gray-900">{selectedVariant.sku}</span></div>}
              </div>
            )}
          </div>

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="mt-10 border-t pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.body}</p>
                    <p className="mt-1 text-xs text-gray-400">— {review.userName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
