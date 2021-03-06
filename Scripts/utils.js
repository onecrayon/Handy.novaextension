/**
 * getTrimmedRange(range, editor)
 *
 * Returns the range representing the text within `range` sans leading and trailing whitespace.
 */
exports.getTrimmedRange = function(range, editor) {
	// Parsing character-by-character because for very large ranges we could consume a lot of memory fetching the text
	const trimmable = /^[\n\r\t ]+$/
	let start = range.start
	while (start < range.end) {
		const char = editor.getTextInRange(new Range(start, start + 1))
		if (!trimmable.test(char)) break
		start += 1
	}
	let end = range.end - 1
	while (end > start && end > range.start) {
		const char = editor.getTextInRange(new Range(end, end + 1))
		if (!trimmable.test(char)) {
			// Have to reset our end, since we're moving left but checking right
			end += 1
			break
		}
		end -= 1
	}
	return new Range(start, end)
}

/**
 * Helper function for extracting number ranges within a single range (used by getNumberRanges)
 */
function numberRangesInRange(range, editor) {
	const bounds = new Range(0, editor.document.length)
	const isNumberLike = /^[\d\.E-]$/i
	let start = range.start
	let end = range.end
	// If the first character is number-like or nonexistent, we need to check for an overlapping number at the start
	if (start === end || isNumberLike.test(
		editor.getTextInRange(new Range(range.start, range.start + 1))
	)) {
		while (start > bounds.start) {
			const prevChar = editor.getTextInRange(new Range(start - 1, start))
			if (!isNumberLike.test(prevChar)) break
			start -= 1
		}
	}
	// If the last character is number-like or non-existent, check for overlap at the end
	if (start === end || isNumberLike.test(
		editor.getTextInRange(new Range(range.end - 1, range.end))
	)) {
		while (end < bounds.end) {
			const nextChar = editor.getTextInRange(new Range(end, end + 1))
			if (!isNumberLike.test(nextChar)) break
			end += 1
		}
	}
	// Now that we have our starting and ending bounds for the potential numbers in the selection, find them all
	let currentNumber = ''
	const numberRanges = []
	while (start < end) {
		const char = editor.getTextInRange(new Range(start, start + 1))
		if (isNumberLike.test(char)) {
			currentNumber += char
		} else if (currentNumber) {
			if (/^-?\d+(?:\.?[\dE]*)?$/i.test(currentNumber)) {
				numberRanges.push(new Range(start - currentNumber.length, start))
			}
			currentNumber = ''
		}
		start += 1
	}
	// Make sure we don't miss the last number, if any
	if (currentNumber && /^-?\d+(?:\.?[\dE]*)?$/i.test(currentNumber)) {
		numberRanges.push(new Range(start - currentNumber.length, start))
	}
	return numberRanges
}

/**
 * getNumberRanges(range, editor)
 *
 * Searches the given range for all numbers (and overlapping numbers) and returns a list of number ranges.
 */
exports.getNumberRanges = function(editor) {
	const numberRanges = []
	for (const range of editor.selectedRanges) {
		const prospectiveRanges = numberRangesInRange(range, editor)
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
	return numberRanges
}
