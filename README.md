# Bear Bite website + admin (Cloudflare Pages), final version

Static website in `public/`, API in `functions/`. Menu, promotions, details, photos and the admin password are stored in
Cloudflare KV (free tier, no credit card). There is nothing to build.

## Deploy (about 10 minutes, all in the browser)

1. **Create storage.** Cloudflare dashboard > Storage & Databases > KV > Create a namespace. Name it `bear-bite`.
2. **Put this folder on GitHub.** New repository, upload everything in this folder (keep the folder layout).
   Note: Cloudflare's drag-and-drop upload does NOT run the `functions` folder, so use GitHub (or the CLI option below).
3. **Create the Pages project.** Workers & Pages > Create > Pages > Connect to Git > pick the repository.
   - Framework preset: None
   - Build command: leave empty
   - Build output directory: `public`
   Click Save and Deploy.
4. **Connect storage.** Project > Settings > Bindings > Add > KV namespace.
   Variable name must be exactly `BB`. Choose the `bear-bite` namespace. Save.
5. **Add the setup code.** Settings > Variables and Secrets > Add. Name `ADMIN_SETUP_CODE`, type Secret,
   value = any code you choose (for example a random 8+ characters). Save.
6. **Redeploy.** Deployments > latest > Retry deployment (bindings only apply to new deployments).
7. **Create the admin.** Open `https://YOUR-PROJECT.pages.dev/admin`, enter the setup code, choose a password,
   and SAVE THE RECOVERY KEY it shows.

Custom domain: Project > Custom domains > Set up a domain.

### CLI alternative
    npm install
    npx wrangler login
    npm run deploy
Then do steps 4 to 6 in the dashboard.

## Starter data
Until the admin presses Save for the first time, the site shows the starter menu (Burgers, Sides, Drinks, Sweets),
the phone number, address and opening hours from the original design. Prices are blank on purpose, so no price is shown.
To go back to the starter data later: Cloudflare > Storage & Databases > KV > bear-bite > View > delete the key named `content`.

## Updating an already deployed site
Replace the files in your GitHub repository with the ones in this folder (keep the folder layout). Cloudflare redeploys
by itself. Your menu, photos and password stay safe in KV.

## Forgot the password
- Click "Forgot password?" on the login page and enter the recovery key. Or
- Lost the key too: Cloudflare > Storage & Databases > KV > bear-bite > View > delete the key named `auth`.
  Open /admin and set up again with your setup code. Menu and photos are kept.

## Good to know
- Changes can take up to about a minute to appear for every visitor (KV caching).
- Photos are resized in the browser before upload and stored in KV. Free tier allows about 1,000 writes a day,
  which is plenty for menu edits.
- Backup: Admin > Account > Download backup.
- If login ever shows "Error 1102" or "exceeded CPU", the Workers Free plan CPU limit is too tight for password hashing.
  Fix: lower `ITER` at the top of `functions/api/[[path]].js` (for example to 30000), or use the Workers Paid plan.
  Passwords set with one value will not work after changing it: reset using the KV `auth` key steps above.

## Test on your computer
    npm install
    npm run dev
Open http://localhost:8788 and /admin. Local setup code: BEAR1234. (Local data is separate from the live site.)
