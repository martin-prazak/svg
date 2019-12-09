let d3 = require("d3");
let fs = require("fs");
let jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
var css = require("css");
const spawn = require('child_process').spawnSync;






async function createAward(width, height, textArr, templatePath, iconPath, numberOfStars, color, timeFrame, outputAsSvg) {

    // get icon svg
    let iconSVG = await new Promise((resolve) => {
        JSDOM.fromFile(iconPath).then(dom => {
            resolve(dom.window.document.body.innerHTML);
        });
    });

    // get main svg
    let mainSVG = await JSDOM.fromFile(templatePath).then(dom => {
        let doc = dom.window.document;

        // push text form array to svg and center it
        d3.select(doc).selectAll("tspan").data(textArr).text(d => d)
        d3.select(doc).selectAll("textPath").attr("startOffset", "50%").attr("text-anchor", "middle");

        // based on number of stars push 1, 2 or 3 stars to svg
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

        // push icon svg to main svg
        d3.select(doc).select("g#luther_category").html(iconSVG);

        // based on timeframe set transparency, text color and award color
        switch (timeFrame) {
            case "month":
                d3.select(doc).select("path#outside").attr("style", "fill-opacity: 0")
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("tspan#period").attr("style", "fill: " + color + "; font-size: 28")
                d3.select(doc).selectAll("g#luther_stars polygon").attr("style", "fill: " + color)
                d3.select(doc).select("g#luther_category").attr("style", "fill: " + color)
                break;
            case "quarter":
                d3.select(doc).select("path#outside").attr("style", "fill: " + color)
                d3.select(doc).select("path#mid").attr("style", "fill: " + color)
                d3.select(doc).select("tspan#period").attr("style", "fill: " + color + "; font-size: 28")
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

        // changed svg in variable
        let newSVG = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: LutherX transform script -->\n" + dom.window.document.body.innerHTML

        /*
        if output as svg is true > return changed svg as string
                            else > run python script to convert svg to png and return png in base64
        */
        if (outputAsSvg) {
            return newSVG
        } else {
            let proc = spawn('python3', ['./awards/svg2png.py', newSVG, width, height]);
            return proc.stdout.toString()
        }
    });

    /*
    if output as svg is false > remove base64 prefix and quotes and return
                         else > return svg
    */
    if (!outputAsSvg) {
        mainSVG = mainSVG.slice(2, mainSVG.length - 2)
        // convert b64 to png
        mainSVG = Buffer.from(mainSVG, "base64")
        fs.writeFileSync('./my-file.png', mainSVG);
    }
    return mainSVG
}





// testing
(async () => {
    textArr = ["6 2020", "EMPLOYEE OF THE MONTH", "BEST SALESMAN"];
    color = "#92D303"
    timeFrame = "month"
    let test = await createAward(1600, 1600, textArr, "./awards/template.svg", "./awards/icon.svg", 1, color, timeFrame, false)
    console.log(test)
})();