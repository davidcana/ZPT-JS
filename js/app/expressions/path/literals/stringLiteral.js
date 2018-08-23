/*
    StringLiteral class
*/
"use strict";

var StringLiteral = function( literalToApply ) {

    var literal = literalToApply;
    
    var evaluate = function( scope ){
        return literal;
    };

    var toString = function(){
        return literal;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

StringLiteral.build = function( string ) {
    
    if ( string.charAt( 0 ) === "'" && string.charAt( string.length - 1 ) ===  "'" ) {
        return new StringLiteral( 
            string.substring( 1, string.length - 1 ) );
    }

    return undefined;
};

module.exports = StringLiteral;