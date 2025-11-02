# Phase 12: Technical Decision Documents

**@fileoverview** Technical comparison and decision documents for AWS staging deployment architecture choices.

---

## Documents in this Directory

### Decision Comparisons

1. **`12-infrastructure-tool-comparison.md`**
   - CloudFormation vs Terraform vs AWS CDK
   - ✅ **Decision**: AWS CDK (TypeScript-native)

2. **`12-container-registry-comparison.md`**
   - ECR vs GitHub Container Registry (GHCR)
   - ✅ **Decision**: Amazon ECR (AWS-native)

3. **`12-routing-strategy-comparison.md`**
   - Subdomain-based vs Path-based routing
   - ✅ **Decision**: Subdomain-based (ready for domain)

4. **`12-domain-registration-options.md`**
   - Route 53 DNS vs External DNS
   - ✅ **Decision**: Deferred (using ALB DNS name initially)

5. **`12-database-deployment-strategy.md`**
   - RDS PostgreSQL vs Container vs EC2
   - ✅ **Decision**: AWS RDS PostgreSQL (managed service)

6. **`12-email-service-comparison.md`**
   - AWS SES vs Resend
   - ✅ **Decision**: Resend (implemented, EmailClient auto-selects in production)

### Final Summary

7. **`12-final-decisions-summary.md`**
   - Complete summary of all decisions
   - Architecture overview
   - Implementation roadmap
   - CDK project structure
   - Cost breakdown

---

## Related Documents

- **Main Review**: `../12-aws-staging-deployment-REVIEW.md`
- **Original Plan**: `../12-aws-staging-deployment.md`

---

These documents were created during the Phase 12 planning process to evaluate architectural choices for the AWS staging deployment.

