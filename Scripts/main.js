// Pull in our various actions
require('actions/align-assignments.js')
require('actions/broaden-selection.js')
require('actions/bump-numbers.js')
require('actions/select-line-contents.js')
require('actions/calculate.js')

// Stubbed out activation and deactivation logic (currently unused)
exports.activate = function() {
	// Do work when the extension is activated
}

exports.deactivate = function() {
	// Clean up state before the extension is deactivated
}
