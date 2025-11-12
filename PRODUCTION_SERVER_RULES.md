# PRODUCTION SERVER RULES - READ THIS FIRST

## ⚠️ CRITICAL RULES - NEVER BREAK THESE ⚠️

### 1. NEVER TOUCH GIT ON PRODUCTION SERVER
- **NEVER** run `git pull`, `git stash`, `git commit`, or ANY git commands
- **NEVER** modify files that would require git operations
- This is a LIVE PRODUCTION SERVER with paying customers
- Git operations can break the entire site and cost money/time

### 2. CURRENT WORKING CONFIGURATION (DO NOT CHANGE)
- **Adapter**: Uses `@sveltejs/adapter-cloudflare` (NOT node adapter)
- **PM2 Mode**: Fork mode (NOT cluster mode) 
- **Environment**: All env vars are in ecosystem.config.cjs
- **Build**: Current build is WORKING - don't rebuild unless absolutely necessary

### 3. SAFE OPERATIONS ONLY
- ✅ Check logs: `pm2 logs`, `tail logs/err-0.log`
- ✅ Restart PM2: `pm2 restart svelteroster` or `pm2 reload ecosystem.config.cjs`
- ✅ Check status: `pm2 status`, `curl -I https://roster86.com`
- ✅ View files: `view`, `cat`
- ✅ Small config changes in .env or ecosystem.config.cjs
- ❌ NO git operations
- ❌ NO major rebuilds unless site is completely broken
- ❌ NO changing adapters or major config

### 4. CURRENT ISSUES TO FIX
- Signup still failing with Prisma validation errors
- Need to fix without rebuilding or touching git

### 5. WORKING ENVIRONMENT VARIABLES
```
DATABASE_URL='postgresql://vultradmin:Fuckstick!@vultr-prod-0274b390-8a2c-4950-963c-f8c94271df22-vultr-prod-42ab.vultrdb.com:16751/defaultdb?sslmode=require'
AUTH_URL="https://roster86.com"
RESEND_API_KEY="re_gntcQ4Rj_5Lg4a97ufJidbQZp9DizpEaV"
EMAIL_FROM="SvelteRoster <onboarding@resend.dev>"
PUBLIC_APP_URL="https://roster86.com"
AUTH_SECRET="sY9sd9anwIhejBNixziI9e6VHRvtEQvC5mRs55XY4B8="
AUTH_TRUST_HOST="true"
```

## REMEMBER: THIS IS A LIVE PRODUCTION SERVER - BE EXTREMELY CAREFUL
