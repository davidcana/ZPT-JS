/*
    VariableExpression class
*/
"use strict";

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        
        // Try to get the value from the scope
        var result = scope.get( name );
        if ( result !== undefined ){
            return result;
        }
        
        // Update the scope and try again
        scope.update();
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