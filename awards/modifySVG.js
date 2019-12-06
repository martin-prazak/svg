let d3 = require("d3");
let fs = require("fs");
let jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
var css = require("css");
const spawn = require('child_process').spawn;

async function createAward(width, height, textArr, templatePath, categoryPath, outputPath, pngOutput, numberOfStars, color, timeFrame) {
    // get icon based on path
    let categorySVG = await new Promise((resolve) => {
        JSDOM.fromFile(categoryPath).then(dom => {
            resolve(dom.window.document.body.innerHTML);
        });
    });

    await JSDOM.fromFile(templatePath).then(dom => {
        let doc = dom.window.document;

        // push text to svg, center it
        d3.select(doc).selectAll("tspan").data(textArr).text(d => d)
        d3.select(doc).selectAll("textPath").attr("startOffset", "50%").attr("text-anchor", "middle");

        switch (numberOfStars) {
            case 1:
                d3.select(doc.querySelector("g#luther_category").parentNode).append("g").attr("id", "luther_stars").html(`<polygon style="fill:#FFFFFF;" points="830.9631,860.3563 837.087,872.7647 850.7804,874.7545 840.8717,884.413 843.2109,898.0511 830.9631,891.6121 818.7153,898.0511 821.0544,884.413 811.1457,874.7545 824.8392,872.7647"/>`);
                break;
            case 2:
                d3.select(doc.querySelector("g#luther_category").parentNode).append("g").attr("id", "luther_stars").html(`<polygon style="fill:#FFFFFF;" points="802.9631,860.3563 809.087,872.7647 822.7804,874.7545 812.8717,884.413 815.2109,898.0511 802.9631,891.6121 790.7153,898.0511 793.0544,884.413 783.1457,874.7545 796.8392,872.7647"/>
                <polygon style="fill:#FFFFFF;" points="856.7156,860.3563 862.8395,872.7647 876.533,874.7545 866.6243,884.413 868.9634,898.0511 856.7156,891.6121 844.4678,898.0511 846.8069,884.413 836.8982,874.7545 850.5917,872.7647"/>`);
                break;
            default: // case 3:
                d3.select(doc.querySelector("g#luther_category").parentNode).append("g").attr("id", "luther_stars").html(`<polygon style="fill:#FFFFFF;" points="779.2105,860.3563 785.3344,872.7647 799.0279,874.7545 789.1192,884.413 791.4583,898.0511 779.2105,891.6121 766.9627,898.0511 769.3018,884.413 759.3931,874.7545 773.0866,872.7647"/>
	            <polygon style="fill:#FFFFFF;" points="830.9631,860.3563 837.087,872.7647 850.7804,874.7545 840.8717,884.413 843.2109,898.0511 830.9631,891.6121 818.7153,898.0511 821.0544,884.413 811.1457,874.7545 824.8392,872.7647"/>
                <polygon style="fill:#FFFFFF;" points="882.7156,860.3563 888.8395,872.7647 902.533,874.7545 892.6243,884.413 894.9634,898.0511 882.7156,891.6121 870.4678,898.0511 872.8069,884.413 862.8982,874.7545 876.5917,872.7647"/>`);
                break;
        }


        // push icon to svg
        d3.select(doc).select("g#luther_category").html(categorySVG);

        // change color, transparency.. based on timeFrame
        switch (timeFrame) {
            case "month":
                d3.select(doc).select("path#outside").attr("style", "fill-opacity: 0")
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("tspan#period").attr("style", "fill: " + color + "; font-size: 25")
                d3.select(doc).selectAll("g#luther_stars polygon").attr("style", "fill: " + color)
                d3.select(doc).select("g#luther_category").attr("style", "fill: " + color)
                break;
            case "quarter":
                d3.select(doc).select("path#outside").attr("style", "fill: " + color)
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("tspan#period").attr("style", "fill: " + color + "; font-size: 25")
                d3.select(doc).selectAll("g#luther_stars polygon").attr("style", "fill: " + color)
                d3.select(doc).select("g#luther_category").attr("style", "fill: " + color)
                break;
            case "exclusive":
                d3.select(doc).select("path#outside").attr("style", "fill: " + color)
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("path#inside").attr("style", "fill: #333333")
                d3.select(doc).select("g#luther_category").attr("style", "fill: #FFFFFF")
                break;
            default:
                d3.select(doc).select("path#outside").attr("style", "fill: " + color)
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("path#inside").attr("style", "fill: " + color)
                d3.select(doc).select("g#luther_category").attr("style", "fill: #FFFFFF")
                break;
        }

        // return ("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: LutherX transform script -->\n" + dom.window.document.body.innerHTML)

        // write svg to file
        fs.writeFileSync(outputPath, "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: LutherX transform script -->\n" + dom.window.document.body.innerHTML, function (error) {
            if (error) throw error;
        });

        // convert to png in python and write to file
        let proc = spawn('python3', ['./awards/svg2png.py', outputPath, pngOutput, width, height]);
    });
}

// #########  TEST INPUT  #########################################################################################################################

textArr = ["2020", "EMPLOYEE OF THE YEAR", "HARDEST WORKER"];
color = "#F4C738"
timeFrame = "year"
console.log(createAward(3200, 3200, textArr, "./awards/template.svg", "./awards/icon.svg", "./new.svg", "./new.png", 2, color, timeFrame))