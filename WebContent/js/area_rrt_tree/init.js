var areas;
// TF-IDFの結果をあらかじめ変数に格納
// 本来はDBに置いておいて, API経由で取得すべき
// 今回は全部JavaScriptで実装
$.getJSON("../js/area_rrt_tree/areas.json", function(json) {
  areas = json;
});

// rrt_treeとほぼ同じ
// 引数に都道府県コードを持たせて, その都道府県の結果を描画するようにする
var create_rrt_tree = function(code) {
var diameter = 1500;

var tree = d3.layout.tree()
  .size([360, 450])
  .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("#svg_body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter + 300)
  .append("g")
    .attr("transform", "translate(" + diameter * 0.4 + "," + diameter / 2 + ")");

d3.json("", function(error, root) {
  root = areas[code];

  root.children = root.children.slice(0, 100);
  // 高レート順位の定義
  var high_rate_rank = root.children.length * 10 / 100;
  // 低レート順位の定義
  var low_rate_rank = root.children.length * 90 / 100;
  for (var i = 0; i < root.children.length; i++) {
    var node = root.children[i];
    node.rank = i + 1;
    // 高レートならtrue
    node.high_rate = (node.rank <= high_rate_rank);
    // 低レートならtrue
    node.low_rate = (node.rank > low_rate_rank);
  }
  var nodes = tree.nodes(root);
  var links = tree.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return "start"; })
      .attr("transform", function(d) { return "translate(8)"; })
      .attr("transform", function(d) { return "translate(8)"; })
      .attr("class", function(n) {
        return n.high_rate ? "bigger" : n.low_rate ? "smaller" : "";
      })
      .attr("style", function(n) {
        if (n.rank) {
          var font_size = 32 - parseInt(n.rank / 10) * 3;
          return "font-size : " + font_size + "px";
        }
      })
      .text(function(d) { 
        // 小数点以下5桁に制限
        return d.word + (d.tfidf ? " : " + (Math.round(d.tfidf * 100000) / 100000) : "");
      });
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");
}

// 日本地図描画用の変数
var areas = [
  {code : 1, name: "北海道地方", color: "#7f7eda", hoverColor: "#b3b2ee", prefectures: [1]},
  {code : 2, name: "東北地方",   color: "#759ef4", hoverColor: "#98b9ff", prefectures: [2,3,4,5,6,7]},
  {code : 3, name: "関東地方",   color: "#7ecfea", hoverColor: "#b7e5f4", prefectures: [8,9,10,11,12,13,14]},
  {code : 4, name: "中部地方",   color: "#7cdc92", hoverColor: "#aceebb", prefectures: [15,16,17,18,19,20,21,22,23]},
  {code : 5, name: "近畿地方",   color: "#ffe966", hoverColor: "#fff19c", prefectures: [24,25,26,27,28,29,30]},
  {code : 6, name: "中国地方",   color: "#ffcc66", hoverColor: "#ffe0a3", prefectures: [31,32,33,34,35]},
  {code : 7, name: "四国地方",   color: "#fb9466", hoverColor: "#ffbb9c", prefectures: [36,37,38,39]},
  {code : 8, name: "九州地方",   color: "#ff9999", hoverColor: "#ffbdbd", prefectures: [40,41,42,43,44,45,46]},
  {code : 9, name: "沖縄地方",   color: "#eb98ff", hoverColor: "#f5c9ff", prefectures: [47]},
];
// 日本地図描画
$("#map_body").japanMap({
    width: 1000,
    areas: areas,
    borderLineColor: "#f2fcff",
    borderLineWidth : 0.25,
    lineWidth: 0,
    drawsBoxLine: true,
    showsPrefectureName: true,
    prefectureNameType: "short",
    movesIslands : true,
    fontSize : 11,
    fontShadowColor: "white",
    onSelect : function(data){
      $("#map_body").hide(500, function(){
        create_rrt_tree(data.code - 1);
        $("#svg_body").show(500);
      });
    }
});

// 日本地図呼び出し
$("#map_link").click(function() {
  $("#svg_body").hide(500, function() {
    $("#map_body").show(500);
    $("#svg_body").empty();
  })
});

