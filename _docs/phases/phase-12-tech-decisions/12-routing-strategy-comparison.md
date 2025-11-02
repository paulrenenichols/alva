# Routing Strategy Comparison: Subdomain vs Path-Based

**@fileoverview** Detailed comparison of routing strategies for Alva's 4 services (web, api, auth, admin) with ALB configuration recommendations.

---

## Quick Decision Matrix

| Criteria | Subdomain-Based | Path-Based |
|----------|----------------|------------|
| **Complexity** | ⚠️ More DNS/certs | ✅ Simpler setup |
| **Scalability** | ✅ Independent scaling | ⚠️ Tied to web service |
| **CORS Configuration** | ✅ Simple | ⚠️ More complex |
| **Service Isolation** | ✅ Complete | ⚠️ Shared domain |
| **SSL Certificates** | ⚠️ Multiple/wildcard | ✅ Single cert |
| **Next.js Routing** | ✅ No conflicts | ⚠️ Potential conflicts |
| **Cost** | Same | Same |
| **Best For** | Microservices | Monolithic apps |

---

## Architecture Overview

### Current Services

1. **web** (Next.js) - Port 3000 - User-facing app
2. **api** (Fastify) - Port 3001 - Business logic  
3. **auth** (Fastify) - Port 3002 - Authentication
4. **admin** (Next.js) - Port 3003 - Admin portal

### Service Communication

- **web** → **api** (via `NEXT_PUBLIC_API_URL`)
- **web** → **auth** (via `NEXT_PUBLIC_AUTH_URL`)
- **admin** → **api** (via `NEXT_PUBLIC_API_URL`)
- **admin** → **auth** (via `NEXT_PUBLIC_AUTH_URL`)
- **api** → **auth** (for token validation, if needed)

---

## Option 1: Subdomain-Based Routing ⭐ **RECOMMENDED**

### Architecture

```
staging.alva.app         → web service (Next.js)
api-staging.alva.app     → api service (Fastify)
auth-staging.alva.app    → auth service (Fastify)
admin-staging.alva.app   → admin service (Next.js)
```

### ALB Configuration

**Target Groups:**
- `alva-web-tg` → ECS service: web (port 3000)
- `alva-api-tg` → ECS service: api (port 3001)
- `alva-auth-tg` → ECS service: auth (port 3002)
- `alva-admin-tg` → ECS service: admin (port 3003)

**Listener Rules:**
```typescript
// CDK Example
listener.addTargetGroups('WebRule', {
  conditions: [ListenerCondition.hostHeaders(['staging.alva.app'])],
  targetGroups: [webTargetGroup],
  priority: 1,
});

listener.addTargetGroups('ApiRule', {
  conditions: [ListenerCondition.hostHeaders(['api-staging.alva.app'])],
  targetGroups: [apiTargetGroup],
  priority: 2,
});

listener.addTargetGroups('AuthRule', {
  conditions: [ListenerCondition.hostHeaders(['auth-staging.alva.app'])],
  targetGroups: [authTargetGroup],
  priority: 3,
});

listener.addTargetGroups('AdminRule', {
  conditions: [ListenerCondition.hostHeaders(['admin-staging.alva.app'])],
  targetGroups: [adminTargetGroup],
  priority: 4,
});
```

### DNS Configuration

**Route 53 Records:**
```
staging.alva.app        A → ALB (alias)
api-staging.alva.app    A → ALB (alias)
auth-staging.alva.app   A → ALB (alias)
admin-staging.alva.app  A → ALB (alias)
```

### SSL Certificate

**Option A: Wildcard Certificate** ⭐ **RECOMMENDED**
```
Certificate: *.staging.alva.app
Covers: staging.alva.app, api-staging.alva.app, auth-staging.alva.app, admin-staging.alva.app
Cost: $0 (ACM)
```

**Option B: Multiple Certificates**
```
4 separate certificates (one per subdomain)
More management overhead
```

### Pros ✅

**Service Isolation**
- Each service has its own domain
- Independent scaling per service
- Clear separation of concerns
- Matches microservices architecture

**CORS Configuration**
- Simple: `api-staging.alva.app` allows `staging.alva.app`
- No path-based CORS complexity
- Clear origin matching

**Next.js Routing**
- No conflicts with Next.js routes
- `/api/*` routes don't interfere with API service
- Clean separation

**Service Communication**
- Clear URLs: `https://api-staging.alva.app`
- Easy to configure in environment variables
- No path rewriting needed

**Independent Deployment**
- Can update/deploy services independently
- Each service has its own SSL cert (if using individual certs)
- Clear service boundaries

**Monitoring & Logging**
- Easy to filter logs by subdomain
- Per-service metrics
- Clear CloudWatch dashboards

**Security**
- Can apply WAF rules per subdomain
- Different security policies per service
- Admin subdomain can have extra restrictions

### Cons ❌

**DNS Configuration**
- Need 4 DNS records (still simple with Route 53)
- More records to manage
- Slightly more complex than single domain

**SSL Certificate**
- Need wildcard cert or multiple certs
- Wildcard cert requires DNS validation (all subdomains)
- Slightly more setup complexity

**Initial Setup**
- More configuration upfront
- More ALB listener rules (but still simple)

### Environment Variables

**Web Service:**
```env
NEXT_PUBLIC_API_URL=https://api-staging.alva.app
NEXT_PUBLIC_AUTH_URL=https://auth-staging.alva.app
```

**Admin Service:**
```env
NEXT_PUBLIC_API_URL=https://api-staging.alva.app
NEXT_PUBLIC_AUTH_URL=https://auth-staging.alva.app
```

**API Service:**
```env
CORS_ORIGINS=https://staging.alva.app,https://admin-staging.alva.app
```

**Auth Service:**
```env
CORS_ORIGINS=https://staging.alva.app,https://admin-staging.alva.app
WEB_URL=https://staging.alva.app
```

---

## Option 2: Path-Based Routing

### Architecture

```
staging.alva.app/            → web service (Next.js)
staging.alva.app/api/*        → api service (Fastify)
staging.alva.app/auth/*       → auth service (Fastify)
staging.alva.app/admin/*      → admin service (Next.js)
```

### ALB Configuration

**Target Groups:** (same as subdomain approach)

**Listener Rules:**
```typescript
// Default rule: web service
listener.addTargetGroups('WebDefault', {
  targetGroups: [webTargetGroup],
  priority: 100, // Default/low priority
});

// Path-based rules
listener.addTargetGroups('ApiRule', {
  conditions: [
    ListenerCondition.pathPatterns(['/api/*']),
  ],
  targetGroups: [apiTargetGroup],
  priority: 1,
});

listener.addTargetGroups('AuthRule', {
  conditions: [
    ListenerCondition.pathPatterns(['/auth/*']),
  ],
  targetGroups: [authTargetGroup],
  priority: 2,
});

listener.addTargetGroups('AdminRule', {
  conditions: [
    ListenerCondition.pathPatterns(['/admin/*']),
  ],
  targetGroups: [adminTargetGroup],
  priority: 3,
});
```

**Important**: Need path rewriting to remove `/api`, `/auth`, `/admin` prefixes!

```typescript
// ALB doesn't do path rewriting natively
// Need to configure target groups with different paths
// OR handle path rewriting in Next.js middleware (complex!)
```

### DNS Configuration

**Route 53 Record:**
```
staging.alva.app    A → ALB (alias)
```

**Simpler**: Only one DNS record!

### SSL Certificate

```
Certificate: staging.alva.app
Single certificate
Cost: $0 (ACM)
```

**Simpler**: One certificate for everything!

### Path Rewriting Challenge ⚠️

**The Problem:**
- User requests: `staging.alva.app/api/users`
- ALB routes to: `api` service
- API service expects: `/users` (not `/api/users`)
- **ALB doesn't natively rewrite paths!**

**Solutions:**

**Option A: Handle in Service**
```typescript
// In Fastify API service
app.addHook('onRequest', async (request, reply) => {
  // Remove /api prefix if present
  if (request.url.startsWith('/api/')) {
    request.url = request.url.replace('/api/', '/');
  }
});
```

**Option B: Next.js Rewrites (Complex)**
```typescript
// next.config.js - Not recommended!
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-internal:3001/:path*',
      },
    ];
  },
};
```
This defeats the purpose (Next.js becomes a proxy).

**Option C: Use ALB Target Group with Path**
- Configure target group to send requests to `/` instead of `/api/*`
- But ALB listener rule still matches on `/api/*`
- Need to handle prefix removal in service

### Pros ✅

**Simpler Setup**
- One DNS record
- One SSL certificate
- Less DNS management

**Cost**
- Same cost (ALB pricing doesn't change)
- Slightly simpler certificate management

**Familiar Pattern**
- Common in monolithic applications
- Some teams prefer this pattern

### Cons ❌

**Path Rewriting Complexity**
- ALB doesn't natively rewrite paths
- Need to handle prefix removal in services
- More error-prone
- Additional code complexity

**CORS Configuration**
- More complex origin matching
- Need to handle paths in CORS config
- Potential CORS issues

**Next.js Route Conflicts**
- Next.js might have routes like `/api/health` (internal)
- Could conflict with API service routes
- Need careful route planning

**Service Coupling**
- All services share same domain
- Harder to scale independently
- Less clear service boundaries

**Service Communication**
- URLs: `https://staging.alva.app/api/...`
- Less clear which service you're calling
- Paths can be confusing

**Monitoring**
- Harder to filter logs by service
- All traffic shows same domain
- Less granular metrics

**Security**
- Harder to apply per-service WAF rules
- All services share same domain security
- Admin routes harder to restrict

**Admin Portal Access**
- Admin at `/admin/*` is less secure
- Can't easily restrict to separate domain
- Path-based restrictions are trickier

---

## Detailed Comparison

### 1. Setup Complexity

**Subdomain:**
- 4 DNS records (5 minutes)
- Wildcard SSL cert (10 minutes with DNS validation)
- 4 ALB listener rules (15 minutes)
- **Total: ~30 minutes**

**Path-based:**
- 1 DNS record (1 minute)
- Single SSL cert (5 minutes)
- 4 ALB listener rules + path rewriting (30+ minutes)
- **Total: ~35-45 minutes**

**Verdict**: Subdomain is actually simpler (no path rewriting)!

### 2. Service Communication

**Subdomain:**
```typescript
// Clean, clear URLs
const apiUrl = 'https://api-staging.alva.app';
const authUrl = 'https://auth-staging.alva.app';

// Easy to understand
fetch(`${apiUrl}/plans`);
```

**Path-based:**
```typescript
// Less clear, need to remember paths
const baseUrl = 'https://staging.alva.app';
fetch(`${baseUrl}/api/plans`);

// What if Next.js has /api routes? Confusion!
```

**Verdict**: Subdomain is clearer.

### 3. CORS Configuration

**Subdomain:**
```typescript
// Simple, explicit origins
CORS_ORIGINS: [
  'https://staging.alva.app',
  'https://admin-staging.alva.app'
]
```

**Path-based:**
```typescript
// Same origin, need path-based checks
CORS_ORIGINS: ['https://staging.alva.app']
// But need to allow /api, /auth paths from web
// More complex logic
```

**Verdict**: Subdomain is simpler.

### 4. Scaling & Deployment

**Subdomain:**
- Each service scales independently
- Can update API without affecting web
- Clear service boundaries

**Path-based:**
- Services still scale independently (ECS)
- But harder to reason about
- Shared domain makes it feel coupled

**Verdict**: Subdomain is better for microservices.

### 5. Monitoring & Debugging

**Subdomain:**
```bash
# Easy to filter logs
aws logs filter --log-group-name alva-api --filter-pattern "api-staging.alva.app"

# Clear service metrics
CloudWatch dashboard per subdomain
```

**Path-based:**
```bash
# Need path-based filtering
aws logs filter --log-group-name alva-web --filter-pattern "/api/*"

# Less clear metrics
All services show same domain
```

**Verdict**: Subdomain is better for observability.

### 6. Security

**Subdomain:**
- Can restrict admin subdomain via WAF
- Different security policies per service
- Easy to block admin from public

**Path-based:**
- Harder to restrict paths
- Shared domain security
- Admin path is less secure

**Verdict**: Subdomain is more secure.

---

## Real-World Examples

### Companies Using Subdomain Approach

- **Netflix**: `api.netflix.com`, `auth.netflix.com`
- **Stripe**: `api.stripe.com`, `connect.stripe.com`
- **GitHub**: `api.github.com`, `gist.github.com`
- **Vercel**: `api.vercel.com`, `vercel.com` (web)

**Why**: Clear service boundaries, easier scaling.

### Companies Using Path-Based

- **Monorepo apps**: Single domain, path routing
- **Legacy applications**: Pre-microservices architecture
- **Simple apps**: Single service applications

**Why**: Simpler for monolithic apps.

---

## Cost Comparison

| Item | Subdomain | Path-Based |
|------|-----------|------------|
| ALB | $16/month | $16/month |
| DNS Records | $0 (Route 53) | $0 (Route 53) |
| SSL Certificate | $0 (ACM wildcard) | $0 (ACM single) |
| **Total** | **$16/month** | **$16/month** |

**Same cost!** No difference.

---

## CDK Implementation Examples

### Subdomain-Based (CDK)

```typescript
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';

// Create ALB
const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
  vpc,
  internetFacing: true,
});

// Create SSL certificate (wildcard)
const certificate = new certificatemanager.Certificate(this, 'Certificate', {
  domainName: '*.staging.alva.app',
  validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
});

// HTTPS listener
const listener = alb.addListener('HttpsListener', {
  port: 443,
  certificates: [certificate],
});

// Target groups
const webTargetGroup = new elbv2.ApplicationTargetGroup(this, 'WebTargetGroup', {
  port: 3000,
  targetType: elbv2.TargetType.IP,
  protocol: elbv2.ApplicationProtocol.HTTP,
});

// Listener rules
listener.addTargetGroups('WebRule', {
  conditions: [
    elbv2.ListenerCondition.hostHeaders(['staging.alva.app']),
  ],
  targetGroups: [webTargetGroup],
  priority: 1,
});

listener.addTargetGroups('ApiRule', {
  conditions: [
    elbv2.ListenerCondition.hostHeaders(['api-staging.alva.app']),
  ],
  targetGroups: [apiTargetGroup],
  priority: 2,
});

// DNS records
new route53.ARecord(this, 'WebRecord', {
  zone: hostedZone,
  recordName: 'staging',
  target: route53.RecordTarget.fromAlias(
    new route53_targets.LoadBalancerTarget(alb)
  ),
});

new route53.ARecord(this, 'ApiRecord', {
  zone: hostedZone,
  recordName: 'api-staging',
  target: route53.RecordTarget.fromAlias(
    new route53_targets.LoadBalancerTarget(alb)
  ),
});
```

**Lines of Code**: ~80-100 lines (clear, explicit)

### Path-Based (CDK)

```typescript
// Default rule (web)
listener.addTargetGroups('WebDefault', {
  targetGroups: [webTargetGroup],
  priority: 100, // Default
});

// Path-based rules (need path rewriting!)
listener.addTargetGroups('ApiRule', {
  conditions: [
    elbv2.ListenerCondition.pathPatterns(['/api/*']),
  ],
  targetGroups: [apiTargetGroup],
  priority: 1,
});

// Problem: ALB doesn't rewrite paths
// Request: /api/users → API service receives: /api/users
// Need to handle prefix removal in service!
```

**Lines of Code**: ~60-70 lines (but need path rewriting logic)

**Complexity**: Higher (path rewriting in services)

---

## Recommendation

### ⭐ **Subdomain-Based Routing** (Strongly Recommended)

**Primary Reasons:**

1. **Matches Microservices Architecture**
   - Your app has 4 independent services
   - Subdomains reflect this architecture
   - Clear service boundaries

2. **No Path Rewriting**
   - ALB routes directly to services
   - Services receive clean paths
   - No prefix removal logic needed

3. **Better CORS Configuration**
   - Explicit origins
   - Simple origin matching
   - No path-based complexity

4. **Clearer URLs**
   - `api-staging.alva.app` is obvious
   - `staging.alva.app/api` could be confusing

5. **Better Security**
   - Can restrict admin subdomain separately
   - Per-service WAF rules
   - Clear security boundaries

6. **Better Monitoring**
   - Filter logs by subdomain
   - Per-service metrics
   - Clear CloudWatch dashboards

7. **Industry Standard**
   - Most microservices use subdomains
   - Proven pattern
   - Easier to hire developers familiar with it

**Trade-off**: Slightly more DNS/SSL setup, but much simpler service configuration.

---

## Decision Framework

Answer these questions:

1. **Do you have 4 separate services?**
   - Yes → **Subdomain** (matches architecture)

2. **Do you want to avoid path rewriting?**
   - Yes → **Subdomain** (no rewriting needed)

3. **Is simplicity more important than architecture clarity?**
   - Yes → Path-based (but you lose clarity)
   - No → **Subdomain**

4. **Do you want the cleanest CORS configuration?**
   - Yes → **Subdomain**

5. **Do you want independent service scaling to be obvious?**
   - Yes → **Subdomain**

6. **Do you want the admin portal on a separate domain?**
   - Yes → **Subdomain** (better security)

---

## Implementation Plan

### If Choosing Subdomain:

1. **Create wildcard SSL certificate** in ACM
2. **Create 4 DNS records** in Route 53
3. **Configure ALB listener rules** (4 rules)
4. **Update environment variables** in services
5. **Configure CORS** with explicit origins

**Estimated Time**: 30-45 minutes

### If Choosing Path-Based:

1. **Create single SSL certificate** in ACM
2. **Create 1 DNS record** in Route 53
3. **Configure ALB listener rules** (4 rules + default)
4. **Implement path rewriting** in services
5. **Update environment variables** in services
6. **Configure CORS** with path-aware logic

**Estimated Time**: 45-60 minutes (more due to path rewriting)

---

## Final Recommendation for Alva

### ⭐ **Subdomain-Based Routing**

**Rationale:**
- Matches your microservices architecture
- No path rewriting complexity
- Better security for admin portal
- Clearer service communication
- Industry-standard pattern
- Easier to maintain and scale

**Implementation:**
- Wildcard certificate: `*.staging.alva.app`
- 4 DNS records (one per subdomain)
- 4 ALB listener rules (host header matching)
- Clean environment variables

---

Would you like me to:
1. Create the CDK code for subdomain-based routing?
2. Show the path-based implementation (if you prefer it)?
3. Move on to the next decision (Admin Portal Access)?

