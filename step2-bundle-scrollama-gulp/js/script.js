// using d3 for convenience
var main = d3.select("main"); //0
var scrolly = main.select("#scrolly"); //0.1
var figure = scrolly.select("figure"); //0.1.1
var article = scrolly.select("article"); //0.1.2
var step = article.selectAll(".step"); //0.1.2.X

var container2 = d3.select("#scroll2");

// initialize the scrollama
var scroller = scrollama();
var scroller2 = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight / 2;
  var figureMarginTop = 0;
  figure.style("height", figureHeight + "px");

  if (window.innerWidth > 800) {
    // step.style("height", stepH_desktop + "px");
    figure
      .style("height", figureHeight * "px")
      .style("top", figureMarginTop + figureHeight / 2 + "px");
  } else {
    step.style("height", stepH + "px");
    figure
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");
  }

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  // add color to current step only
  step.classed("is-active", function(d, i) {
    //classed检查并添加一个类，要分类的第二个参数必须为true
    return i === response.index;
  });
  var currentStep = response.element.id;
  // update graphic based on step
  figure.select("p").text(currentStep);
}

// scroller2
function handleStepEnter2(response) {
  console.log(response.element);
  document
    .querySelector("#nav-container")
    .classList.add("nav-container-sticky");
}

function handleStepExit2(response) {
  // response = { element, direction, index }
  console.log(response);
  // remove color from current step
  document
    .querySelector("#nav-container")
    .classList.remove("nav-container-sticky");
}

function handleProgress2(resp) {
  console.log("progress", resp);
}

// Stickyfill
function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();
  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.66,
      debug: true
    })
    .onStepEnter(handleStepEnter);

  scroller2
    .setup({
      step: "#scroll2 #main-container",
      offset: 0.0,
      debug: true,
      progress: true,
      threshold: 100 //间隔颗粒度大小默认4
    })
    .onStepEnter(handleStepEnter2)
    .onStepExit(handleStepExit2)
    .onStepProgress(handleProgress2);

  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();
