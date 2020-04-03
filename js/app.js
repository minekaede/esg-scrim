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
    return data;
}

function loadResult(text) {
    console.log(text);
}

$(function() {
    var csv_url = getParam("url");
    if (csv_url) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            makeDict(xhr.responseText);
        }
        xhr.open("get", decodeURI(csv_url), true);
        xhr.send(null);
    }
    // $("#game").DataTable();
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