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
    
    var dependsOn = function(){
        return [];
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
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
};

module.exports = BooleanLiteral;
