/*
    FunctionExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var FunctionExpression = function( stringToApply, nameToApply, argsToApply ) {
    
    var string = stringToApply;
    var name = nameToApply;
    var args = argsToApply;
    
    var evaluate = function( scope ){
        var evaluatedArgs = evaluateHelper.evaluateExpressionList( args, scope );
        var element = scope.get( name );
        return ! element? undefined: element.apply( element, evaluatedArgs );
    };

    return {
        evaluate: evaluate
    };
};

FunctionExpression.build = function( string ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var leftParent = string.indexOf( '(' );
    if ( leftParent == -1 ) {
        return undefined;
    }
    
    if ( ! expressionBuilder.endsWith( string, ')' ) ) {
        throw 'Syntax error: bad function call: ' + string;
    }
    var functionName = string.substring( 0, leftParent ).trim();
    var argsString = string.substring( leftParent + 1, string.length - 1 );
    var args = expressionBuilder.getArgumentsFromString( argsString );

    return new FunctionExpression( string, functionName, args );
}

FunctionExpression.prototype.toString = function(){
    return string;
};

module.exports = FunctionExpression;