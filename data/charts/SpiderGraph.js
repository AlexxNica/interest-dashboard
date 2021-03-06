function SpiderGraph($scope) {
  this._scope = $scope;
  this.MAIN_RADIUS = 100;
  this.GENERIC_CIRCLE = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgdmlld0JveD0iMCAwIDUwMCA1MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAJPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMCIgcj0iMTAwJSIgY3k9IjAiIGN4PSIwIiBncmFkaWVudHVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgCQk8c3RvcCBzdHlsZT0ic3RvcC1jb2xvcjogIzRCQjBGRTsiIG9mZnNldD0iMCUiLz4KICAJCTxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiAjMTc5M0U1OyIgb2Zmc2V0PSIxMDAlIi8+CiAgCTwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMjQ4IiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNGMkYyRjIiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMjQwIiBmaWxsPSJ1cmwoI2dyYWQwKSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjgiLz4KPC9zdmc+Cgo=";
  this.GENERIC_SOLID = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgdmlld0JveD0iMCAwIDUwMCA1MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI0OCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRjJGMkYyIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI0MCIgZmlsbD0iIzJDNzJFMiIvPgo8L3N2Zz4=";
  this.YOU_CIRCLE = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgdmlld0JveD0iMCAwIDUwMCA1MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI0OCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRjJGMkYyIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI0MCIgZmlsbD0iI0YyRjJGMiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+";
  this.LITTLE_GREY_CIRCLE = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgdmlld0JveD0iMCAwIDUwMCA1MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAJPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMCIgcj0iMTAwJSIgY3k9IjAiIGN4PSIwIiBncmFkaWVudHVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgCQk8c3RvcCBzdHlsZT0ic3RvcC1jb2xvcjogI0ZGRkZGRjsiIG9mZnNldD0iMCUiLz4KICAJCTxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiAjQzFDMUMxOyIgb2Zmc2V0PSIxMDAlIi8+CiAgCTwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMjQwIiBmaWxsPSJ1cmwoI2dyYWQwKSIgc3Ryb2tlPSIjRENEQ0RDIiBzdHJva2Utd2lkdGg9IjgiLz4KPC9zdmc+Cgo=";
  this.colors = d3.scale.category20();

  this._init();
  this.force = d3.layout.force()
    .size([this.width, this.height])
    .linkDistance(function(node, index) {
      let distance = 150 + node.target.layer * 130;
      if (node.source.id != 0) {
        // This is a subcat so give it a small distance from its parent.
        distance = -10;
      }
      return distance;
    })
    .charge(-8000)
    .on("tick", () => { this._tick(); });
}

SpiderGraph.prototype = {
  _init: function() {
    let self = this;
    this.width  = $(window).width();
    this.height = $(window).height() - 50;

    let x = d3.scale.linear()
        .domain([-this.width / 2, this.width / 2])
        .range([0, this.width]);

    let y = d3.scale.linear()
        .domain([-this.height / 2, this.height / 2])
        .range([this.height, 0]);

    function zoomed() {
      self._graphContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
    this.zoom = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

    this.svg = d3.select("#spiderGraph svg")
      .append("g")
      .on("click", stopped, true)
      .call(this.zoom);
    this.svg.append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    this._graphContainer = this.svg.append("g");
    this._graphContainer.append("g").attr("class", "links");
    this._graphContainer.append("g").attr("class", "nodes");
  },

  _tick: function() {
    link.attr("x1", (d) => { return d.source.x; })
        .attr("y1", (d) => { return d.source.y; })
        .attr("x2", (d) => { return d.target.x; })
        .attr("y2", (d) => { return d.target.y; });

    node.attr("transform", (d) => {
      return "translate(" + d.x + "," + d.y + ")";
    });

    if (typeof link2 !== 'undefined') {
      link2.attr("x1", (d) => { return d.source.x; })
        .attr("y1", (d) => { return d.source.y; })
        .attr("x2", (d) => { return d.target.x; })
        .attr("y2", (d) => { return d.target.y; });

      node2.attr("transform", (d) => {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    if (typeof link3 !== 'undefined') {
      link3.attr("x1", (d) => { return d.source.x; })
        .attr("y1", (d) => { return d.source.y; })
        .attr("x2", (d) => { return d.target.x; })
        .attr("y2", (d) => { return d.target.y; });

      node3.attr("transform", (d) => {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
  },

  _nod2Click: function(d) {
    $('.recommendationPanel').css("visibility", "hidden");
    this._semanticallyZoomed = false;
    this.svg.select(".nodes2").remove();
    this.svg.select(".links2").remove();
    this.svg.select(".nodes").attr("opacity", "1");
    this.svg.transition()
      .duration(750)
      .call(this.zoom.translate([0, 0]).scale(1).event);
  },

  _hover: function(d, $scope) {
    if (this._semanticallyZoomed || d.name == "YOU") {
      return;
    }
    this.svg.select(".nodes3").remove();
    this.svg.select(".links3").remove();

    let links = this._hoverLinks[d.name];
    let nodes = this._hoverNodes[d.name];
    let numSubnodes = nodes.length - 1;

    this._subcat = d3.layout.force()
      .size([d.x * 2, d.y * 2])
      .linkDistance(function(node, index) {
        return node.source.radius + 20;
      })
      .charge(function(node, index) {
        let charge = -4000;
        charge += numSubnodes * 500;
        return charge;
      })
      .on("tick", () => { this._tick(); });

    nodes[0].x = d.x;
    nodes[0].y = d.y;

    this._subcat
      .nodes(nodes)
      .links(links)

    this._graphContainer.append("g").attr("class", "links3");
    this._graphContainer.append("g").attr("class", "nodes3");

    link3 = this.svg.select(".links3").selectAll(".link3")
    link3 = link3.data(links);
    link3.exit().remove();
    link3.enter().append("line")
      .attr("class", "link3");

    node3 = this.svg.select(".nodes3").selectAll(".node3");
    node3 = node3.data(nodes,
      function(d) { return  d.id; });
    node3.exit().remove();
    node3.enter().append("g")
      .attr("class", "node3")
      .on("click", (d) => { return this._click(d, $scope); })
      .on('mouseout', (d) => {
        this.svg.select(".nodes3").remove();
        this.svg.select(".links3").remove();
      });

    node3.append("svg:image")
      .attr("xlink:href", (d) => { return d.id == 0 ? this.GENERIC_SOLID : this.LITTLE_GREY_CIRCLE; })
      .attr("width", function(d) { return d.radius * 2; })
      .attr("height", function(d) { return d.radius * 2; })
      .attr("x", function(d) { return -d.radius; })
      .attr("y", function(d) { return -d.radius; });

    this._subcat.start();
    this._subcat.tick();

    node3.append("foreignObject")
      .attr("width", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("height", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("x", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .attr("y", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .attr("pointer-events", "none")
      .append("xhtml:body")
        .style("font-size", (d) => {
          return this._getFontSizeByRadius(d.radius);
        })
        .style("background-color", "transparent")
        .attr("width", 30)
        .html((d) => { return this._getHTMLForNode(d, "hover"); });

    this._subcat.start();
    for (var i = 0; i < 100; ++i) this._subcat.tick();
    for (let i in this._hoverNodes) {
      this._hoverNodes[i].fixed = true;
    }
  },

  _click: function(d, $scope) {
    // Setting up the recommendation panel
    $('.recommendationPanel').css("visibility", "visible");
    $scope.$apply(function() {
      $scope.recommendationCategory = d.name;
    });

    this._semanticallyZoomed = true;
    this.svg.select(".nodes2").remove();
    this.svg.select(".links2").remove();

    this.svg.select(".nodes").attr("opacity", "0.2");
    let links = this._categoricalLinks[d.name];
    let nodes = this._categoricalNodes[d.name];
    let numSubnodes = nodes.length - 1;

    this._subcat = d3.layout.force()
      .size([d.x * 2, d.y * 2])
      .linkDistance(function(node, index) {
        return node.source.radius + 20;
      })
      .charge(function(node, index) {
        let charge = -4000;
        charge += numSubnodes * 500;
        return charge;
      })
      .on("tick", () => { this._tick(); });

    nodes[0].x = d.x;
    nodes[0].y = d.y;

    this._subcat
      .nodes(nodes)
      .links(links)

    this._subcat.start();
    for (var i = 0; i < 100; ++i) this._subcat.tick();

    this._graphContainer.append("g").attr("class", "links2");
    this._graphContainer.append("g").attr("class", "nodes2");

    link2 = this.svg.select(".links2").selectAll(".link2")
    link2 = link2.data(links);
    link2.exit().remove();
    link2.enter().append("line")
      .attr("class", "link2");

    node2 = this.svg.select(".nodes2").selectAll(".node2");
    node2 = node2.data(nodes,
      function(d) { return  d.id; });
    node2.exit().remove();
    node2.enter().append("g")
      .attr("class", "node2")
      .on("click", (d) => { return this._nod2Click(d); })

    node2.append("svg:image")
      .attr("xlink:href", (d) => { return d.id == 0 ? this.GENERIC_SOLID : this.GENERIC_CIRCLE; })
      .attr("width", function(d) { return d.radius * 2; })
      .attr("height", function(d) { return d.radius * 2; })
      .attr("x", function(d) { return -d.radius; })
      .attr("y", function(d) { return -d.radius; });

    node2.append("foreignObject")
      .attr("width", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("height", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("x", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .attr("y", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .append("xhtml:body")
        .style("font-size", (d) => {
          return this._getFontSizeByRadius(d.radius);
        })
        .style("background-color", "transparent")
        .attr("width", 30)
        .html((d) => { return this._getHTMLForNode(d); });

    let scale = .9 / Math.max((d.radius*2 + 105) / this.width, (d.radius*2 + 105) / this.height);
    let translate = [this.width / 2 - scale * d.x, this.height / 2 - scale * d.y];

    this.svg.transition()
      .duration(750)
      .call(this.zoom.translate(translate).scale(scale).event);
  },

  _getHTMLForNode: function(node, type) {
    if (node.name == "YOU") {
      function daysPostEpochToDate(dayCount) {
        return parseInt(dayCount) * 24 * 60 * 60 * 1000;
      }

      let minDate = d3.time.format('%m/%d/%Y')(new Date(daysPostEpochToDate(node.minDay)));
      return '<div class="centerNode">' +
          '<p id="totalInterests">' + html_sanitize(node.numInterests) + '</p>' +
          '<p id="activeInterestsLabel">Active Interests</p>' +
          '<p id="startDate">since ' + html_sanitize(minDate) + '</p>' +
        '</div>';
    }

    if (type != "hover") {
      return '<p class="nodeText">' + html_sanitize(node.name) + '</p>';
    }

    // Type is hover
    if (!node.name) {
      return "";
    }
    return '<p class="nodeText">(' + html_sanitize(node.recommendationCount) + ')<br>' + html_sanitize(node.name) + '</p>';
  },

  _getFontSizeByRadius: function(radius) {
    switch(radius) {
      case 50:
        return "12px";
      case 60:
        return "16px";
      case 70:
        return "18px";
      case 95:
        return "22px"
      case 110:
        return "28px";
      default:
        return "5px";
    }
  },

  graph: function(data, table, $scope) {
    if (data) {
      d3.select("#spiderGraph svg").selectAll("*").remove();
      this._init();

      data.nodes[0].x = this.width / 2;
      data.nodes[0].y = this.height / 2;

      this._nodes = data.nodes;
      this._links = data.links;

      this._categoricalNodes = data.categoricalNodes;
      this._categoricalLinks = data.categoricalLinks;
    }

    this._hoverNodes = JSON.parse(JSON.stringify(data.categoricalNodes));
    this._hoverLinks = JSON.parse(JSON.stringify(data.categoricalLinks));
    for (let category in this._hoverNodes) {
      for (let node of this._hoverNodes[category]) {
        if (node.id == 0) {
          continue;
        }
        node.radius = 10;
        node.name = "";
      }
    }

    this.force
      .nodes(this._nodes)
      .links(this._links)

    link = this.svg.select(".links").selectAll(".link")
    link = link.data(this._links);
    link.exit().remove();
    link.enter().append("line")
      .attr("class", "link");

    node = this.svg.select(".nodes").selectAll(".node");
    node = node.data(this._nodes, function(d) { return  d.id; });
    node.exit().remove();
    node.enter().append("g")
      .attr("class", "node")
      .on("click", (d) => { return this._click(d, $scope); })
      .on('mouseover', (d) => { return this._hover(d, $scope); })

    node.append("svg:image")
      .attr("xlink:href", (d) => { return d.name == "YOU" ? this.YOU_CIRCLE : this.GENERIC_CIRCLE; })
      .attr("width", function(d) { return d.radius * 2; })
      .attr("height", function(d) { return d.radius * 2; })
      .attr("x", function(d) { return -d.radius; })
      .attr("y", function(d) { return -d.radius; });

    this.force.start();
    this.force.tick();

    node.append("foreignObject")
      .attr("width", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("height", function(d) { return d.radius * 2 - (d.radius * 0.40); })
      .attr("x", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .attr("y", function(d) { return -d.radius + (d.radius * 0.40 / 2); })
      .append("xhtml:body")
        .style("font-size", (d) => {
          return this._getFontSizeByRadius(d.radius);
        })
        .style("background-color", "transparent")
        .attr("width", 30)
        .html((d) => { return this._getHTMLForNode(d); });

    this.force.start();
    if (data) {
      // Wait for graph to settle down before displaying on first draw.
      for (var i = 0; i < 100; ++i) this.force.tick();
      for (let i in this._nodes) {
        this._nodes[i].fixed = true;
      }
    }
  }
}
