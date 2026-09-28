(function(){
  // Absolute origin: this script runs on third-party host sites, so relative
  // paths would hit the HOST's domain, not ours. The Netlify function sets
  // Access-Control-Allow-Origin: * (see netlify.toml) specifically so this works.
  const OSW_ORIGIN = "https://officer-wellness-legislation.netlify.app";

  const fallback = {
    "119-s-419":{
      number:"S. 419", title:"Reauthorizing Support and Treatment for Officers in Crisis Act of 2025",
      category:"Mental Health & Family Support",
      summary:"A federal proposal focused on continuing support for law-enforcement mental-health and crisis programs, including resources that can reach officers and their families.",
      status:"Active legislation — verify current action through Congress.gov",
      congressUrl:"https://www.congress.gov/bill/119th-congress/senate-bill/419"
    },
    "119-hr-2240":{
      number:"H.R. 2240", title:"Improving Law Enforcement Officer Safety and Wellness Through Data Act",
      category:"Officer Safety & Wellness Data",
      summary:"Would require federal reporting on violent attacks against officers, trauma-inducing incidents, training, and mental-health and wellness resources.",
      status:"Passed House; referred to Senate Judiciary Committee in May 2025",
      congressUrl:"https://www.congress.gov/bill/119th-congress/house-bill/2240"
    },
    "119-hr-2711":{
      number:"H.R. 2711", title:"Invest to Protect Act of 2025",
      category:"Small-Agency Resources",
      summary:"A proposal aimed at giving smaller law-enforcement agencies additional federal support for training, recruitment, retention, equipment, and officer mental-health resources.",
      status:"Active legislation — verify current action through Congress.gov",
      congressUrl:"https://www.congress.gov/bill/119th-congress/house-bill/2711"
    }
  };

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
    });
  }

  function officialBlockHTML(o){
    if (!o) return "";
    const lines = ['<div class="osw-bill__official-data"><div class="osw-bill__official-tag">Official legislative data: Congress.gov</div>'];
    if (o.latestAction && o.latestAction.date) {
      const actionText = o.latestAction.text ? " — " + escapeHtml(o.latestAction.text) : "";
      lines.push('<div class="osw-bill__official-action">Last congressional action: ' + escapeHtml(o.latestAction.date) + actionText + "</div>");
    }
    lines.push("</div>");
    return lines.join("");
  }

  // Renders immediately from fallback/editorial data. `b` always has every
  // field the template needs, so there is never blank content while a live
  // fetch is (maybe) still in flight.
  function render(el,b,official){
    const title = (official && official.title) || b.title;
    const number = (official && official.number) || b.number;
    const congressUrl = (official && official.congressUrl) || b.congressUrl;
    el.innerHTML = `
      <article class="osw-bill">
        <header class="osw-bill__header">
          <div class="osw-bill__category">${escapeHtml(b.category || "Federal legislation")}</div>
          <div class="osw-bill__number">${escapeHtml(number)}</div>
          <h3 class="osw-bill__title">${escapeHtml(title)}</h3>
        </header>
        <div class="osw-bill__body">
          <p class="osw-bill__summary">${escapeHtml(b.summary)}</p>
          <p class="osw-bill__status"><strong>Current status:</strong> ${escapeHtml(b.status)}</p>
          ${officialBlockHTML(official)}
        </div>
        <footer class="osw-bill__footer">
          <a class="osw-bill__official" href="${congressUrl}" target="_blank" rel="noopener">View official congressional record</a>
        </footer>
      </article>`;
  }

  function fetchLive(id){
    return fetch(OSW_ORIGIN + "/.netlify/functions/congress-bill?id=" + encodeURIComponent(id))
      .then(function(r){ return r.json(); })
      .then(function(data){ return (data && data.ok) ? data.official : null; })
      .catch(function(){ return null; }); // network/API failure -> keep verified fallback, no raw error surfaced
  }

  document.querySelectorAll("[data-osw-legislation]").forEach(el=>{
    const id=el.getAttribute("data-bill") || "119-s-419";
    const b = fallback[id] || fallback["119-s-419"];
    render(el, b, null); // fallback content shows immediately, never blank
    fetchLive(id).then(official=>{
      if (official) render(el, b, official); // overlay official fields; editorial fields (summary/status) still come from b
    });
  });
})();
