// Downloadversie: voortgang blijft bewaard op dit apparaat
window.Store = { persistent: true,
  load(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  save(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} } };
