var d3 = require("d3");
var fs = require("fs");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
var css = require("css");

// config
const templatePath = "./Awards_new_text.svg";
const categoryPath = "./good_boy.svg"; //"./other.svg";

const TITLES = ["PRESIDENT AWARDS", "EMPLOYEE OF THE YEAR"];
const PERIOD = "2020";
const VALUE = 3; // number of stars

const BASE_COLOR = "RED";

async function start() {
  let categorySVG = await new Promise((resolve, rej) => {
      JSDOM.fromFile(categoryPath).then(dom => {
        resolve(dom.window.document.body.innerHTML);
    });
  });
  // console.log(categorySVG);

  await JSDOM.fromFile(templatePath).then(dom => {
    let doc = dom.window.document;
    // set title and subtitle    startOffset="50%" text-anchor="middle"
    d3.select(doc)
      .selectAll("tspan")
      .data(TITLES)
      .text(d => d);

    d3.select(doc)
      .select("text.st8.st9.st10")
      .text(PERIOD);

    // update text position... text-anchor and startOffset startOffset="60%"
    d3.select(doc)
      .selectAll("textPath")
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle");

    // PROMISE: DATE position jen pres attr x="-8" -> cekam, az se prida path pro date, abych mohl nastavit text-anchor="middle"

    // TODO: colors -> jake barvy se budou menit (a pocet + jejich id nebo-li pozice) ??? -> cekam na lukase
    var style = css.parse(d3.select(doc).select("style").text());
    var color = colors.find(i => i.name === BASE_COLOR);
    color.classes.forEach(el => {
      style.stylesheet.rules.find(s => s.selectors[0] === el.key).declarations[0].value = el.value;
    });
    d3.select(doc)
    .select("style")
    .text(css.stringify(style));
    
    d3.select(doc).select("stop#st21").attr("style", "stop-color:" + color.stop.find(el => el.key === "st21").value);
    d3.select(doc).select("stop#st22").attr("style", "stop-color:" + color.stop.find(el => el.key === "st22").value);
    
    // DONE: category icon.. jak ji tam pridavat (nastavit velikost) ??? -> potrebuji element <g id=SOME_ID>
    d3.select(doc)
        .select("g#luther_category") // element <g id=...>
        .html(categorySVG);

    // DONE: number of stars config... -> bude vzdy stejna sablona (stejne rozmery)??
    d3.select(doc.querySelector("g#luther_category").parentNode)
        .append("g")
        .attr("id", "luther_stars")
        .html(getStars(VALUE));

    
    // save SVG
    fs.writeFileSync(
      "./Awards_new_text_update.svg",
      '<?xml version="1.0" encoding="utf-8"?>\n<!-- Generator: LutherX transform script -->\n' +
        dom.window.document.body.innerHTML,
      function(error) {
        if (error) throw error;
      }
    );
    console.log(d3.select(doc).select("tspan").text());
  });
}
start();

function getStars(value){
  switch(value){
    case 1:
      return `<polygon class="st8" points="480.3,319.5 483.3,325.7 490.2,326.7 485.2,331.5 486.4,338.3 480.3,335.1 474.2,338.3 475.3,331.5 
      470.4,326.7 477.2,325.7"/>`;
    case 2: 
      return `<polygon class="st8" points="467.4,319.5 470.4,325.7 477.3,326.7 472.3,331.5 473.5,338.3 467.4,335.1 461.3,338.3 462.4,331.5 457.5,326.7 464.3,325.7"/>
      <polygon class="st8" points="493.2,319.5 496.2,325.7 503.1,326.7 498.1,331.5 499.3,338.3 493.2,335.1 487.1,338.3 488.2,331.5 483.3,326.7 490.1,325.7"/>`;
    default: // case 3:
      return `<polygon class="st8" points="454.5,319.5 457.5,325.7 464.4,326.7 459.4,331.5 460.6,338.3 454.5,335.1 448.4,338.3 449.5,331.5 444.6,326.7 451.4,325.7 		"/>
      <polygon class="st8" points="480.3,319.5 483.3,325.7 490.2,326.7 485.2,331.5 486.4,338.3 480.3,335.1 474.2,338.3 475.3,331.5 470.4,326.7 477.2,325.7 		"/>
      <polygon class="st8" points="506.1,319.5 509.1,325.7 516,326.7 511,331.5 512.2,338.3 506.1,335.1 500,338.3 501.2,331.5 496.2,326.7 503,325.7 		"/>`;
  }
}

const colors = [{
  name: 'RED',
  classes: [
  {
    key: '.st4',
    value: '#D30324',
  },
  {
    key: '.st5',
    value: '#DD5167',
  },
  {
    key: '.st6',
    value: '#2BA3F7',
  }],
stop: [
  {
    key: 'st21',
    value: '#DD5167',
  },
  {
    key: 'st22',
    value: '#900017',
  }
] 
},
{
name: 'BLUE',
classes: [
  {
    key: '.st4',
    value: '#2C74DD',
  },
  {
    key: '.st5',
    value: '#2BA3F7',
  },
  {
    key: '.st6',
    value: '#2766D0',
  }],
stop: [
  {
    key: 'st21',
    value: '#2766D0',
  },
  {
    key: 'st22',
    value: '#2BA3F7',
  }
] 
}];
