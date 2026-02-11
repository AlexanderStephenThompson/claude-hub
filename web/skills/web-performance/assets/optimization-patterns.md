# Optimization Patterns

Bundle, React, and database optimization patterns. Referenced from `SKILL.md`.

---

## Bundle Optimization

### Code Splitting

```typescript
// Route-based splitting
import { lazy, Suspense } from 'react';

const ProductPage = lazy(() => import('./features/products/ProductPage'));
const CheckoutPage = lazy(() => import('./features/checkout/CheckoutPage'));
const AdminDashboard = lazy(() => import('./features/admin/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### Dynamic Imports for Heavy Libraries

```typescript
// ❌ Bad - Loads chart library on every page
import { Chart } from 'chart.js';

// ✅ Good - Loads only when needed
async function renderChart(data) {
  const { Chart } = await import('chart.js');
  // Use chart...
}

// Or with React
const ChartComponent = lazy(() =>
  import('./ChartComponent').then(module => ({
    default: module.ChartComponent,
  }))
);
```

### Analyzing Bundle

```bash
# Create bundle analysis
npm run build -- --analyze

# Or with source-map-explorer
npx source-map-explorer build/static/js/*.js
```

---

## React Performance

### Memoization

```typescript
// Expensive computation
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
);

// Stable callback for child components
const handleAddToCart = useCallback(
  (productId: string) => {
    addToCart({ variables: { productId } });
  },
  [addToCart]
);

// Memoized component for lists
const ProductCard = memo(function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      {/* ... */}
    </article>
  );
});
```

### When NOT to Memoize

```typescript
// ❌ Don't memoize simple values
const fullName = useMemo(() => `${first} ${last}`, [first, last]); // Just inline it
const fullName = `${first} ${last}`;

// ❌ Don't memoize if always changes
const timestamp = useMemo(() => Date.now(), []); // Defeats the purpose

// ❌ Don't memoize inline handlers on non-memoized children
<button onClick={() => doThing()}>Click</button> // Fine if button isn't memoized
```

### Virtualization for Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ products }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Database Performance

### Prisma Query Optimization

```typescript
// ✅ Select only needed fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    // Don't select description if not needed
  },
});

// ✅ Use include sparingly
const order = await prisma.order.findUnique({
  where: { id },
  include: {
    items: {
      include: {
        product: {
          select: { id: true, name: true, price: true },
        },
      },
    },
    // Don't include user if not needed
  },
});

// ✅ Use raw queries for complex aggregations
const stats = await prisma.$queryRaw`
  SELECT
    category_id,
    COUNT(*) as product_count,
    AVG(price) as avg_price
  FROM products
  WHERE active = true
  GROUP BY category_id
`;
```

### Index Strategy

```prisma
// prisma/schema.prisma
model Product {
  id         String   @id @default(uuid())
  name       String
  price      Int
  categoryId String
  active     Boolean  @default(true)
  createdAt  DateTime @default(now())

  category   Category @relation(fields: [categoryId], references: [id])

  // Compound index for common queries
  @@index([categoryId, active])
  @@index([active, createdAt(sort: Desc)])
  // Full-text search (PostgreSQL)
  @@index([name], type: Gin)
}
```
