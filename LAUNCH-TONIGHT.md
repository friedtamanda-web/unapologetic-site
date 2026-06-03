# UNAPOLOGETIC — Launch Tonight

## Domain: theunapologeticleader.com

You're registering this **fresh** at GoDaddy, which makes it simple. A brand-new domain comes on GoDaddy's own nameservers (domaincontrol.com), so the DNS page works right away. No nameserver detour like the parked one had.

The whole site has already been updated to this domain — every canonical tag, OG URL, sitemap entry, and cross-link. Nothing points at the old one. (The misspelled domain and the parked correct-spelling one are both irrelevant now; ignore them.)

### Step 1 — Register it
GoDaddy → search **theunapologeticleader.com** → add to cart → check out. Instant. (Optional, cheap insurance: also grab **theunapologeticleader.io** to redirect to the .com later, and you can point the old typo domain to redirect here too. Not required tonight.)

### Step 2 — Set the DNS records
GoDaddy → My Products → theunapologeticleader.com → **DNS**. Delete any default parked `A`/`CNAME` on `@` and `www`, then add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | friedtamanda-web.github.io | 1 hour |

### Step 3 — Point the repo at it
The Unapologetic site needs to live in its own GitHub repo.
- If it already does: that repo → **Settings → Pages → Custom domain** → `theunapologeticleader.com` → Save.
- If it doesn't yet: create a public repo (e.g. `unapologetic-site`), upload everything in this folder so `index.html` sits at the root, **Settings → Pages → Source: main / root**, then set the custom domain as above.

### Step 4 — Sleep
Give it 15 min to a couple hours. In the morning the GitHub "DNS check" passes, tick **Enforce HTTPS**, and **https://theunapologeticleader.com** is live.

### Sanity check (any time)
Paste in a browser:
`https://dns.google/resolve?name=theunapologeticleader.com&type=A`
When it shows the four `185.199.x` addresses, DNS is done.

---

## The site (ready to deploy)

Four pages, white + electric, all cross-linked and now on the new domain:
- **index.html** — flagship. Includes the throughline band: "Most business problems are human problems."
- **about.html** — translator positioning + corrected scale line.
- **speaking.html** — repivoted keynote, three talk abstracts, bookers' topics block.
- **essays.html** — hub linking to the Dispatch (Substack).

Plus favicon.svg, og-image.jpg, sitemap.xml, robots.txt. Deploy the whole folder to the repo root. Fonts (Archivo) load live from Google in a real browser.

## Note for the morning
FRDTLAB's pages also had their "Explore Unapologetic" links updated to theunapologeticleader.com, so re-push the FRDTLAB site too (the refreshed FRDTLAB-site-dist.zip in your package) once the domain is live, so the cross-links land in the right place.
