let timerValue = 0
let timerInterval = null
const timerDisplay = document.querySelector('.timer-value')
const pauseBtn = document.querySelector('.pause')
const timerOptions = document.querySelector('.timer-selector')
const timerOptionList = timerOptions.querySelectorAll('.timer-option')

// Selected timer option function
const toggleOption = (params) => {
    timerOptionList.forEach((item, index) => {
        item.setAttribute("data-selected", "false")
        if (params == item.innerHTML) {
            item.setAttribute("data-selected", "true")
            timerDisplay.innerHTML = `${fixString(item.dataset.value)}:00`
            intialPageLoad()
            pauseBtn.dataset.pause = "true"
            if (timerValue != item.dataset.value) { storeState('DEL') }
            pauseTimer()
            timerOptions.style.setProperty('--active-pos', `translateX(${index}00%)`)
        }
    })
}

// Pause, start and delete timer function
const pauseTimer = () => {
    timerOptionList.forEach(item => item.dataset.selected == "true" ? timerValue = item.dataset.value : '')
    if (pauseBtn.dataset.pause == "false") {
        timerInterval = setInterval(() => {
            current = storeState('GET') || { minutes: 1, seconds: 1, value: 0 }
            current.value += 1
            timerDisplay.innerText = `${fixString(timerValue - current.minutes)}:${fixString(60 - current.seconds)}`
            document.querySelector('.dial').style
                .setProperty('--angle', `${360 - Math.floor((360 * current.value) / (60 * timerValue))}deg`)
            if (current.seconds == 60) {
                current.minutes += 1; current.seconds = 1
            }
            else { current.seconds += 1 }
            if (timerValue < current.minutes) {
                clearInterval(timerInterval)
                pauseBtn.innerHTML = "START"
                pauseBtn.dataset.pause = "false"
                intialPageLoad(true)
                storeState('DEL')
            } else {
                storeState('POST')
            }

        }, 1000);
        pauseBtn.innerHTML = "PAUSE"
        pauseBtn.dataset.pause = "true"
    } else {
        clearInterval(timerInterval)
        pauseBtn.innerHTML = "START"
        pauseBtn.dataset.pause = "false"
    }
}

//Function to fix time strings for e.g. 9 => '09' 40 => '40'
const fixString = (val) => {
    if (val >= 10) {
        return val.toString()
    } else {
        return '0'.concat(val.toString())
    }
}

//Show and Close settings modal
const toggleSettings = (params) => {
    if (params == 'on') {
        document.querySelector('#settings').showModal()
        document.querySelector('#settings').querySelector('.model').dataset.view = "true"
    } else if (params == 'off') {
        document.querySelector('#settings').querySelector('.model').dataset.view = "false"
        setTimeout(() =>
            document.querySelector('#settings').close()
            , 500)
    }
}

//Function to change theme of the dial 
const toggleTheme = () => {
    const theme = {}
    document.querySelector('.input-collection').querySelectorAll('input').forEach(item => {
        item.value > 0 ? document.querySelector(`[data-type=${item.id}]`).dataset.value = item.value : null
    })
    document.querySelectorAll('[name="color"]').forEach(item => {
        if (item.checked) {
            theme['colorType'] = item.value
        }
    })
    document.querySelectorAll('[name="font"]').forEach(item => {
        if (item.checked) {
            theme['fontType'] = item.value
        }
    })
    document.body.style.setProperty('--color-type', `var(--${theme.colorType || 'primary'}-color)`)
    document.body.style.setProperty('--font-type', theme.fontType || 'sans-serif')
    intialPageLoad(true)
    toggleSettings('off')
}

//Reset dial Function
const intialPageLoad = (params) => {
    params ?
        timerOptionList.forEach(item => {
            if (item.dataset.selected == "true") {
                timerDisplay.innerHTML = `${fixString(item.dataset.value)}:00`
            }
        }) : null
    document.querySelector('.input-collection').querySelectorAll('input').forEach(item => item.value = null)
    console.log(getComputedStyle(document.body).getPropertyValue('--color-type'));
    console.log(getComputedStyle(document.body).getPropertyValue('--font-type'));
    document.querySelector('.dial').style.setProperty('--angle', '360deg')
}

//Function to get,store and delete time elapsed in timer to localstorage
function storeState(method) {
    if (method == 'POST') {
        localStorage.setItem('state', JSON.stringify(current))
    } else if (method == 'GET') {
        return JSON.parse(localStorage.getItem('state'))
    } else if (method == 'DEL') {
        localStorage.clear()
    }
}

//Reset button
const ResetTimer = () => {
    storeState('DEL')
    pauseBtn.dataset.pause = "true"
    pauseTimer()
    intialPageLoad(true)
}

intialPageLoad(true)

//Auto run function
let count = 0
const AutoStart = () => {
    pauseTimer()
    setTimeout(() => {
        count++
        if (count > 5) {
            clearInterval(timerInterval)
            timerOptions.querySelector('[data-type="pomodoro"]').click()
            return
        } else if (count == 5) {
            timerOptions.querySelector('[data-type="long-break"]').click()
            clearInterval(timerInterval)
            AutoStart()
        } else if (count < 5) {
            count % 2 != 0
            ? timerOptions.querySelector('[data-type="short-break"]').click()
            : timerOptions.querySelector('[data-type="pomodoro"]').click()
            clearInterval(timerInterval)
            AutoStart()
        } 
    }, parseInt(timerOptions.querySelector('[data-selected="true"]').dataset.value) * 60000)
}