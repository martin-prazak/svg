const spawn = require('child_process').spawn;
const fs = require('fs')

async function createAwardBadge(input, width, height) {
    let proc = spawn('python3', ['./svg2png.py', input, width, height]);
    //console.log(proc);
    chunks = [];
    let result = await new Promise((res, rej) => {
        proc.stdout.on('data', function (data) {
            //console.log(data.toString());
            chunks.push(data);
        });
        proc.stdout.on('end', () => {
            res(Buffer.concat(chunks).toString('utf8'));
        })
    });
    return result
}

async function testing() {
    test = await createAwardBadge('Award_template_2.svg', 800, 800);
    let b64 = test.split(';base64,').pop();
    fs.writeFileSync("./test.png", b64, {
        encoding: "base64"
    });
    // return test...
}

testing()
// console.log(testing())