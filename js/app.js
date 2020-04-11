var data; // csvから取得したデータ
var table; // 表示中の表

function drawBombAnalysis() {
    if ($("#date-input-start").val() == "" || $("#date-input-end").val() == "") {
        return;
    }
    var id_list = data.game.filter(g => $("#date-input-start").val() <= g.date && g.date <= $("#date-input-end")).map(g => g.game_id);
    var filtered_round = data.round.filter(r => id_list.includes(r.game_id));
}

function drawBombCond() {
    initResult();
    $("#analysis-area").append(
        $("<div>", {
            class: "row form-group"
        }).append(
            $("<label>", {
                class: "control-label col-sm-1",
                text: "期間："
            })
        ).append(
            $("<div>", {
                class: "col-sm-2"
            }).append(
                $("<input>", {
                    class: "form-control",
                    id: "date-input-start",
                    type: "date",
                    value: data.game.map(g => g.date).reduce((a, b) => a < b ? a : b)
                })
            )
        ).append(
            $("<div>", {
                class: "col-sm-1"
            }).append(
                $("<p>", {
                    class: "form-control-static",
                    text: "～"
                })
            )
        ).append(
            $("<div>", {
                class: "col-sm-2 col-sm-offset-6"
            }).append(
                $("<input>", {
                    class: "form-control",
                    id: "date-input-end",
                    type: "date",
                    value: data.game.map(g => g.date).reduce((a, b) => a > b ? a : b)
                })
            )
        )
    ).append(
        $("<div>", {
            class: "row form-group"
        }).append(
            $("<label>", {
                class: "control-label col-sm-1",
                text: "マップ："
            })
        ).append(
            $("<div>", {
                class: "col-sm-5 col-sm-offset-6"
            }).append(
                $("<select>", {
                    class: "form-control",
                    id: "map-select",
                    style: "vertical-align: middle;"
                })
            )
        )
    );
    map_list.forEach(m => {
        $("<option>").text(m).appendTo("#map-select");
    });

    $("<div>", {
        class: "row",
        id: "bomb-result"
    }).appendTo("#analysis-area");
    drawBombAnalysis(); // 全期間で表示
    $("#date-input-start").on("change", function() {
        drawBombAnalysis();
    });
    $("#date-input-end").on("change", function() {
        drawBombAnalysis();
    });
}

function drawGameTable(word) {
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
    data.game.forEach(g => {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(g.game_id)))
            .append($("<th>").text(String(g.date)))
            .append($("<th>").text(String(g.opponent)))
            .append($("<th>").text(String(g.map)))
            .append($("<th>").text(String(g.offense_first) == "own" ? "自" : "相"))
            .append($("<th>").text(String(g.offense_ban_own)))
            .append($("<th>").text(String(g.offense_ban_opponent)))
            .append($("<th>").text(String(g.defense_ban_own)))
            .append($("<th>").text(String(g.defense_ban_opponent)))
            .append($("<th>").text(String(g.result).replace("win", "勝").replace("lose", "負").replace("draw", "引分")))
            .append($("<th>").text(String(g.score_own)))
            .append($("<th>").text(String(g.score_opponent)))
        );
    });

    $("#game").append(tbody);
    table = $("#game").DataTable({
        language: datatable_ja
    });
    table.on("draw", function() {
        $("#game tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });

    if (word) {
        table.search(word).draw();
    } else {
        table.draw()
    }
}

function drawRoundTable(word) {
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
    data.round.forEach(r => {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(r.game_id)))
            .append($("<th>").text(String(r.num)))
            .append($("<th>").text(String(r.od) == "offense" ? "攻" : "防"))
            .append($("<th>").text(String(r.point)))
            .append($("<th>").text(String(r.wl) == "win" ? "勝" : "負"))
        );
    });

    $("#round").append(tbody);
    table = $("#round").DataTable({
        language: datatable_ja
    });
    table.on("draw", function() {
        $("#round tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });

    if (word) {
        table.search(word).draw();
    } else {
        table.draw()
    }
}

function drawScoreTable(word) {
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
    data.score.forEach(s => {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(s.game_id)))
            .append($("<th>").text(String(s.team)))
            .append($("<th>").text(String(s.uplayid)))
            .append($("<th>").text(String(s.score)))
            .append($("<th>").text(String(s.kill)))
            .append($("<th>").text(String(s.assist)))
            .append($("<th>").text(String(s.death)))
        );
    });

    $("#score").append(tbody);
    table = $("#score").DataTable({
        language: datatable_ja
    });
    table.on("draw", function() {
        $("#score tbody tr th").on("dblclick", function() { // ダブルクリックで検索欄にコピー
            table.search($(this).text()).draw();
        });
    });

    if (word) {
        table.search(word).draw();
    } else {
        table.draw()
    }
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
        drawBombCond();
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