/**
 * select-line-contents.js
 *
 * Selects the current lines (excluding leading and trailing whitespace)
 */

const {getTrimmedRange} = require('../utils.js')

nova.commands.register('handy.selectLineContents', editor => {
	const newSelectedRanges = []
	for (const range of editor.selectedRanges) {
		const lineRange = editor.getLineRangeForRange(range)
		newSelectedRanges.push(getTrimmedRange(lineRange, editor))
	}
	editor.selectedRanges = newSelectedRanges
})
