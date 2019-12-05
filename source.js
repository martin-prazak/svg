const spawn = require('child_process').spawn;

async function createAwardBadge(input, width, height) {
    let proc = await spawn('python3',['./svg2png.py', input, width, height])
    //console.log(proc);
    chunks = [];
    let result = await  new Promise((res, rej) => {
        proc.stdout.on('data', function(data) {
          //console.log(data.toString());
            chunks.push(data);
        });
        proc.stdout.on('end', () => {
            res(Buffer.concat(chunks).toString('utf8'));
        })
    });
    console.log(result)
}

createAwardBadge('Award_template_2.svg',3200,3200)
