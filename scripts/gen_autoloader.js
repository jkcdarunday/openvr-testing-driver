// Small script to generate autoloader header
//  node scripts/gen_autoloader.js >> include/autoloader.x.h

console.log("// This file is autogenerated please do not edit! See scripts/gen_autoloader.js");
console.log("#pragma once");
console.log("#include \"registry.h\"");

var fs = require('fs'),
    path = require('path');

/**
 * Returns an array of directory names within an directory
 * @param srcpath
 * @returns {Array.<T>|*}
 */
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

/**
 * Replaces a character at index in a string
 * @param index
 * @param character
 * @returns {string}
 */
String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

/**
 * Removes a character at index in a string
 * @param index
 * @param character
 * @returns {string}
 */
String.prototype.removeAt = function(index) {
    return this.substr(0, index) + this.substr(index+1);
}

/**
 * Converts underscored name to camel case
 *  test_name -> TestName
 *
 * @param name
 */
function toCamelCase(name) {
    name = name.replaceAt(0, name.charAt(0).toUpperCase());

    while (true) {
        var pos = name.indexOf('_');
        if (pos == -1) {
            break;
        }

        name = name.removeAt(pos);
        name = name.replaceAt(pos, name.charAt(pos).toUpperCase());
    }

    return name;
}

// get all test cases
var testCases = [];

var testCaseDirectories = getDirectories("test_cases/");
for (var i = 0; i < testCaseDirectories.length; i++) {
    var headerName = testCaseDirectories[i].substr(3);

    testCases.push({
        path: testCaseDirectories[i] + '/' + headerName + '.h',
        name: headerName,
        classname: toCamelCase(headerName) + "TestCase"
    });
}


for (var i = 0; i < testCases.length; i++) {
    console.log("#include \"" + testCases[i].path + "\"");
}

console.log("namespace Autoloader {");
console.log("\tvoid init() {");

for (var i = 0; i < testCases.length; i++) {
    console.log("\t\tTestCaseRegistry::getInstance()->registerTestCase<" + testCases[i].classname + ">();");
}


console.log("\t}");
console.log("}");