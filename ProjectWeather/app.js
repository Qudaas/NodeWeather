
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
          out += `<p data-idx="${city.id}" data-lat="${city.coord.lat}" data-lon="${city.coord.lon}">${city.name}</p>`;
        }
      }
      $('#city').html(out);

      $('#city p').on('click', function () {
        const lat = $(this).data('lat');
        const lon = $(this).data('lon');
        selectedCity = {
            lat: $(this).data('lat'),
            lon: $(this).data('lon'),
            name: $(this).text()
        };
        $('#date-range').show(); 

            loadWeather(selectedCity.lat, selectedCity.lon, selectedCity.name); 


            days.forEach((d) => {
              out += `
                <div style="margin:10px 0;padding-bottom:8px;border-bottom:1px dashed #ccc">
                  <div><b>${d.datetime}</b> — ${d.conditions || d.description || ''}</div>
                  <div>Температура: <b>${Math.round(d.tempmin)}…${Math.round(d.tempmax)}°C</b></div>
                  <div>Вологість: <b>${d.humidity ?? '—'}%</b> · Вітер: <b>${d.windspeed ?? '—'} м/с</b></div>
                  <div>Опади (добові): <b>${d.precip ?? 0} мм</b> · Хмарність: <b>${d.cloudcover ?? '—'}%</b></div>
                </div>`;
            });

            $('#weather').html(out);
            console.log('[VC raw]', data);
          })
          .catch((e) => {
            console.error(e);
            $('#weather').html('<p style="color:red">Помилка завантаження прогнозу</p>');
          });
      });
    });
  });
});
