#!/bin/bash

echo "🔍 Analyzing bundle size..."

# Analyze web bundle
ANALYZE=true nx build web

# Check for large dependencies
echo "📦 Checking for large dependencies..."
npx bundle-analyzer dist/apps/web/.next/static/chunks/*.js

# Generate optimization report
echo "📊 Generating optimization report..."
cat > bundle-analysis.md << 'ANALYSIS'
# Bundle Analysis Report

## Current Bundle Size
- Main bundle: $(du -sh dist/apps/web/.next/static/chunks/main-*.js | cut -f1)
- Vendor bundle: $(du -sh dist/apps/web/.next/static/chunks/framework-*.js | cut -f1)

## Optimization Recommendations
1. Implement code splitting for heavy components
2. Use dynamic imports for routes
3. Remove unused dependencies
4. Optimize images and assets

## Next Steps
- [ ] Implement lazy loading for below-fold components
- [ ] Add service worker for caching
- [ ] Optimize font loading
ANALYSIS

echo "✅ Bundle analysis complete. See bundle-analysis.md for details."
