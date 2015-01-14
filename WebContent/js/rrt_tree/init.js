var create_rrt_tree = function() {
var diameter = 1080;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 120])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter + 300)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

d3.json("", function(error, root) {
  root = local_json;
  var nodes = tree.nodes(root).sort(function(n1, n2){
	  // 末端である -> 頻出降順 -> name辞書昇順 
	  if ((!('children' in n1)) && ('children' in n2)) {
		  return -1;
	  } else if (('children' in n1) && (!('children' in n2))) {
		  return 1;
	  } else if (n2.frequent != n1.frequent) {
		  return n2.frequent - n1.frequent;
	  } else if (n2.name > n1.name){
		  return -1;
	  } else if (n2.name < n1.name) {
		  return 1;
	  }
  });
  var word_nums = $.grep(nodes, function(node) { return !('children' in node); }).length;
  // 高レート順位の定義
  var high_rate_rank = word_nums * 10 / 100;
  // 低レート順位の定義
  var low_rate_rank = word_nums * 90 / 100;
  nodes = $.map(nodes, function(node, index){
    node.rank = index + 1;
    // 高レートならtrue
    node.high_rate = !('children' in node) && node.rank <= high_rate_rank;
    // 低レートならtrue
    node.low_rate = !('children' in node) && node.rank > low_rate_rank;
	return node;
  });
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
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .attr("class", function(n) {
    	  if (n.high_rate) {
    		  return "bigger";
    	  } else if (n.low_rate) {
    		  return "smaller";
    	  }
      })
      .text(function(d) { return d.name; });
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");
}