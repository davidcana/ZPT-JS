/*
    VariableExpression class
*/
"use strict";

var context = require( '../../context.js' );

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        
        var value = scope.get( name );
        if ( value !== undefined ){
            return value;
        }
        
        var strictMode = context.isStrictModeInScope( scope );
        if ( strictMode ){
            var error = 'Not declared variable found using strict mode:' + name;
            context.processPropsErrorsArray( [ error ] );
        }

        return undefined;
    };
    /*
    var evaluate = function( scope ){
        return scope.get( name );
    };
    */
    
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