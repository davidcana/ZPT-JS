/*
    VariableExpression class
*/
"use strict";

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        return scope.get( name );
    };
    
    var toString = function(){
        return name;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

VariableExpression.build = function( string ) {
    return new VariableExpression( string );
}

module.exports = VariableExpression;