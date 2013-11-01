var taskList = [];

function TKTask(title, hours, minutes) {
    this.title = title;
    this.hours = hours;
    this.minutes = minutes;
    this.uid = generateUID();
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
    for (var i = taskList.length; i-->0; ) {
        var currentTask = taskList[i];
        var task = "<li id='" + currentTask.uid + "'><a href='#'><h1>" + currentTask.title + "</h1><h2>" + zeroPad(currentTask.hours, 2) + ":" + zeroPad(currentTask.minutes, 2) + "</h2></a><a href='#'></a></li>";
        $('#taskList ul').append(task).listview('refresh');
    }
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
        taskList = [];
        window.localStorage.removeItem('taskList');
        $('#taskList ul').empty();
    });

    taskList = JSON.parse(window.localStorage.getItem('taskList')) || [];
    if (taskList.length != 0) {
        redrawTaskList();
    }
});


