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