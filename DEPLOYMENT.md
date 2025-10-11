# Deployment Guide - Vineta E-commerce

This guide walks you through deploying your Vineta e-commerce platform to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ A Supabase account and project set up
- ✅ Database schema deployed to Supabase
- ✅ A hosting account (Vercel, Netlify, or similar)
- ✅ Your code pushed to GitHub
- ✅ Google Gemini API key (for AI features)

## Step 1: Set Up Supabase Production Database

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Choose a region close to your users
4. Set a strong database password
5. Wait for project to provision (~2 minutes)

### 1.2 Deploy Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the schema
7. Verify all tables were created successfully

### 1.3 Configure Storage Buckets

1. Navigate to **Storage** in the Supabase dashboard
2. Create the following buckets:
   - **products** (public) - For product images
   - **blog** (public) - For blog post images
   - **avatars** (public) - For user profile pictures

For each bucket:
- Click **New Bucket**
- Enter bucket name
- Check **Public bucket** checkbox
- Click **Create**

### 1.4 Configure Authentication

1. Navigate to **Authentication > Settings**
2. Configure email templates:
   - Confirmation email
   - Reset password email
   - Magic link email
3. Set site URL to your production domain (e.g., `https://vineta.com`)
4. Add redirect URLs:
   - `https://your-domain.com/#/reset-password`
   - `https://your-domain.com/#/email-verification`

### 1.5 Get API Credentials

1. Go to **Settings > API**
2. Copy your **Project URL**
3. Copy your **anon/public** key
4. **IMPORTANT**: Never share or commit these credentials!

## Step 2: Seed Initial Data (Optional)

If you want to start with some sample data:

1. Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Run the migration script:
   ```bash
   npm run seed
   ```

3. Verify data in Supabase dashboard under **Table Editor**

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

#### 3.1 Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 3.2 Set Environment Variables

In Vercel project settings:

1. Go to **Settings > Environment Variables**
2. Add the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Apply to: **Production, Preview, and Development**
4. Click **Save**

#### 3.3 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Vercel will provide you with a URL
4. Test your deployed site!

### Option B: Deploy to Netlify

#### 3.1 Connect to Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Click **Add New Site > Import an existing project**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 3.2 Set Environment Variables

1. Go to **Site settings > Environment variables**
2. Add:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### 3.3 Deploy

1. Click **Deploy site**
2. Wait for build to complete
3. Test your site!

## Step 4: Configure Custom Domain (Optional)

### For Vercel:
1. Go to **Settings > Domains**
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate provisioning

### For Netlify:
1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

## Step 5: Post-Deployment Setup

### 5.1 Create Admin Account

1. Visit your deployed site
2. Register a new account
3. In Supabase dashboard:
   - Go to **Table Editor > customers**
   - Find your account
   - Change `role` to `Administrator`
4. Log out and log back in
5. You now have admin access!

### 5.2 Test Critical Flows

Test these user flows:
- ✅ User registration
- ✅ User login
- ✅ Browse products
- ✅ Add to cart
- ✅ Place an order
- ✅ Admin dashboard access
- ✅ Admin product management

### 5.3 Configure Email Service

For production emails, configure Supabase Auth SMTP:

1. In Supabase dashboard: **Settings > Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, Mailgun, etc.)
4. Test email sending

## Step 6: Security Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] RLS policies are enabled on all tables
- [ ] Admin-only operations require proper role
- [ ] User data is protected by RLS
- [ ] No sensitive data exposed in API responses
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] Strong database password
- [ ] Email verification enabled (optional but recommended)

## Step 7: Monitoring and Maintenance

### Set Up Monitoring

1. **Supabase Monitoring**:
   - Go to **Reports** in Supabase dashboard
   - Monitor database usage
   - Check API requests
   - Review error logs

2. **Frontend Monitoring**:
   - Add error tracking (Sentry, LogRocket, etc.)
   - Monitor performance (Google Analytics, Plausible)
   - Set up uptime monitoring (UptimeRobot)

### Regular Maintenance

- **Backup**: Supabase automatically backs up your database
- **Updates**: Keep dependencies updated (`npm update`)
- **Security**: Monitor for security advisories
- **Performance**: Optimize slow queries
- **Content**: Regularly update products and content

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Module not found"
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Issue**: Environment variables not found
- **Solution**: Check they're set in hosting platform dashboard
- Ensure they start with `VITE_` for frontend access

### Database Connection Issues

**Issue**: "Failed to connect to Supabase"
- **Solution**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is not paused

**Issue**: RLS policy blocks queries
- **Solution**: Review policies in Supabase dashboard
- Ensure user has correct role

### Authentication Issues

**Issue**: Users can't log in
- **Solution**: Check Supabase Auth settings
- Verify site URL is correct
- Check email templates are configured

**Issue**: Password reset emails not sending
- **Solution**: Configure SMTP in Supabase
- Check email provider settings

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Consider implementing dynamic imports
2. **Image Optimization**: Use Supabase Storage transformations
3. **Caching**: Implement proper cache headers
4. **CDN**: Use Vercel/Netlify CDN automatically

### Database Optimization

1. **Indexes**: Already created in schema.sql
2. **Query Optimization**: Use `.select()` to limit columns
3. **Pagination**: Implement for large datasets
4. **Connection Pooling**: Enabled by default in Supabase

## Scaling Considerations

### When to Upgrade Supabase Plan

Consider upgrading from free tier when:
- Database size > 500 MB
- Monthly API requests > 50k
- Need more storage for images
- Need better performance

### When to Upgrade Hosting

Consider upgrading when:
- Monthly visitors > 100k
- Need faster build times
- Need team collaboration features
- Need advanced analytics

## Support and Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **React Docs**: https://react.dev

## Rollback Plan

If deployment goes wrong:

1. **Vercel/Netlify**: Rollback to previous deployment
   - Go to **Deployments**
   - Find last working version
   - Click **Promote to Production**

2. **Database**: Restore from backup
   - Supabase dashboard: **Database > Backups**
   - Choose restore point
   - Confirm restoration

---

## Quick Reference

**Supabase Dashboard**: https://app.supabase.com
**Vercel Dashboard**: https://vercel.com/dashboard
**Netlify Dashboard**: https://app.netlify.com

**Need Help?**
- Check the documentation first
- Review error logs in dashboard
- Test locally with production credentials
- Contact support if issue persists

---

Congratulations! Your Vineta e-commerce platform is now live! 🎉
