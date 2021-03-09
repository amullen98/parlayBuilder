var util = require('util');
var BaseReporter = require('./BaseReporter');

var JUnitReporter = function() {
    BaseReporter.call(this);
};

util.inherits(JUnitReporter, BaseReporter);

JUnitReporter.prototype.onComplete = function(results) {
    var xml = this.toXML(results);
    console.log(xml);
};

JUnitReporter.prototype.toXML = function(runner) {
    var suites = runner.suites();
    var suitesXML = suites.map(this.suiteToXML);

    return [
        '<?xml version="1.0" encoding="utf-8" ?>',
        this.getTestSuitesHeader(runner),
        '</testsuites>'
    ].join('\n');
};

JUnitReporter.prototype.getTestSuitesHeader = function(runner) {
    var summary = runner.results();

    return [
        '<testsuites',
            'errors="' + summary.failedCount + '"',
            'failures="' + summary.failedCount + '"',
            'tests="' + summary.totalCount + '"',
            'time="' + (this._endTime - this._startTime) + '"',
        '>'
    ].join(' ');
};

JUnitReporter.prototype.suiteToXML = function(runner) {
    
};

module.exports = JUnitReporter;