const ua = document.querySelector('.search-box')
ua.style.display = "none"
$(document) .ready(function() {
    $.getJSON('current.city.list.json', function(data){     
    $('select').on('change', function(){
        var out='';
        for (var key in data){
            if (data[key].country==$(this).val()){
                ua.style.display = "flex"
                out +=`<p value="${data[key].id}">${data[key].name}</p>`;
            }
        }
        
        $('#city').html(out);
        $('#city p').on('click', function(){
            $.get(
                "https://api.openweathermap.org/data/2.5/weather?",
                {
                    "id": $(this).attr('value'),
                    "appid": "ccb32c048e20c9231b63123395cdc52c"
                },
                function(data) {
                    let out='';
                    out +='<hr>'
                    out +='Місто:  <b>'+(data.name)+'</b><br>'
                    out +='Погода: <b>'+data.weather[0].main+'</b> <img style="margin: 0px 0px -20px -10px" style="width:80px" style="height:80px" src="https://openweathermap.org/img/w/'+data.weather[0].icon+'.png"><br>';
                    out +='Температура: <b>'+Math.round(data.main.temp-273)+'&#176;C</b><br>';
                    out +='Вологість: <b>'+data.main.humidity+'%</b><br>';
                    out +='Тиск: <b>'+Math.round(data.main.pressure*0.00750063755419211*100)+'мм.рт.ст</b><br>';
                    out +='Видимість: <b>'+(data.visibility/1000)+'км</b><br>'
                    out +='Вітер: <b>'+(data.wind.speed)+'м/c</b><br>'
                    console.log(data.main)
                    $('#weather').html(out)
                }
            )
        })
        })    
    }) 
})



//"https://api.openweathermap.org/data/2.5/weather"