const ua = document.querySelector('.search-box');
ua.style.display = 'none';

const VC_KEY = 'YSJBGSYSQPENB9XUVRGNG37YZ';

$(document).ready(function () {
  $.getJSON('current.city.list.json', function (cities) {
    let selectedCity = null;

    $('select').on('change', function () {
      let out = '';
      for (const city of cities) {
        if (city.country === $(this).val()) {
          ua.style.display = 'flex';
          out += `<p data-lat="${city.coord.lat}" data-lon="${city.coord.lon}">${city.name}</p>`;
        }
      }
      $('#city').html(out);

      $('#city p').on('click', function () {
        selectedCity = {
          lat: $(this).data('lat'),
          lon: $(this).data('lon'),
          name: $(this).text()
        };

        // показуємо блок з датами
        $('#date-range').show();

        // завантаження поточного 7-денного прогнозу за замовчуванням
        loadWeather(selectedCity.lat, selectedCity.lon, selectedCity.name);
      });
    });

    // натискаємо кнопку "Показати" → підставляємо обраний діапазон
    $('#load-range').on('click', function () {
      if (!selectedCity) return;
      const start = $('#start-date').val();
      const end = $('#end-date').val();

      if (start && end) {
        loadWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, start, end);
      } else {
        alert('Будь ласка, виберіть обидві дати');
      }
    });

    function loadWeather(lat, lon, cityName, start = '', end = '') {
      let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}`;
      if (start && end) url += `/${start}/${end}`;
      url += `?unitGroup=metric&include=days&key=${VC_KEY}&contentType=json`;

      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const days = data.days || [];
          let out = '';
          out += '<hr>';
          out += `Місто: <b>${cityName}</b><br>`;

          days.forEach((d) => {
            out += `
              <div style="margin:10px 0;padding-bottom:8px;border-bottom:1px dashed #ccc">
                <div><b>${d.datetime}</b> — ${d.conditions || ''}</div>
                <div>Температура: <b>${Math.round(d.tempmin)}…${Math.round(d.tempmax)}°C</b></div>
                <div>Вологість: <b>${d.humidity ?? '—'}%</b> · Вітер: <b>${d.windspeed ?? '—'} м/с</b></div>
                <div>Опади: <b>${d.precip ?? 0} мм</b> · Хмарність: <b>${d.cloudcover ?? '—'}%</b></div>
              </div>`;
          });

          $('#weather').html(out);
        })
        .catch((e) => {
          console.error(e);
          $('#weather').html('<p style="color:red">Помилка завантаження прогнозу</p>');
        });
    }
  });
});
