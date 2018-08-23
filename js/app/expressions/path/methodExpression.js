/*
    MethodExpression class
*/
"use strict";

var evaluateHelper = require( '../evaluateHelper.js' );

var MethodExpression = function( stringToApply, nameToApply, argsToApply ) {
    
    var string = stringToApply;
    var name = nameToApply;
    var args = argsToApply;
    
    var evaluate = function( scope, parent ){
        var evaluatedArgs = evaluateHelper.evaluateExpressionList( args, scope );
        return parent[ name ].apply( parent, evaluatedArgs );
    };

    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

MethodExpression.build = function( string ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var leftParent = string.indexOf( '(' );
    if ( leftParent === -1 ) {
        return undefined;
    }
    
    if ( ! expressionBuilder.endsWith( string, ')' ) ) {
        throw 'Syntax error. Bad method call: ' + string;
    }
    
    var methodName = string.substring( 0, leftParent ).trim();
    var argsString = string.substring( leftParent + 1, string.length - 1 );
    var args = expressionBuilder.getArgumentsFromString( argsString );
    
    return new MethodExpression( string, methodName, args );
}

module.exports = MethodExpression;