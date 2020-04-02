$(function() {
    $("#drop-zone").on("drop", function(e) {
        e.preventDefault();
        var $result_zone = $("#result-zone");
        var files = e.originalEvent.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log("File loaded!");
        }
    }).on("dragenter", function() {
        return false;
    }).on("dragover", function() {
        return false;
    });
});