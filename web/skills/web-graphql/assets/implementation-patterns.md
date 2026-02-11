# Implementation Patterns

Resolver, service, DataLoader, error handling, and auth patterns for Apollo Server + Prisma. Referenced from `SKILL.md`.

---

## Thin Resolvers

```typescript
// ✅ Good - Resolver is thin, delegates to service
const resolvers = {
  Query: {
    product: async (_, { id }, { services }) => {
      return services.product.findById(id);
    },

    products: async (_, { first, after, filter, orderBy }, { services }) => {
      return services.product.findMany({ first, after, filter, orderBy });
    },
  },

  Mutation: {
    createProduct: async (_, { input }, { services, user }) => {
      // Auth check in resolver is OK
      if (!user?.isAdmin) {
        return {
          product: null,
          errors: [{ message: 'Unauthorized', code: 'UNAUTHORIZED' }],
        };
      }

      return services.product.create(input);
    },
  },

  Product: {
    // Field resolvers for computed/related data
    formattedPrice: (product) => {
      return `$${(product.price / 100).toFixed(2)}`;
    },

    category: async (product, _, { loaders }) => {
      return loaders.category.load(product.categoryId);
    },
  },
};
```

---

## Context Setup

```typescript
// graphql/context.ts
import { PrismaClient } from '@prisma/client';
import { createLoaders } from '../dataloaders';
import { createServices } from '../services';

export interface Context {
  prisma: PrismaClient;
  user: User | null;
  loaders: ReturnType<typeof createLoaders>;
  services: ReturnType<typeof createServices>;
}

export async function createContext({ req }): Promise<Context> {
  const prisma = new PrismaClient();
  const user = await getUserFromToken(req.headers.authorization);
  const loaders = createLoaders(prisma);
  const services = createServices(prisma, user);

  return { prisma, user, loaders, services };
}
```

---

## Service Layer (Prisma Integration)

```typescript
// services/product.service.ts
import { PrismaClient, Prisma } from '@prisma/client';

export class ProductService {
  constructor(
    private prisma: PrismaClient,
    private user: User | null
  ) {}

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findMany({ first = 20, after, filter, orderBy }) {
    const where = this.buildWhereClause(filter);
    const order = this.buildOrderByClause(orderBy);

    // Cursor-based pagination with Prisma
    const products = await this.prisma.product.findMany({
      where,
      orderBy: order,
      take: first + 1, // Fetch one extra to check hasNextPage
      ...(after && {
        cursor: { id: after },
        skip: 1, // Skip the cursor itself
      }),
    });

    const hasNextPage = products.length > first;
    const edges = products.slice(0, first).map(product => ({
      node: product,
      cursor: product.id,
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount: await this.prisma.product.count({ where }),
    };
  }

  async create(input: CreateProductInput) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.priceInCents,
          categoryId: input.categoryId,
        },
      });

      return { product, errors: [] };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            product: null,
            errors: [{
              field: 'name',
              message: 'Product with this name already exists',
              code: 'CONFLICT',
            }],
          };
        }
      }
      throw error;
    }
  }

  private buildWhereClause(filter?: ProductFilter): Prisma.ProductWhereInput {
    if (!filter) return {};

    return {
      ...(filter.categoryId && { categoryId: filter.categoryId }),
      ...(filter.inStock !== undefined && { stock: filter.inStock ? { gt: 0 } : 0 }),
      ...(filter.minPrice && { price: { gte: filter.minPrice } }),
      ...(filter.maxPrice && { price: { lte: filter.maxPrice } }),
      ...(filter.search && {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  private buildOrderByClause(orderBy?: ProductOrderBy): Prisma.ProductOrderByWithRelationInput {
    switch (orderBy) {
      case 'NAME_ASC': return { name: 'asc' };
      case 'NAME_DESC': return { name: 'desc' };
      case 'PRICE_ASC': return { price: 'asc' };
      case 'PRICE_DESC': return { price: 'desc' };
      case 'CREATED_AT_DESC':
      default: return { createdAt: 'desc' };
    }
  }
}
```

---

## DataLoader for N+1 Prevention

### The Problem

```typescript
// ❌ Without DataLoader - N+1 queries
// Query: products { category { name } }
// Executes: 1 query for products + N queries for categories

Product: {
  category: async (product, _, { prisma }) => {
    return prisma.category.findUnique({
      where: { id: product.categoryId },
    });
  },
}
```

### The Solution

```typescript
// dataloaders/index.ts
import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient) {
  return {
    category: new DataLoader(async (categoryIds: string[]) => {
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      // Map results to match input order
      const categoryMap = new Map(categories.map(c => [c.id, c]));
      return categoryIds.map(id => categoryMap.get(id) ?? null);
    }),

    user: new DataLoader(async (userIds: string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
      });

      const userMap = new Map(users.map(u => [u.id, u]));
      return userIds.map(id => userMap.get(id) ?? null);
    }),
  };
}

// In resolver - now batched!
Product: {
  category: async (product, _, { loaders }) => {
    return loaders.category.load(product.categoryId);
  },
}
```

---

## Error Handling

### Structured Errors

```typescript
// ✅ Good - Explicit error handling
async createOrder(input: CreateOrderInput) {
  const errors: UserError[] = [];

  // Validation
  if (input.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Order must contain at least one item',
      code: 'VALIDATION_ERROR',
    });
  }

  // Check stock
  for (const item of input.items) {
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      errors.push({
        field: 'items',
        message: `Product ${item.productId} not found`,
        code: 'NOT_FOUND',
      });
    } else if (product.stock < item.quantity) {
      errors.push({
        field: 'items',
        message: `Insufficient stock for ${product.name}`,
        code: 'VALIDATION_ERROR',
      });
    }
  }

  if (errors.length > 0) {
    return { order: null, errors };
  }

  // Create order...
  const order = await this.prisma.order.create({ ... });
  return { order, errors: [] };
}
```

### Authentication Errors

```typescript
// Use Apollo's built-in errors for auth
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const resolvers = {
  Mutation: {
    updateProduct: async (_, { id, input }, { user, services }) => {
      if (!user) {
        throw new AuthenticationError('Must be logged in');
      }

      if (!user.isAdmin) {
        throw new ForbiddenError('Admin access required');
      }

      return services.product.update(id, input);
    },
  },
};
```

---

## Authentication with Cognito

### Token Validation

```typescript
// middleware/auth.ts
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

export async function getUserFromToken(authHeader?: string) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifier.verify(token);

    // Fetch full user from database
    return prisma.user.findUnique({
      where: { cognitoSub: payload.sub },
    });
  } catch (error) {
    return null;
  }
}
```
