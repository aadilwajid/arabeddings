# 🚀 Quick Start Guide - ARA Beddings

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your credentials
# At minimum, set JWT_SECRET
```

### Required Environment Variables

**JWT_SECRET** (Required for admin login):
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
JWT_SECRET=your-generated-secret-here
```

**SMTP Credentials** (Required for email notifications):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@arabeddings.com
```

For Gmail:
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password
4. Use that as SMTP_PASS

## Step 3: Seed Database

```bash
npm run seed
```

This creates:
- 3 admin users
- 8 sample products
- 3 sample orders
- Sample reviews and media

## Step 4: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Test Admin Login

Go to http://localhost:3000/admin/login

**Credentials:**
- Email: `admin@arabeddings.com`
- Password: `password`

## Step 6: Test Order Flow

1. Browse products at /shop
2. Add items to cart
3. Go to /cart
4. Proceed to checkout
5. Fill in customer details
6. Place order
7. Check email for confirmation (if SMTP configured)
8. Track order at /track-order

## Step 7: Test Admin Features

1. Go to /admin/dashboard
2. View analytics
3. Manage products
4. Process orders
5. Check inventory
6. View audit logs

---

## 🔧 Optional Configurations

### SMS Notifications (Optional)

**Twilio:**
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Jazz SMS (Pakistan):**
```env
JAZZ_SMS_API_KEY=your-key
JAZZ_SMS_MASK=ARA Beddings
```

### Analytics (Optional)

**Google Analytics:**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Facebook Pixel:**
```env
NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id
```

---

## 📋 Testing Checklist

### Frontend
- [ ] Homepage loads correctly
- [ ] Product listing works
- [ ] Search and filters work
- [ ] Add to cart works
- [ ] Cart persists across page reloads
- [ ] Checkout flow completes
- [ ] Order tracking works
- [ ] Wishlist works
- [ ] Dark mode toggles
- [ ] Currency selector works
- [ ] Voice search works (Chrome/Edge)
- [ ] Mobile responsive
- [ ] PWA installable

### Backend
- [ ] Admin login works
- [ ] Product CRUD works
- [ ] Order management works
- [ ] Inventory updates work
- [ ] Analytics display correctly
- [ ] Audit logs created
- [ ] Webhooks trigger (if configured)
- [ ] Email notifications send (if SMTP configured)
- [ ] SMS notifications send (if configured)
- [ ] Data export works

### Admin
- [ ] Dashboard shows stats
- [ ] Products page works
- [ ] Orders page works
- [ ] Inventory page works
- [ ] Analytics page works
- [ ] Audit logs page works
- [ ] Webhooks page works
- [ ] Exports page works
- [ ] All CRUD operations work

---

## 🐛 Troubleshooting

### Admin Login Not Working
```bash
# Reset admin password
npm run seed

# Or use password reset API
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arabeddings.com","newPassword":"password"}'
```

### Cart Not Persisting
- Check browser localStorage
- Clear browser cache
- Check console for errors

### Email Not Sending
- Verify SMTP credentials in .env.local
- Check Gmail app password is correct
- Check SMTP_HOST and SMTP_PORT
- Look for errors in console

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Issues
```bash
# Re-seed database
npm run seed

# Check data files exist
ls -la data/
```

---

## 📚 Documentation

- `README.md` - Project overview
- `FINAL_COMPLETE_SUMMARY.md` - All features
- `COMPREHENSIVE_AUDIT_REPORT.md` - Audit findings
- `BACKEND_ADMIN_FEATURES_COMPLETE.md` - Backend guide
- `FRONTEND_FEATURES_COMPLETE.md` - Frontend guide
- `MOBILE_PWA_COMPLETE.md` - Mobile guide

---

## 🎯 Next Steps

1. ✅ Configure environment variables
2. ✅ Test all features
3. ✅ Set up production environment
4. ✅ Deploy to Vercel
5. ✅ Configure production environment variables
6. ✅ Test production deployment
7. ✅ Monitor logs and analytics
8. ✅ Gather user feedback
9. ✅ Iterate and improve

---

## 📞 Support

**WhatsApp:** 03160143039  
**Email:** admin@arabeddings.com  
**Documentation:** See markdown files in root directory

---

**Ready to launch your luxury bedding e-commerce platform!** 🚀🛏️
