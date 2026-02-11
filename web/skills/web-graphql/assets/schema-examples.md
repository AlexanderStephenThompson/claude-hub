# Schema Examples

GraphQL schema design examples for Apollo Server + Prisma stack. Referenced from `SKILL.md`.

---

## Schema Organization

```
src/
├── graphql/
│   ├── schema/
│   │   ├── index.ts        # Combines all type defs
│   │   ├── user.graphql    # User types and operations
│   │   ├── product.graphql # Product types and operations
│   │   └── order.graphql   # Order types and operations
│   ├── resolvers/
│   │   ├── index.ts        # Combines all resolvers
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   └── context.ts          # Context type and creation
├── services/               # Business logic
│   ├── user.service.ts
│   └── product.service.ts
└── dataloaders/            # DataLoader definitions
    └── index.ts
```

---

## Type Definitions

```graphql
# ✅ Good - Client-focused types
type Product {
  id: ID!
  name: String!
  description: String
  price: Money!
  images: [Image!]!
  category: Category!
  inStock: Boolean!

  # Computed field - not in database
  formattedPrice: String!
}

type Money {
  amount: Int!       # Cents to avoid float issues
  currency: String!
  formatted: String! # "$19.99"
}

# Input types for mutations
input CreateProductInput {
  name: String!
  description: String
  priceInCents: Int!
  categoryId: ID!
}

input UpdateProductInput {
  name: String
  description: String
  priceInCents: Int
}
```

---

## Query Design

```graphql
type Query {
  # Single item by ID
  product(id: ID!): Product
  user(id: ID!): User

  # Lists with pagination and filtering
  products(
    first: Int
    after: String
    filter: ProductFilter
    orderBy: ProductOrderBy
  ): ProductConnection!

  # Current user (from auth context)
  me: User
}

# Cursor-based pagination
type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ProductEdge {
  node: Product!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Filtering
input ProductFilter {
  categoryId: ID
  minPrice: Int
  maxPrice: Int
  inStock: Boolean
  search: String
}

enum ProductOrderBy {
  NAME_ASC
  NAME_DESC
  PRICE_ASC
  PRICE_DESC
  CREATED_AT_DESC
}
```

---

## Mutation Design

```graphql
type Mutation {
  # Returns the created/updated entity
  createProduct(input: CreateProductInput!): CreateProductPayload!
  updateProduct(id: ID!, input: UpdateProductInput!): UpdateProductPayload!
  deleteProduct(id: ID!): DeleteProductPayload!

  # Action-based naming for non-CRUD
  addToCart(productId: ID!, quantity: Int!): AddToCartPayload!
  checkout(input: CheckoutInput!): CheckoutPayload!
}

# Payload pattern - allows for errors and metadata
type CreateProductPayload {
  product: Product
  errors: [UserError!]!
}

type UserError {
  field: String
  message: String!
  code: ErrorCode!
}

enum ErrorCode {
  NOT_FOUND
  VALIDATION_ERROR
  UNAUTHORIZED
  FORBIDDEN
  CONFLICT
}
```

---

## Full Type File Example

```graphql
# graphql/schema/product.graphql

type Product {
  id: ID!
  name: String!
  description: String
  price: Int!
  formattedPrice: String!
  images: [Image!]!
  category: Category!
  inStock: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

extend type Query {
  product(id: ID!): Product
  products(
    first: Int
    after: String
    filter: ProductFilter
    orderBy: ProductOrderBy
  ): ProductConnection!
}

extend type Mutation {
  createProduct(input: CreateProductInput!): CreateProductPayload!
  updateProduct(id: ID!, input: UpdateProductInput!): UpdateProductPayload!
  deleteProduct(id: ID!): DeleteProductPayload!
}

input ProductFilter {
  categoryId: ID
  minPrice: Int
  maxPrice: Int
  inStock: Boolean
  search: String
}

enum ProductOrderBy {
  NAME_ASC
  NAME_DESC
  PRICE_ASC
  PRICE_DESC
  CREATED_AT_DESC
}

input CreateProductInput {
  name: String!
  description: String
  priceInCents: Int!
  categoryId: ID!
}

input UpdateProductInput {
  name: String
  description: String
  priceInCents: Int
}

type CreateProductPayload {
  product: Product
  errors: [UserError!]!
}

type UpdateProductPayload {
  product: Product
  errors: [UserError!]!
}

type DeleteProductPayload {
  success: Boolean!
  errors: [UserError!]!
}
```
