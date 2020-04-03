function loadResult(text) {
    var data = makeDict(text);
    var thead = $("#game").createTHead();
    var row = thead.insertRow(0);
    row.insertCell(0).innerHTML = "試合ID"
    row.insertCell(1).innerHTML = "ゲーム開始時の日付"
    row.insertCell(2).innerHTML = "相手のチーム名";
    row.insertCell(3).innerHTML = "マップ";
    row.insertCell(4).innerHTML = "先攻";
    row.insertCell(5).innerHTML = "自チーム攻撃側オペレーターBAN";
    row.insertCell(6).innerHTML = "相手チーム攻撃側オペレーターBAN";
    row.insertCell(7).innerHTML = "自分チーム防衛側オペレーターBAN";
    row.insertCell(8).innerHTML = "相手チーム防衛側オペレーターBAN";
    row.insertCell(9).innerHTML = "試合結果";
    row.insertCell(10).innerHTML = "自チームスコア";
    row.insertCell(11).innerHTML = "相手チームスコア";
    var tbody = $("#game").createTBody();
    var row = tbody.insertRow(0);
    for (var i = 0; i < data["game"]["game_id"].length; i++) {
        row.insertCell(i).textContent = String(data["game"]["game_id"]);
        row.insertCell(i).textContent = String(data["game"]["date"]);
        row.insertCell(i).textContent = String(data["game"]["opponent"]);
        row.insertCell(i).textContent = String(data["game"]["map"]);
        row.insertCell(i).textContent = String(data["game"]["offense_first"]);
        row.insertCell(i).textContent = String(data["game"]["offense_ban_own"]);
        row.insertCell(i).textContent = String(data["game"]["offense_ban_opponent"]);
        row.insertCell(i).textContent = String(data["game"]["defense_ban_own"]);
        row.insertCell(i).textContent = String(data["game"]["defense_ban_opponent"]);
        row.insertCell(i).textContent = String(data["game"]["result"]);
        row.insertCell(i).textContent = String(data["game"]["score_own"]);
        row.insertCell(i).textContent = String(data["game"]["score_opponent"]);
    }
    $("#game").DataTable();
}

$(function() {
    var csv_url = getParam("url");
    if (csv_url) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            loadResult(xhr.responseText);
        }
        xhr.open("get", decodeURI(csv_url), true);
        xhr.send(null);
    }
    $("#drop-zone").on("drop", function(e) {
        e.preventDefault();
        var $result_zone = $("#result-zone");
        var files = e.originalEvent.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            loadResult(e.target.result);
        }
        reader.readAsText(files, "UTF-8");
    }).on("dragenter", function() {
        return false;
    }).on("dragover", function() {
        return false;
    });
});