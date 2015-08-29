var proto2json = require('proto2json');
var fs = require('fs');
var path = require('path');
var output = { messages: { }, codes: { } };

function parseFile(filename, callback) {
    var key;
    var filepath = path.join(__dirname, 'riak_pb', 'src', filename);
    var file = fs.readFileSync(filepath, 'utf8');
    proto2json.parse(file, function (err, result) {
        for (key in result.messages) {
            output.messages[key] = result.messages[key];
        }
        callback();
    });
}

function parseCsv(callback) {
    var filepath = path.join(__dirname, 'riak_pb', 'src', 'riak_pb_messages.csv');
    var file = fs.readFileSync(filepath, 'utf8');
    var lines = file.split('\n');
    var i, l, line;
    for (i = 0, l = lines.length; i < l; i++) {
        line = lines[i].split(',');
        if (line.length > 1) {
            output.codes[line[0]] = line[1];
            output.codes[line[1]] = line[0];
        }
    }
    callback();
}

function writeFile() {
    var filepath = path.join(__dirname, 'proto.json');
    fs.writeFileSync(filepath, JSON.stringify(output), 'utf8');
}

parseFile('riak.proto', function () {
    parseFile('riak_dt.proto', function () {
        parseFile('riak_kv.proto', function () {
            parseFile('riak_search.proto', function () {
                parseFile('riak_yokozuna.proto', function () {
                    parseCsv(function () {
                        writeFile();
                    });
                });
            });
        });
    });
});
