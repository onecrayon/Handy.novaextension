/**
* broaden-selection.js
*
* Broadens the current selection(s) to the nearest logical delimiters. For instance, will select all text within
* a string, then select the string itself, then select the function the string is defined in.
*
* Due to the inability to check syntax scopes at a given range, the script currently only selects single-line
* strings and multiline balanced delimiters, and ignores multiline strings, comments, etc.
*
* TODO:
* - Implement support for regex in Javascript (and elsewhere?)
* - Implement support for Markdown bold/italics
* - Implement support for non-symbol navigation across multiple lines (requires ability to check for characters in
*   string zones)
* - Initially check the syntax zone under the cursor for strings, regex, comments, etc. if/when that becomes available
*/

const {getTrimmedRange} = require('../utils.js')

function getDelimitedRange(range, editor) {
	const bounds = new Range(0, editor.document.length)
	// Can't balance a range that has no possibility for a delimiter outside it
	if (range.start === bounds.start || range.end >= bounds.end - 1) {
		return range
	}
	const firstLineRange = editor.getLineRangeForRange(new Range(range.start, range.start))
	const fullLineRange = editor.getLineRangeForRange(range)
	const requireMultiline = !fullLineRange.isEqual(firstLineRange)

	// Look for strings surrounding our cursor if we do not have a multiline selection
	if (!requireMultiline) {
		let stringStartIndex = null
		let stringStartChar = null
		let possiblePythonPrefix = false
		const checkPythonPrefixes = editor.document.syntax === 'python'
		let escapeChars = 0
		let index = firstLineRange.start
		const isStringChar = /^['"`]$/
		const isPythonPrefix = /^[bfru]$/
		while (index < firstLineRange.end) {
			const char = editor.getTextInRange(new Range(index, index + 1))
			// Check for Python prefixes, if necessary
			const havePythonPrefix = checkPythonPrefixes && isPythonPrefix.test(char)
			if (stringStartIndex === null && !havePythonPrefix) {
				possiblePythonPrefix = false
			}
			if (stringStartIndex === null && havePythonPrefix) {
				// We have a Python prefix
				possiblePythonPrefix = true
			} else if (stringStartIndex === null && isStringChar.test(char)) {
				// We have the start of a string
				stringStartIndex = index
				stringStartChar = char
			} else if (stringStartIndex !== null && char === '\\') {
				// We have an escape character
				escapeChars += 1
			} else if (stringStartIndex !== null && char === stringStartChar && escapeChars % 2 === 0) {
				// We've found the end of the string
				// Add our string range
				let startIndex = possiblePythonPrefix ? stringStartIndex - 1 : stringStartIndex
				const outerRange = new Range(startIndex, index + 1)
				// If the ranges are equal, then we need to look beyond our string range, so break out of the loop
				if (outerRange.isEqual(range)) break
				// If the outerRange otherwise contains our original range, verify we want the actual inner range
				if (outerRange.containsRange(range)) {
					startIndex = stringStartIndex + 1
					// If the start and end ranges don't support a new range, just return the outer range
					if (startIndex >= index) {
						return outerRange
					}
					const trimmedRange = getTrimmedRange(new Range(startIndex, index), editor)
					// Return whatever results in the larger range
					return trimmedRange.isEqual(range) || !trimmedRange.containsRange(range) ? outerRange : trimmedRange
				}
				// Reset everything so we can keep looking for a string that contains our range
				escapeChars = 0
				stringStartChar = null
				stringStartIndex = null
				possiblePythonPrefix = false
			} else if (stringStartIndex !== null && char !== '\\') {
				// Need to clear escape characters because they were separated from a string delimiter by something else
				escapeChars = 0
			}
			index += 1
		}
	}

	// We were unable to find an appropriate string within a single line, so fall back on symbols
	let possibleSymbol = editor.symbolAtPosition(range.start)
	if (!possibleSymbol || !possibleSymbol.range) return range
	while (!possibleSymbol.range.containsRange(range) && possibleSymbol.parent !== null) {
		possibleSymbol = possibleSymbol.parent
	}
	// Bail if no symbol surrounds the range
	if (!possibleSymbol.range.containsRange(range)) return range
	const trimmedRange = getTrimmedRange(possibleSymbol.range, editor)
	if (trimmedRange.isEqual(range) || !trimmedRange.containsRange(range)) return possibleSymbol.range
	return trimmedRange
}

nova.commands.register('handy.broadenSelection', editor => {
	const newSelectedRanges = []
	// There's no point trying to balance something that's not long enough to contain delimited text
	if (editor.document.length < 3) return
	for (const range of editor.selectedRanges) {
		let delimitedRange = getDelimitedRange(range, editor)
		// TODO: any automatic expansions when the two ranges match?
		newSelectedRanges.push(delimitedRange)
	}
	editor.selectedRanges = newSelectedRanges
})
