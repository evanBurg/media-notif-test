const version = 1.0;
const cacheName = `Notification-Demo ${version}`;
const filesToCache = ["index.html", "notify.js", "https://raw.githubusercontent.com/anars/blank-audio/master/10-seconds-of-silence.mp3"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      for (const file of filesToCache) {
        try {
          await cache.add(file);
        } catch (e) {
          console.error(file, e);
        }
      }
    })
  );
  console.log("Service Worker installed...");
});

self.addEventListener("fetch", (event) => {
  console.log(event.request.url, new Date());
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      // Fallback to network and if it fails, return the cached page hopefully
      return fetch(event.request).catch((error) => {
        console.log("Network error...", error);
        console.log("Attempting Offline fallback.");
        return caches.open(cacheName).then((cache) => {
          return cache.match("index.html");
        });
      });
    })
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activate");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            console.log("Service Worker: Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
