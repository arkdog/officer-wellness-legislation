const API_ROOT = "https://api.congress.gov/v3";

const billMap = {
  "119-s-419": { congress:119, type:"s", chamberSlug:"senate-bill", number:"419" },
  "119-hr-2240": { congress:119, type:"hr", chamberSlug:"house-bill", number:"2240" },
  "119-hr-2711": { congress:119, type:"hr", chamberSlug:"house-bill", number:"2711" }
};

function congressUrlFor(bill) {
  return `https://www.congress.gov/bill/${bill.congress}th-congress/${bill.chamberSlug}/${bill.number}`;
}

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const bill = billMap[id];

  if (!bill) {
    return jsonResponse(404, { ok:false, id, reason:"unknown_bill" });
  }

  const key = Netlify.env.get("CONGRESS_API_KEY");
  if (!key) {
    return jsonResponse(503, { ok:false, id, reason:"not_configured" });
  }

  const endpoint = `${API_ROOT}/bill/${bill.congress}/${bill.type}/${bill.number}?format=json&api_key=${encodeURIComponent(key)}`;

  let upstream;
  try {
    upstream = await fetch(endpoint);
  } catch (error) {
    return jsonResponse(502, { ok:false, id, reason:"upstream_unreachable" });
  }

  if (!upstream.ok) {
    // Never forward the upstream body: it can echo the request URL (and thus the API key)
    // back to the client on some error paths. Log server-side only, respond generically.
    console.error(`Congress.gov request failed for ${id}: HTTP ${upstream.status}`);
    return jsonResponse(502, { ok:false, id, reason:"upstream_error" });
  }

  let data;
  try {
    data = await upstream.json();
  } catch (error) {
    return jsonResponse(502, { ok:false, id, reason:"upstream_invalid_response" });
  }

  const b = data && data.bill;
  if (!b) {
    return jsonResponse(502, { ok:false, id, reason:"upstream_invalid_response" });
  }

  const official = {
    title: b.title || null,
    number: b.type && b.number ? `${b.type}. ${b.number}` : null,
    congress: b.congress || null,
    originChamber: b.originChamber || null,
    policyArea: (b.policyArea && b.policyArea.name) || null,
    latestAction: b.latestAction
      ? { date: b.latestAction.actionDate || null, text: b.latestAction.text || null }
      : null,
    congressUrl: congressUrlFor(bill)
  };

  return new Response(JSON.stringify({ ok:true, id, official }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*"
    }
  });
};
