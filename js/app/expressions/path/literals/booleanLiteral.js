/*
    BooleanLiteral class
*/
"use strict";

var BooleanLiteral = function( literalToApply ) {

    var literal = literalToApply;
    
    var evaluate = function( scope ){
        return literal;
    };
    
    var toString = function(){
        return "" + literal;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

BooleanLiteral.build = function( string ) {
    
    if ( 'true' === string ) {
        return new BooleanLiteral( true );
    }
    if ( 'false' === string ) {
        return new BooleanLiteral( false );
    }
    return undefined;
}

module.exports = BooleanLiteral;