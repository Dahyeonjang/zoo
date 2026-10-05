// 사주동물원 옛 주소의 서비스워커 — 2026-10-05 이사 뒤 스스로 물러난다.
// 옛 캐시(zoo-v1)에 남은 옛 앱이 비행기 모드에서 뜨지 않게 캐시를 비우고 등록을 푼다.
// 이 주소의 화면은 이제 이사 페이지(index.html)뿐이다 — 새 주소: https://soldamlab.com/zoo/
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("zoo-")).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
