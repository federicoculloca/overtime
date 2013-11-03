var taskList = [];

function TKTask(title, hours, minutes) {
    this.title = title;
    this.hours = hours;
    this.minutes = minutes;
    this.uid = generateUID();
    this.dateAdded = Date(); // when de-serialized it will return a string anyway
}

function isTaskInDateRange(task, dateFrom, dateTo) {
    // set all hours to zero to compare only year, month and day
    currentTaskDate = new Date(task.dateAdded);
    currentTaskDate.setHour(0, 0, 0, 0);
    normalizedDateFrom = new Date(dateFrom);
    normalizedDateTo = new Date(dateTo);
    normalizedDateFrom.setHour(0, 0, 0, 0);
    normalizedDateTo.setHour(0, 0, 0, 0);
    return currentTaskDate >= normalizedDateFrom && currentTaskDate <= normalizedDateTo;
}

function generateUID(){
    var d = new Date().getTime();
    var uid = 'txxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uid;
};

function zeroPad(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

function redrawTaskList() {
    $('#taskList ul').empty();
    var firstElement = true;
    for (var i = taskList.length; i-->0; ) {
        var currentTask = taskList[i];
        var currentTaskNormDate = new Date(taskList[i].dateAdded);
        currentTaskNormDate.setHours(0, 0, 0, 0);
        currentTaskNormDate.setDate(1);
        if(!firstElement) {
            var previousTaskNormDate = new Date(taskList[i+1].dateAdded);
            previousTaskNormDate.setHours(0, 0, 0, 0);
            previousTaskNormDate.setDate(1);
            if (currentTaskNormDate.getTime() != previousTaskNormDate.getTime()) {
                addDateSeparator($('#taskList ul'), currentTaskNormDate);
            }
        } else {
            firstElement = false;
            addDateSeparator($('#taskList ul'), currentTaskNormDate);
        }
        var task = "<li id='" + currentTask.uid + "'><a href='#'><h1>" + currentTask.title + "</h1><h2>" + zeroPad(currentTask.hours, 2) + ":" + zeroPad(currentTask.minutes, 2) + "</h2></a><a href='#' onclick='removeTaskFromList(\"" + currentTask.uid + "\")'></a></li>";
        $('#taskList ul').append(task).listview('refresh');
    }
}

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

function addDateSeparator(listView, date) {
    var divider = "<li data-role='list-divider'>" +
        monthNames[date.getMonth()] + " " +
        date.getFullYear() + 
        "</li>";
    listView.append(divider);
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function removeTaskFromList(uid) {
    for (var i = taskList.length; i-->0; ) {
        var currentTask = taskList[i];
        if(currentTask.uid == uid) {
            if (confirm ("Remove selected task?")) {
                taskList.remove(i);
            }
            break;
        }
    }
    window.localStorage.setItem('taskList', JSON.stringify(taskList));
    redrawTaskList();
}

function setInitialReportDates() {
    $('#endDate').val(new Date().toLocaleDateString());
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    $('#startDate').val(startDate.toLocaleDateString());
}

$(document).ready( function () {
    $('#addTaskOk').click(function () {
        var title = $('#addTaskTitle').val();
        var hours = parseInt($('#addTaskDurationH').val(), 10) || 0;
        var minutes = parseInt($('#addTaskDurationM').val(), 10) || 0;
        var newTask = new TKTask(title, hours, minutes);
        taskList.push(newTask);
        window.localStorage.setItem('taskList', JSON.stringify(taskList));
        $('#addTaskTitle').val("");
        $('#addTaskDurationH').val("");
        $('#addTaskDurationM').val("");
        redrawTaskList();
    });

    $('#listClearButton').click(function () {
        if(confirm("Delete all tasks?")) {
            taskList = [];
            window.localStorage.removeItem('taskList');
            $('#taskList ul').empty();
        }
    });

    $('#backFromAddTask').click(function () {
        $('#addTaskTitle').val("");
        $('#addTaskDurationH').val("");
        $('#addTaskDurationM').val("");
    });

    $('#backFromReport').click(function () {
        setInitialReportDates();
    });

    taskList = JSON.parse(window.localStorage.getItem('taskList')) || [];
    if (taskList.length != 0) {
        redrawTaskList();
    }
    setInitialReportDates();
});


