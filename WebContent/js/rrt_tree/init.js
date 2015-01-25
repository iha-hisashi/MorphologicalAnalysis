var create_rrt_tree = function() {
var diameter = 1500;

var tree = d3.layout.tree()
  .size([360, 450])
  .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter + 300)
  .append("g")
    .attr("transform", "translate(" + diameter * 0.4 + "," + diameter / 2 + ")");

// 実際は第一引数にjsonのパスを渡す
// 今回は$.ajax()の中で local_json = 取得json のようにやっている
// つまりlocal_jsonはグローバル変数となっているため注意
d3.json("", function(error, root) {
  // name, children が入れ子になっているような構造
  // root = { name : "入力テキスト", children : [
  //   { name : "名詞", children : [ { name : "犬", frequent : 1 }, ... ]},
  //   { name : "動詞", children : [ { name : "走る", frequent : 2 }, ... ]}, ...
  //  ]}
  root = local_json;

  // 名詞に限定, ソート, limit 100.
  // 本来はサーバサイドでやった方が通信量を抑えられて良い.
  root.children = $.map(root.children, function(child) {
     return child.name.match("名詞") ? child.children : [];  
  }).sort(function(c1, c2){
    if (c2.frequent != c1.frequent) {
      return c2.frequent - c1.frequent;
    } else if (c2.name > c1.name){
      return -1;
    } else if (c2.name < c1.name) {
      return 1;
    }
  }).slice(0, 100);

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
 
  // d3.jsが座標を計算してくれる
  var nodes = tree.nodes(root);
  var links = tree.links(nodes);

  // メソッドチェーンでDOM操作や属性追加
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
        // 高レート, 低レートでclass追加
        return n.high_rate ? "bigger" : n.low_rate ? "smaller" : "";
      })
      .attr("style", function(n) {
       if (n.rank) {
         // 配列の頭からだんだん文字を小さく
         var font_size = 32 - parseInt(n.rank / 10) * 3;
         return "font-size : " + font_size + "px";
       }
      })
      .text(function(d) { 
        return d.name + (d.frequent ? (" : " + d.frequent) : "");
      });
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");
}
