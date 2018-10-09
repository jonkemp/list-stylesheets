let fs = require("fs"),
    path = require("path"),
    inline = require("inline-css");

const CODE_COVERAGE_DIRECTORY = "./../.test_output/coverage";

const read = (dir) =>
    fs.readdirSync(dir)
        .reduce((files, file) =>
                fs.statSync(path.join(dir, file)).isDirectory() ?
                    files.concat(read(path.join(dir, file))) :
                    files.concat(path.join(dir, file)),
            []);

const absPath = path.join(__dirname, CODE_COVERAGE_DIRECTORY);

let reports = read(absPath).filter((report)=> {
    return report.endsWith(".html");
});

reports.forEach((report)=> {
    let options = {
        url: "file://" + report,
        extraCss: ".pad1 { padding: 0; }"
    };

    fs.readFile(report, (err, data) => {
        inline(data, options)
            .then((html) => {
                fs.writeFile(report, html, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
});
