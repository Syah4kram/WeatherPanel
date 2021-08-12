function getData(location) {
    return fetch("https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml") // Fetch API Data BMKG
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data =>{
            // Membuat Array untuk menyimpan data
            var timeArray = [];
            var temArray = [];
            var humArray = [];
            var winddirArray = [];
            var windspeedArray = [];
            var weatherArray = [];

            //Mendefinisikan Path
            pathTem = `data/forecast/area[@description="${location}"]/parameter[@id="t"]/timerange/value[@unit="C"]`;
            pathHum = `data/forecast/area[@description="${location}"]/parameter[@id="hu"]/timerange/value`;
            pathWeather = `data/forecast/area[@description="${location}"]/parameter[@id="weather"]/timerange/value`;
            pathTime = `data/forecast/area[@description="${location}"]/parameter[@id="hu"]/timerange`;
            pathWD = `data/forecast/area[@description="${location}"]/parameter[@id="wd"]/timerange/value[@unit="deg"]`;
            pathWS = `data/forecast/area[@description="${location}"]/parameter[@id="ws"]/timerange/value[@unit="MS"]`;

            //Memilih Node menggunakan Evaluate dan menyimpan data
            if(data.evaluate) {
                i = 0;
                var nodeT = data.evaluate(pathTem, data, null, XPathResult.ANY_TYPE, null);
                var nodeH = data.evaluate(pathHum, data, null, XPathResult.ANY_TYPE, null);
                var nodeWD = data.evaluate(pathWD, data, null, XPathResult.ANY_TYPE, null);
                var nodeWS = data.evaluate(pathWS, data, null, XPathResult.ANY_TYPE, null);
                var nodeW = data.evaluate(pathWeather, data, null, XPathResult.ANY_TYPE, null);
                var nodeTime = data.evaluate(pathTime, data, null, XPathResult.ANY_TYPE, null);
                var resultT = nodeT.iterateNext();
                var resultH = nodeH.iterateNext();
                var resultWD = nodeWD.iterateNext();
                var resultWS = nodeWS.iterateNext();
                var resultW = nodeW.iterateNext();
                var resultTime = nodeTime.iterateNext();

                while(resultT && resultH && resultWD && resultWS && resultW && resultTime) {
                    timeArray[i] = resultTime.getAttributeNode("datetime").nodeValue;
                    temArray[i] = resultT.childNodes[0].nodeValue;
                    humArray[i] = resultH.childNodes[0].nodeValue;
                    winddirArray[i] = resultWD.childNodes[0].nodeValue;
                    windspeedArray[i] = Math.floor(resultWS.childNodes[0].nodeValue);
                    weatherArray[i] = resultW.childNodes[0].nodeValue;

                    resultT = nodeT.iterateNext();
                    resultH = nodeH.iterateNext();
                    resultWD = nodeWD.iterateNext();
                    resultWS = nodeWS.iterateNext();
                    resultW = nodeW.iterateNext();
                    resultTime = nodeTime.iterateNext();
                    i++;
                }
            }

            // Menentukan waktu dan menampilkan data sesuai dengan waktu
            var days = "";
            var dataHours = "";
            var dates = [];
            var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            for (var i = 0; i < timeArray.length; i++) {
                var date = timeArray[i][6].toString() + timeArray[i][7].toString();
                var month = parseInt(timeArray[i][4] + timeArray[i][5]) - 1;
                var year = timeArray[i][0].toString() + timeArray[i][1].toString() + timeArray[i][2].toString() + timeArray[i][3].toString()
                var hour = timeArray[i][8].toString() + timeArray[i][9].toString();

                dates[i] = date;

                dataHours +=`
                    <div class="box">
                        <h3>${hour}.00</h3>
                        <img src="icons/w_${parseInt(weatherArray[i])}.png" width="85px"><br>
                        <i class="fas fa-temperature-high"></i> ${temArray[i]}<sup>o</sup>C<br>
                        <i class="fas fa-tint"></i> ${humArray[i]}%<br>
                        <i class="fas fa-location-arrow"></i> ${winddirArray[i]}<sup>o</sup><br>
                        <i class="fas fa-wind"></i> ${windspeedArray[i]} m/s<br>
                    </div>
                `;
                if(dates[i-1] != dates[i]){
                    days +=`<div class="box"><h3>${timeArray[i][6]}${timeArray[i][7]} ${months[month]} ${year}</h3></div>`
                }

                document.getElementById(`days${location}`).innerHTML = days;
                document.getElementById(`dataHours${location}`).innerHTML = dataHours;
            }
        })
}

// Membuat fungsi untuk menampilkan panel
function weatherPanel(locations) {
    body = "";
    for(i = 0; i < locations.length; i++){
        body += `
            <div class="container"><div class="box"><h1>${locations[i]}</h1></div></div>
            <div class="container" id="days${locations[i]}"></div>
            <div class="container" id="dataHours${locations[i]}"></div>
        `;
    }

    document.getElementById("main").innerHTML = body;
    for (i = 0; i < locations.length; i++) {
        getData(locations[i])
    }
}

// Memanggil fungsi
weatherPanel(["Cikarang", "Bekasi", "Cibinong"])

/* Gunakan kode berikut untuk menampilkan panel lebih dari tiga kota


function timeout() {
    setTimeout(function () {
        weather(["Cikarang", "Bekasi", "Cibinong"])
        timeout2();
    }, 20000);
}

function timeout2() {
    setTimeout(function () {
        weather(["Kota Bogor", "Depok", "Bandung"])
        timeout();
    }, 20000);
}

weather(["Cikarang", "Bekasi", "Cibinong"])
timeout()


*/