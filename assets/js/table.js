// Difficulty Table
$(function () {
  // Table Load Message
  $("#table_int").before("<div id='tableLoading'>Loading...</div>");
  $.getJSON($("meta[name=bmstable]").attr("content"), function (header) {
    $.getJSON(header.data_url, function (info) {
      makeChangelog(info, header.symbol);
      makeAUTOPLAY(info);
      makeBMSTable(info, header.symbol);
      $("#tableLoading").hide();
      $("#table_int").tablesorter({
        sortList: [
          [0, 0],
          [3, 0],
        ],
      });
    });
  });
});

function makeBMSTable(info, mark) {
  var obj = $("#table_int");
  // Table Clear
  obj.html("");
  $(
    "<thead>" +
      "<tr>" +
      "<th style='width: 1%'>Lv <i class='fas fa-arrows-alt-v'></i></th>" +
      "<th style='width: 1%'>Movie</th>" +
      "<th style='width: 1%'>Score</th>" +
      "<th style='width: 30%'>Title <i class='fas fa-arrows-alt-v'></i></th>" +
      "<th style='width: 10%'>Artist <i class='fas fa-arrows-alt-v'></i></th>" +
      "<th style='width: 1%'>DL</th>" +
      "<th style='width: 1%'>Date <i class='fas fa-arrows-alt-v'></i></th>" +
      "<th style='width: 10%'>Comment <i class='fas fa-arrows-alt-v'></i></th>" +
      "</tr>" +
      "</thead>" +
      "<tbody></tbody>"
  ).appendTo(obj);
  Array.prototype.forEach.call(info, function (i) {
    // Main text
    var str = $("<tr class='tr_normal'></tr>");
    if (i.state == 1) str = $("<tr class='state1'></tr>");
    if (i.state == 2) str = $("<tr class='state2'></tr>");
    if (i.state == 3) str = $("<tr class='state3'></tr>");
    if (i.state == 4) str = $("<tr class='state4'></tr>");
    if (i.state == 5) str = $("<tr class='state5'></tr>");
    if (i.state == 6) str = $("<tr class='state6'></tr>");
    // Level
    $("<td>" + mark + i.level + "</a></td>").appendTo(str);
    // AUTOPLAY Movie
    if (i.movie_link) {
      $(
        "<td><a href='" +
          i.movie_link +
          "' class='fas fa-lg fa-play' target='_blank'></a></td>"
      ).appendTo(str);
    } else {
      $("<td></td>").appendTo(str);
    }
    // View Pattern
    $(
      "<td><a href='http://www.ribbit.xyz/bms/score/view?p=1&md5=" +
        i.md5 +
        "' class='fas fa-lg fa-music' target='_blank'></a></td>"
    ).appendTo(str);

    // Title
    $(
      "<td>" +
        "<a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" +
        i.md5 +
        "' target='_blank'>" +
        i.title +
        "</a></td>"
    ).appendTo(str);
    // Artist (Package Link)
    var astr = "";
    if (i.url) {
      if (i.artist) {
        astr = "<a href='" + i.url + "'>" + i.artist + "</a>";
      } else {
        astr = "<a href='" + i.url + "'>" + i.url + "</a>";
      }
    } else {
      if (i.artist) {
        astr = i.artist;
      }
    }
    if (i.url_pack) {
      if (i.name_pack) {
        astr += "<br>(<a href='" + i.url_pack + "'>" + i.name_pack + "</a>)";
      } else {
        astr += "<br>(<a href='" + i.url_pack + "'>" + i.url_pack + "</a>)";
      }
    } else {
      if (i.name_pack) {
        astr += "<br>(" + i.name_pack + ")";
      }
    }
    $("<td>" + astr + "</td>").appendTo(str);
    // Pattern Download
    if (i.url_diff) {
      if (i.name_diff) {
        $(
          "<td><a href='" + i.url_diff + "'>" + i.name_diff + "</a></td>"
        ).appendTo(str);
      } else {
        $(
          "<td><a href='" +
            i.url_diff +
            "' class='fas fa-lg fa-arrow-down'></a></td>"
        ).appendTo(str);
      }
    } else {
      if (i.name_diff) {
        $("<td>" + i.name_diff + "</td>").appendTo(str);
      } else {
        $("<td>同梱</td>").appendTo(str);
      }
    }
    // Added Date
    if (i.date) {
      var addDate = new Date(i.date);
      var dateStr =
        addDate.getFullYear() +
        "." +
        ("0" + (addDate.getMonth() + 1)).slice(-2) +
        "." +
        ("0" + addDate.getDate()).slice(-2);
      $("<td>" + dateStr + "</td>").appendTo(str);
    } else {
      $("<td></td>").appendTo(str);
    }
    // Comment
    $("<td>" + i.comment + "</td>").appendTo(str);
    str.appendTo(obj);
  });
}

function makeChangelog(info) {
  var $changelog = $("#changelog");
  var $show_log = $("#show_log");
  $show_log.click(function () {
    if (
      $changelog.css("display") == "none" &&
      $show_log.html() == "VIEW CHANGELOG"
    ) {
      $changelog.show(300);
      $show_log.html("HIDE CHANGELOG");
    } else {
      $changelog.hide(300);
      $show_log.html("VIEW CHANGELOG");
    }
  });
  var history = info
    .filter(function (i) {
      return !!i.date;
    })
    .sort(function (a, b) {
      var aDate = new Date(a.date);
      var bDate = new Date(b.date);
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .map(function (i) {
      var date_ = new Date(i.date);
      var dateStr =
        ("" + date_.getFullYear()).slice(-2) +
        "." +
        ("0" + (date_.getMonth() + 1)).slice(-2) +
        "." +
        ("0" + date_.getDate()).slice(-2);
      return "(" + dateStr + ")\n" + i.artist + " - " + i.title + " was added.";
    })
    .join("\n\n");
  $show_log.show();
  $changelog.val(history);
}

// AUTOPLAY List
function makeAUTOPLAY(info) {
  var videoObj = $("#video_int");
  videoObj.html("");
  info
    .filter(function (song) {
      return !!song.date && !!song.movie_link;
    })
    .sort(function (a, b) {
      var aDate = new Date(a.date);
      var bDate = new Date(b.date);
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .slice(0, 4)
    .map(function (i) {
      var str = $("<blockquote></blockquote>");
      if (i.title) {
        $(
          "<h3><span class='icon solid major brands fa-youtube'> " +
            i.title +
            "</span></h3>"
        ).appendTo(str);
      } else {
        $("<h3><span>Nothing</span></h3>").appendTo(str);
      }
      if (i.movie_link) {
        $(
          "<div class='video_wrap'>" +
            "<iframe class='video_iframe' src='https://www.youtube.com/embed/" +
            i.movie_link.slice(-11) +
            "' srcdoc='" +
            "<style>" +
            "* {" +
            "padding: 0;" +
            "margin: 0;" +
            "overflow: hidden" +
            "}" +
            "html,body {" +
            "height: 100%" +
            "}" +
            "img,span {" +
            "position: absolute;" +
            "width: 100%;" +
            "top: 0;" +
            "bottom: 0;" +
            "margin: auto" +
            "}" +
            "span {" +
            "height: 1.5em;" +
            "text-align: center;" +
            "font: 48px/1.5 sans-serif;" +
            "color: white;" +
            "text-shadow: 0 0 0.5em black" +
            "}" +
            "</style>" +
            "<a href=https://www.youtube.com/embed/" +
            i.movie_link.slice(-11) +
            "?autoplay=1>" +
            "<img src=https://img.youtube.com/vi/" +
            i.movie_link.slice(-11) +
            "/hqdefault.jpg>" +
            "<span>▶</span>" +
            "</a>" +
            "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen>" +
            "</iframe>" +
            "</div>"
        ).appendTo(str);
      } else {
        $("<div>Nothing</div>").appendTo(str);
      }
      str.appendTo(videoObj);
    });
}
