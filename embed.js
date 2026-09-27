(function(){
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

  function render(el,b){
    el.innerHTML = `
      <article class="osw-bill">
        <header class="osw-bill__header">
          <div class="osw-bill__category">${b.category || "Federal legislation"}</div>
          <div class="osw-bill__number">${b.number}</div>
          <h3 class="osw-bill__title">${b.title}</h3>
        </header>
        <div class="osw-bill__body">
          <p class="osw-bill__summary">${b.summary}</p>
          <p class="osw-bill__status"><strong>Current status:</strong> ${b.status}</p>
        </div>
        <footer class="osw-bill__footer">
          <a class="osw-bill__official" href="${b.congressUrl}" target="_blank" rel="noopener">View official congressional record</a>
        </footer>
      </article>`;
  }

  document.querySelectorAll("[data-osw-legislation]").forEach(el=>{
    const id=el.getAttribute("data-bill") || "119-s-419";
    render(el, fallback[id] || fallback["119-s-419"]);
  });
})();
