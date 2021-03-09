// Stop automocking
if (jest) {
	jest.autoMockOff();
}

var reporters = {
	JUnitReporter: require('./jasmine.junit-reporter')
};

module.exports = reporters;