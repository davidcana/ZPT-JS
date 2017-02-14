/*
    NumericLiteral class
*/
"use strict";

var NumericLiteral = function( literalToApply ) {

    var literal = literalToApply;
    
    var evaluate = function( scope ){
        return literal;
    };

    return {
        evaluate: evaluate
    };
};

NumericLiteral.build = function( string ) {
    
    if ( isFinite( string ) ){
        var integerValue = parseInt( string );
        if ( integerValue == string ){
            return new NumericLiteral( integerValue );
        }

        var floatValue = parseFloat( string );
        if ( floatValue == string ){
            return new NumericLiteral ( floatValue );
        }
    }

    return undefined;
}

module.exports = NumericLiteral;