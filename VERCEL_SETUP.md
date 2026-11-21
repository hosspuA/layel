# Deploy Layel on Vercel

The storefront and `/admin` share content and product images through Vercel
Blob. Storefront content is kept in a private JSON blob and is only read or
written by the server.

## 1. Configure Vercel Blob

Create a Vercel Blob store and connect it to the project. Vercel normally
provides `BLOB_READ_WRITE_TOKEN` automatically after the store is connected. If
you manage environment variables manually, add the store's read/write token
under that name. This token is used server-side for both storefront data and
image uploads. No database or SQL migration is required.

Until the Blob store is connected, the site displays its bundled starter
catalog; admin changes cannot be saved.

In `/admin`, the Products section can manage Men, Women, Sets, and Travel Size
items. Travel Size products require an admin-entered size and price. The
configurable Buy 1, Get 1 offer applies to pairs of full-size Men/Women
fragrances, making the lower-priced item free; Sets and Travel Size are excluded.
The storefront opens on customer reviews and only shows products after a
collection is selected.

## 2. Set admin credentials

Add these server-side environment variables in Vercel:

- `ADMIN_PASSWORD`: a strong password used only to sign in at `/admin`. The
  public storefront does not require a password.
- `ADMIN_SESSION_SECRET`: a randomly generated secret with at least 32
  characters. For example, generate one locally with
  `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.

Do not expose these values with a `NEXT_PUBLIC_` prefix or commit them to the
repository. Set them in Vercel Project Settings → Environment Variables for the
environments where the admin should be available, then redeploy. The admin
sign-in uses a signed, HttpOnly session cookie; the admin data and image upload
endpoints also require that session.

Optionally set `NEXT_PUBLIC_SITE_URL` to the canonical production origin. If
unset, the app uses Vercel's production URL, then the current Vercel deployment
URL.

## 3. Deploy

Import the repository into Vercel and deploy with the detected Next.js
framework, or use the Vercel CLI. The build command is `pnpm run vercel:build`.
After deployment, visit `/admin` to sign in, update homepage content, and add
products. Image uploads accept JPEG, PNG, WebP, or AVIF files up to 4 MiB.
