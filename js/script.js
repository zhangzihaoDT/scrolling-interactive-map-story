var main=d3.select("main"),scrolly=main.select("#scrolly"),figure=scrolly.select("figure"),article=scrolly.select("article"),step=article.selectAll(".step"),scroller=scrollama();function handleResize(){var e=Math.floor(.75*window.innerHeight);step.style("height",e+"px");var t=window.innerHeight/2;figure.style("height",t+"px"),800<window.innerWidth?figure.style("height","px"*t).style("top",0+t/2+"px"):(step.style("height",e+"px"),figure.style("height",t+"px").style("top","0px")),scroller.resize()}function handleStepEnter(i){console.log(i),step.classed("is-active",function(e,t){return t===i.index});var e=i.element.id;figure.select("p").text(e)}function setupStickyfill(){d3.selectAll(".sticky").each(function(){Stickyfill.add(this)})}function init(){setupStickyfill(),handleResize(),scroller.setup({step:"#scrolly article .step",offset:.66,debug:!0}).onStepEnter(handleStepEnter),window.addEventListener("resize",handleResize)}init();