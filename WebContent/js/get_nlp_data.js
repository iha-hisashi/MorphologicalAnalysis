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
      d3.json("", function(json) {
        root = local_json;
        root.x0 = h / 2;
        root.y0 = 0;

        function toggleAll(d) {
          if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
          }
        }
        root.children.forEach(toggleAll);

        update(root);
      });
    });
   // とりあえずローカルでデータを用意
   //local_json = {
   //  "name" : "親",
   //  "children" : [
   //    { "name" : "子1", "children" : null },
   //    { "name" : "子2", "children" : [ { "name" : "孫2-1" }, { "name" : "孫2-2" }, { "name" : "孫2-3" }  ] },
   //    { "name" : "子3", "children" : [ { "name" : "孫3-1" }, { "name" : "孫3-2" } ] }
   //  ]
   //};

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
