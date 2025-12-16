# Email Subscription Form Implementation Plan

## Overview
Implement an email subscription form using Resend API in an Astro website, hosted on Cloudflare Pages with serverless function support.

## Current State Analysis
- Astro v5.16.5 (static site - no SSR adapter configured)
- Site URL placeholder: `https://example.com`
- No API routes exist yet
- No Resend integration
- No hosting configured

## Prerequisites

### 1. Resend Account Setup
- [ ] Create account at https://resend.com
- [ ] Verify email domain (or use Resend's testing domain initially)
- [ ] Generate API key from dashboard
- [ ] Store API key securely (will be added to environment variables)

### 2. Cloudflare Account Setup
- [ ] Create/login to Cloudflare account
- [ ] Have GitHub repository ready (for Pages deployment)

## Implementation Steps

### Phase 1: Configure Astro for Hybrid Rendering

**Rationale**: Use hybrid mode instead of full SSR. This keeps your site mostly static (fast) while enabling server-side rendering only for the API endpoint.

#### 1.1 Install Cloudflare Adapter
```bash
npm install @astrojs/cloudflare
```

#### 1.2 Update astro.config.mjs
Add Cloudflare adapter and configure for hybrid mode:
- Import and add `@astrojs/cloudflare` adapter
- Set `output: 'hybrid'` (allows mixing static pages with server endpoints)
- Update `site` URL to actual domain

**Files to modify:**
- `astro.config.mjs`

### Phase 2: Install Resend SDK

#### 2.1 Install Dependencies
```bash
npm install resend
```

**Purpose**: Official Resend SDK for Node.js to interact with Resend API

### Phase 3: Create API Endpoint

#### 3.1 Create API Route Structure
Create new directory: `src/pages/api/`

#### 3.2 Implement Subscription Endpoint
Create: `src/pages/api/subscribe.ts`

**Endpoint Specification:**
- Method: POST
- Expected body: `{ email: string }`
- Response codes:
  - 200: Success
  - 400: Invalid email format
  - 500: Server error
- CORS: Allow your domain only

**Functionality:**
- Validate email format
- Initialize Resend client with API key from environment
- Create contact in Resend (or send to a predefined audience)
- Handle errors gracefully
- Return appropriate JSON responses

**Files to create:**
- `src/pages/api/subscribe.ts`

### Phase 4: Create Subscription Form Component

#### 4.1 Create Form Component
Create: `src/components/SubscribeForm.astro`

**Features:**
- Email input field with validation
- Submit button with loading state
- Success/error message display
- Client-side validation before API call
- Fetch API call to `/api/subscribe`
- Accessible form elements (labels, ARIA attributes)

**Files to create:**
- `src/components/SubscribeForm.astro`

#### 4.2 Add Form to Homepage
Integrate the subscription form into `src/pages/index.astro`

**Files to modify:**
- `src/pages/index.astro`

### Phase 5: Environment Variables

#### 5.1 Create Local Environment File
Create: `.env`

**Variables needed:**
```
RESEND_API_KEY=your_api_key_here
```

#### 5.2 Add to .gitignore
Ensure `.env` is in `.gitignore` to prevent committing secrets

**Files to check/modify:**
- `.gitignore`

#### 5.3 Create Example File
Create: `.env.example`

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Files to create:**
- `.env.example`

### Phase 6: Cloudflare Pages Configuration

#### 6.1 Create Cloudflare Pages Project
- Connect GitHub repository to Cloudflare Pages
- Build settings:
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Framework preset: Astro

#### 6.2 Configure Environment Variables in Cloudflare
In Cloudflare Pages dashboard:
- Go to Settings → Environment Variables
- Add `RESEND_API_KEY` with your Resend API key
- Set for Production (and Preview if needed)

#### 6.3 Configure Functions (if needed)
Cloudflare Pages automatically handles Astro's server endpoints, but verify:
- Functions are enabled in your Pages project
- Check build logs for successful function deployment

### Phase 7: Testing Strategy

#### 7.1 Local Development Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test form UI rendering
- [ ] Test client-side email validation
- [ ] Test API endpoint with valid email
- [ ] Test API endpoint with invalid email
- [ ] Verify error handling
- [ ] Check network tab for proper request/response

#### 7.2 Resend Dashboard Testing
- [ ] Verify contacts appear in Resend dashboard
- [ ] Check email formatting
- [ ] Test with multiple emails

#### 7.3 Production Testing (Post-Deployment)
- [ ] Test form on live Cloudflare Pages URL
- [ ] Verify environment variables are loaded
- [ ] Test with real email addresses
- [ ] Check Cloudflare Functions logs
- [ ] Monitor for errors in Cloudflare dashboard

### Phase 8: Optional Enhancements (Future Iterations)

#### 8.1 Email Confirmation Flow
- Send welcome email to subscribers
- Double opt-in confirmation

#### 8.2 Rate Limiting
- Implement rate limiting to prevent abuse
- Use Cloudflare Workers KV or Durable Objects

#### 8.3 Analytics
- Track subscription conversions
- A/B test form placement

#### 8.4 Audience Segmentation
- Create different subscription lists in Resend
- Allow users to choose topic preferences

## File Structure After Implementation

```
mo-atie-personal-website/
├── .env                              # Local environment variables (gitignored)
├── .env.example                      # Environment variables template
├── astro.config.mjs                  # Updated with Cloudflare adapter
├── package.json                      # Updated with new dependencies
├── src/
│   ├── components/
│   │   └── SubscribeForm.astro      # New subscription form component
│   └── pages/
│       ├── api/
│       │   └── subscribe.ts         # New API endpoint
│       └── index.astro              # Modified to include form
```

## Dependencies Summary

**New packages to install:**
- `@astrojs/cloudflare` - Astro adapter for Cloudflare Pages
- `resend` - Official Resend SDK

## Deployment Checklist

Before going live:
- [ ] Resend API key obtained and tested
- [ ] Domain verified in Resend (if using custom domain)
- [ ] `.env` file configured locally
- [ ] Cloudflare Pages project created
- [ ] GitHub repository connected to Cloudflare
- [ ] Environment variables set in Cloudflare dashboard
- [ ] Build command tested locally (`npm run build`)
- [ ] Form tested in local development
- [ ] All error states handled gracefully
- [ ] Success message provides clear feedback
- [ ] Form is accessible (keyboard navigation, screen readers)

## Rollback Plan

If issues arise:
1. Disable the API endpoint by adding `export const prerender = false;` comment
2. Hide the subscription form from UI
3. Check Cloudflare Functions logs for errors
4. Verify environment variables in Cloudflare dashboard
5. Test Resend API key in Resend dashboard

## Security Considerations

- [ ] API key stored in environment variables (never in code)
- [ ] Email validation on both client and server
- [ ] CORS configured appropriately
- [ ] No sensitive data logged
- [ ] Rate limiting considered for production
- [ ] HTTPS enforced by Cloudflare Pages

## Estimated Complexity

- **Backend Setup**: Low (straightforward API endpoint)
- **Frontend Form**: Low (basic form with fetch)
- **Cloudflare Configuration**: Medium (first-time setup may require learning)
- **Testing**: Low-Medium (depends on edge cases)

## Next Steps After Approval

1. Confirm Resend account is created and API key obtained
2. Install dependencies (@astrojs/cloudflare, resend)
3. Configure Astro for hybrid mode
4. Implement API endpoint
5. Create subscription form component
6. Local testing
7. Deploy to Cloudflare Pages
8. Production testing

## Notes

- Hybrid mode is preferred over full SSR to maintain static site performance
- Cloudflare Pages automatically handles serverless functions from Astro API routes
- Consider starting with Resend's test domain before verifying custom domain
- Monitor Resend quota limits (free tier may have limits)
