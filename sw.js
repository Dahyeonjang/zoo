// 사주동물원 서비스워커 — 홈 화면에 둔 뒤 비행기 모드에서도 열리게 (2026-10-04)
// 모여셈 sw.js와 같은 방식: 네트워크 우선 → 실패하면 캐시. 온라인일 땐 늘 최신이다.
// 캐시 버전을 올리면 예전 캐시를 비우고 새로 받는다.
// ⚠️ 배포할 땐 목업 파일을 index.html로 올린다. 그래서 ASSETS에는 index.html만 적는다
//    (로컬 미리보기의 「동물원_목업.html」은 fetch 처리기가 처음 받을 때 캐시에 넣는다).
const CACHE = "zoo-v1";  // v1: 홈 화면 추가(manifest·아이콘·안내 카드) — 2026-10-04
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // 파일 하나가 없어도 설치가 통째로 깨지지 않게 하나씩 넣는다 — 로컬 미리보기엔 index.html이 없다
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
