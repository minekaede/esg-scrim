var data; // csvから取得したデータ
var table; // 表示中の表

function drawBombAnalysis() {
    initResult();
    $("<div>", {
        class: "row form-group",
        id: "period-input"
    }).appendTo("#analysis-area");
    $("<label>", {
        class: "col-1 col-form-label",
        for: "date-input-start",
        text: "期間："
    }).appendTo("#period-input");
    $("<div>", {
        class: "col-5"
    }).append($("<input>", {
        class: "form-control",
        id: "date-input-start",
        type: "date",
        value: data["game"]["date"].reduce((a, b) => a < b ? a : b)
    })).appendTo("#period-input");
    $("<div>", {
        class: "col-1",
        text: "～"
    });
    $("<div>", {
        class: "col-5"
    }).append($("<input>", {
        class: "form-control",
        id: "date-input-end",
        type: "date",
        value: data["game"]["date"].reduce((a, b) => a > b ? a : b)
    })).appendTo("#period-input");
}

function drawGameTable() {
    /* #table-area内に表を設置 */
    initResult();
    $("<table>", {
        class: "table table-bordered table-hover",
        id: "game",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#game").append(
        $("<thead>").append(
            $("<tr>")
            .append($("<th>").text("試合ID"))
            .append($("<th>").text("日付"))
            .append($("<th>").text("チーム名"))
            .append($("<th>").text("マップ"))
            .append($("<th>").text("先攻"))
            .append($("<th>").text("攻撃オペBAN(自)"))
            .append($("<th>").text("攻撃オペBAN(相)"))
            .append($("<th>").text("防衛オペBAN(自)"))
            .append($("<th>").text("防衛オペBAN(相)"))
            .append($("<th>").text("勝敗"))
            .append($("<th>").text("スコア(自)"))
            .append($("<th>").text("スコア(相)"))
        )
    );
    var tbody = $("<tbody>");
    for (var i = 0; i < data["game"]["game_id"].length; i++) {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(data["game"]["game_id"][i])))
            .append($("<th>").text(String(data["game"]["date"][i])))
            .append($("<th>").text(String(data["game"]["opponent"][i])))
            .append($("<th>").text(String(data["game"]["map"][i])))
            .append($("<th>").text(String(data["game"]["offense_first"][i]) == "own" ? "自" : "相"))
            .append($("<th>").text(String(data["game"]["offense_ban_own"][i])))
            .append($("<th>").text(String(data["game"]["offense_ban_opponent"][i])))
            .append($("<th>").text(String(data["game"]["defense_ban_own"][i])))
            .append($("<th>").text(String(data["game"]["defense_ban_opponent"][i])))
            .append($("<th>").text(String(data["game"]["result"][i]) == "win" ? "勝" : "負"))
            .append($("<th>").text(String(data["game"]["score_own"][i])))
            .append($("<th>").text(String(data["game"]["score_opponent"][i])))
        );
    }
    $("#game").append(tbody);
    table = $("#game").DataTable();
    table.on("draw", function() {
        $("#game tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });
    table.draw();
}

function drawRoundTable() {
    /* #table-area内に表を設置 */
    initResult();
    $("<table>", {
        class: "table table-bordered table-hover",
        id: "round",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#round").append(
        $("<thead>").append(
            $("<tr>")
            .append($("<th>").text("試合ID"))
            .append($("<th>").text("ラウンド数"))
            .append($("<th>").text("攻防"))
            .append($("<th>").text("防衛地点"))
            .append($("<th>").text("勝敗"))
        )
    );
    var tbody = $("<tbody>");
    for (var i = 0; i < data["round"]["game_id"].length; i++) {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(data["round"]["game_id"][i])))
            .append($("<th>").text(String(data["round"]["num"][i])))
            .append($("<th>").text(String(data["round"]["od"][i]) == "offense" ? "攻" : "防"))
            .append($("<th>").text(String(data["round"]["point"][i])))
            .append($("<th>").text(String(data["round"]["wl"][i]) == "win" ? "勝" : "負"))
        );
    }
    $("#round").append(tbody);
    table = $("#round").DataTable();
    table.on("draw", function() {
        $("#round tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });
    table.draw();
}

function drawScoreTable() {
    /* #table-area内に表を設置 */
    initResult();
    $("<table>", {
        class: "table table-bordered table-hover",
        id: "score",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#score").append(
        $("<thead>").append(
            $("<tr>")
            .append($("<th>").text("試合ID"))
            .append($("<th>").text("チーム名"))
            .append($("<th>").text("UplayID"))
            .append($("<th>").text("スコア"))
            .append($("<th>").text("キル"))
            .append($("<th>").text("アシスト"))
            .append($("<th>").text("デス"))
        )
    );
    var tbody = $("<tbody>");
    for (var i = 0; i < data["score"]["game_id"].length; i++) {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(data["score"]["game_id"][i])))
            .append($("<th>").text(String(data["score"]["team"][i])))
            .append($("<th>").text(String(data["score"]["uplayid"][i])))
            .append($("<th>").text(String(data["score"]["score"][i])))
            .append($("<th>").text(String(data["score"]["kill"][i])))
            .append($("<th>").text(String(data["score"]["assist"][i])))
            .append($("<th>").text(String(data["score"]["death"][i])))
        );
    }
    $("#score").append(tbody);
    table = $("#score").DataTable();
    table.on("draw", function() {
        $("#score tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });
    table.draw();
}

function initResult() {
    if ($("#table-area").length) { // #table-areaが空でないとき
        $("#table-area").empty();
    }
    if ($("#analysis-area").length) { // #analysis-areaが空でないとき
        $("#analysis-area").empty();
    }
}

function loadResult(text) {
    $("#dd-panel").hide();
    data = makeDict(text);
    drawGameTable();
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
    $("#select-bomb-item").on("click", function() {
        drawBombAnalysis();
    });
    $("#select-game-item").on("click", function() {
        drawGameTable();
    });
    $("#select-round-item").on("click", function() {
        drawRoundTable();
    });
    $("#select-score-item").on("click", function() {
        drawScoreTable();
    });
});