# Email Service Comparison: AWS SES vs Resend

**@fileoverview** Comparison of AWS SES and Resend for email delivery in AWS staging deployment.

---

## Current State

- **ResendProvider**: Already implemented in `libs/email-client/src/providers/resend.provider.ts`
- **MailpitProvider**: Used for local development
- **EmailClient**: Currently hardcoded to use MailpitProvider (needs environment-based switching)

---

## Option 1: AWS SES (Simple Email Service)

### Pros

- **Native AWS Integration**: Fully integrated with AWS ecosystem
- **Cost**: Very affordable at scale
  - $0.10 per 1,000 emails (first 62,000 emails/month are free in AWS Free Tier)
  - No monthly minimum
  - Pay only for what you use
- **Scalability**: Handles millions of emails
- **Reliability**: High deliverability rates
- **Infrastructure**: Already deploying to AWS
- **SMTP or API**: Supports both SMTP and API (SES v2 API)

### Cons

- **Setup Complexity**: Requires domain verification
  - Need to verify sending domain
  - Production requires moving out of sandbox
- **Cold Start**: Sandbox mode limits to verified emails only
- **Code Changes**: Need to implement SES provider (similar to Resend)
- **Deliverability**: May require additional configuration (SPF, DKIM)

### Cost Example

- **0-62k emails/month**: Free (within Free Tier)
- **62k-100k emails/month**: ~$3.80
- **100k+ emails/month**: $0.10 per 1,000

---

## Option 2: Resend (Current Implementation)

### Pros

- **Already Implemented**: ResendProvider exists and works
- **Simple Setup**: Just need API key (already in Secrets Manager)
- **Production Ready**: No sandbox, verified domains optional for basic use
- **Developer Experience**: Modern API, good documentation
- **Analytics**: Built-in email analytics
- **No Domain Verification**: Can send immediately (though domain verification improves deliverability)

### Cons

- **Cost**: More expensive than SES
  - Free tier: 100 emails/day, 3,000/month
  - Paid: $20/month for 50,000 emails
  - $0.40 per 1,000 emails beyond plan
- **External Dependency**: Not part of AWS ecosystem
- **Vendor Lock-in**: Different API than SES

### Cost Example

- **0-3k emails/month**: Free
- **3k-50k emails/month**: $20/month
- **50k+ emails/month**: $20 + ($0.40 × additional 1,000s)

---

## Comparison Table

| Factor | AWS SES | Resend |
|--------|---------|--------|
| **Setup Time** | ~30-60 min (domain verification) | ~5 min (API key) |
| **Cost (0-10k emails)** | Free | Free |
| **Cost (50k emails)** | ~$5 | $20/month |
| **Cost (100k emails)** | ~$10 | $20 + $20 = $40 |
| **AWS Native** | ✅ Yes | ❌ No |
| **Already Implemented** | ❌ No | ✅ Yes |
| **Deliverability** | High (with proper setup) | High |
| **Analytics** | Basic | Built-in dashboard |
| **SMTP Support** | ✅ Yes | ✅ Yes |
| **API Support** | ✅ Yes (SES v2) | ✅ Yes |

---

## Recommendation

### Short Term: Use Resend (Easiest)

**Why:**
1. **Already Implemented**: ResendProvider exists and works
2. **Quick Setup**: Just populate `RESEND_API_KEY` in Secrets Manager
3. **No Additional Code**: Minimal changes needed
4. **Production Ready**: Can send immediately

**Action Items:**
1. Populate `RESEND_API_KEY` in AWS Secrets Manager
2. Update `EmailClient` to use `ResendProvider` in production/staging
3. Keep `MailpitProvider` for local development

### Long Term: Consider AWS SES (Cost Optimization)

**Why:**
1. **Cost Savings**: Significantly cheaper at scale (10x+ difference)
2. **AWS Native**: Better integration with AWS infrastructure
3. **Scalability**: Better for high volume

**Action Items:**
1. Create `SESProvider` implementing `EmailProvider` interface
2. Verify domain in AWS SES
3. Request production access (move out of sandbox)
4. Update `EmailClient` to support SES
5. Migrate when volume justifies cost savings

---

## Implementation Recommendation

### Phase 1: Use Resend (Now)

1. ✅ ResendProvider already exists
2. ⏳ Populate `RESEND_API_KEY` in Secrets Manager
3. ⏳ Update `EmailClient` to use ResendProvider in staging/production
4. ⏳ Test email sending in staging

**Time**: ~15 minutes  
**Cost**: $0 (free tier) or $20/month when exceeding 3k emails

### Phase 2: Add SES Provider (Future)

1. Create `libs/email-client/src/providers/ses.provider.ts`
2. Implement `EmailProvider` interface using AWS SDK v3
3. Add environment variable `USE_AWS_SES=true/false`
4. Update `EmailClient` to support both providers
5. Verify domain and move SES out of sandbox

**Time**: ~2-3 hours  
**Benefit**: Lower costs at scale

---

## Decision

**Recommended**: **Use Resend for now** (Phase 1)

**Rationale:**
- Fastest to production (already implemented)
- Good enough for initial staging/production needs
- Can migrate to SES later when volume grows
- Minimal code changes required

**Next Steps:**
1. Update `EmailClient` to use ResendProvider in production
2. Populate Resend API key in Secrets Manager
3. Test email sending in staging
4. Consider SES migration when email volume exceeds 50k/month

---

## Cost Analysis

### Example: 20,000 emails/month

- **AWS SES**: Free (within Free Tier)
- **Resend**: $20/month

### Example: 100,000 emails/month

- **AWS SES**: ~$10/month
- **Resend**: $20 + ($0.40 × 50) = $40/month

### Break-even Point

- **Resend cheaper**: 0-50k emails/month (with paid plan)
- **SES cheaper**: 50k+ emails/month

---

## Code Changes Required

### Option A: Resend (Recommended for Now)

**Changes needed:**
1. Update `EmailClient` constructor to use ResendProvider in production
2. Populate `RESEND_API_KEY` in AWS Secrets Manager
3. Ensure environment variable is passed to ECS containers

**Files to modify:**
- `libs/email-client/src/email-client.ts`

### Option B: AWS SES

**Changes needed:**
1. Create `SESProvider` class
2. Add AWS SDK v3 `@aws-sdk/client-ses` dependency
3. Update `EmailClient` to support SES
4. Add IAM permissions for ECS tasks to use SES
5. Verify domain in AWS SES Console

**Files to create/modify:**
- `libs/email-client/src/providers/ses.provider.ts` (new)
- `libs/email-client/src/email-client.ts` (update)
- `infrastructure/lib/stacks/ecs-stack.ts` (add IAM permissions)

---

## Final Recommendation

**Start with Resend, migrate to SES when scale justifies it.**

This gives you:
- ✅ Fastest path to production
- ✅ Proven solution (ResendProvider already works)
- ✅ Easy migration path (both use EmailProvider interface)
- ✅ Cost optimization when needed

