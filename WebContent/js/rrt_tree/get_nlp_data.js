$(function() {
  // ajaxでインプットデータを投げて, 形態素解析の結果データをlocal_jsonへ渡す
  var get_nlp_data = function(input_data) {
    $.ajax(
      {
        url: "/MorphologicalAnalysis" + (location.host.match("localhost") ? "/MorphologicalAnalysis" : ""),
        type: "POST",
        data: { "input_data" :  input_data },
        dataType: "json"
      }
    )
    .fail(function() {alert("failed");})
    .done(function(json) {
      // var宣言していないためグローバル変数
      local_json = json;
      // 根のnameは長いので"入力テキスト"という言葉で上書き
      local_json.name = "入力テキスト";
      $("body").children("svg").remove();
      create_rrt_tree();
    });
  };

  // イベント追加
  $("#show_button").click(function() {
    var input_data = $("#input_data").val();
    // show(), setTimeout() の数字を変えればわざとらしくロードしている感を見せれる(今回はなし)
    $("#loading_gif").show(0);
    setTimeout(function() {
      $("#loading_gif").hide(0);
      get_nlp_data(input_data);
    }, 0);
    return false;
  });
});
