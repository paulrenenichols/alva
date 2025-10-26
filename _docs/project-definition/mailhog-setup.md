# MailHog Setup Guide

**@fileoverview** Guide to using MailHog for local email testing during development.

---

## What is MailHog?

**MailHog** is a local email testing tool that catches all outgoing emails during development. Instead of sending emails to real recipients (which would cost money and spam people), MailHog receives them and displays them in a web interface.

---

## Why Use MailHog?

### Problems Without MailHog
1. **Cost**: Every test email sends via Resend API ($20/month)
2. **Spam**: Can't test email flows safely
3. **Delay**: Real emails take time to arrive
4. **Privacy**: Don't want to email real users during testing

### Benefits With MailHog
1. **Free**: No API costs during development
2. **Instant**: Emails appear immediately in web UI
3. **Safe**: No real emails sent accidentally
4. **Isolated**: Test any scenario without consequences

---

## How It Works

### Architecture

```
Your App → Sends Email → MailHog (localhost:1025) → Shows in Web UI (localhost:8025)
```

1. Your app sends email to `mailhog:1025` (SMTP)
2. MailHog receives and stores the email
3. View it at `http://localhost:8025` (web interface)

### Environments

- **Development** (NODE_ENV=development): Uses MailHog
- **Staging/Production**: Uses Resend API

---

## Setup

### 1. MailHog Already Added to Docker Compose

MailHog is now included in `docker-compose.yml`:

```yaml
mailhog:
  image: mailhog/mailhog:latest
  ports:
    - '1025:1025'  # SMTP server
    - '8025:8025'  # Web UI
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs:
- `nodemailer` - For sending emails via SMTP to MailHog
- `@types/nodemailer` - TypeScript types

### 3. Start Services

```bash
# Start all services including MailHog
pnpm docker:up
```

Now MailHog is running and receiving emails!

---

## Usage

### During Development

1. **Start the app**:
   ```bash
   pnpm dev
   ```

2. **Trigger an email** (register, invite, etc.)

3. **View the email**: Open `http://localhost:8025`

### MailHog Web Interface

The MailHog web UI shows:
- **List of emails** sent by your app
- **Email details**: From, To, Subject, Body
- **Click to open**: See full HTML email
- **Message source**: Raw email content
- **Delete**: Remove test emails

### What You'll See

```
┌─────────────────────────────────────────────────┐
│ MailHog                                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ Email 1: "Verify your email - Alva"            │
│   From: Alva <noreply@alva.local>              │
│   To: user@example.com                          │
│   Subject: Verify your email - Alva           │
│   [View Email]                                   │
│                                                 │
│ Email 2: "You're invited to join Alva"          │
│   From: Alva <noreply@alva.local>              │
│   To: newuser@example.com                       │
│   [View Email]                                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Email Service Integration

### How It Works

The `EmailService` automatically detects the environment:

```typescript
// Development: Uses MailHog
if (process.env['NODE_ENV'] === 'development') {
  return this.sendViaMailHog(email, subject, html);
}

// Production: Uses Resend
return this.sendViaResend(email, subject, html);
```

### SMTP Configuration

MailHog listens on:
- **Port 1025**: SMTP server (app sends emails here)
- **Port 8025**: Web UI (view emails here)

Your app connects via Docker network:
- Host: `mailhog` (Docker service name)
- Port: `1025`

---

## Testing Email Flows

### 1. Registration Email

```bash
# Start MailHog and services
pnpm docker:up

# Start dev server
pnpm dev

# Register a new user
# Email sent → MailHog → View at localhost:8025
```

### 2. Invite Email (Future)

```bash
# Send invite from admin panel
# Email sent → MailHog → View at localhost:8025
```

### 3. Verification Email

```bash
# User clicks verification link
# Email sent → MailHog → View at localhost:8025
```

---

## Switching Between MailHog and Resend

### Development (MailHog)

```bash
NODE_ENV=development pnpm dev
```

Automatically uses MailHog.

### Staging/Production (Resend)

```bash
NODE_ENV=production
RESEND_API_KEY=re_xxx
pnpm start
```

Automatically uses Resend.

---

## Troubleshooting

### MailHog Not Showing Emails

1. **Check MailHog is running**:
   ```bash
   docker ps | grep mailhog
   ```

2. **Check logs**:
   ```bash
   docker logs -f alva-mailhog
   ```

3. **Restart services**:
   ```bash
   pnpm docker:restart
   ```

### Emails Not Being Received

1. **Check environment**:
   ```bash
   echo $NODE_ENV
   ```
   Should be `development` for MailHog

2. **Check app logs**:
   ```bash
   pnpm dev  # Check console for email errors
   ```

### Port Already in Use

If ports 1025 or 8025 are taken:
```yaml
mailhog:
  ports:
    - '2025:1025'  # Change to 2025
    - '8026:8025'   # Change to 8026
```

Then access at `http://localhost:8026`

---

## Advanced Usage

### Testing Email Templates

1. Send invite/verification email
2. Click email in MailHog
3. Verify HTML rendering
4. Check mobile responsiveness
5. Click links to test redirects

### Testing Multiple Emails

MailHog maintains a history of all emails sent. You can:
- View all sent emails
- Re-send form data
- Test different email addresses
- Simulate email flooding

### Clearing Emails

Click "Delete" in MailHog UI to remove test emails.

Or restart MailHog container:
```bash
docker restart alva-mailhog
```

---

## Benefits for Development

### 1. Faster Testing
- No waiting for emails to arrive
- Instant feedback on email content

### 2. Cost Savings
- No API costs during development
- Unlimited testing

### 3. Privacy
- Don't spam real users
- Test with any email address

### 4. Isolated Environment
- Test failures safely
- No external dependencies

---

## Production Configuration

### Using Resend (Production)

In production, emails are sent via Resend API:

```bash
# Environment variables
NODE_ENV=production
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@alva.app
```

### Email Service Flow

```
Development:     Production:
MailHog          Resend API
    ↓                ↓
localhost:8025   user@email.com
   (local)      (real email)
```

---

## Next Steps

1. **Start MailHog**:
   ```bash
   pnpm docker:up
   ```

2. **View web UI**:
   Open `http://localhost:8025`

3. **Send test email**:
   Register a user or send an invite

4. **Check inbox**:
   View the email in MailHog UI

5. **Test email links**:
   Click verification/invite links from emails

---

## Summary

✅ **MailHog added to docker-compose.yml**
✅ **Email service configured for MailHog**
✅ **Automatic environment detection**
✅ **No production email costs during development**
✅ **Instant email viewing**

MailHog makes email testing easy, safe, and free during development!

