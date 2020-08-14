# Handy extension

Keeping your fingers on your keyboard since 2011 (this is a port of the original Handy.sugar for Espresso)!

Includes several of my favorite shortcuts and clips from my original TEA for Coda/Espresso plug-in, as well.

**Please note:** this extension is currently a work in progress! I'll submit it to the official extension library when it's ready.

## Included commands

* **Align Assignments** (`command option A`): align assignments in the given selection(s) vertically. For instance:

        'stuff' => 'things,
        'foofoo' => 'barbar',
        'fibbles' => 'mcgee',

    Becomes:

        'stuff'   => 'things,
        'foofoo'  => 'barbar',
        'fibbles' => 'mcgee',
* **Broaden Selection** (`control B`): Expand your selection(s) to their surrounding scopes. **PLEASE NOTE:** due to limitations in the Nova API, this is currently only useful for single-line strings. Stick your cursor in a string and hit `control B` to select the string's contents. Hit it again to select the full string (including delimiters). Some day it will also traverse multiline blocks the way the old "Balance" action did in Espresso...but not today. 😔
* **Select Line Contents** (`command option L`): selects the line, excluding leading and trailing whitespace.
