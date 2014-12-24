$(function() {
  // ajaxでインプットデータを投げて, 形態素解析の結果データをinit_tree.jsonへ渡す
  var get_nlp_data = function(input_data) {
    $.ajax(
      {
        url: "/MorphologicalAnalysis/MorphologicalAnalysis",
        type: "POST",
        data: { "input_data" :  input_data },
        dataType: "json"
      }
    )
    .fail(function() {alert("failed");})
    .done(function(json) {
      local_json = json;
      // 根のnameは長いので"テキスト"という言葉で上書き
      local_json.name = "テキスト";
      $("body").children("svg").remove();
      create_rrt_tree();
    });

  };

  $("#show_button").click(function() {
    var input_data = $("#input_data").val();
    $("#loading_gif").show(0);
    setTimeout(function() {
      $("#loading_gif").hide(0);
      get_nlp_data(input_data);
    }, 0);
    return false;
  });
});
