const API_ROOT = "https://api.congress.gov/v3";

const billMap = {
  "119-s-419": { congress:119, type:"s", number:"419" },
  "119-hr-2240": { congress:119, type:"hr", number:"2240" },
  "119-hr-2711": { congress:119, type:"hr", number:"2711" }
};

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const bill = billMap[id];

  if (!bill) {
    return new Response(JSON.stringify({error:"Unknown bill id"}), {
      status:404, headers:{"content-type":"application/json","access-control-allow-origin":"*"}
    });
  }

  const key = Netlify.env.get("CONGRESS_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({
      error:"CONGRESS_API_KEY is not configured",
      id
    }), {
      status:503, headers:{"content-type":"application/json","access-control-allow-origin":"*"}
    });
  }

  const endpoint = `${API_ROOT}/bill/${bill.congress}/${bill.type}/${bill.number}?format=json&api_key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(endpoint);
    const body = await response.text();
    return new Response(body, {
      status:response.status,
      headers:{
        "content-type":"application/json",
        "cache-control":"public, max-age=300, s-maxage=3600",
        "access-control-allow-origin":"*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({error:"Congress.gov request failed"}), {
      status:502, headers:{"content-type":"application/json","access-control-allow-origin":"*"}
    });
  }
};
