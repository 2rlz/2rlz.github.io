// Table Load Message
$(".tablesorter").append("<div id='tableLoading'>Loading...</div>");

// Difficulty Table
$(document).ready(function() {
    $.getJSON($("meta[name=bmstable]").attr("content"), function(header) {
        makeChangelog();
        $.getJSON(header.data_url, function(information) {
            makeBMSTable(information, header.symbol);
            $("#tableLoading").remove();
            $(".tablesorter").tablesorter({
                sortList: [
                    [0, 0],
                    [3, 0]
                ]
            });
        });
    });
});

// Changelog
function makeChangelog() {
    $("#changelog").load("Change.txt");
    $("#show_log").click(function() {
        if ($("#changelog").css("display") == "none" && $(this).html() == "VIEW CHANGELOG") {
            $("#changelog").show(300);
            $(this).html("HIDE CHANGELOG");
        } else {
            $("#changelog").hide(300);
            $(this).html("VIEW CHANGELOG");
        }
    });
}

function makeBMSTable(info, mark) {
    var x = "";
    var ev = "";
    var count = 0;
    var obj = $("#table_int");
    // Table Clear
    obj.html("");
    $("<thead><tr><th width='1%'>Lv <i class='fas fa-arrows-alt-v'></i></th><th width='1%'>Movie</th><th width='1%'>Score</th><th width='30%'>Title <i class='fas fa-arrows-alt-v'></i></th><th width='10%'>Artist <i class='fas fa-arrows-alt-v'></i></th><th width='1%'>DL</th><th width='1%'>Date <i class='fas fa-arrows-alt-v'></i></th><th width='10%'>Comment <i class='fas fa-arrows-alt-v'></i></th></tr></thead><tbody></tbody>").appendTo(obj);
    var obj_sep = null;
    for (var i = 0; i < info.length; i++) {
        if (x != info[i].level) {
            count = 0;
            x = info[i].level;
        }
        // Main text
        var str = $("<tr class='tr_normal'></tr>");

        if (info[i].state == 1) {
            str = $("<tr class='state1'></tr>");
        }
        if (info[i].state == 2) {
            str = $("<tr class='state2'></tr>");
        }
        if (info[i].state == 3) {
            str = $("<tr class='state3'></tr>");
        }
        if (info[i].state == 4) {
            str = $("<tr class='state4'></tr>");
        }
        if (info[i].state == 5) {
            str = $("<tr class='state5'></tr>");
        }
        if (info[i].state == 6) {
            str = $("<tr class='state6'></tr>");

        }

        // Level
        $("<td width='1%'>" + mark + x + "</a></td>").appendTo(str);
        // AUTOPLAY Movie
        if (info[i].movie_link != "" && info[i].movie_link != null) {
            $("<td width='1%'><a href='" + info[i].movie_link + "' class='fas fa-lg fa-play' target='_blank'></a></td>").appendTo(str);
        } else {
            $("<td width='1%'></td>").appendTo(str);
        }
        // View Pattern
        $("<td width='1%'><a href='http://www.ribbit.xyz/bms/score/view?p=1&md5=" + info[i].md5 + "' class='fas fa-lg fa-music' target='_blank'></a></td>").appendTo(str);

        // Title
        $("<td width='30%'>" + "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + info[i].md5 + "' target='_blank'>" + info[i].title + "</a></td>").appendTo(str);
        // Artist (Package Link)
        var astr = "";
        if (info[i].url != "" && info[i].url != null) {
            if (info[i].artist != "" && info[i].artist != null) {
                astr = "<a href='" + info[i].url + "'>" + info[i].artist + "</a>";
            } else {
                astr = "<a href='" + info[i].url + "'>" + info[i].url + "</a>";
            }
        } else {
            if (info[i].artist != "" && info[i].artist != null) {
                astr = info[i].artist;
            }
        }
        if (info[i].url_pack != "" && info[i].url_pack != null) {
            if (info[i].name_pack != "" && info[i].name_pack != null) {
                astr += "<br>(<a href='" + info[i].url_pack + "'>" + info[i].name_pack + "</a>)";
            } else {
                astr += "<br>(<a href='" + info[i].url_pack + "'>" + info[i].url_pack + "</a>)";
            }
        } else {
            if (info[i].name_pack != "" && info[i].name_pack != null) {
                astr += "<br>(" + info[i].name_pack + ")";
            }
        }
        $("<td width='10%'>" + astr + "</td>").appendTo(str);
        // Pattern Download
        if (info[i].url_diff != "" && info[i].url_diff != null) {
            if (info[i].name_diff != "" && info[i].name_diff != null) {
                $("<td width='1%'><a href='" + info[i].url_diff + "'>" + info[i].name_diff + "</a></td>").appendTo(str);
            } else {
                $("<td width='1%'><a href='" + info[i].url_diff + "' class='fas fa-lg fa-arrow-down'></a></td>").appendTo(str);
            }
        } else {
            if (info[i].name_diff != "" && info[i].name_diff != null) {
                $("<td width='1%'>" + info[i].name_diff + "</td>").appendTo(str);
            } else {
                $("<td width='1%'>同梱</td>").appendTo(str);
            }
        }
        // Added Date
        if (info[i].date != "" && info[i].date != null) {
            var addDate = new Date(info[i].date);
            var year = addDate.getFullYear();
            var month = addDate.getMonth() + 1;
            var day = addDate.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            $("<td width='1%'>" + year + "." + month + "." + day + "</td>").appendTo(str);
        } else {
            $("<td width='1%'></td>").appendTo(str);
        }
        // Comment
        $("<td width='10%'>" + info[i].comment + "</td>").appendTo(str);
        str.appendTo(obj);
        count++;
    }
}