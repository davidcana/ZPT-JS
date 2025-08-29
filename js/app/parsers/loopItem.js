/* 
    Class LoopItem
*/

export const LoopItem = function ( _currentIndex, _itemsLength, _offset ) {
    
    this.currentIndex = _currentIndex;
    this.itemsLength = _itemsLength;
    this.offset = _offset;
};

LoopItem.prototype.index = function( ) {
    return this.offset + this.currentIndex;
};

LoopItem.prototype.number = function( ) {
    return this.index() + 1;
};

LoopItem.prototype.even = function( ) {
    return this.index() % 2 === 0;
};

LoopItem.prototype.odd = function ( ) {
    return this.index() % 2 === 1;
};

LoopItem.prototype.start = function ( ) {
    return this.index() === 0;
};

LoopItem.prototype.end = function ( ) {
    return this.currentIndex === this.itemsLength - 1;
};

LoopItem.prototype.length = function () {
    return this.offset + this.itemsLength;
};

LoopItem.prototype.letter = function () {
    return this.formatLetter( this.index(), 'a' );
};

LoopItem.prototype.Letter = function () {
    return this.formatLetter( this.index(), 'A' );
};

LoopItem.prototype.formatLetter = function ( ii, startChar ) {
    var i = ii;
    var buffer = '';
    var start = startChar.charCodeAt( 0 ); 
    var digit = i % 26;
    buffer += String.fromCharCode( start + digit );

    while( i > 25 ) {
        i /= 26;
        digit = (i - 1 ) % 26;
        buffer += String.fromCharCode( start + digit );
    }

    return buffer.split('').reverse().join('');
};

LoopItem.prototype.roman = function () {
    return this.formatRoman( this.index() + 1, 0 );
};

LoopItem.prototype.Roman = function () {
    return this.formatRoman( this.index() + 1, 1 );
};

LoopItem.prototype.formatRoman = function ( nn, capital ) {
    var n = nn;

    // Can't represent any number 4000 or greater
    if ( n >= 4000 ) {
        return 'Overflow formatting roman!';
    }

    var buf = '';
    for ( var decade = 0; n !== 0; decade++ ) {
        var digit = n % 10;
        if ( digit > 0 ) {
            digit--;
            buf += this.romanArray [ decade ][ digit ][ capital ];
        }
        n = (n / 10) >> 0;
    }

    return buf.split( '' ).reverse().join( '' );
};

LoopItem.prototype.romanArray = [
    /* One's place */
    [
        [ "i", "I" ],
        [ "ii", "II" ], 
        [ "iii", "III" ],
        [ "vi", "VI" ],
        [ "v", "V" ],
        [ "iv", "IV" ],
        [ "iiv", "IIV" ],
        [ "iiiv", "IIIV" ],
        [ "xi", "XI" ]
    ],

    /* 10's place */
    [
        [ "x", "X" ],
        [ "xx", "XX" ],
        [ "xxx", "XXX" ],
        [ "lx", "LX" ],
        [ "l", "L" ],
        [ "xl", "XL" ],
        [ "xxl", "XXL" ],
        [ "xxxl", "XXXL" ],
        [ "cx", "CX" ]
    ],

    /* 100's place */
    [
        [ "c", "C" ],
        [ "cc", "CC" ],
        [ "ccc", "CCC" ],
        [ "dc", "DC" ],
        [ "d", "D" ],
        [ "cd", "CD" ],
        [ "ccd", "CCD" ],
        [ "cccd", "CCCD" ],
        [ "mc", "MC" ]
    ],

    /* 1000's place */
    [
        [ "m", "M" ],
        [ "mm", "MM" ],
        [ "mmm", "MMM" ]
    ]
];

//module.exports = LoopItem;
