# Component Patterns

React component, hook, Apollo, and state management examples. Referenced from `SKILL.md`.

---

## Component Structure

```jsx
// ✅ Good - Clear structure
function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product.id, quantity);
  };

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-card__actions">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />
        <button onClick={handleAdd}>Add to Cart</button>
      </div>
    </article>
  );
}
```

### When to Split

```jsx
// ❌ Too much in one component
function ProductPage() {
  // 50 lines of hooks...
  // 100 lines of handlers...
  // 200 lines of JSX...
}

// ✅ Split by responsibility
function ProductPage() {
  return (
    <main>
      <ProductHeader />
      <ProductGallery />
      <ProductDetails />
      <ProductReviews />
      <RelatedProducts />
    </main>
  );
}
```

---

## Custom Hooks

```jsx
// ✅ Good - Logic extracted to hook
function useProductQuantity(initialQuantity = 1) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  const reset = () => setQuantity(initialQuantity);

  return { quantity, setQuantity, increment, decrement, reset };
}

// Component stays clean
function QuantitySelector({ onChange }) {
  const { quantity, increment, decrement } = useProductQuantity();

  useEffect(() => {
    onChange(quantity);
  }, [quantity, onChange]);

  return (
    <div className="quantity-selector">
      <button onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## Apollo Client Patterns

### Query Pattern

```jsx
// ✅ Good - Using Apollo hooks
function ProductList({ categoryId }) {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { categoryId },
    // Stale-while-revalidate pattern
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul className="product-list">
      {data.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

### Mutation Pattern

```jsx
// ✅ Good - Optimistic updates
function AddToCartButton({ productId }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    variables: { productId },
    optimisticResponse: {
      addToCart: {
        __typename: 'CartItem',
        id: 'temp-id',
        productId,
        quantity: 1,
      },
    },
    update(cache, { data: { addToCart } }) {
      // Update cart cache
      cache.modify({
        fields: {
          cart(existingCart = []) {
            const newItemRef = cache.writeFragment({
              data: addToCart,
              fragment: CART_ITEM_FRAGMENT,
            });
            return [...existingCart, newItemRef];
          },
        },
      });
    },
  });

  return (
    <button onClick={() => addToCart()} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Don't Duplicate Server State

```jsx
// ❌ Bad - Duplicating Apollo data in local state
function ProductList() {
  const { data } = useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState([]); // Why?

  useEffect(() => {
    if (data) setProducts(data.products); // Duplication!
  }, [data]);
}

// ✅ Good - Use Apollo cache directly
function ProductList() {
  const { data, loading } = useQuery(GET_PRODUCTS);

  // Filter/transform inline or with useMemo
  const activeProducts = useMemo(
    () => data?.products.filter(p => p.active) ?? [],
    [data]
  );
}
```

---

## State Management

### Context Pattern

```jsx
// ✅ Good - Focused context for specific concern
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggle = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Avoid Context for Frequently Changing Data

```jsx
// ❌ Bad - Causes unnecessary re-renders
const AppContext = createContext();
// Contains: user, theme, cart, notifications, sidebar state...
// Every change re-renders everything!

// ✅ Good - Split by concern
const UserContext = createContext();
const ThemeContext = createContext();
const SidebarContext = createContext();
```

---

## JSX Patterns

### Semantic Elements

```jsx
// ❌ Div soup
<div className="nav">
  <div className="nav-item" onClick={handleClick}>Home</div>
</div>

// ✅ Semantic elements
<nav>
  <a href="/">Home</a>
</nav>
```

### No Inline Styles

```jsx
// ❌ Inline styles
<div style={{ marginTop: 16, padding: '8px 16px', backgroundColor: '#3b82f6' }}>

// ✅ CSS class
<div className="card-header">
```

### Minimal Class Lists

```jsx
// ❌ Class soup
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

// ✅ Semantic class
<button className="btn-primary">
```

---

## Import Order

```jsx
// 1. React
import React, { useState, useCallback } from 'react';

// 2. Third-party
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';

// 3. Internal modules
import { useAuth } from '@/hooks/useAuth';
import { GET_PRODUCTS } from '@/graphql/products';

// 4. Components
import { Button } from '@/components/Button';
import { ProductCard } from './ProductCard';

// 5. Styles
import './ProductList.css';
```
