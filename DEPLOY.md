# UNAPOLOGETIC — Ship Guide (GitHub Pages → unapologeticleadership.com)

Single-page flagship + favicon + share image. Deploy the whole folder as-is.
Cross-links to frdtlab.com and your Substack are already baked in.

---

## PART 1 — New GitHub repo
1. On GitHub, create a new public repo — name it `unapologetic-site`.
2. **Add file → Upload files** → drag in everything in this folder
   (`index.html`, `favicon.svg`, `og-image.jpg`, `DEPLOY.md`). `index.html` must sit at the repo root.
3. **Commit changes.**

## PART 2 — Turn on Pages + custom domain
1. Repo → **Settings → Pages**.
2. **Source:** Deploy from a branch · **Branch:** `main` · folder `/ (root)`. Save.
3. When the temp URL works, set **Custom domain:** `unapologeticleadership.com` → Save (writes a CNAME file — leave it).

## PART 3 — GoDaddy DNS for unapologeticleadership.com
GoDaddy → My Products → DNS for **unapologeticleadership.com**. Same record set as frdtlab.com.
Delete any "Parked" `A`/`CNAME` on `@`/`www` first.

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `185.199.108.153` | 1 hour |
| A | @ | `185.199.109.153` | 1 hour |
| A | @ | `185.199.110.153` | 1 hour |
| A | @ | `185.199.111.153` | 1 hour |
| CNAME | www | `friedtamanda-web.github.io` | 1 hour |

(Optional IPv6 — AAAA on `@`: `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`)

Wait 15–30 min, then in **Settings → Pages** tick **Enforce HTTPS**. `https://unapologeticleadership.com` is live.

> Note: both frdtlab.com and unapologeticleadership.com point their `www` at the SAME
> `friedtamanda-web.github.io`. GitHub routes each to the right repo by the custom-domain
> (CNAME file) you set per repo. That's expected and works.

---

## After it's live
- Submit `unapologeticleadership.com` to Google Search Console.
- Test the share card in the LinkedIn Post Inspector + opengraph.xyz (the warm "Become fully yourself" card).
- Fonts (Fraunces + Inter) load from Google in any real browser — the page will look sharper than any flat preview.

## What's in this folder
```
index.html     The UNAPOLOGETIC flagship (single page, all sections)
favicon.svg    The "U" mark on paper
og-image.jpg   Warm editorial share card
DEPLOY.md      This file
```

## To swap the placeholder essay links later
The Featured Writing section links all point to your Substack for now. When you have real
essay URLs, replace the four `href="https://afrdtlab.substack.com/"` in the essays block.
