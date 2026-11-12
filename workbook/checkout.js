import { settings } from "./settings.js";

function stripePaymentLink(value) {
  try {
    const url = new URL(value);
    const api = new URL(settings.apiOrigin);
    const publicSite = ["theunapologeticleader.com", "www.theunapologeticleader.com"].includes(location.hostname);
    return url.origin === "https://buy.stripe.com"
      && !url.username && !url.password
      && api.protocol === "https:" && !api.username && !api.password
      && /^\/[a-zA-Z0-9_]+$/.test(url.pathname)
      && !(publicSite && url.pathname.startsWith("/test_")) ? url.href : "";
  } catch {
    return "";
  }
}

const checkout = stripePaymentLink(settings.checkoutUrl);
if (checkout) document.getElementById("workbook-buy").href = checkout;
