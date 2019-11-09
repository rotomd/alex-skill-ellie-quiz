const fs = require('fs');
const archiver = require('archiver');
const pjson = require('./package.json');
const fileName = pjson.nam + '.zip';

if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

console.log('Outputting', directory + fileName);

const output = fs.createWriteStream(directory + fileName);
const archive = archiver('zip', {
    zlib: {level: 9}
});

output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiving finalized and output file closed.');
});

output.on('end', function() {
    console.log('data has been drained');
});

archive.on('warning', function(err) {
    if (err.code === 'ENOEND') {
        console.warn(err);
    } else {
        console.error(err);

        throw err;
    }
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

console.log('Adding main file');
archive.file('index.js');

console.log('Adding build directory');
archive.directory('buid/');

console.log('Adding node modules');
archive.glob('node_modules/!(@types|aws-sdk|jest|typescript|ts-jeft)/**');

archive.finalize();
