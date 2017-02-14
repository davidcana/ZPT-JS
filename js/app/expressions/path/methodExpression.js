/*
    MethodExpression class
*/
"use strict";

var evaluateHelper = require( '../evaluateHelper.js' );

var MethodExpression = function( nameToApply, argsToApply ) {
    
    var name = nameToApply;
    var args = argsToApply;
    
    var evaluate = function( scope, parent ){
        var evaluatedArgs = evaluateHelper.evaluateExpressionList( args, scope );
        return parent[ name ].apply( parent, evaluatedArgs );
    };

    return {
        evaluate: evaluate
    };
};

MethodExpression.build = function( string ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var leftParent = string.indexOf( '(' );
    if ( leftParent === -1 ) {
        return undefined;
    }
    
    if ( ! expressionBuilder.endsWith( string, ')' ) ) {
        throw 'Syntax error: bad method call: ' + string;
    }
    
    var methodName = string.substring( 0, leftParent ).trim();
    var argsString = string.substring( leftParent + 1, string.length - 1 );
    var args = expressionBuilder.getArgumentsFromString( argsString );
    
    return new MethodExpression( methodName, args );
}

module.exports = MethodExpression;