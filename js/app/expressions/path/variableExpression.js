/*
    VariableExpression class
*/
"use strict";

var context = require( '../../context.js' );

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        
        if ( ! scope.isValidVariable( name ) ){
            var error = 'Not declared variable found using strict mode:' + name;
            context.processPropsErrorsArray( [ error ] );
            return undefined;
        }
        
        return scope.get( name );
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
    
    return context.getConf().variableNameRE.test( string )?
        new VariableExpression( string ):
        undefined;
    //return new VariableExpression( string );
}

module.exports = VariableExpression;
