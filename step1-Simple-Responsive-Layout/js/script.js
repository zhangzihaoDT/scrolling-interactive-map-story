// using d3 for convenience
var main = d3.select("main"); //0
var scrolly = main.select("#scrolly"); //0.1
var figure = scrolly.select("figure"); //0.1.1
var article = scrolly.select("article"); //0.1.2
var step = article.selectAll(".step"); //0.1.2.X

// initialize the scrollama
const scroller = scrollama();

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
  console.log(response);
  // response = { element, direction, index }
  // add color to current step only
  step.classed("is-active", function(d, i) {
    //classed检查并添加一个类，要分类的第二个参数必须为true
    return i === response.index;
  });
  const currentStep = response.element.id;
  // update graphic based on step
  figure.select("p").text(currentStep);
}

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

  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();
