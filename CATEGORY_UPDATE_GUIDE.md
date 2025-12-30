# Category Update Guide

## Changes Made:
✅ Admin Panel (admin.html) - Updated dropdown options
✅ Deals Filter Screen - Updated category list  
✅ Events Filter Screen - Updated category list

## Old vs New Names:
- `Other Deals & Promotions` → `Other Deals`
- `Other Events & Happenings` → `Other Events`

## ⚠️ IMPORTANT - Database Update Required:

You need to update any existing deals/events in Supabase that use the old category names:

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Table Editor
4. Update `deals` table:
   - Find rows where `category = 'Other Deals & Promotions'`
   - Change to `category = 'Other Deals'`
5. Update `events` table:
   - Find rows where `category = 'Other Events & Happenings'`
   - Change to `category = 'Other Events'`

### Option 2: Via SQL (Faster)
Run these SQL queries in the Supabase SQL Editor:

```sql
-- Update deals table
UPDATE deals 
SET category = 'Other Deals' 
WHERE category = 'Other Deals & Promotions';

-- Update events table
UPDATE events 
SET category = 'Other Events' 
WHERE category = 'Other Events & Happenings';
```

## Testing:
After updating the database, test in the app:
1. Open the app in Expo: `npx expo start --clear`
2. Navigate to Deals and apply the "Other Deals" filter
3. Navigate to Events and apply the "Other Events" filter
4. Verify cards display correctly with shorter category names

## Why This Change?
The category names were too long and didn't fit well on the cards in the mobile app. The shorter versions look much better!
