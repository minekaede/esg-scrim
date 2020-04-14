var data; // csvから取得したデータ
var table; // 表示中の表

function drawMapAnalysis() {
    $("#map-result").empty();
    $("#map-info").empty();
    if ($("#date-input-start").val() == "" || $("#date-input-end").val() == "") {
        $("#map-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 期間が設定されていません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }
    var filtered_game = data.game.filter(g => $("#date-input-start").val() <= g.date && g.date <= $("#date-input-end").val());
    if (filtered_game.length == 0) {
        $("#map-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 該当するデータがありません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }
    var result = {};
    var filtered_map_list = [...new Set(filtered_game.map(g => g.map))];
    filtered_map_list.forEach(m => {
        result[m] = {
            win: 0,
            lose: 0,
            draw: 0
        }
    });
    filtered_game.forEach(g => {
        result[g.map][g.result]++;
    });
    filtered_map_list.forEach(m => {
        if (result[m].win != 0 || result[m].lose != 0) {
            result[m].winRate = (100 * result[m].win / (result[m].win + result[m].lose)).toFixed(1);
        } else {
            result[m].winRate = (0).toFixed(1);
        }
    });

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "map",
        style: "width:100%;"
    }).appendTo("#map-result");

    $("#map").append(
        $("<thead>").addClass("thead-dark").append(
            $("<tr>")
            .append($("<th>").text("マップ"))
            .append($("<th>").text("勝利数"))
            .append($("<th>").text("敗北数"))
            .append($("<th>").text("引分数"))
            .append($("<th>").text("合計"))
            .append($("<th>").html('勝率[%]<sup class="text-info">※</sup>'))
        )
    );
    var tbody = $("<tbody>");
    filtered_map_list.forEach(m => {
        if (result[m].win != 0 || result[m].lose != 0 || result[m].draw != 0) {
            tbody.append(
                $("<tr>")
                .append($("<th>").text(String(m)))
                .append($("<th>").text(String(result[m].win)))
                .append($("<th>").text(String(result[m].lose)))
                .append($("<th>").text(String(result[m].draw)))
                .append($("<th>").text(String(result[m].win + result[m].lose + result[m].draw)))
                .append($("<th>").text(String(result[m].winRate)))
            );
        }
    });

    $("#map").append(tbody);
    table = $("#map").DataTable({
        language: datatable_ja,
        lengthChange: false,
        searching: false,
        info: false,
        paging: false,
        order: [[5, "desc"]]
    });

    $("#map-info").append(
        $("<div>", {
            class: "alert alert-info",
            role: "info",
            html: "※ <strong>勝率[%]</strong> = 100 × 勝利数 ÷ (勝利数 + 敗北数)"
        }).css("margin-top", 10)
    );
}

function drawMapCond() {
    initResult();
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-map-item").addClass("active");

    $("#analysis-area").append(
        $("<div>", {
            class: "row form-group"
        }).css("margin-bottom", 0).append(
            $("<label>", {
                class: "col-form-label col-xs-3",
                text: "期間："
            })
        ).append(
            $("<div>", {
                class: "col-xs-4"
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
                class: "col-form-label col-xs-1"
            }).append(
                $("<p>", {
                    class: "form-control-static",
                    text: "～"
                })
            )
        ).append(
            $("<div>", {
                class: "col-xs-4"
            }).append(
                $("<input>", {
                    class: "form-control",
                    id: "date-input-end",
                    type: "date",
                    value: data.game.map(g => g.date).reduce((a, b) => a > b ? a : b)
                })
            )
        )
    );

    $("#analysis-area").append(
        $("<div>", {
            class: "row",
            id: "map-result"
        })
    ).append(
        $("<div>", {
            class: "row",
            id: "map-info"
        })
    );
    drawMapAnalysis(); // 全期間で表示

    $("#date-input-start").on("change", function() {
        drawMapAnalysis();
    });
    $("#date-input-end").on("change", function() {
        drawMapAnalysis();
    });
}

function drawBombAnalysis() {
    $("#bomb-result").empty();
    $("#bomb-info").empty();
    if ($("#date-input-start").val() == "" || $("#date-input-end").val() == "") {
        $("#bomb-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 期間が設定されていません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }
    var id_list = data.game.filter(g => $("#date-input-start").val() <= g.date && g.date <= $("#date-input-end").val() && g.map == $("#map-select").val()).map(g => g.game_id);
    var filtered_round = data.round.filter(r => id_list.includes(r.game_id));
    if (filtered_round.length == 0) {
        $("#bomb-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 該当するデータがありません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }
    var result = {
        total: {
            offense: 0,
            defense: 0
        }
    };
    var point_list = [...new Set(filtered_round.map(r => r.point))];
    point_list.forEach(p => {
        result[p] = {
            offense: {
                win: 0,
                lose: 0,
                sum: 0
            },
            defense: {
                win: 0,
                lose: 0,
                sum: 0
            }
        };
    });
    filtered_round.forEach(r => {
        result[r.point][r.od][r.wl]++;
        result.total[r.od]++;
    });
    point_list.forEach(p => {
        result[p].offense.pickRate = (100 * (result[p].offense.win + result[p].offense.lose) / result.total.offense).toFixed(1);
        result[p].defense.pickRate = (100 * (result[p].defense.win + result[p].defense.lose) / result.total.defense).toFixed(1);
        result[p].offense.winRate = (100 * result[p].offense.win / (result[p].offense.win + result[p].offense.lose)).toFixed(1);
        result[p].defense.winRate = (100 * result[p].defense.win / (result[p].defense.win + result[p].defense.lose)).toFixed(1);
    });

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "bomb",
        style: "width:100%;"
    }).appendTo("#bomb-result");

    $("#bomb").append(
        $("<thead>").addClass("thead-dark").append(
            $("<tr>")
            .append($("<th>").text("防衛地点"))
            .append($("<th>").text("攻防"))
            .append($("<th>").text("勝利数"))
            .append($("<th>").text("敗北数"))
            .append($("<th>").text("合計"))
            .append($("<th>").html('ピック率[%]<sup class="text-info">※1</sup>'))
            .append($("<th>").html('勝率[%]<sup class="text-info">※2</sup>'))
        )
    );
    var tbody = $("<tbody>");
    point_list.forEach(p => {
        if (result[p].offense.win != 0 || result[p].offense.lose != 0) {
            tbody.append(
                $("<tr>").addClass("table-warning")
                .append($("<th>").text(String(p)))
                .append($("<th>").text(String("攻")))
                .append($("<th>").text(String(result[p].offense.win)))
                .append($("<th>").text(String(result[p].offense.lose)))
                .append($("<th>").text(String(result[p].offense.win + result[p].offense.lose)))
                .append($("<th>").text(String(result[p].offense.pickRate)))
                .append($("<th>").text(String(result[p].offense.winRate)))
            );
        }
        if (result[p].defense.win != 0 || result[p].defense.lose != 0) {
            tbody.append(
                $("<tr>").addClass("table-primary")
                .append($("<th>").text(String(p)))
                .append($("<th>").text(String("防")))
                .append($("<th>").text(String(result[p].defense.win)))
                .append($("<th>").text(String(result[p].defense.lose)))
                .append($("<th>").text(String(result[p].defense.win + result[p].defense.lose)))
                .append($("<th>").text(String(result[p].defense.pickRate)))
                .append($("<th>").text(String(result[p].defense.winRate)))
            );
        }
    });

    $("#bomb").append(tbody);
    table = $("#bomb").DataTable({
        language: datatable_ja,
        lengthChange: false,
        searching: false,
        info: false,
        paging: false,
        order: [[1, "asc"], [6, "desc"]]
    });

    $("#bomb-info").append(
        $("<div>", {
            class: "alert alert-info",
            role: "info",
            html: "※1 <strong>ピック率[%]</strong>は攻防ごとに算出<br>※2 <strong>勝率[%]</strong> = 100 × 勝利数 ÷ (勝利数 + 敗北数)"
        }).css("margin-top", 10)
    );
}

function drawBombCond() {
    initResult();
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-bomb-item").addClass("active");

    $("#analysis-area").append(
        $("<div>", {
            class: "row form-group"
        }).css("margin-bottom", 0).append(
            $("<label>", {
                class: "col-form-label col-xs-3",
                text: "期間："
            })
        ).append(
            $("<div>", {
                class: "col-xs-4"
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
                class: "col-form-label col-xs-1"
            }).append(
                $("<p>", {
                    class: "form-control-static",
                    text: "～"
                })
            )
        ).append(
            $("<div>", {
                class: "col-xs-4"
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
                class: "col-form-label col-xs-3",
                text: "マップ："
            })
        ).append(
            $("<div>", {
                class: "col-xs-9"
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

    $("#analysis-area").append(
        $("<div>", {
            class: "row",
            id: "bomb-result"
        })
    ).append(
        $("<div>", {
            class: "row",
            id: "bomb-info"
        })
    );
    drawBombAnalysis(); // 全期間で表示

    $("#date-input-start").on("change", function() {
        drawBombAnalysis();
    });
    $("#date-input-end").on("change", function() {
        drawBombAnalysis();
    });
    $("#map-select").on("change", function() {
        drawBombAnalysis();
    });
}

function drawKdAnalysis() {
    $("#kd-result").empty();
    $("#kd-info").empty();
    if ($("#date-input-start").val() == "" || $("#date-input-end").val() == "") {
        $("#kd-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 期間が設定されていません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }

    var filtered_game = data.game.filter(g => $("#date-input-start").val() <= g.date && g.date <= $("#date-input-end").val());
    if ($("#map-select").val() != "全マップ") {
        filtered_game = filtered_game.filter(g => g.map == $("#map-select").val());
    }

    if (filtered_game.length == 0) {
        $("#kd-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 該当するデータがありません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }
    var filtered_score = data.score.filter(s => filtered_game.map(g => g.game_id).includes(s.game_id) && s.team == our_team);
    filtered_score.forEach(s => {
        s.member = our_alias[s.uplayid] ? our_alias[s.uplayid] : s.uplayid;
    });

    var result = {};
    var member_list = [...new Set(filtered_score.map(s => s.member))];
    member_list.forEach(m => {
        result[m] = {
            kill: 0,
            assist: 0,
            death: 0
        };
    });
    filtered_score.forEach(s => {
        result[s.member].kill += s.kill;
        result[s.member].assist += s.assist;
        result[s.member].death += s.death;
    });
    member_list.forEach(m => {
        result[m].kd = (result[m].kill / result[m].death).toFixed(3);
        result[m].kdrate = (100 * result[m].kill / (result[m].kill + result[m].death)).toFixed(1);
    });

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "kd",
        style: "width:100%;"
    }).appendTo("#kd-result");

    $("#kd").append(
        $("<thead>").addClass("thead-dark").append(
            $("<tr>")
            .append($("<th>").text("名前"))
            .append($("<th>").text("キル数"))
            .append($("<th>").text("アシスト数"))
            .append($("<th>").text("デス数"))
            .append($("<th>").text("K/D"))
            .append($("<th>").html('KD[%]<sup class="text-info">※</sup>'))
        )
    );
    var tbody = $("<tbody>");
    member_list.forEach(m => {
        if (result[m].kill != 0 || result[m].death != 0) {
            tbody.append(
                $("<tr>")
                .append($("<th>").text(String(m)))
                .append($("<th>").text(String(result[m].kill)))
                .append($("<th>").text(String(result[m].assist)))
                .append($("<th>").text(String(result[m].death)))
                .append($("<th>").text(String(result[m].kd)))
                .append($("<th>").text(String(result[m].kdrate)))
            );
        }
    });

    $("#kd").append(tbody);
    table = $("#kd").DataTable({
        language: datatable_ja,
        lengthChange: false,
        searching: false,
        info: false,
        paging: false,
        order: [[0, "asc"]]
    });

    $("#kd-info").append(
        $("<div>", {
            class: "alert alert-info",
            role: "info",
            html: "※ <strong>KD[%]</strong> = 100 × キル数 ÷ (キル数 + デス数)"
        }).css("margin-top", 10)
    );
}

function drawKdCond() {
    initResult();
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-kd-item").addClass("active");

    var filtered_game = data.game.filter(g => data.score.map(s => s.game_id).includes(g.game_id));
    $("#analysis-area").append(
        $("<div>", {
            class: "row form-group"
        }).css("margin-bottom", 0).append(
            $("<label>", {
                class: "col-form-label col-xs-3",
                text: "期間："
            })
        ).append(
            $("<div>", {
                class: "col-xs-4"
            }).append(
                $("<input>", {
                    class: "form-control",
                    id: "date-input-start",
                    type: "date",
                    value: filtered_game.map(g => g.date).reduce((a, b) => a < b ? a : b)
                })
            )
        ).append(
            $("<div>", {
                class: "col-form-label col-xs-1"
            }).append(
                $("<p>", {
                    class: "form-control-static",
                    text: "～"
                })
            )
        ).append(
            $("<div>", {
                class: "col-xs-4"
            }).append(
                $("<input>", {
                    class: "form-control",
                    id: "date-input-end",
                    type: "date",
                    value: filtered_game.map(g => g.date).reduce((a, b) => a > b ? a : b)
                })
            )
        )
    ).append(
        $("<div>", {
            class: "row form-group"
        }).append(
            $("<label>", {
                class: "col-form-label col-xs-3",
                text: "マップ："
            })
        ).append(
            $("<div>", {
                class: "col-xs-9"
            }).append(
                $("<select>", {
                    class: "form-control",
                    id: "map-select",
                    style: "vertical-align: middle;"
                })
            )
        )
    );
    $("<option>").text("全マップ").appendTo("#map-select");
    map_list.forEach(m => {
        $("<option>").text(m).appendTo("#map-select");
    });

    $("#analysis-area").append(
        $("<div>", {
            class: "row",
            id: "kd-result"
        })
    ).append(
        $("<div>", {
            class: "row",
            id: "kd-info"
        })
    );
    drawKdAnalysis(); // 全期間で表示

    $("#date-input-start").on("change", function() {
        drawKdAnalysis();
    });
    $("#date-input-end").on("change", function() {
        drawKdAnalysis();
    });
    $("#map-select").on("change", function() {
        drawKdAnalysis();
    });
}

function drawBanAnalysis() {
    $("#ban-result").empty();
    $("#ban-info").empty();
    if ($("#date-input-start").val() == "" || $("#date-input-end").val() == "") {
        $("#ban-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 期間が設定されていません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }

    var filtered_game = data.game.filter(g => $("#date-input-start").val() <= g.date && g.date <= $("#date-input-end").val());
    if ($("#map-select").val() != "全マップ") {
        filtered_game = filtered_game.filter(g => g.map == $("#map-select").val());
    }
    var ban_type = $("#ban-select")
        .replace("攻撃側(自)", "offense_ban_own")
        .replace("防衛側(自)", "defense_ban_own")
        .replace("攻撃側(相)", "offense_ban_opponent")
        .replace("防衛側(相)", "defense_ban_opponent");

    if (filtered_game.length == 0) {
        $("#ban-result").append(
            $("<p>", {
                class: "text-danger",
                text: " 該当するデータがありません"
            }).prepend(
                $("<span>", {
                    class: "badge badge-danger",
                    text: "Error"
                })
            )
        );
        return;
    }

    var result = {
        total: 0
    };
    var operator_list = [...new Set(filtered_game.map(g => g[ban_type]))];
    operator_list.forEach(o => {
        result[o] = {
            sum: 0
        };
    });
    filtered_game.forEach(g => {
        result[g[ban_type]].sum++;
        result.total++;
    });
    operator_list.forEach(o => {
        result[o].rate = (100 * result[o].sum / result.total).toFixed(1);
    });

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "ban",
        style: "width:100%;"
    }).appendTo("#ban-result");

    $("#ban").append(
        $("<thead>").addClass("thead-dark").append(
            $("<tr>")
            .append($("<th>").text("オペレーター"))
            .append($("<th>").text("BAN数"))
            .append($("<th>").html('BAN率[%]'))
        )
    );
    var tbody = $("<tbody>");
    operator_list.forEach(o => {
        tbody.append(
            $("<tr>")
            .append($("<th>").text(String(o)))
            .append($("<th>").text(String(result[o].sum)))
            .append($("<th>").text(String(result[o].total)))
        );
    });

    $("#ban").append(tbody);
    table = $("#ban").DataTable({
        language: datatable_ja,
        lengthChange: false,
        searching: false,
        info: false,
        paging: false,
        order: [[0, "asc"]]
    });
}

function drawBanCond() {
    initResult();
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-ban-item").addClass("active");

    $("#analysis-area").append(
        $("<div>", {
            class: "row form-group"
        }).css("margin-bottom", 0).append(
            $("<label>", {
                class: "col-form-label col-xs-3",
                text: "期間："
            })
        ).append(
            $("<div>", {
                class: "col-xs-4"
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
                class: "col-form-label col-xs-1"
            }).append(
                $("<p>", {
                    class: "form-control-static",
                    text: "～"
                })
            )
        ).append(
            $("<div>", {
                class: "col-xs-4"
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
                class: "col-form-label col-xs-3",
                text: "マップ："
            })
        ).append(
            $("<div>", {
                class: "col-xs-9"
            }).append(
                $("<select>", {
                    class: "form-control",
                    id: "map-select",
                    style: "vertical-align: middle;"
                })
            )
        )
    ).append(
        $("<div>", {
            class: "row form-group"
        }).append(
            $("<label>", {
                class: "col-form-label col-xs-8",
                text: "オペレーターBAN："
            })
        ).append(
            $("<div>", {
                class: "col-xs-4"
            }).append(
                $("<select>", {
                    class: "form-control",
                    id: "ban-select",
                    style: "vertical-align: middle;"
                })
            )
        )
    );
    $("<option>").text("全マップ").appendTo("#map-select");
    map_list.forEach(m => {
        $("<option>").text(m).appendTo("#map-select");
    });
    $("#ban-select").append(
        $("<option>").text("攻撃側(自)")
    ).append(
        $("<option>").text("防衛側(自)")
    ).append(
        $("<option>").text("攻撃側(相)")
    ).append(
        $("<option>").text("防衛側(相)")
    );

    $("#analysis-area").append(
        $("<div>", {
            class: "row",
            id: "ban-result"
        })
    ).append(
        $("<div>", {
            class: "row",
            id: "ban-info"
        })
    );
    drawBanAnalysis(); // 全期間で表示

    $("#date-input-start").on("change", function() {
        drawBanAnalysis();
    });
    $("#date-input-end").on("change", function() {
        drawBanAnalysis();
    });
    $("#map-select").on("change", function() {
        drawBanAnalysis();
    });
    $("#ban-select").on("change", function() {
        drawBanAnalysis();
    });
}

function drawGameTable(word) {
    /* #table-area内に表を設置 */
    initResult();
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-game-item").addClass("active");

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "game",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#game").append(
        $("<thead>").addClass("thead-dark").append(
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
            $("<tr>").addClass(g.result.replace("win", "table-success").replace("lose", "table-danger").replace("draw", "table-warning"))
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
        language: datatable_ja,
        order: [[0, "desc"]]
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
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-round-item").addClass("active");

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "round",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#round").append(
        $("<thead>").addClass("thead-dark").append(
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
            $("<tr>").addClass(r.od == "offense" ? "table-warning" : "table-primary")
            .append($("<th>").text(String(r.game_id)))
            .append($("<th>").text(String(r.num)))
            .append($("<th>").text(String(r.od) == "offense" ? "攻" : "防"))
            .append($("<th>").text(String(r.point)))
            .append($("<th>").text(String(r.wl) == "win" ? "勝" : "負"))
        );
    });

    $("#round").append(tbody);
    table = $("#round").DataTable({
        language: datatable_ja,
        order: [[0, "desc"]]
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
    $("#site-menu .dropdown-item").removeClass("active");
    $("#select-score-item").addClass("active");

    $("<table>", {
        class: "table table-bordered table-hover",
        id: "score",
        style: "width:100%;"
    }).appendTo("#table-area");

    $("#score").append(
        $("<thead>").addClass("thead-dark").append(
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
            $("<tr>").addClass(s.team == our_team ? "table-info" : "")
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
        language: datatable_ja,
        order: [[0, "desc"]]
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
    $("#table-menu").css("visibility", "visible");
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
    $("#select-map-item").on("click", function() {
        drawMapCond();
    });
    $("#select-bomb-item").on("click", function() {
        drawBombCond();
    });
    $("#select-kd-item").on("click", function() {
        drawKdCond();
    });
    $("#select-ban-item").on("click", function() {
        drawBanCond();
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