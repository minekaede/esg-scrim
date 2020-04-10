function makeDict(text) { // csvテキストを処理して連想配列を返す
    /*
        マップリスト
        Googleフォームのマップリストと同じ順番になっている必要あり
    */
    const map_list = [
        "銀行",
        "国境",
        "クラブハウス",
        "海岸線",
        "領事館",
        "カフェ・ドストエフスキー",
        "ヴィラ"
    ]
    var arr = $.csv.toArrays(text); // csvテキストを2次元配列に変換 by jquery-csv
    arr.shift(); // ヘッダー(1行目)を削除
    var data = {};
    data["game"] = { // 試合ごとのデータ
        game_id: [], // 試合ID
        date: [], // ゲーム開始時の日付
        opponent: [], // 相手のチーム名
        map: [], // マップ
        offense_first: [], // 先攻
        offense_ban_own: [], // 自チーム攻撃側オペレーターBAN
        defense_ban_own: [], // 自チーム防衛側オペレーターBAN
        offense_ban_opponent: [], // 相手チーム攻撃側オペレーターBAN
        defense_ban_opponent: [], // 相手チーム防衛側オペレーターBAN
        result: [], // 試合結果
        score_own: [], // 自チームスコア
        score_opponent: [] // 相手チームスコア
    };
    data["round"] = { // ラウンドごとのデータ
        game_id: [], // 試合ID
        num: [], // ラウンド数
        od: [], // 攻防
        point: [], // 防衛地点
        wl: [] // 勝敗
    };
    data["score"] = { // プレーヤーごとのデータ
        game_id: [], // 試合ID
        team: [], // チーム名
        uplayid: [], // UplayID
        score: [], // スコア
        kill: [], // キル
        assist: [], // アシスト
        death: [] // デス
    };

    for (var id = 0; id < arr.length; id++) {
        var score_own = 0
        var score_opponent = 0
        var row = arr[id];

        // game
        data["game"]["game_id"].push(id);
        data["game"]["date"].push(row[1].replace(/\//g, "-"));
        data["game"]["opponent"].push(row[2]);
        data["game"]["map"].push(row[8]);
        data["game"]["offense_first"].push(row[3].replace("自チーム", "own").replace("相手チーム", "opponent"));
        if (row[3] == "自チーム") { // 自チーム先攻
            data["game"]["offense_ban_own"].push(row[5]);
            data["game"]["defense_ban_own"].push(row[6]);
            data["game"]["offense_ban_opponent"].push(row[4]);
            data["game"]["defense_ban_opponent"].push(row[7]);
        } else if (row[3] == "相手チーム") { // 自チーム後攻
            data["game"]["offense_ban_own"].push(row[4]);
            data["game"]["defense_ban_own"].push(row[7]);
            data["game"]["offense_ban_opponent"].push(row[5]);
            data["game"]["defense_ban_opponent"].push(row[6]);
        } else {
            throw new Error("想定していない文字列が含まれています: row[3] (先攻)");
        }

        // round
        var map_index = map_list.indexOf(row[8]);
        var round_row = row.slice(9 + map_index * 32, 41 + map_index * 32);
        for (var i = 0; i < 15; i++) {
            if (round_row[i] != "") {
                data["round"]["game_id"].push(id);
                data["round"]["num"].push(i + 1);
                data["round"]["point"].push(round_row[15 + i]);
                if (round_row[i] == "自チーム") {
                    data["round"]["wl"].push("win");
                    score_own++;
                } else if (round_row[i] == "相手チーム") {
                    data["round"]["wl"].push("lose");
                    score_opponent++;
                } else {
                    throw new Error("想定していない文字列が含まれています: round_row[" + String(i) + "] (ラウンド勝利)");
                }
                if (0 <= i && i <= 5) {
                    data["round"]["od"].push(row[3] == "自チーム" ? "offense" : "defense");
                } else if (6 <= i && i <= 11) {
                    data["round"]["od"].push(row[3] == "自チーム" ? "defense" : "offense");
                } else if (round_row[30] == "自チーム") {
                    data["round"]["od"].push(i % 2 == 0 ? "offense" : "defense");
                } else if (round_row[30] == "相手チーム") {
                    data["round"]["od"].push(i % 2 == 0 ? "defense" : "offense");
                } else {
                    throw new Error("想定していない文字列が含まれています: round_row[30] (延長先攻)");
                }
            }
        }

        // score
        var score_list = round_row[31].split("\n").filter(l => l != "");
        if (score_list.length == 5 || score_list.length == 10) {
            for (var i = 0; i < score_list.length; i++) {
                data["score"]["game_id"].push(id);
                if (0 <= i && i <= 4) {
                    data["score"]["team"].push("Excelsior Gaming");
                } else if (5 <= i && i <= 9) {
                    data["score"]["team"].push(row[2]);
                } else {
                    throw new Error("スコアの行数が多すぎます: " + String(i + 1) + "行");
                }
                var values = score_list[i].split(" ");
                data["score"]["uplayid"].push(values[0]);
                data["score"]["score"].push(Number(values[1]));
                data["score"]["kill"].push(Number(values[2]));
                data["score"]["assist"].push(Number(values[3]));
                data["score"]["death"].push(Number(values[4]));
            }
        }

        // game
        if (score_own > score_opponent) {
            data["game"]["result"].push("win");
        } else if (score_own < score_opponent) {
            data["game"]["result"].push("lose");
        } else {
            data["game"]["result"].push("draw");
        }
        data["game"]["score_own"].push(score_own);
        data["game"]["score_opponent"].push(score_opponent);
    }

    return data;
}