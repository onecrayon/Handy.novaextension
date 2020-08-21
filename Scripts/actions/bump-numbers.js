/**
 * bump-numbers.js
 *
 * Provides actions for modifying the numbers in all selections by a set amount
 */

const {getNumberRanges} = require('../utils.js')

function modifySelectedNumbers(editor, amount) {
	const numberRanges = []
	for (const range of editor.selectedRanges) {
		const prospectiveRanges = getNumberRanges(range, editor)
		// No need to proceed if we don't have any ranges
		if (!prospectiveRanges.length) continue
		// Make sure there isn't any overlap
		const curLength = numberRanges.length
		if (curLength && numberRanges[curLength - 1].intersectsRange(prospectiveRanges[0])) {
			// Toss off the first element if it overlaps
			prospectiveRanges.shift()
		}
		// Push the prospective arrays into the list
		Array.prototype.push.apply(numberRanges, prospectiveRanges)
	}
	// No need for edits if we don't have any numbers
	if (!numberRanges.length) return

	editor.edit(edits => {
		// Traverse backwards through the ranges that need updating so our ranges don't have to be adjusted
		for (let i = numberRanges.length - 1; i >= 0; i--) {
			const numberRange = numberRanges[i]
			let numberText = editor.getTextInRange(numberRange)
			// Trim excess characters, since we only want the int
			const match = /^([^\d-]*)(-?\d+)(.*?)$/.exec(numberText)
			const prefix = (match !== null ? match[1] : '')
			const number = (match !== null ? match[2] : numberText)
			const suffix = (match !== null ? match[3] : '')
			numberText = prefix + (parseInt(number, 10) + amount) + suffix
			edits.replace(numberRange, numberText)
		}
	})
}

nova.commands.register('handy.incrementIntegers', editor => {
	modifySelectedNumbers(editor, 1)
})

nova.commands.register('handy.decrementIntegers', editor => {
	modifySelectedNumbers(editor, -1)
})

nova.commands.register('handy.incrementIntegersTen', editor => {
	modifySelectedNumbers(editor, 10)
})

nova.commands.register('handy.decrementIntegersTen', editor => {
	modifySelectedNumbers(editor, -10)
})
