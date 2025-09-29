import {
  addFavorite,
  getFavorites,
  removeFavorite,
  clearFavorites,
  addHistory,
  getHistory,
  clearHistory
} from "./storage.js";

$(document).ready(function () {
  $.getJSON("current.city.list.json", function (cities) {
    let selectedCity = null;

    $("select").on("change", function () {
      let out = "";
      for (const city of cities) {
        if (city.country === $(this).val()) {
          out += `<p data-lat="${city.coord.lat}" data-lon="${city.coord.lon}">${city.name}</p>`;
        }
      }
      $("#city").html(out);

      $("#city p").on("click", function () {
        selectedCity = {
          lat: $(this).data("lat"),
          lon: $(this).data("lon"),
          name: $(this).text()
        };

        addHistory({ city: selectedCity.name });
        renderHistory();

        loadWeather(selectedCity.lat, selectedCity.lon, selectedCity.name);
      });
    });

    $("#add-fav").on("click", function () {
      if (selectedCity) {
        addFavorite(selectedCity);
        renderFavorites();
      }
    });

    $("#clear-fav").on("click", function () {
      clearFavorites();
      renderFavorites();
    });

    $("#clear-history").on("click", function () {
      clearHistory();
      renderHistory();
    });

    function renderFavorites() {
      const favs = getFavorites();
      if (favs.length === 0) {
        $("#favorites").html("<p><i>Немає улюблених</i></p>");
        return;
      }
      let out = favs
        .map(
          (f) =>
            `<li>${f.name} <button data-city="${f.name}">×</button></li>`
        )
        .join("");
      $("#favorites").html(`<ul>${out}</ul>`);

      $("#favorites button").on("click", function () {
        removeFavorite($(this).data("city"));
        renderFavorites();
      });
    }

    function renderHistory() {
      const hist = getHistory();
      if (hist.length === 0) {
        $("#history").html("<p><i>Історія порожня</i></p>");
        return;
      }
      let out = hist.map((h) => `<li>${h.date} — ${h.city}</li>`).join("");
      $("#history").html(`<ul>${out}</ul>`);
    }

    function loadWeather(lat, lon, cityName) {
      const VC_KEY = "YSJBGSYSQPENB9XUVRGNG37YZ";
      let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&include=days&key=${VC_KEY}&contentType=json`;

      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const days = data.days || [];
          let out = "";
          out += "<hr>";
          out += `Місто: <b>${cityName}</b><br>`;

          days.forEach((d) => {
            out += `
              <div style="margin:10px 0;padding-bottom:8px;border-bottom:1px dashed #ccc">
                <div><b>${d.datetime}</b> — ${d.conditions || ""}</div>
                <div>Температура: <b>${Math.round(d.tempmin)}…${Math.round(
              d.tempmax
            )}°C</b></div>
                <div>Вологість: <b>${d.humidity ?? "—"}%</b> · Вітер: <b>${
              d.windspeed ?? "—"
            } м/с</b></div>
                <div>Опади: <b>${d.precip ?? 0} мм</b> · Хмарність: <b>${
              d.cloudcover ?? "—"
            }%</b></div>
              </div>`;
          });

          $("#weather").html(out);
        })
        .catch((e) => {
          console.error(e);
          $("#weather").html(
            '<p style="color:red">Помилка завантаження прогнозу</p>'
          );
        });
    }

    renderFavorites();
    renderHistory();
  });
});
