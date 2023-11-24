// Sound clip when the alarm starts
var sound = new Audio("iphone_alarm.mp3")
sound.loop = true;

let arr = []
let setHr = document.getElementById("hr")
let setMin = document.getElementById("min")
let setSec = document.getElementById("sec")
let setAMPM = document.getElementById("ampm")
let colorChange = document.getElementsByClassName("time")
let incompleteAlarmsholder = document.getElementById("incomplete-alarms")


// Selected by the visitor :

let totalHrs = 12
// Range from 1 to 12 hrs
for (let i = 1; i <= totalHrs; i++) {
    setHr.options[setHr.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalMins = 59
// Range of 00-59 minutes
for (let i = 0; i <= totalMins; i++) {
    setMin.options[setMin.options.length] = new Option(i < 10 ? '0' + i : i)
}

let totalSecs = 59
// Range of 00-59 seconds
for (let i = 0; i <= totalSecs; i++) {
    setSec.options[setSec.options.length] = new Option(i < 10 ? '0' + i : i)
}

let morningornoon = ["AM", "PM"]
// setting the AM, PM
for (let i = 0; i < morningornoon.length; i++) {
    setAMPM.options[setAMPM.options.length] = new Option(morningornoon[i])
}


// Function to display the time:
function realTime() {
    const date = new Date()
    let hr = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let AMPM = ""

    if (date.getHours() == 0) {
        hr = 12
    }

    if (date.getHours() >= 12) {
        if (date.getHours() == 12) {
            hr = 12
        } else {
            hr = hr - 12
        }

        AMPM = "PM"
    } else {
        AMPM = "AM"
    }

    if (hr.toString().length == 1) {
        hr = '0' + hr
    }
    if (min < 10) {
        min = '0' + min
    }
    if (sec < 10) {
        sec = '0' + sec
    }

    document.getElementById("realtime").innerHTML = hr + ":" + min + ":" + sec + AMPM
}
setInterval(realTime, 1000)


// Creating new Alarm time element in form of list:
var createNewTaskElement = function (alarmString) {
    let listItem = document.createElement("li")
    let label = document.createElement("label")
    let deleteButton = document.createElement("button")

    deleteButton.innerText = "Delete" + alarmString[0]
    deleteButton.className = "delete"
    label.innerText = alarmString

    listItem.appendChild(label)
    listItem.appendChild(deleteButton)
    return listItem
}


// Clicking the alarm time button which triggers creating the alarm time element:
document.getElementById("setButton").addEventListener("click", function () {
    let selectedHr = setHr.options[setHr.selectedIndex].value;
    let selectedMin = setMin.options[setMin.selectedIndex].value;
    let selectedSec = setSec.options[setSec.selectedIndex].value;
    let selectedAMPM = setAMPM.options[setAMPM.selectedIndex].value;
    console.log(selectedHr, selectedMin, selectedSec, selectedAMPM)
    let len = arr.length + 1

    // Getting today's time
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let alarmhr = parseInt(selectedHr)
    if (selectedAMPM == "PM") {
        alarmhr = 12 + alarmhr
    }

    if (selectedAMPM == "AM" && alarmhr == 12) {
        alarmhr = 0
    }
    if (alarmhr.toString.length == 1) {
        alarmhr = '0' + alarmhr
    }
    let timeForAlarm = alarmhr + ":" + selectedMin + ":" + selectedSec
    var d = new Date(`${today} ${timeForAlarm}`);

    // Getting time in milliseconds 
    var milliseconds = d.getTime();

    // storing alarm time data in an array
    arr.push([selectedHr, selectedMin, selectedSec, selectedAMPM, milliseconds, len])

    // milliseconds time is used for sorting the array and the first element in the array
    // will be the first alarm to get triggered
    arr = arr.sort((a, b) => a[4] - b[4])
    let val = len.toString() + ") " + selectedHr + ":" + selectedMin + ":" + selectedSec + ":" + selectedAMPM

    // creating the alarm list element which includes delete button
    var listItem = createNewTaskElement(val)
    incompleteAlarmsholder.appendChild(listItem)
    // This function is used for deleting an alarm element
    bindAlarmEvents(listItem)

    // function to check alarm time with real time
    setInterval(() => {
        const date = new Date()
        let hr = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        let AMPM = "AM"
        if (date.getHours() == 0) {
            hr = 12
        }

        if (date.getHours() > 12) {
            if (date.getHours() == 12) {
                hr = 12
            } else {
                hr = hr - 12
            }
            AMPM = "PM"
        } else {
            AMPM = "AM"
        }

        if (hr.toString().length == 1) {
            hr = '0' + hr
        }
        if (min < 10) {
            min = '0' + min
        }
        if (sec < 10) {
            sec = '0' + sec
        }

        // When real time matches with alarm time, the alarm shows an alert and then starts ringing
        if (arr.length != 0 && arr[0][0] == hr && arr[0][1] == min && arr[0][2] == sec && arr[0][3] == selectedAMPM) {
            alert("Alarm is ringing")
            sound.play()
        }
    }, 1000)
})

// When set clear button is clicked, alarm sound stops
document.getElementById("setClear").addEventListener("click", function () {
    sound.pause()
})
var indexDel = 0

// To delete  perticular alarm from the recent listed alarms:
var deleteAlarm = function () {
    let listItem = this.parentNode
    var ul = listItem.parentNode
    var deleteButton = listItem.querySelector("button.delete")
    indexDel = parseInt(deleteButton.innerHTML[6])
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][5] == indexDel) {
            arr.splice(i, 1)
        }
    }
    ul.removeChild(listItem)
}
var bindAlarmEvents = function (alarmListItem) {
    var deleteButton = alarmListItem.querySelector("button.delete")
    deleteButton.onclick = deleteAlarm
}