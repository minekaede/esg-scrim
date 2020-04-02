function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function convertCsv(text) {
    /*
    マップリスト
    Googleフォームのマップリストと同じ順番になっている必要あり
    */
    const MAP_LIST = [
        "銀行",
        "国境",
        "クラブハウス",
        "海岸線",
        "領事館",
        "カフェ・ドストエフスキー",
        "ヴィラ"
    ]
    var data = {};
    return data;
}

$(function() {
    $("#drop-zone").on("drop", function(e) {
        e.preventDefault();
        var $result_zone = $("#result-zone");
        var files = e.originalEvent.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            // console.log(e.target.result);
        }
        var url = decodeURI(getParam("csv"));
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log(xhr.responseText);
        }
        xhr.open("get", url, true);
        xhr.send(null);
        reader.readAsText(files, "UTF-8");
    }).on("dragenter", function() {
        return false;
    }).on("dragover", function() {
        return false;
    });
});