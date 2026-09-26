# 📋 UNUSED COMPONENTS - INTEGRATION GUIDE

## Quick Reference

**Total Unused Components:** 11  
**Total Lines of Unused Code:** ~2,500+  
**Integration Difficulty:** Easy to Medium  

---

## 🔴 HIGH PRIORITY - Integrate Immediately

### 1. QuickViewModal
**File:** `src/components/QuickViewModal.tsx`  
**Lines:** ~263  
**Difficulty:** 🟢 Easy  
**Impact:** 🔴 High  

**What it does:**
- Shows product details in a modal without leaving the page
- Image zoom on hover
- Variant selection
- Add to cart directly

**Where to integrate:**
1. **Shop Page** (`src/app/shop/page.tsx`)
   - Add "Quick View" button to product cards
   - Import and render QuickViewModal on button click

2. **Homepage** (`src/app/page.tsx`)
   - Add "Quick View" button to featured products
   - Same integration as shop page

3. **Collections Page** (`src/app/collections/page.tsx`)
   - Add "Quick View" button to collection products

**Integration Code:**
```tsx
// In product card component
import QuickViewModal from '@/components/QuickViewModal';
import { Eye } from 'lucide-react';

const [showQuickView, setShowQuickView] = useState(false);

<button onClick={() => setShowQuickView(true)}>
  <Eye size={20} />
  Quick View
</button>

{showQuickView && (
  <QuickViewModal
    product={product}
    onClose={() => setShowQuickView(false)}
    onAddToCart={handleAddToCart}
  />
)}
```

---

### 2. BundleBuilder
**File:** `src/components/BundleBuilder.tsx`  
**Lines:** ~213  
**Difficulty:** 🟢 Easy  
**Impact:** 🔴 High  

**What it does:**
- Allows users to create custom product bundles
- 15% discount on bundles
- Visual bundle builder interface

**Where to integrate:**
1. **Homepage** (`src/app/page.tsx`)
   - Add section below featured products
   - Title: "Build Your Perfect Bundle & Save 15%"

**Integration Code:**
```tsx
// In homepage
import BundleBuilder from '@/components/BundleBuilder';

<section className="py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl md:text-3xl font-serif text-center mb-8">
      Build Your Perfect Bundle & Save 15%
    </h2>
    <BundleBuilder
      products={products}
      onAddBundleToCart={handleAddBundleToCart}
    />
  </div>
</section>
```

---

### 3. LoyaltyWidget
**File:** `src/components/LoyaltyWidget.tsx`  
**Lines:** ~168  
**Difficulty:** 🟢 Easy  
**Impact:** 🟠 Medium  

**What it does:**
- Displays user's loyalty points
- Shows tier (Bronze, Silver, Gold, Platinum)
- Modal with detailed loyalty info

**Where to integrate:**
1. **Header** (`src/components/Header.tsx`)
   - Add next to cart icon
   - Show points badge

**Integration Code:**
```tsx
// In header
import LoyaltyWidget from '@/components/LoyaltyWidget';

<div className="flex items-center gap-2 md:gap-4">
  {/* Existing icons */}
  <LoyaltyWidget />
  {/* Other icons */}
</div>
```

---

### 4. ReferralProgram
**File:** `src/components/ReferralProgram.tsx`  
**Lines:** ~159  
**Difficulty:** 🟢 Easy  
**Impact:** 🟠 Medium  

**What it does:**
- Displays referral code
- "Give Rs 500, Get Rs 500" program
- Share functionality

**Where to integrate:**
1. **Header** (`src/components/Header.tsx`)
   - Add next to loyalty widget
   - Show referral badge

**Integration Code:**
```tsx
// In header
import ReferralProgram from '@/components/ReferralProgram';

<div className="flex items-center gap-2 md:gap-4">
  {/* Existing icons */}
  <ReferralProgram />
  {/* Other icons */}
</div>
```

---

## 🟠 MEDIUM PRIORITY - Integrate Soon

### 5. RecentlyViewed
**File:** `src/components/RecentlyViewed.tsx`  
**Lines:** ~139  
**Difficulty:** 🟡 Medium  
**Impact:** 🟠 Medium  

**What it does:**
- Shows last 10 viewed products
- Horizontal scrollable carousel
- Clear all functionality

**Where to integrate:**
1. **Homepage** (`src/app/page.tsx`)
   - Add below featured products
   - Only show if user has viewed products

**Integration Code:**
```tsx
// In homepage
import RecentlyViewed, { addToRecentlyViewed } from '@/components/RecentlyViewed';

// Track product views
const handleViewProduct = (product: Product) => {
  addToRecentlyViewed(product.id);
  setSelectedProduct(product);
};

// Display section
{recentlyViewed.length > 0 && (
  <RecentlyViewed
    products={products}
    onViewProduct={handleViewProduct}
    formatPrice={formatPrice}
  />
)}
```

---

### 6. AbandonedCartNotification
**File:** `src/components/AbandonedCartNotification.tsx`  
**Lines:** ~147  
**Difficulty:** 🟡 Medium  
**Impact:** 🔴 High  

**What it does:**
- Shows notification after 24 hours of cart abandonment
- "Restore Cart" button
- Preview of abandoned items

**Where to integrate:**
1. **Homepage** (`src/app/page.tsx`)
   - Add at bottom of page
   - Only show if cart is abandoned

**Integration Code:**
```tsx
// In homepage
import AbandonedCartNotification, { saveCartForRecovery } from '@/components/AbandonedCartNotification';

// Save cart when items added
const addToCart = (product, variantId, quantity) => {
  // ... existing code
  saveCartForRecovery(newCart);
};

// Display notification
<AbandonedCartNotification onRestore={handleRestoreCart} />
```

---

### 7. PhotoReviews
**File:** `src/components/PhotoReviews.tsx`  
**Lines:** ~295  
**Difficulty:** 🔴 High  
**Impact:** 🟠 Medium  

**What it does:**
- Displays customer photo reviews
- Upload functionality
- Like/vote system

**Where to integrate:**
1. **Product Detail Page** (`src/app/product/[id]/page.tsx`)
   - Add below product description
   - Show customer photos

**Integration Code:**
```tsx
// In product detail page
import PhotoReviews from '@/components/PhotoReviews';

<section>
  <h3>Customer Photos</h3>
  <PhotoReviews productId={product.id} />
</section>
```

---

### 8. ProductComparison
**File:** `src/components/ProductComparison.tsx`  
**Lines:** ~263  
**Difficulty:** 🔴 High  
**Impact:** 🟠 Medium  

**What it does:**
- Compare up to 3 products side-by-side
- Floating comparison bar
- Detailed comparison table

**Where to integrate:**
1. **Shop Page** (`src/app/shop/page.tsx`)
   - Add "Compare" button to product cards
   - Show comparison bar when products selected

**Integration Code:**
```tsx
// In shop page
import CompareBar, { CompareButton } from '@/components/ProductComparison';

// In product card
<CompareButton productId={product.id} />

// At bottom of page
<CompareBar products={products} onAddToCart={addToCart} />
```

---

## 🟢 LOW PRIORITY - Integrate Later

### 9. CountdownTimer
**File:** `src/components/UIComponents.tsx` (line 423)  
**Lines:** ~40  
**Difficulty:** 🟢 Easy  
**Impact:** 🟢 Low  

**What it does:**
- Shows countdown to flash sale end
- Days, hours, minutes, seconds
- Creates urgency

**Where to integrate:**
1. **Homepage** (`src/app/page.tsx`)
   - Add for flash sales
   - Only show when flash sale is active

**Integration Code:**
```tsx
// In homepage
import { CountdownTimer } from '@/components/UIComponents';

{flashSaleActive && (
  <CountdownTimer
    endDate={flashSaleEndDate}
    title="Flash Sale Ends In!"
  />
)}
```

---

### 10. LazyImage
**File:** `src/components/LazyImage.tsx`  
**Lines:** ~54  
**Difficulty:** 🟡 Medium  
**Impact:** 🟢 Low  

**What it does:**
- Lazy loads images when they enter viewport
- Loading spinner
- Smooth fade-in

**Where to integrate:**
1. **All pages with images**
   - Replace regular `<img>` tags
   - Especially product images

**Integration Code:**
```tsx
// Replace this:
<img src={product.mainImage} alt={product.name} />

// With this:
import LazyImage from '@/components/LazyImage';
<LazyImage src={product.mainImage} alt={product.name} />
```

---

### 11. VoiceSearch
**File:** `src/components/VoiceSearch.tsx`  
**Lines:** ~233  
**Difficulty:** 🟡 Medium  
**Impact:** 🟢 Low  

**What it does:**
- Voice-based product search
- Web Speech API
- Real-time transcription

**Where to integrate:**
1. **Header** (`src/components/Header.tsx`)
   - Already imported
   - Verify functionality
   - Add to search bar

**Status:** ⚠️ Already imported in Header, verify it works

---

## 📊 INTEGRATION PRIORITY MATRIX

| Component | Impact | Effort | Priority | Timeline |
|-----------|--------|--------|----------|----------|
| QuickViewModal | 🔴 High | 🟢 Easy | 1 | Week 1 |
| BundleBuilder | 🔴 High | 🟢 Easy | 2 | Week 1 |
| LoyaltyWidget | 🟠 Medium | 🟢 Easy | 3 | Week 1 |
| ReferralProgram | 🟠 Medium | 🟢 Easy | 4 | Week 1 |
| RecentlyViewed | 🟠 Medium | 🟡 Medium | 5 | Week 2 |
| AbandonedCart | 🔴 High | 🟡 Medium | 6 | Week 2 |
| PhotoReviews | 🟠 Medium | 🔴 High | 7 | Week 3 |
| ProductComparison | 🟠 Medium | 🔴 High | 8 | Week 3 |
| CountdownTimer | 🟢 Low | 🟢 Easy | 9 | Week 4 |
| LazyImage | 🟢 Low | 🟡 Medium | 10 | Week 4 |
| VoiceSearch | 🟢 Low | 🟡 Medium | 11 | Week 4 |

---

## 🎯 QUICK START GUIDE

### Step 1: Integrate QuickViewModal (30 minutes)
1. Open `src/app/shop/page.tsx`
2. Import QuickViewModal
3. Add state for modal visibility
4. Add "Quick View" button to product cards
5. Render modal when button clicked
6. Test functionality

### Step 2: Integrate BundleBuilder (20 minutes)
1. Open `src/app/page.tsx`
2. Import BundleBuilder
3. Add section below featured products
4. Pass products and handler
5. Test functionality

### Step 3: Integrate LoyaltyWidget (10 minutes)
1. Open `src/components/Header.tsx`
2. Import LoyaltyWidget
3. Add to action icons section
4. Test functionality

### Step 4: Integrate ReferralProgram (10 minutes)
1. Open `src/components/Header.tsx`
2. Import ReferralProgram
3. Add to action icons section
4. Test functionality

**Total Time:** ~70 minutes for 4 high-impact features

---

## ✅ TESTING CHECKLIST

After integrating each component:

### QuickViewModal
- [ ] Button appears on product cards
- [ ] Modal opens on click
- [ ] Image zoom works
- [ ] Variant selection works
- [ ] Add to cart works
- [ ] Modal closes properly

### BundleBuilder
- [ ] Section appears on homepage
- [ ] Can select products
- [ ] Bundle discount calculates
- [ ] Add to cart works
- [ ] UI is responsive

### LoyaltyWidget
- [ ] Widget appears in header
- [ ] Points display correctly
- [ ] Modal opens on click
- [ ] Tier displays correctly
- [ ] Progress bar works

### ReferralProgram
- [ ] Widget appears in header
- [ ] Referral code displays
- [ ] Share functionality works
- [ ] Stats display correctly
- [ ] Modal opens properly

---

## 📝 NOTES

### Code Quality
- All components are well-documented
- TypeScript types are properly defined
- Components follow React best practices
- Responsive design implemented

### Performance
- Components are lightweight
- Lazy loading where appropriate
- No performance concerns

### Maintenance
- Easy to integrate
- Well-structured code
- Clear documentation

---

## 🚀 NEXT STEPS

1. **Review this guide** - Understand all unused components
2. **Start with QuickViewModal** - Highest impact, easiest to integrate
3. **Integrate BundleBuilder** - High impact, easy integration
4. **Add Loyalty & Referral** - Medium impact, easy integration
5. **Continue with medium priority** - RecentlyViewed, AbandonedCart
6. **Finish with low priority** - Remaining components

**Estimated Total Time:** 2-3 days for all integrations  
**Expected Result:** 100% component utilization, all features functional  

---

**Guide Created:** 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Implementation  

---

**Built with ❤️ for ARA Beddings**
