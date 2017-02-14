/*
    IndirectionExpression class
*/
"use strict";

var IndirectionExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        return scope.get( name );
    };

    return {
        evaluate: evaluate
    };
};

IndirectionExpression.build = function( string ) {
    
    if ( string.charAt( 0 ) !== '?' ) {
        return undefined;
    }
    
    return new IndirectionExpression( string.substring( 1 ) );
}

module.exports = IndirectionExpression;