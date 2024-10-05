var aodActive = true;
var inactivityTimer;

var sysFont = '';
var sysWeight = '';
var bgimg = '';

function resetInactivity() {
    // Сбрасываем таймер
    clearTimeout(inactivityTimer);

    // Стартуем новый таймер на 5 секунд, только если AOD выключен
    if (!aodActive) {
        inactivityTimer = setTimeout(function() {
            document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
            document.getElementById("wallpaper").style.opacity = '30%';
            
            inactivityTimer = setTimeout(function() {
                document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
                document.getElementById("Time").style = '';
                document.getElementById("wallpaper").style = '';
                document.getElementById("Date").style = '';
                document.getElementsByTagName("main")[0].style.paddingBottom = '0%';
                aodActive = true;
                document.getElementById("Main").style = '';
                document.getElementById('Time').style.fontWeight = sysWeight;
            }, 5000);
        }, 5000);
    }
}

function GoFromAOD() {
    if (aodActive) {
        document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
        document.getElementById("Time").style.fontWeight = '1000';
        document.getElementById("Date").style.fontWeight = '300';
        document.getElementById("Time").style.letterSpacing = '0';
        document.getElementById("Time").style.marginLeft = '0';
        document.getElementById("Time").style.rotate = '0deg';
        document.getElementById("Time").style.marginBottom = '0';
        document.getElementById("wallpaper").style.opacity = '100%';
        document.getElementById("wallpaper").style.filter = 'blur(0px)';
        document.getElementById("wallpaper").style.width = '150vw';
        document.getElementById("wallpaper").style.height = '150vh';
        document.getElementById('Time').style.fontFamily = sysFont;
        document.getElementById('Date').style.fontFamily = sysFont;

        //document.getElementsByTagName("main")[0].style.paddingBottom = '50%';
        

        aodActive = false;
    } else {
        document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
        document.getElementById("Time").style = '';
        document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
        document.getElementById("wallpaper").style = '';
        document.getElementById('wallpaper').style = `background-image: url('${bgimg}') !important`;
        document.getElementsByTagName("main")[0].style.paddingBottom = '';
        document.getElementById("Date").style = '';
        document.getElementById('Time').style.fontFamily = sysFont;
        document.getElementById('Date').style.fontFamily = sysFont;
        document.getElementById('Time').style.fontWeight = sysWeight;

        aodActive = true;
    }

    // Сброс таймера при любом действии
    resetInactivity();
}

// Добавляем обработчики событий для сброса таймера при нажатиях и движениях
document.addEventListener('mousemove', resetInactivity);
document.addEventListener('click', resetInactivity);
document.addEventListener('keydown', resetInactivity);

// Стартуем таймер при загрузке страницы
resetInactivity();

function updateDateTime() {
    const now = new Date();

    // Форматируем время
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const timeString = now.toLocaleTimeString('ru-RU', optionsTime);

    // Форматируем дату
    const optionsDate = { weekday: 'short', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('ru-RU', optionsDate);

    // Приводим первую букву дня недели к заглавной
    const formattedDateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // Обновляем элементы
    document.getElementById('Time').textContent = timeString;
    document.getElementById('Date').textContent = formattedDateString;
}

// Обновляем время и дату каждые 1000 мс (1 секунда)
setInterval(updateDateTime, 1000);

// Первоначальное обновление
updateDateTime();

function SkipSetup() {
    document.getElementById("Setup").style.filter = 'opacity(0%)';
    setTimeout (
        function () {
            document.getElementById("Setup").style.display = 'none';
            document.getElementById("Setup").style.filter = 'opacity(100%);';
            
        }, 200
    ) 
}

function Vibrate(amp, time) {
    //Сейчас код в разработке, нет доступа к реальному железу
    //Смотрите на элемент Vibro в разделе I/O на дебаг панели
    const vibroIO = document.getElementById('vibroIO');
    vibroIO.style.backgroundColor = 'white';

    vibroIO.style.backgroundColor = `rgba(0, 0, 0, ${amp})`;
    setTimeout (
        function () {
            vibroIO.style.backgroundColor = 'white';
        }, time
    )    
}


// Функция для вычисления расстояния между двумя координатами
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = lat1 * Math.PI / 180; // Преобразование в радианы
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Возвращает расстояние в метрах
}



// Получение текущего местоположения и расчет расстояния
function checkDistance() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
            let displayDistance, unit;

            // Выбираем единицу измерения
            if (distance >= 1000) {
                displayDistance = (distance / 1000).toFixed(1); // Преобразование в километры с одним знаком после запятой
                unit = "км";
            } else {
                displayDistance = Math.round(distance); // Округляем до целых метров
                unit = "м";
            }

            // Формируем правильное склонение
            let textDistance = "До дома ";
            if (unit === "м") {
                if (displayDistance === 1) {
                    textDistance += `остался ${displayDistance} метр`;
                } else if (displayDistance > 1 && displayDistance < 5) {
                    textDistance += `осталось ${displayDistance} метра`;
                } else {
                    textDistance += `осталось ${displayDistance} метров`;
                }
            } else {
                textDistance += `осталось ${displayDistance} ${unit}`;
            }

            // Если расстояние меньше 100 метров, скрываем виджет
            if (distance < 100) {
                document.getElementById("Widget").classList.add("hide");
                setTimeout(function() {
                    document.getElementById("Widget").style.display = 'none';
                }, 500);
            } else {
                document.getElementById("Widget").classList.remove("hide");
                setTimeout(function() {
                    document.getElementById("Widget").style = '';
                }, 500);
            }

            // Обновляем текст с расстоянием
            document.getElementById("nav-info").textContent = textDistance;
        });
    } else {
        console.error("Геолокация не поддерживается вашим браузером.");
        document.getElementById("Widget").style.opacity = '0';
    }
}

// Запуск проверки каждую минуту
setInterval(checkDistance, 1000); // 60000 мс = 1 минута

// Первоначальная проверка
//checkDistance();


function settings() {
    document.getElementById("settings").style.display = 'block';
    setTimeout(
        function() {
            document.getElementById("settings").style.marginBottom = '0';
            document.getElementById("settings").style.opacity = '1';
        }, 100
    )
}

function changeWallpaper() {
    //document.getElementById("wallpaper")
}

var targetLat = 0;
var targetLon = 0;

async function updateUI() {
    try {
        // 1. Получение содержимого uuid.txt
        const uuidResponse = await fetch('uuid.txt');
        
        if (!uuidResponse.ok) {
            throw new Error('Ошибка при получении uuid.txt');
        }

        const uuidText = await uuidResponse.text(); // Разрешаем промис
        const uuid = uuidText.trim(); // Применяем .trim() после того, как промис разрешён

        // 2. Запрос на /sync с использованием полученного uuid
        const syncResponse = await fetch(`https://api.watchui.space/sync/?uuid=${uuid}`);

        if (!syncResponse.ok) {
            throw new Error('Ошибка при запросе на /sync');
        }

        // 3. Обработка ответа
        const responseData = await syncResponse.json();
        
        const dataString = responseData.data.replace(/&quot;/g, '"');
        const data = JSON.parse(dataString);

        localStorage.setItem('font', data.font);
        localStorage.setItem('fontWeight', data.fontWeight);
        localStorage.setItem('lat', data.coordinates.latitude);
        localStorage.setItem('lon', data.coordinates.longitude);

        // Обновление UI
        var fileName = data.background.match(/[^\/]+$/)[0];
        document.getElementById('wallpaper').style = `background-image: url('${fileName}') !important`;
        bgimg = fileName;
        console.log(fileName);  // bg3.png
        localStorage.setItem('bgimg', bgimg);

        document.getElementById('Time').style.fontFamily = data.font;
        document.getElementById('Date').style.fontFamily = data.font;

        sysFont = data.font;
        sysWeight = data.fontWeight;
        
        document.getElementById('Time').style.fontWeight = data.fontWeight;
        
        console.log('Координаты:', data.coordinates.latitude, data.coordinates.longitude);
        targetLat = data.coordinates.latitude;
        targetLon = data.coordinates.longitude;

    } catch (error) {
        console.error('Ошибка:', error);
    }
}


// Вызов функции для обновления UI
updateUI();

setInterval(() => updateUI(), 3000);

function fetchData(uuid) {
    console.log(`Запрос к API с UUID: ${uuid}`);
    fetch(`https://api.watchui.space/sync/?uuid=${uuid}`)
        .then(response => {
            console.log(`Ответ от сервера: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Данные от сервера:', data);
            updateUI(JSON.stringify(data));
        })
        .catch(error => console.error('Ошибка при запросе:', error));
}

function checkActivation(uuid) {
    fetch('https://api.watchui.space/activation/?action=check_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid: uuid })
    })
    .then(response => response.json())
    .then(data => {
        const activationDiv = document.getElementById('activation');
        
        if (data.status === 'success' && data.message === 'Device is activated') {
            if (localStorage.getItem('isActivated') !== 'true') {
                localStorage.setItem('isActivated', 'true');
                console.log('Устройство активировано');
                activationDiv.style = 'opacity: 0;';
                setTimeout(() => {
                    activationDiv.style.display = 'none';
                    fetchData(uuid); // Первый запуск fetchData при активации устройства
                }, 300);
            }
        } else {
            if (localStorage.getItem('isActivated') === 'true') {
                console.log('Устройство деактивировано');
            } else {
                console.log('Устройство не активировано');
            }
            localStorage.removeItem('isActivated');
            activationDiv.style = '';
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function startActivationCheck() {
    fetch('uuid.txt')
        .then(response => response.text())
        .then(uuid => {
            console.log(`UUID из файла: ${uuid}`);
            const activationDiv = document.getElementById('activation');
            activationDiv.innerHTML = `
                <p class="activbanner">Activate your watchUI</p>
                <p>${uuid}</p>
                <p class="activlink">watchui.space/setup</p>
            `;
            checkActivation(uuid); // Первичная проверка активации

            // Проверка активации каждые 3 секунды
            setInterval(() => checkActivation(uuid), 3000);
        })
        .catch(error => console.error('Ошибка:', error));
}

// Проверяем, активировано ли устройство
if (!localStorage.getItem('isActivated')) {
    const activationDiv = document.getElementById('activation');
    setTimeout(() => {
        activationDiv.style.display = 'flex';
    }, 300);
    startActivationCheck();
} else {
    const activationDiv = document.getElementById('activation');
    activationDiv.style = 'opacity: 0;';
    setTimeout(() => {
        activationDiv.style.display = 'none';
    }, 300);
    // Продолжаем периодические проверки даже при активации
    startActivationCheck();
}
