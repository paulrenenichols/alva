# Domain Registration & DNS Options for Alva Staging

**@fileoverview** Options for domain registration and DNS management for Alva's staging environment, including Route 53 limitations and alternatives.

---

## Route 53 Domain Registration Limitations

### What Route 53 Supports

✅ **DNS Hosting**: Route 53 can host DNS for **any domain** (including .app)  
❌ **Domain Registration**: Route 53 has **limited TLD support** for domain registration

**Route 53 Supports Registration For:**
- `.com`, `.net`, `.org`
- `.io`, `.co`, `.dev`
- `.cloud`, `.tech`, `.store`
- Many others, but **NOT `.app`** for registration

**However**: You can register `.app` elsewhere and use Route 53 for DNS!

---

## Options for Domain & DNS

### Option 1: Route 53 DNS + External Domain Registration ⭐ **RECOMMENDED**

**Domain Registration**: External registrar (Google Domains, Namecheap, etc.)  
**DNS Hosting**: Route 53 (AWS-native, best for ALB integration)

#### Steps:

1. **Register domain** at external registrar:
   - Google Domains (now Squarespace): `alva.app`
   - Namecheap: `alva.app`
   - Cloudflare: `alva.app`
   - GoDaddy: `alva.app`

2. **Get Route 53 Hosted Zone**:
   ```bash
   aws route53 create-hosted-zone \
     --name alva.app \
     --caller-reference $(date +%s)
   ```

3. **Update nameservers** at domain registrar:
   - Copy nameservers from Route 53 hosted zone
   - Update at domain registrar (takes 24-48 hours to propagate)

4. **Create DNS records** in Route 53:
   ```
   staging.alva.app         → ALB
   api-staging.alva.app     → ALB
   auth-staging.alva.app    → ALB
   admin-staging.alva.app   → ALB
   ```

#### Pros ✅

- **Route 53 integration**: Seamless ALB alias records
- **AWS-native**: All in AWS console
- **Best for ALB**: Route 53 alias records are free and fast
- **Flexible**: Register domain anywhere (best price, features)

#### Cons ❌

- **Two-step setup**: Register + DNS setup
- **Propagation delay**: 24-48 hours for nameserver changes
- **Cost**: Route 53 hosted zone = $0.50/month per zone

#### Cost

- Domain registration: ~$15-20/year (`.app` domains)
- Route 53 hosted zone: $0.50/month = $6/year
- **Total**: ~$21-26/year**

---

### Option 2: Cloudflare (Domain + DNS) 

**Domain Registration**: Cloudflare Registrar  
**DNS Hosting**: Cloudflare DNS

#### Pros ✅

- **Free DNS**: No hosted zone costs
- **Fast CDN**: Built-in Cloudflare CDN (optional)
- **DDoS Protection**: Included
- **Simple**: All in one place
- **Cheap domains**: At-cost pricing (no markup)

#### Cons ❌

- **ALB Integration**: Need to use CNAME (not alias), slightly more complex
- **Less AWS-native**: Not in AWS console
- **Cloudflare account**: Additional service to manage

#### ALB Integration

```typescript
// Cloudflare DNS (CNAME record)
api-staging.alva.app  CNAME  → your-alb-123456789.us-east-1.elb.amazonaws.com
```

**Note**: Cloudflare CNAME works fine, just not as "native" as Route 53 alias records.

---

### Option 3: Temporary Domain for Staging

**Use a subdomain of a domain you already own**, or:

**Option A: Use AWS-assigned ALB DNS name**
- No domain needed initially
- Test with ALB DNS: `your-alb-123456789.us-east-1.elb.amazonaws.com`
- Add domain later

**Option B: Use a free/test domain**
- `.dev` domains: ~$10-15/year
- `.test` or `.local`: Not publicly routable

**Option C: Use AWS Certificate Manager Public Certificate**
- Can request certificate with ALB DNS name
- Test SSL/HTTPS without domain
- Add domain later when ready

---

## Recommended Approach

### For Staging: Register `.app` Domain Externally + Route 53 DNS

**Step 1: Register Domain**

**Best Options for `.app` Registration:**

1. **Google Domains (now Squarespace)**: ~$20/year
   - Simple interface
   - Good support
   - Easy nameserver updates

2. **Namecheap**: ~$18-25/year
   - Reliable
   - Good pricing
   - Easy to use

3. **Cloudflare Registrar**: At-cost (~$15-20/year)
   - No markup
   - Free DNS included
   - Best pricing

**Recommendation**: **Cloudflare Registrar** (best pricing) or **Namecheap** (reliable, simple)

**Step 2: Create Route 53 Hosted Zone**

```typescript
// CDK Example
import * as route53 from 'aws-cdk-lib/aws-route53';

const hostedZone = new route53.HostedZone(this, 'HostedZone', {
  zoneName: 'alva.app',
});

// Or use existing hosted zone
const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
  domainName: 'alva.app',
});
```

**Step 3: Update Nameservers at Registrar**

After creating Route 53 hosted zone:
- Get nameservers: `aws route53 get-hosted-zone --id <zone-id>`
- Update at domain registrar (Cloudflare/Namecheap/etc.)
- Wait 24-48 hours for propagation

**Step 4: Create DNS Records in Route 53**

```typescript
// CDK Example
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets';

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

new route53.ARecord(this, 'AuthRecord', {
  zone: hostedZone,
  recordName: 'auth-staging',
  target: route53.RecordTarget.fromAlias(
    new route53_targets.LoadBalancerTarget(alb)
  ),
});

new route53.ARecord(this, 'AdminRecord', {
  zone: hostedZone,
  recordName: 'admin-staging',
  target: route53.RecordTarget.fromAlias(
    new route53_targets.LoadBalancerTarget(alb)
  ),
});
```

---

## Alternative Domain Options

### If `.app` is too expensive or unavailable:

**Option 1: `.dev` Domain**
- Route 53 registration: ✅ Supported
- Cost: ~$10-15/year
- Good for development/staging
- Requires HTTPS (HSTS preload)

**Option 2: `.io` Domain**
- Route 53 registration: ✅ Supported
- Cost: ~$30-40/year
- Popular for tech companies
- Good brand recognition

**Option 3: `.cloud` Domain**
- Route 53 registration: ✅ Supported
- Cost: ~$15-25/year
- Tech-friendly
- Available

**Option 4: Standard TLDs**
- `.com`: Route 53 supported, ~$12-15/year
- `.net`: Route 53 supported, ~$12-15/year
- Most common, highest trust

---

## Implementation Without Domain (Temporary)

### Use ALB DNS Name Initially

You can deploy and test without a domain:

```typescript
// ALB will have DNS name like:
// alva-staging-123456789.us-east-1.elb.amazonaws.com

// Access services directly:
https://alva-staging-123456789.us-east-1.elb.amazonaws.com  → web (default)
```

**Environment Variables (temporary):**
```env
NEXT_PUBLIC_API_URL=https://alva-staging-123456789.us-east-1.elb.amazonaws.com
NEXT_PUBLIC_AUTH_URL=https://alva-staging-123456789.us-east-1.elb.amazonaws.com
```

**Limitations:**
- Ugly URLs
- SSL certificate needs wildcard or SAN cert
- Can't use Route 53 alias records (need CNAME to ALB DNS)
- Not production-ready

**When to add domain:**
- Before production
- When you want clean URLs
- When you need proper SSL certificates

---

## SSL Certificate Strategy

### With Domain (Route 53)

**Option A: Wildcard Certificate** ⭐ **RECOMMENDED**
```
Certificate: *.staging.alva.app
Covers: staging.alva.app, api-staging.alva.app, auth-staging.alva.app, admin-staging.alva.app
Validation: DNS (automatic with Route 53)
Cost: Free (ACM)
```

**CDK Example:**
```typescript
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';

const certificate = new certificatemanager.Certificate(this, 'Certificate', {
  domainName: '*.staging.alva.app',
  validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
  subjectAlternativeNames: ['staging.alva.app'], // Include base domain too
});
```

**Option B: Multiple Certificates**
- One per subdomain
- More management overhead
- Not recommended

### Without Domain (Temporary)

**Use ALB DNS name in certificate:**
- Request ACM certificate with ALB DNS name
- Or use self-signed (not recommended)
- Or skip HTTPS initially (testing only)

---

## Cost Breakdown

### Option 1: External Registrar + Route 53 DNS

| Item | Cost |
|------|------|
| `.app` domain (external) | ~$20/year |
| Route 53 hosted zone | $0.50/month = $6/year |
| **Total** | **~$26/year** |

### Option 2: Cloudflare (Domain + DNS)

| Item | Cost |
|------|------|
| `.app` domain (Cloudflare) | ~$15-20/year |
| Cloudflare DNS | $0 (free) |
| **Total** | **~$15-20/year** |

**Verdict**: Cloudflare is cheaper, but Route 53 has better AWS integration.

---

## Recommendation for Alva

### Phase 1: Deploy Without Domain (Now)

1. **Deploy infrastructure** with ALB DNS name
2. **Test services** using ALB DNS URLs
3. **Validate everything works** before adding domain

**Benefits:**
- Deploy immediately
- Test functionality
- Add domain when ready
- No pressure to choose domain immediately

### Phase 2: Register Domain + Add DNS (Before Production)

1. **Choose domain**: `.app` (external registrar) or `.dev` (Route 53)
2. **Register domain**: Cloudflare Registrar or Namecheap
3. **Create Route 53 hosted zone**
4. **Update nameservers**
5. **Create DNS records** (subdomain-based)
6. **Update SSL certificate** (wildcard)
7. **Update environment variables**

---

## Step-by-Step Guide

### Registering `.app` Domain

**Option A: Cloudflare Registrar** (Recommended)

1. Go to Cloudflare → Domain Registration
2. Search for `alva.app`
3. Add to cart and checkout (~$15-20/year)
4. Domain registered instantly

**Option B: Namecheap**

1. Go to Namecheap.com
2. Search for `alva.app`
3. Add to cart and checkout (~$18-25/year)
4. Domain registered instantly

### Setting Up Route 53 DNS

**After domain registration:**

```bash
# 1. Create hosted zone in Route 53
aws route53 create-hosted-zone \
  --name alva.app \
  --caller-reference staging-$(date +%s)

# 2. Get nameservers
aws route53 get-hosted-zone --id <zone-id> | jq '.DelegationSet.NameServers'

# 3. Update nameservers at registrar (Cloudflare/Namecheap)
# Copy the 4 nameservers from Route 53
# Paste into registrar's nameserver settings

# 4. Wait 24-48 hours for propagation
```

**CDK will create DNS records automatically when you deploy.**

---

## Updated Recommendation

### ✅ **Use Route 53 DNS + Register `.app` Domain Externally**

**Why:**
- Route 53 has best ALB integration (alias records)
- Can register `.app` at external registrar
- AWS-native DNS management
- Wildcard SSL certificates work seamlessly

**Action Plan:**
1. **Now**: Deploy with ALB DNS name (test everything)
2. **When ready**: Register `alva.app` at Cloudflare/Namecheap
3. **Setup**: Create Route 53 hosted zone
4. **Configure**: Update nameservers and create DNS records
5. **Deploy**: Update infrastructure with domain

---

## Alternative: Use `.dev` Domain (Route 53 Native)

If you want everything in AWS:

1. **Register `.dev` domain** directly in Route 53
2. **Cost**: ~$10-15/year
3. **Setup**: Automatic (no nameserver changes needed)
4. **DNS**: Route 53 hosted zone included

**Example:**
```
staging.alva.dev
api-staging.alva.dev
auth-staging.alva.dev
admin-staging.alva.dev
```

**Trade-off**: `.dev` is less common than `.app`, but fully supported by Route 53.

---

Would you like me to:
1. Update the routing strategy to include domain registration options?
2. Create CDK code that works with or without a domain initially?
3. Provide a step-by-step domain registration guide?
4. Explore other domain TLD options that Route 53 supports natively?

