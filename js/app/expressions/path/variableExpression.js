/*
    VariableExpression class
*/
"use strict";

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        return scope.get( name );
    };

    return {
        evaluate: evaluate
    };
};

VariableExpression.build = function( string ) {
    return new VariableExpression( string );
}

module.exports = VariableExpression;