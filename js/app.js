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

function convertCsvText(text) {
    // csvテキストを2次元配列に変換
    var arr = $.csv.toArrays(text);
    console.log(arr);




    //var data = {};
    //return data;
}

function loadResult(text) {
    console.log(text);
}

$(function() {
    var csv_url = getParam("url");
    if (csv_url) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            convertCsvText(xhr.responseText);
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