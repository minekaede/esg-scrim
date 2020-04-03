function drawGameTable(data) {
    $("#game").append(
        $("<thead></thead>").append(
            $("<tr></tr>")
            .append($("<th></th>").text("試合ID"))
            .append($("<th></th>").text("ゲーム開始時の日付"))
            .append($("<th></th>").text("相手のチーム名"))
            .append($("<th></th>").text("マップ"))
            .append($("<th></th>").text("先攻"))
            .append($("<th></th>").text("自チーム攻撃側オペレーターBAN"))
            .append($("<th></th>").text("相手チーム攻撃側オペレーターBAN"))
            .append($("<th></th>").text("自チーム防衛側オペレーターBAN"))
            .append($("<th></th>").text("相手チーム防衛側オペレーターBAN"))
            .append($("<th></th>").text("試合結果"))
            .append($("<th></th>").text("自チームスコア"))
            .append($("<th></th>").text("相手チームスコア"))
        )
    );
    var tbody = $("<tbody></tbody>");
    for (var i = 0; i < data["game"]["game_id"].length; i++) {
        tbody.append(
            $("<tr></tr>")
            .append($("<th></th>").text(String(data["game"]["game_id"][i])))
            .append($("<th></th>").text(String(data["game"]["date"][i])))
            .append($("<th></th>").text(String(data["game"]["opponent"][i])))
            .append($("<th></th>").text(String(data["game"]["map"][i])))
            .append($("<th></th>").text(String(data["game"]["offense_first"][i])))
            .append($("<th></th>").text(String(data["game"]["offense_ban_own"][i])))
            .append($("<th></th>").text(String(data["game"]["offense_ban_opponent"][i])))
            .append($("<th></th>").text(String(data["game"]["defense_ban_own"][i])))
            .append($("<th></th>").text(String(data["game"]["defense_ban_opponent"][i])))
            .append($("<th></th>").text(String(data["game"]["result"][i])))
            .append($("<th></th>").text(String(data["game"]["score_own"][i])))
            .append($("<th></th>").text(String(data["game"]["score_opponent"][i])))
        );
    }
    $("#game").append(tbody);
    $("#game").DataTable();
}

function loadResult(text) {
    var data = makeDict(text);
    drawGameTable(data);
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