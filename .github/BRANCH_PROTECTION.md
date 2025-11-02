# Branch Protection Setup for Staging

This document explains how to configure GitHub branch protection for the `staging` branch.

## Why Protect Staging?

- **Prevent direct pushes**: Force all changes through pull requests
- **Require reviews**: Ensure code is reviewed before deployment
- **Maintain deployment history**: All changes tracked via PRs
- **Prevent accidental deployments**: Reduce risk of breaking staging

## Setup Instructions

### 1. Go to Repository Settings

1. Navigate to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** or find existing `staging` rule

### 2. Configure Branch Protection Rule

**Branch name pattern**: `staging`

**Protection Settings** (Recommended):

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (or more if you have a team)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if you have CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Select required checks:
    - `lint-and-typecheck` (from CI workflow)
    - `test-unit` (from CI workflow)

- ✅ **Require conversation resolution before merging**
  - Ensures all PR comments are addressed

- ✅ **Do not allow bypassing the above settings** (for administrators too)
  - Prevents accidental direct pushes even by admins

- ✅ **Restrict who can push to matching branches**
  - Leave empty (applies to everyone, enforced by PR requirement)

### 3. Additional Recommendations

**Optional Settings**:

- **Allow force pushes**: ❌ Disabled (prevents history rewriting)
- **Allow deletions**: ❌ Disabled (prevents accidental branch deletion)

## How It Works

1. **Developer creates PR** from feature branch to `staging`
2. **CI runs** on the PR (lint, test, etc.)
3. **Code review** is required before merge
4. **PR is merged** to `staging` branch
5. **Deploy workflow triggers** automatically
6. **Infrastructure deploys** to AWS staging environment

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to **Actions** tab
2. Select **Deploy to Staging** workflow
3. Click **Run workflow**
4. Select `staging` branch
5. Click **Run workflow**

## Emergency Bypass

If you need to bypass protection in an emergency:

1. Go to **Settings** → **Branches**
2. Temporarily disable protection for `staging`
3. Make the emergency change
4. Re-enable protection immediately
5. Create a follow-up PR to document the change

⚠️ **Warning**: Only use in genuine emergencies. Always re-enable protection immediately.

---

## Current Status

After setting up branch protection:
- ✅ Direct pushes to `staging` will be blocked
- ✅ All changes must go through pull requests
- ✅ CI must pass before merging
- ✅ Code review required before merging
- ✅ Deploy workflow triggers automatically on merge

