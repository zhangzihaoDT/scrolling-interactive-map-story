var margin = { top: 30, right: 10, bottom: 10, left: 0 },
  width = document.getElementById("sankey").getBoundingClientRect().width,
  height = window.innerHeight / 2 - margin.top - margin.bottom;
// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function(d) {
    return "$" + formatNumber(d);
  };
// append the svg object to the body of the page
var svg = d3
  .select("#sankey")
  .append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3
  .sankey()
  .nodeWidth(10)
  .nodePadding(10)
  .size([width, height]);

var path = sankey.link();

// defs for the linear gradients
var defs = svg.append("defs");

// load the data
d3.csv("data/sankey.csv")
  .then(function(csv) {
    var nest_data = [];
    d3.nest()
      .key(function(d) {
        return d.source;
      })
      .rollup(function(item) {
        return {
          length: item[0].target,
          total_flights: d3.sum(item, function(d) {
            return parseFloat(eval(d.value));
          })
        };
      })
      .entries(csv)
      .forEach(e => {
        nest_data.push({
          source: e.key,
          target: e.value.length,
          value: e.value.total_flights
        });
      });
    return nest_data;
  })
  .then(function(csv) {
    var color = d3
      .scaleOrdinal()
      .domain(
        csv.map(item => {
          // console.log(item.target);
          return item.target;
        })
      )
      .range([
        "#da0050",
        "#ffe0b0",
        "#053e6f",
        "#23d4cc",
        "#ef9970",
        "#868e9e",
        "#73f2bc"
      ]);
    // create an array to push all sources and targets, before making them unique
    var arr = [];
    csv.forEach(function(d) {
      arr.push(d.source);
      arr.push(d.target);
    });

    // create nodes array
    var nodes = arr.filter(onlyUnique).map(function(d, i) {
      return {
        node: i,
        name: d
      };
    });

    // create links array
    var links = csv.map(function(csv_row) {
      return {
        source: getNode("source"),
        target: getNode("target"),
        value: +csv_row.value
      };

      function getNode(type) {
        return nodes.filter(function(node_object) {
          return node_object.name == csv_row[type];
        })[0].node;
      }
    });

    sankey
      .nodes(nodes)
      .links(links)
      .layout(32);

    // add in the links
    var link = svg
      .append("g")
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke", function(d, i) {
        // create the gradient
        var gradient_id = "gradient-" + i;
        var gradient = defs.append("linearGradient").attr("id", gradient_id);
        gradient
          .append("stop")
          .attr("offset", "5%")
          .attr("stop-color", color(d.source.name.replace(/ .*/, "")));
        gradient
          .append("stop")
          .attr("offset", "95%")
          .attr("stop-color", color(d.target.name.replace(/ .*/, "")));

        // TODO: Figure out what the hell is happening with bob and jimmy
        return i == 0
          ? color(d.source.name.replace(/ .*/, ""))
          : "url(#" + gradient_id + ")";
        // return "url(#" + gradient_id + ")";
      })
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy);
      })
      .sort(function(a, b) {
        return b.dy - a.dy;
      });

    // add the link titles
    link.append("title").text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

    // add in the nodes
    var node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(
        d3
          .drag()
          .subject(function(d) {
            return d;
          })
          .on("start", function() {
            this.parentNode.appendChild(this);
          })
          .on("drag", dragmove)
      );

    // add the rectangles for the nodes
    node
      .append("rect")
      .attr("height", function(d) {
        return d.dy < 0 ? 0.1 : d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
        return (d.color = color(d.name.replace(/ .*/, "")));
      })
      .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function(d) {
        return d.name + "\n" + format(d.value);
      });

    // add in the title for the nodes
    node
      .append("text")
      .attr("x", -6)
      .attr("y", function(d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) {
        return d.name;
      })
      .filter(function(d) {
        return d.x < width / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr(
        "transform",
        "translate(" +
          d.x +
          "," +
          (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
          ")"
      );
      sankey.relayout();
      link.attr("d", path);
    }
  });
// unique values of an array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var svgP1 = d3
  .select("#histogram")
  .append("svg")
  .attr("width", width)
  .attr("height", height / 2 + 20 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/2008-2018airportCapacity.csv")
  .then(function(d) {
    var histData = [];
    d3.nest()
      .key(function(d) {
        return d.year;
      })
      .rollup(function(item) {
        return {
          total_flights: d3.sum(item, function(d) {
            return parseFloat(eval(d.capacity));
          })
        };
      })
      .entries(d)
      .forEach(e => {
        histData.push({
          year: e.key,
          capacity: e.value.total_flights
        });
      });
    return histData;
  })
  .then(function(data) {
    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function(d) {
          return d.year;
        })
      )
      .padding(0.2);
    svgP1
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([0, 1300000000])
      .range([height / 2, 0]);
    // svgP1.append("g").call(d3.axisLeft(y));

    // Bars
    svgP1
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.year);
      })
      .attr("width", x.bandwidth())
      .attr("fill", function(d) {
        if (d.year == 2018) {
          return "#30f5d2";
        } else {
          return "#868e9e";
        }
      })
      // no bar at the beginning thus:
      .attr("height", function() {
        return height / 2 - y(0);
      }) // always equal to 0
      .attr("y", function(d) {
        return y(0);
      });

    document.getElementById("slider").addEventListener("input", function(e) {
      var year = parseInt(e.target.value);
      console.log(year);
      svgP1.selectAll("rect").attr("fill", function(d) {
        if (d.year == year) {
          return "#30f5d2";
        } else {
          return "#868e9e";
        }
      });
    });
    //Animation
    svgP1
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function(d) {
        return y(d.capacity);
      })
      .attr("height", function(d) {
        return height / 2 - y(d.capacity);
      })
      .delay(function(d, i) {
        return i * 200;
      });
  });

var svgP2 = d3
  .select("#dviz-hbar")
  .append("svg")
  .attr("width", width)
  .attr("height", (height * 3) / 2 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.right * 6 + "," + margin.top + ")");
const dataset = [];
d3.csv("data/2018_centrality_edit.csv")
  .then(function(data) {
    data
      .sort(function(a, b) {
        return d3.ascending(b.node_dc, a.node_dc);
      })
      .filter(function(d, i) {
        return i < 30;
      })
      .forEach(function(node, index) {
        return dataset.push({
          Name: node.node,
          region: node.air_region,
          Count: index + 1,
          size: eval(node.node_dc)
        });
      });
    return dataset;
  })
  .then(function(data) {
    //sort bars based on value
    data = data.sort(function(a, b) {
      return d3.ascending(a.size, b.size);
    });
    var formatDecimalComma = d3.format(",.2f");
    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var color = d3
      .scaleOrdinal()
      .domain(
        dataset.map(item => {
          // console.log(item.region);
          return item.region;
        })
      )
      .range([
        "#868e9e",
        "#da0050",
        "#23d4cc",
        "#ffe0b0",
        "#053e6f",
        "#73f2bc",
        "#ef9970"
      ]);
    var x = d3
      .scaleLinear()
      .range([0, width])
      .domain([
        0,
        d3.max(data, function(d) {
          return d.size;
        })
      ]);

    var y = d3
      .scaleBand()
      .rangeRound([(height * 3) / 2, 0], 0.1)
      .domain(
        data.map(function(d) {
          return d.Name;
        })
      );

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y);

    var gy = svgP2
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var bars = svgP2
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g");

    //append rects
    bars
      .append("rect")
      .attr("y", function(d) {
        return y(d.Name);
      })
      .attr("height", y.bandwidth() / 2)
      .attr("transform", "translate(" + 0 + "," + 5 + ")")
      .attr("x", 0)
      .attr("width", function(d) {
        return (x(d.size) * 2) / 3;
      })
      .style("fill", function(d, i) {
        return color(d.region);
      });
    //add a value label to the right of each bar
    bars
      .append("text")
      .attr("y", function(d) {
        return y(d.Name) + y.bandwidth() / 2 + 4;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", function(d) {
        return (x(d.size) * 2) / 3 + 3;
      })
      .text(function(d) {
        return formatDecimalComma(d.size);
      })

      .attr("font-size", function(d) {
        return 14;
      })
      .attr("fill", "white");
    bars
      .append("text")
      .attr("y", function(d) {
        return y(d.Name) + y.bandwidth() / 2 + 4;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", -60)
      .text(function(d) {
        return d.Count;
      })
      .attr("font-size", function(d) {
        return 14;
      })
      .attr("font-family", "DIN-Bold")
      .attr("fill", "white");
  });
