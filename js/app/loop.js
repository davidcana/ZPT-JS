/* LoopManager singleton class */
var loopManager = (function() {
    var NAME_PREFFIX = 'repeat-';

    var getVarName = function( name ) {
        return NAME_PREFFIX + name;
    };
    
    var get = function( scope, name ){
        var fullName = getVarName( name );
        return scope.get( fullName );
    };
    
    var create = function( scope, expression ){
        expression = expression.trim();
        var space = expression.indexOf( ' ' );
        if ( space == -1 ) {
            throw 'Bad repeat expression: ' + expression;
        }
        var name = expression.substring( 0, space );
        var loopExpression = expression.substring( space + 1 );
        var items = expressionEvaluator.evaluate( scope, loopExpression );            
        
        var fullName = getVarName( name );
        var loop = new Loop( fullName, name, items );
        scope.set( fullName, loop );
        
        return loop;
    };

    return {
        getVarName: getVarName,
        get: get,
        create: create
    };
})();


/* Class Loop */
var Loop = function ( nameOfLoop, itemVariableNameToApply, itemsToIterate ) {
    var name = nameOfLoop;
    var itemVariableName = itemVariableNameToApply;
    var items = itemsToIterate;
    var currentIndex = -1;
    var maxIndex = itemsToIterate? itemsToIterate.length - 1: -1;
    
    var getName = function( ){
        return name;
    };
    
    var repeat = function( scope ){
        if ( currentIndex < maxIndex ) {
            scope.set( itemVariableName, items[ ++currentIndex ] );
            return true;
        }
        
        return false;
    };
    
    var index = function( ) {
        return currentIndex;
    };
    
    var number = function( ) {
        return currentIndex + 1;
    };
    
    var isEven = function( ) {
        return currentIndex % 2 == 0;
    };
    
    var isOdd = function ( ) {
        return currentIndex % 2 == 1;
    };
    
    var isStart = function ( ) {
        return currentIndex == 0;
    };
    
    var isEnd = function ( ) {
        return currentIndex == items.length - 1;
    };
    
    var getLength = function () {
        return items.length;
    };

    var getLetter = function () {
        return formatLetter( currentIndex, 'a' );
    };
    
    var getCapitalLetter = function () {
        return formatLetter( currentIndex, 'A' );
    };
    
    var formatLetter = function ( ii, startChar ) {
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
    
    var getRoman = function () {
        return formatRoman( currentIndex + 1, 0 );
    };
    
    var getCapitalRoman = function () {
        return formatRoman( currentIndex + 1, 1 );
    };
    
    var formatRoman = function ( nn, capital ) {
        var n = nn;
        
        // Can't represent any number 4000 or greater
        if ( n >= 4000 ) {
            return "<overflow>";
        }

        var buf = '';
        for ( var decade = 0; n != 0; decade++ ) {
            var digit = n % 10;
            if ( digit > 0 ) {
                digit--;
                buf +=  roman [ decade ][ digit ][ capital ];
            }
            n = (n / 10) >> 0;
        }
        
        return buf.split( '' ).reverse().join( '' );
    };
    
    var roman = [
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
            [ "xi", "XI" ],
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
            [ "cx", "CX" ],
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
            [ "mc", "MC" ],
        ],

        /* 1000's place */
        [
            [ "m", "M" ],
            [ "mm", "MM" ],
            [ "mmm", "MMM" ]
        ]
    ];
    
    return {
        getName: getName,
        repeat:repeat,
        index: index,
        number: number,
        isEven: isEven,
        isOdd: isOdd,
        isStart: isStart,
        isEnd: isEnd,
        getLength: getLength,
        getLetter: getLetter,
        getCapitalLetter: getCapitalLetter,
        getRoman: getRoman,
        getCapitalRoman: getCapitalRoman
    };
};
