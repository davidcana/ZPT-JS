/*
    VariableExpression class
*/
"use strict";

var context = require( '../../context.js' );
var expressionsUtils = require( '../expressionsUtils.js' );

var VariableExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope ){
        
        if ( ! scope.isValidVariable( name ) ){
            throw 'Not declared variable found using strict mode:' + name;
        }
        
        return scope.get( name );
    };
    
    var dependsOn = function( scope ){
        
        var expression = scope.getVarExpression( name );
        return expression? expression.dependsOn( scope ): [ name ];
    };
    
    var toString = function(){
        return name;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

VariableExpression.build = function( string ) {
    
    return context.getConf().variableNameRE.test( string )?
        new VariableExpression( string ):
        undefined;
}

module.exports = VariableExpression;
