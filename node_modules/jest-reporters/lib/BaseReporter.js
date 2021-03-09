var BaseReporter = function(options) {};

BaseReporter.prototype = {
    reportRunnerStarting: function(runner) {
        if (!this._startTime) {
            this._startTime = new Date();
        }
    },
    reportSpecStarting: function() {
    },
    reportSpecResults: function() {
    },
    reportSuiteResults: function(suite) {
    },
    reportRunnerResults: function(results) {
        this._endTime = new Date();

        this.onComplete(results);
    },
    log: function(l) {
        console.log('BaseReporter::log', l);
    },
    onComplete: function() {
        // Implement this function
    }
};

module.exports = BaseReporter;