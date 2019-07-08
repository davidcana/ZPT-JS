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
    
    var dependsOn = function( selfVarName, scope ){
        
        var expression = scope.getVarExpression( name );
        return expression? expression.dependsOn( name, scope ): [ name ];
    };
    
    var getVarName = function(){
        return name;
    };
    
    var toString = function(){
        return name;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        getVarName: getVarName,
        toString: toString
    };
};

VariableExpression.build = function( string ) {
    
    return context.getConf().variableNameRE.test( string )?
        new VariableExpression( string ):
        undefined;
}

module.exports = VariableExpression;
