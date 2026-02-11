---
name: web-graphql
description: GraphQL patterns for Apollo Server + Express + Prisma stack
user-invocable: false
---

# Web GraphQL Skill

**Version:** 1.0
**Stack:** GraphQL + Apollo Server + Express + Prisma

GraphQL is deceptively easy to start and deceptively hard to maintain. Fat resolvers become untestable. Database-shaped schemas lock you into implementation details. No DataLoader means N+1 queries that silently degrade as data grows. The API works in development and collapses under real traffic — not because of scale, but because of patterns that don't survive it.

Schema-first design, thin resolvers, and structured errors prevent these problems before they compound.

---

## Core Principles

1. **Schema-First Thinking** — Design the schema for client needs, not database shape.
2. **Thin Resolvers** — Resolvers orchestrate; business logic lives in services.
3. **Type Safety End-to-End** — Prisma types flow through to GraphQL.
4. **N+1 Prevention** — Use DataLoader for batching.
5. **Explicit Errors** — Structured error responses, not vague messages.

---

## Schema Design

Design types for client needs, not database shape. Use `Money` types (cents, not floats), input types for mutations, and the payload pattern for structured error responses.

**Key patterns:**
- **Cursor-based pagination** — `ProductConnection` with edges, pageInfo, totalCount
- **Filtering + ordering** — Input types (`ProductFilter`) and enums (`ProductOrderBy`)
- **Payload pattern** — Every mutation returns `{ entity, errors: [UserError!]! }` instead of throwing

See `assets/schema-examples.md` for complete type definitions, query design, mutation design, and full type file examples.

---

## Resolver Patterns

Resolvers are thin orchestrators. Auth checks are OK in resolvers; business logic goes in services. Use field resolvers for computed/related data, always through DataLoader.

See `assets/implementation-patterns.md` for thin resolver, context setup, and field resolver examples.

---

## Prisma Integration

Service layer wraps Prisma. Services handle:
- Cursor-based pagination (fetch N+1, check hasNextPage)
- Where clause building from filters
- OrderBy clause mapping from enums
- Structured error handling (catch Prisma errors, return UserError)

See `assets/implementation-patterns.md` for complete ProductService with pagination, filtering, and error handling.

---

## DataLoader for N+1 Prevention

Without DataLoader: `products { category { name } }` = 1 query + N queries. With DataLoader: 1 query + 1 batched query.

Create loaders per request in context. Map results back to input order. Use `loaders.entity.load(id)` in field resolvers.

See `assets/implementation-patterns.md` for DataLoader setup and usage.

---

## Error Handling

Two error strategies:
- **Business errors** → Return in payload (`{ order: null, errors: [{ code: 'VALIDATION_ERROR' }] }`)
- **Auth errors** → Throw Apollo errors (`AuthenticationError`, `ForbiddenError`)

See `assets/implementation-patterns.md` for structured error handling and auth error examples.

---

## Authentication with Cognito

Validate JWT in context creation. Return `null` user for invalid/missing tokens (don't throw). Let resolvers decide auth requirements.

See `assets/implementation-patterns.md` for Cognito token validation.

---

## File Structure

```
src/
├── graphql/
│   ├── schema/       # .graphql type defs per domain
│   ├── resolvers/    # Thin resolver files per domain
│   └── context.ts    # Context type and creation
├── services/         # Business logic (one per domain)
└── dataloaders/      # DataLoader definitions
```

See `assets/schema-examples.md` for detailed schema organization and a full type file example.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Fat resolvers** | Hard to test, mixed concerns | Extract to services |
| **No DataLoader** | N+1 queries kill performance | Use DataLoader for relations |
| **Database-shaped schema** | Exposes internals, hard to evolve | Design for client needs |
| **Generic error messages** | Clients can't handle errors | Structured error payloads |
| **No pagination** | Memory/performance issues | Cursor-based pagination |
| **Returning null for errors** | Silent failures | Return error in payload |
| **Auth in every resolver** | Repetitive, error-prone | Middleware or directive |
| **Prisma in resolvers** | Tight coupling | Service layer abstraction |

---

## Checklist

### Schema
- [ ] Types designed for client needs
- [ ] Cursor-based pagination for lists
- [ ] Input types for mutations
- [ ] Payload pattern with errors
- [ ] Enum for error codes

### Resolvers
- [ ] Thin resolvers, logic in services
- [ ] DataLoader for all relations
- [ ] Proper error handling
- [ ] Auth checks where needed

### Performance
- [ ] DataLoader prevents N+1
- [ ] Pagination limits enforced
- [ ] Complex queries optimized
- [ ] Indices on filtered fields

### Security
- [ ] Auth tokens validated
- [ ] Authorization on sensitive operations
- [ ] Input validation in services
- [ ] Rate limiting configured

---

## When to Consider Alternatives

| Situation | Consider |
|-----------|----------|
| Simple CRUD, no relations | REST might be simpler |
| Real-time requirements | GraphQL Subscriptions |
| Public API with caching needs | REST with HTTP caching |
| File uploads | Separate REST endpoint or signed URLs |

---

## References

- `assets/schema-examples.md` — Type definitions, query/mutation design, full type file
- `assets/implementation-patterns.md` — Resolvers, services, DataLoader, errors, auth
