# Handy extension

Keeping your fingers on your keyboard since 2011 (this is a port of the original Handy.sugar for Espresso)!

Includes several of my favorite shortcuts and clips from my original TEA for Coda/Espresso plug-in, as well.

**Please note:** this extension is currently a work in progress! Please let me know if you have any requests, and I will be migrating over some other Handy shortcuts in time.

## Included commands

* **Align Assignments** (`command option A`): align assignments in the given selection(s) vertically. For instance:

        'stuff' => 'things,
        'foofoo' => 'barbar',
        'fibbles' => 'mcgee',

    Becomes:

        'stuff'   => 'things,
        'foofoo'  => 'barbar',
        'fibbles' => 'mcgee',

### Numbers

* **Calculate...** (`control =`): Perform a calculation for all selected numbers, with `x` representing the numbers in your selection(s). For instance, if you select the text `padding: 0 0 5 5` and enter the calculation `x + 3` you will end up with `padding: 3 3 8 8`. This is a very powerful action and supports a bunch of different calculations:
    * Addition: `x + 5`
    * Subtraction: `x - 5`
    * Multiplication: `x * 5`
    * Division: `x / 5`
    * Exponentiation: `x ^ 2`
    * Modulus: `x Mod 2` (capitalization is important!)
    * Parenthetical groupings: `(x + 2) * 3`
    * Factorials: `x!`
    * Logarithmic function (base 10): `log x`
    * Square roots: `root x`
    * Trigonometric functions: `sin x`
    * [And more...](http://bugwheels94.github.io/math-expression-evaluator/#supported-maths-symbols)
* **Increment/Decrement**: These actions will increment or decrement all numbers within your selection(s) by 1 or 10, respectively.
    * Increment +1: `control option up-arrow`
    * Increment +10: `control shift option up-arrow`
    * Decrement -1: `control option down-arrow`
    * Decrement -10: `control shift option down-arrow`

### Selections

* **Broaden Selection** (`control B`): Expand your selection(s) to their surrounding scopes. **PLEASE NOTE:** due to limitations in the Nova API, this is currently only useful for single-line strings. Stick your cursor in a string and hit `control B` to select the string's contents. Hit it again to select the full string (including delimiters). Once more will select the line contents. Some day it will also traverse multiline blocks the way the old "Balance" action did in Espresso...but not today. 😔
* **Select Line Contents** (`command option L`): selects the line, excluding leading and trailing whitespace.

## Included Clips

Handy currently also includes some clips that I find helpful when working with Javascript and HTML.

* **Insert documentation comment**: `/**→`

### HTML-based languages

* **Ampersand entity**: `control &`
* **Less-than entity**: `control <`
* **Greater-than entity**: `control >`
* **Non-breaking space**: `control shift space`
* **Linebreak**: `control shift return`
