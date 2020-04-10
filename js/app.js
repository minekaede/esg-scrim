var data; // csvから取得したデータ
var table; // 表示中の表

function drawBombAnalysis() {
    initResult();
    var dateDiv = document.createElement("div");
    dateDiv.classList.add("row", "form-group");
    var labelStart = document.createElement("label");
    labelStart.classList.add("col-1", "col-form-label");
    labelStart.setAttribute("for", "date-input-start");
    labelStart.text("期間：");
    dateDiv.append(labelStart);
}

function drawGameTable() {
    /* #table-area内に表を設置 */
    initResult();
    var gTable = document.createElement("table");
    gTable.classList.add("table", "table-bordered", "table-hover");
    gTable.setAttribute("id", "game");
    gTable.style.width = "100%";
    $("#table-area").append(gTable);

    $("#game").append(
        $("<thead></thead>").append(
            $("<tr></tr>")
            .append($("<th></th>").text("試合ID"))
            .append($("<th></th>").text("日付"))
            .append($("<th></th>").text("チーム名"))
            .append($("<th></th>").text("マップ"))
            .append($("<th></th>").text("先攻"))
            .append($("<th></th>").text("攻撃オペBAN(自)"))
            .append($("<th></th>").text("攻撃オペBAN(相)"))
            .append($("<th></th>").text("防衛オペBAN(自)"))
            .append($("<th></th>").text("防衛オペBAN(相)"))
            .append($("<th></th>").text("スコア(自)"))
            .append($("<th></th>").text("スコア(相)"))
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
            .append($("<th></th>").text(String(data["game"]["offense_first"][i]) == "own" ? "自" : "相"))
            .append($("<th></th>").text(String(data["game"]["offense_ban_own"][i])))
            .append($("<th></th>").text(String(data["game"]["offense_ban_opponent"][i])))
            .append($("<th></th>").text(String(data["game"]["defense_ban_own"][i])))
            .append($("<th></th>").text(String(data["game"]["defense_ban_opponent"][i])))
            .append($("<th></th>").text(String(data["game"]["score_own"][i])))
            .append($("<th></th>").text(String(data["game"]["score_opponent"][i])))
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
    var rTable = document.createElement("table");
    rTable.classList.add("table", "table-bordered", "table-hover");
    rTable.setAttribute("id", "round");
    rTable.style.width = "100%";
    $("#table-area").append(rTable);

    $("#round").append(
        $("<thead></thead>").append(
            $("<tr></tr>")
            .append($("<th></th>").text("試合ID"))
            .append($("<th></th>").text("ラウンド数"))
            .append($("<th></th>").text("攻防"))
            .append($("<th></th>").text("防衛地点"))
            .append($("<th></th>").text("勝敗"))
        )
    );
    var tbody = $("<tbody></tbody>");
    for (var i = 0; i < data["round"]["game_id"].length; i++) {
        tbody.append(
            $("<tr></tr>")
            .append($("<th></th>").text(String(data["round"]["game_id"][i])))
            .append($("<th></th>").text(String(data["round"]["num"][i])))
            .append($("<th></th>").text(String(data["round"]["od"][i])))
            .append($("<th></th>").text(String(data["round"]["point"][i])))
            .append($("<th></th>").text(String(data["round"]["wl"][i])))
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
    var sTable = document.createElement("table");
    sTable.classList.add("table", "table-bordered", "table-hover");
    sTable.setAttribute("id", "score");
    sTable.style.width = "100%";
    $("#table-area").append(sTable);

    $("#score").append(
        $("<thead></thead>").append(
            $("<tr></tr>")
            .append($("<th></th>").text("試合ID"))
            .append($("<th></th>").text("チーム名"))
            .append($("<th></th>").text("UplayID"))
            .append($("<th></th>").text("スコア"))
            .append($("<th></th>").text("キル"))
            .append($("<th></th>").text("アシスト"))
            .append($("<th></th>").text("デス"))
        )
    );
    var tbody = $("<tbody></tbody>");
    for (var i = 0; i < data["score"]["game_id"].length; i++) {
        tbody.append(
            $("<tr></tr>")
            .append($("<th></th>").text(String(data["score"]["game_id"][i])))
            .append($("<th></th>").text(String(data["score"]["team"][i])))
            .append($("<th></th>").text(String(data["score"]["uplayid"][i])))
            .append($("<th></th>").text(String(data["score"]["score"][i])))
            .append($("<th></th>").text(String(data["score"]["kill"][i])))
            .append($("<th></th>").text(String(data["score"]["assist"][i])))
            .append($("<th></th>").text(String(data["score"]["death"][i])))
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