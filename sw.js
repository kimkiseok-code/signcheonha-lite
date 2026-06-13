// SignCheonha Lite Service Worker
var CACHE = 'scl-v1';
var ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Gothic+A1:wght@900&family=Black+Han+Sans&family=Noto+Sans+KR:wght@900&family=Nanum+Gothic:wght@800&family=Do+Hyeon&family=Gugi&family=Jua&family=Stylish&family=Yeon+Sung&family=Nanum+Myeongjo:wght@800&family=Gowun+Dodum&family=Gowun+Batang&family=Song+Myung&family=Hahmlet:wght@700&family=IBM+Plex+Sans+KR:wght@700&family=Sunflower:wght@700&family=Gaegu:wght@700&family=Dongle:wght@700&family=Gamja+Flower&family=Poor+Story&family=Single+Day&family=Hi+Melody&family=Cute+Font&family=Jeju+Gothic&family=Jeju+Myeongjo&family=Jeju+Hallasan&family=Dokdo&family=East+Sea+Dokdo&family=Nanum+Pen+Script&family=Nanum+Brush+Script&display=swap'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(['/index.html']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(res) {
        if (!res || res.status !== 200) return res;
        var clone = res.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });
        return res;
      }).catch(function() {
        return caches.match('/index.html');
      });
    })
  );
});
