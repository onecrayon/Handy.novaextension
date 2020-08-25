/**
 * calculate.js
 *
 * Allows modifying multiple selected numbers via calculations.
 */

const {getNumberRanges} = require('../utils.js')
const mexp = require('../third-party/math-expression-evaluator.js')

nova.commands.register('handy.calculateNumbers', editor => {
	const numberRanges = getNumberRanges(editor)
	// No need for edits if we don't have any numbers
	if (!numberRanges.length) return

	const numbersCount = numberRanges.length
	let message = 'Perform calculation on selected number'
	message += numbersCount === 1 ? '.' : 's (represented by "x").'
	const value = numbersCount === 1 ? editor.getTextInRange(numberRanges[0]) : 'x + 5'

	nova.workspace.showInputPanel(message, {
		'label': 'Calculation:',
		'placeholder': 'x + 5',
		'value': value,
		'prompt': 'Calculate'
	}, inputValue => {
		if (!inputValue) return
		const changedPairs = []
		for (const range of numberRanges) {
			// Multiplying by one to convert to a Number without knowing if it's a float, int, etc.
			const number = editor.getTextInRange(range) * 1
			let value = number
			try {
				value = mexp.eval(inputValue, [
					// Defines a variable token named "x"
					{
						type: 3,
						token: 'x',
						show: 'x',
						value: 'x'
					}
				], {
					// Defines the token value
					'x': number
				})
			}
			catch (e) {
				nova.workspace.showErrorMessage(`Calculation failed with error: ${e.message}`)
				return
			}
			if (value != number) {
				changedPairs.push([range, value])
			}
		}
		editor.edit(edits => {
			// Traverse backwards through the ranges that need updating so our ranges don't have to be adjusted
			for (let i = changedPairs.length - 1; i >= 0; i--) {
				const range = changedPairs[i][0]
				const value = changedPairs[i][1]
				edits.replace(range, value + '')
			}
		})
	})
})
