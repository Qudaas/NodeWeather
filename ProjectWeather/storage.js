const FAVORITES_KEY = "favorites";
const HISTORY_KEY = "history";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    console.warn(`Помилка читання ${key}:`, e);
    return [];
  }
}

function write(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Помилка запису ${key}:`, e);
  }
}

function isValidCity(city) {
  return (
    city &&
    typeof city.name === "string" &&
    city.name.trim().length > 0 &&
    typeof city.lat === "number" &&
    typeof city.lon === "number"
  );
}

export function addFavorite(city) {
  if (!isValidCity(city)) {
    console.warn("Невалідні дані міста:", city);
    return;
  }
  const favorites = getFavorites();
  if (!favorites.find((c) => c.name === city.name)) {
    favorites.push(city);
    write(FAVORITES_KEY, favorites);
    console.info("Місто додано в улюблені:", city.name);
  } else {
    console.info("Місто вже є в улюблених:", city.name);
  }
}

export function getFavorites() {
  return read(FAVORITES_KEY);
}

export function removeFavorite(name) {
  const favorites = getFavorites().filter((c) => c.name !== name);
  write(FAVORITES_KEY, favorites);
  console.info("Місто видалено з улюблених:", name);
}

export function clearFavorites() {
  write(FAVORITES_KEY, []);
  console.info("Усі улюблені очищено");
}

export function isFavorite(name) {
  return getFavorites().some((c) => c.name === name);
}

export function addHistory(record) {
  const history = getHistory();
  const entry = {
    date: record.date || new Date().toISOString().split("T")[0],
    city: record.city,
    temp: record.temp ?? null,
    conditions: record.conditions ?? ""
  };

  history.unshift(entry);
  if (history.length > 10) history.pop();

  write(HISTORY_KEY, history);
  console.info("Додано запис в історію:", entry);
}

export function getHistory() {
  return read(HISTORY_KEY);
}

export function clearHistory() {
  write(HISTORY_KEY, []);
  console.info("Історію очищено");
}

export function getHistoryByCity(cityName) {
  return getHistory().filter((h) => h.city === cityName);
}

export function getStorageStats() {
  return {
    favoritesCount: getFavorites().length,
    historyCount: getHistory().length
  };
}

export function resetAll() {
  clearFavorites();
  clearHistory();
  console.info("Повне очищення storage виконано");
}

export function debugStorage() {
  console.group("Storage Debug");
  console.log("Favorites:", getFavorites());
  console.log("History:", getHistory());
  console.groupEnd();
}