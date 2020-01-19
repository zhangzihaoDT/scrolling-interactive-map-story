//每次刷新回到顶部
window.onbeforeunload = function() {
  window.scrollTo(0, 0);
};
document.getElementById("getback").addEventListener("click", function() {
  window.scrollTo(0, 0);
});
document.getElementById("scrollDown").addEventListener("click", function() {
  window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
});
var zoom = 3.7;
// 为方便起见使用d3
var main = d3.select(".page");
var scrolly = main.select(".scrolly");
var figure = scrolly.select("#map");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

function getZoomValue() {
  let gWidth = window.screen.width;
  if (gWidth <= 414) {
    zoom = 2.2;
  } else if (gWidth <= 640) {
    zoom = 3.2;
  } else if (gWidth <= 812) {
    zoom = 4;
  }
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.5); //向下取整
  var stepH_desktop = Math.floor(window.innerHeight * 0.5); //向下取整
  var scrollyWidth = window.innerWidth;
  var figureHeight = scrollyWidth * 1.025;
  var figureHeightFull = window.innerHeight;
  var figureMarginTop = 0;
  if (window.innerWidth > 811) {
    // step.style("height", stepH_desktop + "px");
    figure
      .style("height", figureHeightFull + "px")
      .style("top", figureMarginTop + "px");
  } else {
    // step.style("height", stepH + "px");
    figure
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");

    window.addEventListener("scroll", function(e) {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > window.innerHeight) {
        document.getElementById("hideMap").classList.remove("hidden");
      } else {
        document.getElementById("hideMap").classList.add("hidden");
      }
    });

    document.getElementById("hideMap").addEventListener("click", function() {
      if (
        document.getElementById("map").getAttribute("data-status") != "close"
      ) {
        figure.style("height", 4 + "px");
        window.scrollBy({
          top: window.innerWidth * 1.025 - 4,
          left: 0,
          behavior: "smooth"
        });
        document.getElementById("map").setAttribute("data-status", "close");
        document.getElementById("map").style.borderBottom = "4px solid #23d4cc";
        document.getElementById("hideMap").setAttribute("value", "expand");
        document.getElementById("hideMap").setAttribute("checked", "release");
      } else {
        figure.style("height", window.innerWidth * 1.025 + "px");
        window.scrollBy({
          top: 4 - window.innerWidth * 1.025,
          left: 0,
          behavior: "smooth"
        });
        document.getElementById("map").setAttribute("data-status", "open");
        document.getElementById("map").style.borderBottom = "none";
        document.getElementById("hideMap").setAttribute("value", "fold");
        document.getElementById("hideMap").setAttribute("checked", "checked");
      }
    });
  }
}

function naviFind() {
  window.addEventListener("scroll", function(e) {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > window.innerHeight) {
      document.querySelector(".Quick-navigation").classList.remove("hidden");
    } else {
      document.querySelector(".Quick-navigation").classList.add("hidden");
    }
  });
  const allMenu = document.querySelectorAll(".Quick-navigation-item");
  for (const menuEle of allMenu) {
    const menuId = menuEle.id;
    // const cardId = menuEle.getAttribute("href").slice(1);
    document.getElementById(menuId).addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const cardId = e.currentTarget.getAttribute("href").slice(1);
      document.getElementById(cardId).scrollIntoView({ behavior: "smooth" });
    });
  }
}

// generic window resize listener event
function handleResize() {
  document.addEventListener("resize", function(event) {
    //"resize"是window的内置对象;
    // debugger;
    getZoomValue();

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
  });
}
// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  const data_step = {
    capacity: "data_step1",
    airlines: "data_step2",
    centrality: "data_step3",
    TOP30: "data_step4",
    chinaEconomicZone: "data_step5",
    china_xinan: "data_step6",
    china_huazhongAndDongbei: "data_step7",
    region_concat: "data_step8"
  };
  // console.log(Object.entries(data_step));

  const currentStep = response.element.id;
  const menuId = data_step[currentStep];
  if (menuId) {
    const allMenu = document.querySelectorAll(".Quick-navigation-item");
    for (const menuEle of allMenu) {
      menuEle.classList.remove("current");
    }
    document.getElementById(menuId).classList.add("current");
  }
  const currentDirection = response.direction;
  const directionIs = (index, direction) => {
    return currentStep === index && currentDirection === direction;
  };
  if (directionIs("airlines", "down") || directionIs("airlines", "up")) {
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(airlinesLayer, "visibility", "visible");
    map.setLayoutProperty(airportsLayer, "visibility", "visible");
    map.flyTo({
      duration: 3000,
      zoom: zoom * 1.0125,
      center: [104.2115, 32],
      bearing: 0,
      pitch: 15
    });
  } else if (directionIs("capacity", "up")) {
    mapReset();
  } else if (
    directionIs("centrality", "down") ||
    directionIs("centrality", "up")
  ) {
    map.easeTo({
      duration: 2000,
      zoom: zoom * 1.125,
      center: [104.2115, 32],
      bearing: 5,
      pitch: 30
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(airlinesLayer, "visibility", "visible");
    map.setLayoutProperty(centralityLayer, "visibility", "visible");
  } else if (directionIs("TOP30", "down") || directionIs("TOP30", "up")) {
    map.easeTo({
      duration: 2000,
      zoom: zoom * 1.125,
      center: [104.2115, 32],
      bearing: 5,
      pitch: 30
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(airline2018Top30Layer, "visibility", "visible");
    map.setLayoutProperty(centrality2018Top30Layer, "visibility", "visible");
    china_economicZones.forEach(china_economicZone => {
      map.setLayoutProperty(china_economicZone, "visibility", "none");
    });
    china_areas.forEach(china_area => {
      map.setLayoutProperty(china_area, "visibility", "none");
    });
  } else if (
    directionIs("chinaEconomicZone", "down") ||
    directionIs("chinaEconomicZone", "up")
  ) {
    map.easeTo({
      duration: 2000,
      zoom: zoom * 1.35,
      center: [114.96792240851124, 31.764229293654296],
      bearing: -8,
      pitch: 32.0
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(airlineUrbanLayer, "visibility", "visible");
    map.setLayoutProperty(centrality2018UrbanLayer, "visibility", "visible");
    china_economicZones.forEach(china_economicZone => {
      map.setLayoutProperty(china_economicZone, "visibility", "visible");
    });
    china_areas.forEach(china_area => {
      map.setLayoutProperty(china_area, "visibility", "none");
    });
  } else if (
    directionIs("china_xinan", "down") ||
    directionIs("china_xinan", "up")
  ) {
    map.flyTo({
      duration: 2000,
      zoom: zoom * 1.15,
      center: [101.282855, 29.124317],
      bearing: 19.44,
      pitch: 41.0
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(centralityLayer, "visibility", "visible");
    china_economicZones.forEach(china_economicZone => {
      map.setLayoutProperty(china_economicZone, "visibility", "none");
    });
    china_areas.forEach(china_area => {
      map.setLayoutProperty(china_area, "visibility", "none");
    });
    map.setLayoutProperty(mapboxLayerXinan, "visibility", "visible");
  } else if (
    directionIs("china_huazhongAndDongbei", "down") ||
    directionIs("china_huazhongAndDongbei", "up")
  ) {
    map.flyTo({
      duration: 1500,
      zoom: zoom * 1.25,
      center: [113.890045, 37.303672],
      bearing: 10.86,
      pitch: 30.0
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(centralityLayer, "visibility", "visible");
    china_economicZones.forEach(china_economicZone => {
      map.setLayoutProperty(china_economicZone, "visibility", "none");
    });
    china_areas.forEach(china_area => {
      map.setLayoutProperty(china_area, "visibility", "visible");
    });
    map.setLayoutProperty(mapboxLayerXinan, "visibility", "none");
  } else if (
    directionIs("region_concat", "down") ||
    directionIs("region_concat", "up")
  ) {
    map.flyTo({
      duration: 1500,
      center: [105.71583091589503, 34.54057941327483],
      zoom: zoom * 1.1,
      pitch: 27,
      bearing: 0 //轴旋转
    });
    toggleableLayerIds.forEach(toggleableLayerId => {
      map.setLayoutProperty(toggleableLayerId, "visibility", "none");
    });
    map.setLayoutProperty(regionLinesLayer, "visibility", "visible");
    map.setLayoutProperty(regionTop10Layer, "visibility", "visible");
    map.setLayoutProperty(regionTop7Layer, "visibility", "visible");
    china_economicZones.forEach(china_economicZone => {
      map.setLayoutProperty(china_economicZone, "visibility", "none");
    });
    china_areas.forEach(china_area => {
      map.setLayoutProperty(china_area, "visibility", "none");
    });
  } else if (directionIs("gloucester", "down")) {
    mapReset();
  }

  // add color to current step only
  step.classed("is-active", function(d, i) {
    return i === response.index;
  });

  // update graphic based on step
  // figure.select("p").text(response.index + 1);
}
function handleStepProgress(response) {
  // console.log(response.progress);
}
function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}
function proportion() {
  if (window.innerWidth > 720) {
    return 0.5;
  } else {
    return (window.innerWidth / window.innerHeight) * 1.025;
  }
}
function init() {
  naviFind();
  setupStickyfill();
  getZoomValue();
  // 1. 强制调整大小以确保将适当的尺寸发送到scrollama
  handleResize();
  // 2. 设置滚动条传递选项
  // 	  这也会初始化trigger observations
  // 3. 绑定scrollalama事件处理程序（这可以链接如下）

  scroller
    .setup({
      step: ".scrolly article .step",
      offset: proportion(),
      debug: false,
      progress: true
    })
    .onStepEnter(handleStepEnter)
    .onStepProgress(handleStepProgress);

  // 设置调整大小事件
  window.addEventListener("resize", handleResize);
}
// 开始吧～
init();
//这里要注意：一定要先初始化，才能加载地图，否则mapboxGL无法明确既定的CSS方案来设置地图
mapboxgl.accessToken =
  "pk.eyJ1Ijoiemhhbmd6aWhhbyIsImEiOiJjamN6dDF1bzMwenphMzNuMjlqaG1vOTJlIn0.VdSfOPUC85YcWqs3LZeXmA";

// debugger;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/zhangzihao/ck085noh40pji1dnx8aoqkpae", //DESIGN2019-LAST
  pitch: 0, //视角
  bearing: 0, //轴旋转
  center: [104.2115, 32],
  zoom: zoom,
  maxZoom: 5.75,
  interactive: false
});
// function to reset map to original position
const mapReset = () => {
  map.flyTo({
    duration: 1500,
    center: [104.2115, 32],
    zoom: zoom,
    pitch: 0,
    bearing: 0 //轴旋转
  });
  toggleableLayerIds.forEach(toggleableLayerId => {
    map.setLayoutProperty(toggleableLayerId, "visibility", "none");
  });
  // map.setLayoutProperty(airlinesLayer, "visibility", "visible");
  map.setLayoutProperty(capacityLayer, "visibility", "visible");
};
var count = 0;

var files = [
  "data/2008-2018airportCapacity.csv",
  "data/2018_centrality_edit.csv",
  "data/Airline&Centrality_edit.csv",
  "data/regionalContact_edit.csv"
];
var promises = [];

var airLines = {
  type: "FeatureCollection",
  features: []
};

var capacityData = {
  type: "FeatureCollection",
  features: []
};
var centralityData = {
  type: "FeatureCollection",
  features: []
};
const centralityValues = {
  type: "FeatureCollection",
  features: []
};

var regionLines = {
  type: "FeatureCollection",
  features: []
};

var regionAirports = {
  type: "FeatureCollection",
  features: []
};

var regionAirportsDeparture = {
  type: "FeatureCollection",
  features: []
};

files.forEach(function(url) {
  promises.push(d3.csv(url));
});

map.on("load", function(e) {
  Promise.all(promises)
    .then(function(csvData) {
      console.log("data coming!");
      csvData[0].forEach(item => {
        return capacityData.features.push({
          type: "Feature",
          properties: {
            year: eval(item.year),
            code: String(item.airport_code),
            name: item.airport_name,
            capacity: eval(item.capacity),
            rank: eval(item.rank)
          },
          geometry: {
            type: "Point",
            coordinates: [eval(item.longitude), eval(item.latitude)]
          }
        });
      });
      csvData[1]
        .sort(function(a, b) {
          return d3.ascending(b.node_dc, a.node_dc);
        })
        .forEach(function(item, index) {
          return centralityData.features.push({
            type: "Feature",
            properties: {
              rank: index + 1,
              code: String(item.node),
              name: item.airport_name,
              node_dc: eval(item.node_dc),
              urban: item.urban_group,
              region: item.air_region
            },
            geometry: {
              type: "Point",
              coordinates: [eval(item.longitude), eval(item.latitude)]
            }
          });
        });

      csvData[2]
        .filter(function(d) {
          return d.year == 2018;
        })
        .forEach(item => {
          return airLines.features.push({
            type: "Feature",
            properties: {
              year: eval(item.year),
              flights: eval(item.flights),
              centrality: parseFloat(item.node_dc.replace(",", "")),
              urban: item.urban_group
            },
            geometry: {
              type: "LineString",
              coordinates: [
                [eval(item.departure_lng), eval(item.departure_lat)],
                [eval(item.arrival_lng), eval(item.arrival_lat)]
              ]
            }
          });
        });
      csvData[3].forEach(item => {
        return regionLines.features.push({
          type: "Feature",
          properties: {
            departureCity: item.departure_EN,
            arrivalCity: item.arrival_EN,
            flights: eval(item.flights),
            departure_code: item.departure_code,
            arrival_code: item.arrival_code
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [eval(item.departure_lng), eval(item.departure_lat)],
              [eval(item.arrival_lng), eval(item.arrival_lat)]
            ]
          }
        });
      });
      csvData[3].forEach(item => {
        return regionAirports.features.push({
          type: "Feature",
          properties: {
            departureCity: item.departure_EN,
            arrivalCity: item.arrival_EN,
            flights: eval(item.flights),
            departure_code: item.departure_code,
            arrival_code: item.arrival_code
          },
          geometry: {
            type: "Point",
            coordinates: [eval(item.arrival_lng), eval(item.arrival_lat)]
          }
        });
      });

      d3.nest() //7大核心机场
        .key(function(d) {
          return d.departure_EN;
        })
        .sortKeys(d3.ascending)
        .rollup(function(item) {
          return {
            length: item.length,
            total_flights: d3.sum(item, function(d) {
              return parseFloat(eval(d.flights));
            }),
            departure_lng: eval(item[0].departure_lng),
            departure_lat: eval(item[0].departure_lat),
            departure_code: item[0].departure_code,
            arrival_EN: item.map(s => {
              return s.arrival_EN;
            })
          };
        })
        .entries(csvData[3])
        .forEach(e => {
          return regionAirportsDeparture.features.push({
            type: "Feature",
            properties: {
              departureCity: e.key,
              frequency: e.value.length,
              total_flights: e.value.total_flights,
              departure_code: e.value.departure_code,
              arrivalCity: e.value.arrival_EN
            },
            geometry: {
              type: "Point",
              coordinates: [e.value.departure_lng, e.value.departure_lat]
            }
          });
        });
    })
    .then(function() {
      //航线
      const flightsMax = d3.max(
        airLines.features.map(function(d) {
          return d.properties.flights;
        })
      );
      const flightsMin = d3.min(
        airLines.features.map(function(d) {
          return d.properties.flights;
        })
      );
      const flightsSort = airLines.features
        .filter(function(d) {
          return d.properties.urban != "none";
        })
        .sort(function(a, b) {
          return d3.ascending(b.properties.flights, a.properties.flights);
        });

      // console.log(
      //   centralityData.features.map(function(d) {
      //     return d.properties.rank;
      //   })
      // );
      map.addLayer(
        {
          type: "line",
          source: {
            type: "geojson",
            lineMetrics: true,
            data: airLines
          },
          id: "airline2018",
          paint: {
            "line-color": "red",
            "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.1, 5, 0.8],
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            "line-gradient": [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#30f5d2",
              0.2,
              "#002252",
              0.4,
              "#22262f",
              0.6,
              "#002252",
              1,
              "#fddeb2"
            ],
            "line-opacity": 0.07
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        },
        "waterway-label"
      );
      map.addLayer(
        {
          type: "line",
          source: {
            type: "geojson",
            lineMetrics: true,
            data: airLines
          },
          id: "airline2018Top30",
          filter: [
            ">=",
            ["get", "centrality"],
            centralityData.features[29].properties.node_dc
          ],
          paint: {
            "line-color": "red",
            "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.2, 5, 1.6],
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            "line-gradient": [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#40f3d1",
              0.5,
              "#002252",
              1,
              "#d70e52"
            ],
            "line-opacity": 0.05
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        },
        "waterway-label"
      );
      map.addLayer(
        //绘制3大城市经济圈航班量Top50航线
        {
          type: "line",
          source: {
            type: "geojson",
            lineMetrics: true,
            data: airLines
          },
          id: "airlineUrban",
          filter: [
            "all",
            ["!=", ["get", "urban"], "none"],
            [">=", ["get", "flights"], flightsSort[49].properties.flights]
          ],
          paint: {
            "line-color": [
              "match",
              ["get", "urban"],
              "yrd",
              "#fbb03b",
              "prd",
              "#223b53",
              "bth",
              "#e55e5e",
              /* other */ "#ccc"
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "flights"]],
                flightsSort[49].properties.flights, //差值min
                2,
                flightsMax, //差值max
                18
              ],
              5,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "flights"]],
                flightsSort[49].properties.flights, //差值min
                4,
                flightsMax, //差值max
                36
              ]
            ],
            // 'line-gradient' must be specified using an expression
            // with the special 'line-progress' property
            "line-gradient": [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#30f5d2",
              1,
              "#22262f"
            ],
            "line-opacity": 0.1
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        },
        "waterway-label"
      );
      map.addLayer(
        //绘制7大地理核心触达机场TOP10
        {
          type: "line",
          source: {
            type: "geojson",
            lineMetrics: true,
            data: regionLines
          },
          id: "regionAirConcat",
          paint: {
            "line-color": [
              "match",
              ["get", "arrival_code"],
              "northChina",
              "#868e9e",
              "eastChina",
              "#da0050",
              "northWest",
              "#23d4cc",
              "southWest",
              "#ffe0b0",
              "southChina",
              "#053e6f",
              "central",
              "#73f2bc",
              /* other */ "#ef9970"
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "flights"]],
                4216, //差值min
                2,
                34787, //差值max
                18
              ],
              5,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "flights"]],
                4216, //差值min
                4,
                34787, //差值max
                36
              ]
            ],
            // with the special 'line-progress' property

            "line-opacity": 0.3
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        },
        "waterway-label"
      );
      //中心度
      centralityData.features.forEach(function(f) {
        var object = turf.centerOfMass(f);
        var center = object.geometry.coordinates;
        var radius = 15;
        var options = {
          steps: 6,
          units: "kilometers",
          properties: object.properties
        };
        centralityValues.features.push(turf.circle(center, radius, options));
      });
      map.addLayer(
        {
          id: "extrusion",
          type: "fill-extrusion",
          source: "fill-extrusion",
          source: {
            type: "geojson",
            data: centralityValues
          },
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["exponential", 0.99],
              ["to-number", ["get", "node_dc"]],
              0,
              "#40f3d1",
              0.6,
              "#fddeb2",
              1,
              "#da0050"
            ],
            "fill-extrusion-height": [
              "*",
              ["to-number", ["get", "node_dc"]],
              600000
            ],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.9
          }
        },
        "waterway-label"
      );
      //筛选出中心度TOP30
      map.addLayer(
        {
          id: "extrusionTop30",
          type: "fill-extrusion",
          source: "fill-extrusion",
          source: {
            type: "geojson",
            data: centralityValues
          },
          filter: [
            ">=",
            ["get", "node_dc"],
            centralityData.features[29].properties.node_dc
          ],
          paint: {
            "fill-extrusion-color": [
              "match",
              ["get", "region"],
              "northChina",
              "#868e9e",
              "eastChina",
              "#da0050",
              "northWest",
              "#23d4cc",
              "southWest",
              "#ffe0b0",
              "southChina",
              "#053e6f",
              "central",
              "#73f2bc",
              /* other */ "#ef9970"
            ],
            "fill-extrusion-height": [
              "*",
              ["to-number", ["get", "node_dc"]],
              600000
            ],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.9
          }
        },
        "waterway-label"
      );
      //筛选出城市群内的
      map.addLayer(
        {
          id: "extrusionUrban",
          type: "fill-extrusion",
          source: "fill-extrusion",
          source: {
            type: "geojson",
            data: centralityValues
          },
          filter: ["!=", ["get", "urban"], "none"],
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["exponential", 0.99],
              ["to-number", ["get", "node_dc"]],
              0,
              "#40f3d1",
              1,
              "#fffdfa"
            ],
            "fill-extrusion-height": [
              "*",
              ["to-number", ["get", "node_dc"]],
              600000
            ],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.9
          }
        },
        "waterway-label"
      );

      map.addLayer(
        {
          id: "thought10Years",
          type: "circle",
          source: {
            type: "geojson",
            data: capacityData
          },
          filter: ["==", ["to-number", ["get", "year"]], 2018],
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "capacity"]],
                456, //差值min
                1,
                100983290, //差值max
                16
              ],
              5,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "capacity"]],
                456, //差值min
                4,
                100983290, //差值max
                48
              ]
            ],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["to-number", ["get", "capacity"]],
              200000, //20万级别的
              "#40f3d1",
              1000000, //百万级别的
              "#95efad",
              10000000, //千万级别的
              "#cce89f",
              20000000, //2000万级别的
              "#fddeb2",
              50000000, //5000万级别的
              "#eb8062",
              100000000, //1亿级别的
              "#d70e52"
            ],
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["to-number", ["get", "capacity"]],
              200000, //20万级别的
              0.65,
              1000000, //百万级别的
              0.75,
              10000000, //千万级别的
              0.8,
              20000000, //2000万级别的
              0.85,
              50000000, //5000万级别的
              0.95,
              100000000, //1亿级别的
              1
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff"
          }
        },
        "waterway-label"
      );

      map.addLayer(
        {
          id: "airpots2018",
          type: "circle",
          source: {
            type: "geojson",
            data: capacityData
          },
          filter: ["==", ["to-number", ["get", "year"]], 2018],
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              0.2,
              5,
              5
            ],
            "circle-color": "#fffdfa",
            "circle-opacity": 1,
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              1,
              5,
              3
            ],
            "circle-stroke-opacity": 0.5,
            "circle-stroke-color": "#ffffff"
          }
        },
        "waterway-label"
      );

      const regionConcatTotalFlightsMax = d3.max(
        regionAirportsDeparture.features.map(function(d) {
          return d.properties.total_flights;
        })
      );
      const regionConcatTotalFlightsMin = d3.min(
        regionAirportsDeparture.features.map(function(d) {
          return d.properties.total_flights;
        })
      );
      map.addLayer(
        {
          id: "regionTop10",
          type: "circle",
          source: {
            type: "geojson",
            data: regionAirports
          },
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 2, 5, 8],
            "circle-color": [
              "match",
              ["get", "arrival_code"],
              "northChina",
              "#868e9e",
              "eastChina",
              "#da0050",
              "northWest",
              "#23d4cc",
              "southWest",
              "#ffe0b0",
              "southChina",
              "#053e6f",
              "central",
              "#73f2bc",
              /* other */ "#ef9970"
            ],
            "circle-opacity": 1,
            "circle-stroke-width": 0.5,
            "circle-stroke-color": "#ffffff"
          }
        },
        "waterway-label"
      );
      map.addLayer(
        {
          id: "regionTop7",
          type: "circle",
          source: {
            type: "geojson",
            data: regionAirportsDeparture
          },
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              2,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "total_flights"]],
                regionConcatTotalFlightsMin, //差值min
                3,
                regionConcatTotalFlightsMax, //差值max
                10
              ],
              5,
              [
                "interpolate",
                ["linear"],
                ["to-number", ["get", "total_flights"]],
                regionConcatTotalFlightsMin, //差值min
                6,
                regionConcatTotalFlightsMax, //差值max
                20
              ]
            ],
            "circle-color": [
              "match",
              ["get", "departure_code"],
              "northChina",
              "#868e9e",
              "eastChina",
              "#da0050",
              "northWest",
              "#23d4cc",
              "southWest",
              "#ffe0b0",
              "southChina",
              "#053e6f",
              "central",
              "#73f2bc",
              /* other */ "#ef9970"
            ],
            "circle-opacity": 1,
            "circle-stroke-width": 0.5,
            "circle-stroke-color": "#ffffff"
          }
        },
        "waterway-label"
      );

      //初始化将所有的图层隐藏
      toggleableLayerIds.forEach(toggleableLayerId => {
        if (toggleableLayerId == capacityLayer) {
        } else {
          map.setLayoutProperty(toggleableLayerId, "visibility", "none");
        }
      });

      // the layer must be of type 'line'
      document.getElementById("slider").addEventListener("input", function(e) {
        var year = parseInt(e.target.value);
        // update the map
        map.setFilter("thought10Years", [
          "==",
          ["to-number", ["get", "year"]],
          year
        ]);
        // update text in the UI
        document.getElementById("active-hour").innerText = year;
      });
      document.getElementById("filters").addEventListener("click", function(e) {
        var region = e.target.value;
        // console.log(region);
        // update the map filter
        if (region === "TOP10") {
          filterRegion = [
            "!=",
            ["string", ["get", "departure_code"]],
            "placeholder"
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features.forEach(function(e) {
            e.geometry.coordinates.forEach(function(item) {
              boundsData.push(item);
            });
          });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 40
          });
        } else if (region === "北京") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["northChina"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Beijing";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "上海") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["eastChina"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Shanghai";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "哈尔滨") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["northEast"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Harbin";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "西安") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["northWest"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Xi'an";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "长沙") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["central"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Changsha";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "成都") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["southWest"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Chengdu";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else if (region === "广州") {
          filterRegion = [
            "match",
            ["get", "departure_code"],
            ["southChina"],
            true,
            false
          ];
          //航线数据筛选，存入当前的bounds，更改地图适口
          var boundsData = [];
          regionLines.features
            .filter(function(d) {
              return d.properties.departureCity == "Guangzhou";
            })
            .forEach(function(e) {
              e.geometry.coordinates.forEach(function(item) {
                boundsData.push(item);
              });
            });
          var bounds = boundsData.reduce(function(bounds, coord) {
            // console.log(bounds.extend(coord))
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(boundsData[0], boundsData[0]));
          map.fitBounds(bounds, {
            padding: 20
          });
        } else {
          console.log("error");
        }
        map.setFilter("regionTop7", ["all", filterRegion]);
        map.setFilter("regionTop10", ["all", filterRegion]);
        map.setFilter("regionAirConcat", ["all", filterRegion]);
      });
      //鼠标点击信息增强
      // regionAirportsDeparture.features.forEach(function(marker) {
      //   // create a HTML element for each feature
      //   var el = document.createElement("div");
      //   el.className = "marker";
      //   // make a marker for each feature and add to the map
      //   new mapboxgl.Marker(el)
      //     .setLngLat(marker.geometry.coordinates)
      //     .setPopup(
      //       new mapboxgl.Popup({ offset: 25 }) // add popups
      //         .setHTML("<h3>" + marker.properties.departure_code + "</h3>")
      //     )
      //     .addTo(map);
      // });
    });

  //针对指定图层添加交互
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  map.on("mouseenter", regionTop7Layer, e => {
    console.log(e);
  });
  // A map event -- on mouseenter
  map.on("mouseenter", centrality2018Top30Layer, e => {
    map.getCanvas().style.cursor = "pointer";
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = d3.format(",.0f")(e.features[0].properties.rank);
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        "<h3>" +
          "TOP " +
          description +
          "</h3><p>" +
          e.features[0].properties.name +
          "</p>"
      )
      .addTo(map);
  });

  map.on("mouseleave", centrality2018Top30Layer, () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });
  map.on("mouseenter", centralityLayer, e => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    const description = d3.format(",.0f")(e.features[0].properties.rank);

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        "<h3>" +
          "TOP " +
          description +
          "</h3><p>" +
          e.features[0].properties.name +
          "</p>"
      )
      .addTo(map);
  });

  map.on("mouseleave", centralityLayer, () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  // debugger;
  // $("#maskLoading").addClass("hidden");
  count++;
  if (count >= 2) {
    document.getElementById("maskLoading").classList.add("hidden");
    document.getElementById("menu").classList.remove("full-page");
  }
});

var video = document.querySelector("video");
video.addEventListener("loadeddata", function(e) {
  console.log("video ready");
  count++;
  if (count >= 2) {
    document.getElementById("maskLoading").classList.add("hidden");
    document.getElementById("menu").classList.remove("full-page");
  }
});

const airlinesLayer = "airline2018";
const capacityLayer = "thought10Years";
const centralityLayer = "extrusion";
const airportsLayer = "airpots2018";
const airline2018Top30Layer = "airline2018Top30";
const centrality2018Top30Layer = "extrusionTop30";
const centrality2018UrbanLayer = "extrusionUrban";
const airlineUrbanLayer = "airlineUrban";
const regionLinesLayer = "regionAirConcat";
const regionTop10Layer = "regionTop10";
const regionTop7Layer = "regionTop7";
const toggleableLayerIds = [
  airlinesLayer,
  capacityLayer,
  centralityLayer,
  airportsLayer,
  airline2018Top30Layer,
  centrality2018Top30Layer,
  centrality2018UrbanLayer,
  airlineUrbanLayer,
  regionLinesLayer,
  regionTop10Layer,
  regionTop7Layer
];
console.log("my layers", toggleableLayerIds.length);
const mapboxLayerPrd = "china-prd";
const mapboxLayerBth = "china-bth";
const mapboxLayerYrd = "china-yrd";
const china_economicZones = [mapboxLayerPrd, mapboxLayerBth, mapboxLayerYrd];

const mapboxLayerXinan = "china-xinan";
const mapboxLayerZhongbu = "china-zhongbu";
const mapboxLayerDongbei = "china-dongbei";

const china_areas = [mapboxLayerXinan, mapboxLayerZhongbu, mapboxLayerDongbei];

map.on("click", function(e) {
  console.log(e.lngLat);
});
// disable map zoom when using scroll
map.scrollZoom.disable();
