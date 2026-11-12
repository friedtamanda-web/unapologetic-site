import { settings } from "../settings.js";

const statusText = document.getElementById("receipt-status");
const download = document.getElementById("receipt-download");
const retry = document.getElementById("receipt-retry");
const companion = document.getElementById("companion");
const companionLink = document.getElementById("companion-link");
const storageKey = "tul.workbook.return";

function readSession() {
  const url = new URL(location.href);
  const incoming = url.searchParams.get("session_id");
  const valid = /^cs_(test|live)_[a-zA-Z0-9_]{8,250}$/;
  if (url.searchParams.has("session_id")) {
    url.searchParams.delete("session_id");
    history.replaceState(null, "", url);
  }
  try {
    if (incoming !== null) {
      sessionStorage.removeItem(storageKey);
      if (valid.test(incoming)) {
        sessionStorage.setItem(storageKey, JSON.stringify({ sessionId: incoming, at: Date.now() }));
        return incoming;
      }
      return "";
    }
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && Date.now() - saved.at < 30 * 60 * 1000 && valid.test(saved.sessionId)) return saved.sessionId;
    sessionStorage.removeItem(storageKey);
  } catch {
    // The incoming session still works when a browser disables session storage.
  }
  return incoming && valid.test(incoming) ? incoming : "";
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

const sessionId = readSession();
const configuredApi = httpsUrl(settings.apiOrigin);
const api = configuredApi?.origin;
const optIn = httpsUrl(settings.companionSignupUrl);

function show(message, retryable = false) {
  statusText.textContent = message;
  retry.hidden = !retryable;
}

function validDownload(value) {
  const url = httpsUrl(value);
  return url && url.origin === api && url.pathname === "/download" && url.searchParams.get("token") ? url : null;
}

async function checkOrder() {
  download.hidden = true;
  companion.hidden = true;
  if (!sessionId) {
    show("Open this page from checkout, or use the download link in your order email.");
    return;
  }
  if (!api) {
    show("This page can’t check the order right now. Look for your download email or contact us below.");
    return;
  }

  show("Checking for your purchase…");
  const endpoint = new URL("/checkout/status", api);
  endpoint.searchParams.set("session_id", sessionId);
  try {
    const response = await fetch(endpoint, {
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 404) {
      show("We couldn’t match this link to a workbook order. Check your order email or contact us below.");
      return;
    }
    if (!response.ok) throw new Error("Order lookup unavailable");

    const order = await response.json();
    if (order.status === "pending") {
      show("Your payment is still processing. Check again in a moment or watch for your download email.", true);
      return;
    }
    const file = validDownload(order.downloadUrl);
    if (order.status !== "paid" || !file) throw new Error("Order download unavailable");

    download.href = file.href;
    download.hidden = false;
    show("Your purchase is confirmed. Save a copy of the PDF before you start writing.");
    if (optIn) {
      companionLink.href = optIn.href;
      companion.hidden = false;
    }
  } catch {
    show("We couldn’t check your order just now. Try again or use the link in your download email.", true);
  }
}

retry.addEventListener("click", checkOrder);
checkOrder();
