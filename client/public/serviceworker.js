import { version, manifest } from "@parcel/service-worker";
import { idbChat as db } from "./storage";
const IMAGE_CACHE = "image-cache-v1";

// Install SW
async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}
addEventListener("install", (e) => e.waitUntil(install()));

// Activate SW
async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(
      (key) => key !== version && key !== IMAGE_CACHE && caches.delete(key)
    )
  );
}
addEventListener("activate", (e) => e.waitUntil(activate()));

const updateImageCache = (request, response) => {
  if (request.url.includes("/images/")) {
    caches.open(IMAGE_CACHE).then((cache) => cache.put(request, response));
  }
};

const updateIndexDB = async (request, response) => {
  const requestUrl = new URL(request.url);

  // GET /users
  if (request.method === "GET" && requestUrl.pathname.match(/^\/users$/)) {
    const users = await response.json();
    users.forEach((u) => {
      db.setUser(u);
    });
  }

  // GET /conversations
  if (
    request.method === "GET" &&
    requestUrl.pathname.match(/^\/conversations$/)
  ) {
    const conversations = await response.json();
    conversations.forEach((c) => db.setConversation(c));
  }

  // GET /conversations/:id/messages
  if (
    request.method === "GET" &&
    requestUrl.pathname.match(/^\/conversations\/.\/messages$/)
  ) {
    const conversationId = requestUrl.pathname.split("/")[2];
    const messages = await response.json();
    db.setMessages(conversationId, messages);
  }
};

function createResponse(obj) {
  const blob = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });
  const options = { status: 200, ok: true };
  return new Response(blob, options);
}

const readIndexDB = async (request) => {
  const requestUrl = new URL(request.url);

  // GET /users
  if (request.method === "GET" && requestUrl.pathname.match(/^\/users$/)) {
    const users = await db.getUsers();
    return createResponse(users);
  }

  // GET /conversations
  if (
    request.method === "GET" &&
    requestUrl.pathname.match(/^\/conversations$/)
  ) {
    const username = requestUrl.searchParams.get("user");
    const conversations = await db.getConversations(username);

    return createResponse(conversations);
  }

  // GET /conversations/:id/messages
  if (
    request.method === "GET" &&
    requestUrl.pathname.match(/^\/conversations\/.\/messages$/)
  ) {
    const conversationId = requestUrl.pathname.split("/")[2];
    const messagesPerCoversation = await db.getMessages(conversationId);
    return createResponse(messagesPerCoversation.messages);
  }
};

const networkOrDBFetch = (request) => {
  return new Promise((fullfill) => {
    fetch(request)
      .then((response) => {
        fullfill(response);
        if (response.ok) {
          updateImageCache(request, response.clone());
          updateIndexDB(request, response.clone());
        }
      })
      .catch(() => fullfill(readIndexDB(request)));
  });
};

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || networkOrDBFetch(event.request);
    })
  );
});
