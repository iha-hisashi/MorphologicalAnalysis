var create_rrt_tree = function() {
var diameter = 1800;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 370])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter + 300)
  .append("g")
    .attr("transform", "translate(" + diameter * 0.4 + "," + diameter / 2 + ")");

d3.json("", function(error, root) {
  $.getJSON("../js/area_rrt_tree/okinawa.js", function(json) {
	root = json;  

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
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "start"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "translate(8)"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "translate(8)"; })
      .attr("class", function(n) {
    	  return n.high_rate ? "bigger" : n.low_rate ? "smaller" : "";
      })
      .attr("style", function(n) {
    	 if (n.rank) {
    		 var font_size = 32 - parseInt(n.rank / 10) * 3;
    		 return "font-size : " + font_size + "px";
    	 }
      })
      .text(function(d) { return d.word + (d.tfidf ? " : " + d.tfidf : ""); });
  });
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");
}
create_rrt_tree();