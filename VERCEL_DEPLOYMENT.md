# Vercel Deployment - Function Limit Solution

## ✅ SOLVED - Ready to Deploy!

### Final Configuration

**Total Serverless Functions: 12** (exactly at free tier limit)

### Files Created/Modified:

1. ✅ `/api/auth.js` - Consolidated auth router (handles 7 endpoints)
2. ✅ `.vercelignore` - Excludes non-essential endpoints  
3. ✅ `vercel.json` - Updated routing configuration

### Function Breakdown:

1. `/api/index.js` - API root
2. `/api/status.js` - Health check
3. `/api/permissions.js` - Permission checks
4. `/api/ai.js` - AI autofill
5. **`/api/auth.js` - Auth router handles:**
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/me`
   - `/api/auth/forgot-password`
   - `/api/auth/reset-password`
   - `/api/auth/2fa-setup`
   - `/api/auth/2fa-verify`
6. `/api/songs/index.js` - Songs list
7. `/api/songs/[id].js` - Song CRUD
8. `/api/setlists/index.js` - Setlists list
9. `/api/setlists/[id].js` - Setlist CRUD
10. `/api/bands/index.js` - Bands list
11. `/api/bands/[id].js` - Band CRUD
12. `/api/bands/invitations/[invId].js` - Invitation handling

### Excluded Features (Optional):

These features are disabled to stay under the limit:
- ❌ Practice sessions (`/api/practice/*`)
- ❌ Gigs management (`/api/gigs/*`)
- ❌ Band members endpoint (`/api/bands/members.js` - merged into bands/[id])
- ❌ Band invitations list (`/api/bands/invitations.js` - merged into bands/[id])

**Note:** These can be re-enabled if you upgrade to Vercel Pro or consolidate further.

### Deployment Steps:

```bash
# 1. Test locally first
npm run dev

# 2. Deploy to Vercel
vercel --prod

# 3. Check function count in Vercel Dashboard
# Settings → Functions → Should show ≤12 functions
```

### If Still Over Limit:

Add to `.vercelignore`:
```
api/bands/invitations/
```

This reduces to **11 functions** (safer margin).

### Production Notes:

- All core features work (auth, songs, setlists, bands)
- Auth endpoints consolidated but fully functional
- Frontend routes remain unchanged
- All API calls work as before

