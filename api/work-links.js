const STORAGE_KEY = "sealedware:featured-work";

const defaultItems = [
  {
    title: "The Pharaoh's Code",
    label: "Movie Trailer",
    url: "",
    thumbnail: "assets/work-1.png",
  },
  {
    title: "Shadow Protocol",
    label: "Teaser",
    url: "",
    thumbnail: "assets/work-2.png",
  },
  {
    title: "Echoes of War",
    label: "Official Trailer",
    url: "",
    thumbnail: "assets/work-3.png",
  },
  {
    title: "Beyond the Horizon",
    label: "Teaser",
    url: "",
    thumbnail: "assets/work-4.png",
  },
  {
    title: "Rise of Empires",
    label: "Official Trailer",
    url: "",
    thumbnail: "assets/work-5.png",
  },
];

function getRedisConfig() {
  return {
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  };
}

async function redisRestRequest(path) {
  const { token, url } = getRedisConfig();

  if (!token || !url) {
    throw new Error("Featured Work storage is not configured");
  }

  const result = await fetch(`${url}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!result.ok) {
    throw new Error("Featured Work storage request failed");
  }

  return result.json();
}

async function redisUrlGet() {
  if (!process.env.REDIS_URL) {
    throw new Error("Featured Work storage is not configured");
  }

  const { createClient } = await import("redis");
  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    return client.get(STORAGE_KEY);
  } finally {
    await client.quit().catch(() => {});
  }
}

async function redisUrlSet(value) {
  if (!process.env.REDIS_URL) {
    throw new Error("Featured Work storage is not configured");
  }

  const { createClient } = await import("redis");
  const client = createClient({ url: process.env.REDIS_URL });

  try {
    await client.connect();
    await client.set(STORAGE_KEY, value);
  } finally {
    await client.quit().catch(() => {});
  }
}

async function getStoredItems() {
  const { token, url } = getRedisConfig();

  if (token && url) {
    const stored = await redisRestRequest(`/get/${encodeURIComponent(STORAGE_KEY)}`);
    return stored.result;
  }

  return redisUrlGet();
}

async function setStoredItems(value) {
  const { token, url } = getRedisConfig();

  if (token && url) {
    await redisRestRequest(`/set/${encodeURIComponent(STORAGE_KEY)}/${encodeURIComponent(value)}`);
    return;
  }

  await redisUrlSet(value);
}

function cleanItems(items) {
  return items.slice(0, 5).map((item, index) => ({
    title: String(item.title || defaultItems[index]?.title || "Featured Work").trim(),
    label: String(item.label || defaultItems[index]?.label || "YouTube Short").trim(),
    url: String(item.url || "").trim(),
    thumbnail: String(item.thumbnail || "").trim(),
  }));
}

module.exports = async function handler(request, response) {
  if (request.method === "GET") {
    try {
      const stored = await getStoredItems();
      const items = stored ? JSON.parse(stored) : defaultItems;

      return response.status(200).json({ items: cleanItems(items) });
    } catch (error) {
      return response.status(200).json({ items: defaultItems });
    }
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return response.status(500).json({ error: "Admin password is not configured" });
  }

  const { password, items } = request.body || {};

  if (password !== process.env.ADMIN_PASSWORD) {
    return response.status(401).json({ error: "Incorrect admin password" });
  }

  if (!Array.isArray(items)) {
    return response.status(400).json({ error: "Featured Work items are required" });
  }

  const cleanedItems = cleanItems(items);

  try {
    await setStoredItems(JSON.stringify(cleanedItems));
    return response.status(200).json({ ok: true, items: cleanedItems });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};
