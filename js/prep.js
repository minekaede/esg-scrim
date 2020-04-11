var map_list; // config.jsonから取得するマップリスト(Googleフォームの順番と同じになっている必要あり)
var datatable_ja; // DataTableの日本語データ
$.getJSON("config.json", function(data) {
    map_list = data.map;
    datatable_ja = data.datatable.ja;
});

function makeDict(text) { // csvテキストを処理して連想配列を返す
    var arr = $.csv.toArrays(text); // csvテキストを2次元配列に変換 by jquery-csv
    arr.shift(); // ヘッダー(1行目)を削除
    var data = {
        game: [], // 試合ごとのデータ
        round: [], // ラウンドごとのデータ
        score: [] // プレーヤーごとのデータ
    };

    for (var id = 0; id < arr.length; id++) {
        var score_own = 0
        var score_opponent = 0
        var row = arr[id];
        var game_dict = {};

        // game_dict
        game_dict.game_id = id;
        game_dict.date = row[1].replace(/\//g, "-");
        game_dict.opponent = row[2];
        game_dict.map = row[8];
        game_dict.offense_first = row[3].replace("自チーム", "own").replace("相手チーム", "opponent");
        if (row[3] == "自チーム") { // 自チーム先攻
            game_dict.offense_ban_own = row[5];
            game_dict.defense_ban_own = row[6];
            game_dict.offense_ban_opponent = row[4];
            game_dict.defense_ban_opponent = row[7];
        } else if (row[3] == "相手チーム") { // 自チーム後攻
            game_dict.offense_ban_own = row[4];
            game_dict.defense_ban_own = row[7];
            game_dict.offense_ban_opponent = row[5];
            game_dict.defense_ban_opponent = row[6];
        } else {
            throw new Error("想定していない文字列が含まれています: row[3] (先攻)");
        }

        // round_dict
        var map_index = map_list.indexOf(row[8]);
        var round_row = row.slice(9 + map_index * 32, 41 + map_index * 32);
        for (var i = 0; i < 15; i++) {
            if (round_row[i] != "") {
                var round_dict = {};
                round_dict.game_id = id;
                round_dict.num = i + 1;
                round_dict.point = round_row[15 + i];
                if (round_row[i] == "自チーム") {
                    round_dict.wl = "win";
                    score_own++;
                } else if (round_row[i] == "相手チーム") {
                    round_dict.wl = "lose";
                    score_opponent++;
                } else {
                    throw new Error("想定していない文字列が含まれています: round_row[" + String(i) + "] (ラウンド勝利)");
                }
                if (0 <= i && i <= 5) {
                    round_dict.od = row[3] == "自チーム" ? "offense" : "defense";
                } else if (6 <= i && i <= 11) {
                    round_dict.od = row[3] == "自チーム" ? "defense" : "offense";
                } else if (round_row[30] == "自チーム") {
                    round_dict.od = i % 2 == 0 ? "offense" : "defense";
                } else if (round_row[30] == "相手チーム") {
                    round_dict.od = i % 2 == 0 ? "defense" : "offense";
                } else {
                    throw new Error("想定していない文字列が含まれています: round_row[30] (延長先攻)");
                }

                data.round.push(round_dict);
            }
        }

        // score_dict
        var score_list = round_row[31].split("\n").filter(l => l != "");
        if (score_list.length == 5 || score_list.length == 10) {
            for (var i = 0; i < score_list.length; i++) {
                var score_dict = {};
                score_dict.game_id = id;
                if (0 <= i && i <= 4) {
                    score_dict.team = "Excelsior Gaming";
                } else if (5 <= i && i <= 9) {
                    score_dict.team = row[2];
                } else {
                    throw new Error("スコアの行数が多すぎます: " + String(i + 1) + "行");
                }
                var values = score_list[i].split(" ");
                score_dict.uplayid = values[0];
                score_dict.score = Number(values[1]);
                score_dict.kill = Number(values[2]);
                score_dict.assist = Number(values[3]);
                score_dict.death = Number(values[4]);

                data.score.push(score_dict);
            }
        }

        // game_dict
        if (score_own > score_opponent) {
            game_dict.result = "win";
        } else if (score_own < score_opponent) {
            game_dict.result = "lose";
        } else {
            game_dict.result = "draw";
        }
        game_dict.score_own = score_own;
        game_dict.score_opponent = score_opponent;

        data.game.push(game_dict);
    }

    return data;
}