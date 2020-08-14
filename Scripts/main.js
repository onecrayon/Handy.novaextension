// Pull in our various actions
require('actions/align-assignments.js')
require('actions/broaden-selection.js')
require('actions/select-line-contents.js')

// Stubbed out activation and deactivation logic (currently unused)
exports.activate = function() {
	// Do work when the extension is activated
}

exports.deactivate = function() {
	// Clean up state before the extension is deactivated
}
