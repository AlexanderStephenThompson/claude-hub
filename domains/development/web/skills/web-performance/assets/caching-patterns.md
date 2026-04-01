# Caching Patterns

Apollo Client, Redis, CloudFront, and image optimization patterns. Referenced from `SKILL.md`.

---

## Apollo Client Cache Configuration

```typescript
// apollo/client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Merge paginated results
        products: {
          keyArgs: ['filter', 'orderBy'], // Cache separately per filter
          merge(existing, incoming, { args }) {
            if (!args?.after) {
              // First page - replace cache
              return incoming;
            }
            // Subsequent pages - append
            return {
              ...incoming,
              edges: [...(existing?.edges || []), ...incoming.edges],
            };
          },
        },
      },
    },

    Product: {
      fields: {
        // Computed field from cache
        formattedPrice: {
          read(_, { readField }) {
            const price = readField('price');
            return `$${(price / 100).toFixed(2)}`;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  uri: '/graphql',
  cache,
  defaultOptions: {
    watchQuery: {
      // Stale-while-revalidate by default
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});
```

### Fetch Policy Examples

```typescript
// Static data - cache forever
const { data } = useQuery(GET_CATEGORIES, {
  fetchPolicy: 'cache-first',
});

// User data - stale-while-revalidate
const { data } = useQuery(GET_CURRENT_USER, {
  fetchPolicy: 'cache-and-network',
});

// Order status - always fresh
const { data } = useQuery(GET_ORDER_STATUS, {
  fetchPolicy: 'network-only',
  pollInterval: 5000, // Poll every 5s
});
```

### Optimistic Updates

```typescript
const [addToCart] = useMutation(ADD_TO_CART, {
  // Show result immediately
  optimisticResponse: {
    addToCart: {
      __typename: 'CartItem',
      id: `temp-${Date.now()}`,
      productId,
      quantity: 1,
      product: {
        __typename: 'Product',
        id: productId,
        name: product.name,
        price: product.price,
      },
    },
  },

  // Update cache without refetching
  update(cache, { data: { addToCart } }) {
    cache.modify({
      fields: {
        cart(existingItems = []) {
          const newItemRef = cache.writeFragment({
            data: addToCart,
            fragment: CART_ITEM_FRAGMENT,
          });
          return [...existingItems, newItemRef];
        },
        cartTotal(existing = 0) {
          return existing + addToCart.product.price;
        },
      },
    });
  },
});
```

---

## Redis Caching

### Caching Strategy

```typescript
// services/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

interface CacheOptions {
  ttl?: number;  // Seconds
  tags?: string[];
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const { ttl = 3600 } = options; // Default 1 hour
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  },
};
```

### Cache-Aside Pattern

```typescript
// services/product.service.ts
export class ProductService {
  async findById(id: string) {
    const cacheKey = `product:${id}`;

    // Try cache first
    const cached = await cache.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from database
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (product) {
      // Cache for 1 hour
      await cache.set(cacheKey, product, { ttl: 3600 });
    }

    return product;
  }

  async update(id: string, input: UpdateProductInput) {
    const product = await this.prisma.product.update({
      where: { id },
      data: input,
    });

    // Invalidate cache
    await cache.invalidate(`product:${id}`);
    await cache.invalidate('products:*'); // Invalidate list caches

    return product;
  }
}
```

---

## CloudFront & S3 Optimization

### Static Asset Caching

```typescript
// CloudFront cache behaviors (CDK example)
const distribution = new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket),
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  additionalBehaviors: {
    // Immutable assets (hashed filenames)
    '/static/*': {
      origin: new origins.S3Origin(bucket),
      cachePolicy: new cloudfront.CachePolicy(this, 'ImmutableCache', {
        defaultTtl: Duration.days(365),
        maxTtl: Duration.days(365),
        minTtl: Duration.days(365),
      }),
    },
    // API - no caching at CDN
    '/graphql': {
      origin: new origins.HttpOrigin(apiDomain),
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    },
  },
});
```

### Image Optimization

```typescript
// Generate optimized image URLs
function getImageUrl(key: string, options: ImageOptions = {}) {
  const { width, height, quality = 80, format = 'webp' } = options;

  // Use CloudFront image resizing or external service
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  params.set('q', String(quality));
  params.set('fm', format);

  return `${CDN_URL}/${key}?${params.toString()}`;
}

// React component
function ProductImage({ product, size = 'medium' }) {
  const sizes = { small: 150, medium: 300, large: 600 };
  const width = sizes[size];

  return (
    <img
      src={getImageUrl(product.imageKey, { width, format: 'webp' })}
      srcSet={`
        ${getImageUrl(product.imageKey, { width, format: 'webp' })} 1x,
        ${getImageUrl(product.imageKey, { width: width * 2, format: 'webp' })} 2x
      `}
      alt={product.name}
      loading="lazy"
      decoding="async"
      width={width}
      height={width}
    />
  );
}
```
