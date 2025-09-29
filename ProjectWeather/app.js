
const ua = document.querySelector('.search-box');
ua.style.display = 'none';

const VC_KEY = 'YSJBGSYSQPENB9XUVRGNG37YZ';

$(document).ready(function () {
  $.getJSON('current.city.list.json', function (cities) {
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

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&include=days&key=${VC_KEY}&contentType=json`;

        fetch(url)
          .then((r) => r.json())
          .then((data) => {
            const days = (data.days || []).slice(0, 7);
            let out = '';
            out += '<hr>';
            out += `Місто: <b>${data.address}</b><br>`;
            out += `<div style="margin-top:6px"></div>`;

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
