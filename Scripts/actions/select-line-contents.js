/**
 * select-line-contents.js
 *
 * Selects the current lines (excluding leading and trailing whitespace)
 */

nova.commands.register('handy.selectLineContents', editor => {
	const newSelectedRanges = []
	for (const range of editor.selectedRanges) {
		const lineRange = editor.getLineRangeForRange(range)
		const lineText = editor.getTextInRange(lineRange)
		const trimmed = lineText.trim()
		// Figure out where the trimmed text starts
		let start = lineRange.start
		const trimStart = lineText.indexOf(trimmed)
		if (trimStart >= 0) {
			start += trimStart
		}
		// Set the end the length of the trimmed text beyond the start
		const end = start + trimmed.length
		newSelectedRanges.push(new Range(start, end))
	}
	editor.selectedRanges = newSelectedRanges
})
