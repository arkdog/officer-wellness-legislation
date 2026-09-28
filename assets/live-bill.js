// Shared helper for index.html and bill.html (same-origin pages only).
// Fetches live official bill metadata from our own Netlify function and
// renders a small, visually-separate "official data" badge. Never touches
// the editorial fallback content in assets/data.js — that stays as-is and
// is what the page already renders before this ever resolves.
(function () {
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  const cache = Object.create(null);

  function fetchLiveBill(id) {
    if (cache[id]) return cache[id];
    cache[id] = fetch("/.netlify/functions/congress-bill?id=" + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (data) { return (data && data.ok) ? data.official : null; })
      .catch(function () { return null; });
    return cache[id];
  }

  function officialBadgeHTML(o) {
    if (!o) return "";
    const lines = ['<div class="osw-official"><div class="osw-official__tag">Official legislative data: Congress.gov</div>'];
    if (o.latestAction && o.latestAction.date) {
      const actionText = o.latestAction.text ? " — " + escapeHtml(o.latestAction.text) : "";
      lines.push('<div class="osw-official__action">Last congressional action: ' + escapeHtml(o.latestAction.date) + actionText + "</div>");
    }
    const meta = [];
    if (o.originChamber) meta.push(escapeHtml(o.originChamber) + " bill");
    if (o.policyArea) meta.push("Policy area: " + escapeHtml(o.policyArea));
    if (meta.length) lines.push('<div class="osw-official__meta">' + meta.join(" &middot; ") + "</div>");
    lines.push("</div>");
    return lines.join("");
  }

  window.OSW_LIVE = { fetchLiveBill: fetchLiveBill, officialBadgeHTML: officialBadgeHTML, escapeHtml: escapeHtml };
})();
