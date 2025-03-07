"use strict";

var path = require("path"),
    fs   = require("fs");

var gitSemverTags = require("git-semver-tags"),
    gitRawCommits = require("git-raw-commits"),
    minimist      = require("minimist");

var basedir = path.join(__dirname, "..");
var pkg = require(basedir + "/package.json");

var argv = minimist(process.argv, {
    alias: {
        tag    : "t",
        write  : "w"
    },
    string: [ "tag" ],
    boolean: [ "write" ],
    default: {
        tag: null,
        write: false
    }
});

// categories to be used in the future and regexes for lazy / older subjects
var validCategories = {
    "Breaking": null,
    "Fixed": /fix|properly|prevent|correctly/i,
    "New": /added|initial/i,
    "CLI": /pbjs|pbts|CLI/,
    "Docs": /README/i,
    "Other": null
};
var breakingFallback = /removed|stripped|dropped/i;

var repo = "https://github.com/dcodeIO/protobuf.js";

gitSemverTags(function(err, tags) {
    if (err)
        throw err;

    var categories = {};
    Object.keys(validCategories).forEach(function(category) {
        categories[category] = [];
    });
    var output = [];

    var from = tags[0];
    var to = "HEAD";
    var tag;
    if (argv.tag) {
        var idx = tags.indexOf(argv.tag);
        if (idx < 0)
            throw Error("no such tag: " + argv.tag);
        from = tags[idx + 1];
        tag = to = tags[idx];
    } else
        tag = pkg.version;

    var commits = gitRawCommits({
        from: from,
        to: to,
        merges: false,
        format: "%B%n#%H"
    });

    commits.on("error", function(err) {
        throw err;
    });

    commits.on("data", function(chunk) {
        var message = chunk.toString("utf8").trim();
        var match = /#([0-9a-f]{40})$/.exec(message);
        var hash;
        if (match) {
            message = message.substring(0, message.length - match[1].length).trim();
            hash = match[1];
        }
        message.split(";").forEach(function(message) {
            if (/^(Merge pull request |Post-merge)/.test(message))
                return;
            var match = /^(\w+):/i.exec(message = message.trim());
            var category;
            if (match && match[1] in validCategories) {
                category = match[1];
                message = message.substring(match[1].length + 1).trim();
            } else {
                var keys = Object.keys(validCategories);
                for (var i = 0; i < keys.length; ++i) {
                    var re = validCategories[keys[i]];
                    if (re && re.test(message)) {
                        category = keys[i];
                        break;
                    }
                }
                message = message.replace(/^(\w+):/i, "").trim();
            }
            if (!category) {
                if (breakingFallback.test(message))
                    category = "Breaking";
                else
                    category = "Other";
            }
            var nl = message.indexOf("\n");
            if (nl > -1)
                message = message.substring(0, nl).trim();
            if (!hash || message.length < 12)
                return;
            message = message.replace(/\[ci skip\]/, "").trim();
            categories[category].push({
                text: message,
                hash: hash
            });
        });
    });

    commits.on("end", function() {
        output.push("# [" + tag + "](" + repo + "/releases/tag/" + tag + ")\n");
        Object.keys(categories).forEach(function(category) {
            var messages = categories[category];
            if (!messages.length)
                return;
            output.push("\n## " + category + "\n");
            messages.forEach(function(message) {
                var text = message.text.replace(/#(\d+)/g, "[#$1](" + repo + "/issues/$1)");
                output.push("[:hash:](" + repo + "/commit/" + message.hash + ") " + text + "<br />\n");
            });
        });
        var current;
        try {
            current = fs.readFileSync(basedir + "/CHANGELOG.md").toString("utf8");
        } catch (e) {
            current = "";
        }
        var re = new RegExp("^# \\[" + tag + "\\]");
        if (re.test(current)) { // regenerated, replace
            var pos = current.indexOf("# [", 1);
            if (pos > -1)
                current = current.substring(pos).trim();
            else
                current = "";
        }
        var contents = output.join("") + "\n" + current;
        if (argv.write)
            fs.writeFileSync(basedir + "/CHANGELOG.md", contents, "utf8");
        else
            process.stdout.write(contents);
    });
});
