$(function() {
  // ajaxでインプットデータを投げて, 形態素解析の結果データをinit_tree.jsonへ渡す
  var get_nlp_data = function(input_data) {
    $.ajax(
      {
        url: "/MorphologicalAnalysis",
        type: "POST",
        data: { "input_data" :  input_data },
        dataType: "json"
      }
    )
    .fail(function() {alert("failed");})
    .done(function(json) {
    	d3.json("", function(json) {
    		  json = local_json;
    		  var nodes = cluster.nodes(json);

    		  var link = vis.selectAll("path.link")
    		      .data(cluster.links(nodes))
    		    .enter().append("svg:path")
    		      .attr("class", "link")
    		      .attr("d", diagonal);

    		  var node = vis.selectAll("g.node")
    		      .data(nodes)
    		    .enter().append("svg:g")
    		      .attr("class", "node")
    		      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    		  node.append("svg:circle")
    		      .attr("r", 3);

    		  node.append("svg:text")
    		      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
    		      .attr("dy", ".31em")
    		      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    		      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
    		      .text(function(d) { return d.name; });
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
