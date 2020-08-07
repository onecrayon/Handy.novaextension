/**
 * align-assignments.js
 * 
 * Automatically inserts space characters to align multiple assigments
 * vertically based on the longest line. Automatically skips lines
 * that do not have an obvious assignment.
 * 
 * For example, this:
 * 
 * 'stuff' => 'things,
 * 'foofoo' => 'barbar',
 * 'fibbles' => 'mcgee',
 * 
 * Is transformed into this:
 * 'stuff'   => 'things,
 * 'foofoo'  => 'barbar',
 * 'fibbles' => 'mcgee',
 */

// Helper function to advance through ranges (initial range is empty)
function nextRange(range, text) {
	if (range.empty) return new Range(range.start, range.start + text.length)
	return new Range(range.end, range.end + text.length)
}

nova.commands.register('handy.alignAssignments', editor => {
	let longestRange = 0
	let longestOperator = 0
	const validLines = []
	const tabsToSpaces = ' '.repeat(editor.tabLength)
	// Capture group 1 => start characters; group 2 => space prior to operator; group 3 => operator
	const assignRegex = /^([\t ]*(?:[^\/]|\/(?!\/|\*))*?(?:'(?:[^']|\\')*'|"(?:[^"]|\\")*")*)([\t ]*)(:|=>|=|(?:\.|\+|-|\*\*?|\/\/?|%|&|\|\|?|\^|<<|>>)=)/g

	// Loop through all selected ranges and parse their lines
	for (const range of editor.selectedRanges) {
		// Grab our selection, and parse into lines
		const lineRange = editor.getLineRangeForRange(range)
		const linesText = editor.getTextInRange(lineRange)
		// Grab our line text (including linebreak delimiters thanks to capture group)
		const segments = linesText.split(/(\r\n|\n|\r)/)
		let currentRange = new Range(lineRange.start, lineRange.start)
		// Parse over each line, looking for assignments
		for (const segment of segments) {
			const match = assignRegex.exec(segment)
			// Proceed to next result, if there's no capture
			if (!match) {
				currentRange = nextRange(currentRange, segment)
				continue
			}
			// Replace all tabs with spaces so we can do an accurate count
			const initialChars = match[1].replace(/\t/g, tabsToSpaces)
			if (longestRange < initialChars.length) {
				longestRange = initialChars.length
			}
			if (longestOperator < match[3].length) {
				longestOperator = match[3].length
			}
			currentRange = nextRange(currentRange, segment)
			validLines.push({
				'range': currentRange,
				'adjustedLength': initialChars.length,
				'actualLength': match[1].length,
				'whitespaceLength': match[2].length,
				'operatorLength': match[3].length
			})
		}
	}
	
	// No need to proceed if we don't have any edits to make
	if (!validLines.length) return

	// Make the actual changes
	editor.edit(edits => {
		// Traverse backwards through the ranges that need updating so our ranges don't have to be adjusted
		for (let i = validLines.length - 1; i >= 0; i--) {
			const lineObject = validLines[i]
			const numSpaces = (longestRange - lineObject.adjustedLength) + (longestOperator - lineObject.operatorLength) + 1
			const lineRange = lineObject.range
			let replaceString = ' '
			// Add extra spaces, if necessary
			if (numSpaces > 1) {
				replaceString = ' '.repeat(numSpaces)
			}
			const start = lineRange.start + lineObject.actualLength
			const replaceRange = new Range(start, start + lineObject.whitespaceLength)
			edits.replace(replaceRange, replaceString)
		}
	})
})
