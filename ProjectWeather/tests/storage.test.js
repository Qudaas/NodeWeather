import {
  addFavorite,
  getFavorites,
  removeFavorite,
  addHistory,
  getHistory
} from "./storage.js";

beforeEach(() => {
  localStorage.clear();
});

test("Додає місто в улюблені", () => {
  addFavorite({ name: "Kyiv" });
  expect(getFavorites()).toEqual([{ name: "Kyiv" }]);
});

test("Видаляє місто з улюблених", () => {
  addFavorite({ name: "Lviv" });
  removeFavorite("Lviv");
  expect(getFavorites()).toEqual([]);
});

test("Додає запис в історію і зберігає максимум 10", () => {
  for (let i = 1; i <= 12; i++) {
    addHistory({ date: `2025-01-${i}`, city: `City${i}` });
  }
  const history = getHistory();
  expect(history.length).toBe(10);
  expect(history[0].city).toBe("City12"); // останній додається першим
});
