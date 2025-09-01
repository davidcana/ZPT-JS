/*
    FunctionExpression class
*/
//var evaluateHelper = require( '../evaluateHelper.js' );
//var expressionBuilder = require( '../expressionBuilder.js' );
import { evaluateHelper } from '../evaluateHelper.js';
import { expressionBuilder } from '../expressionBuilder.js';

export const FunctionExpression = function( stringToApply, nameToApply, argsToApply ) {
    
    var string = stringToApply;
    var name = nameToApply;
    var args = argsToApply;
    
    var evaluate = function( scope ){
        var evaluatedArgs = evaluateHelper.evaluateExpressionList( args, scope );
        var element = scope.get( name );
        return ! element? undefined: element.apply( element, evaluatedArgs );
    };

    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

FunctionExpression.build = function( string ) {
    //var expressionBuilder = require( '../expressionBuilder.js' );
    
    var leftParent = string.indexOf( '(' );
    if ( leftParent === -1 ) {
        return undefined;
    }
    
    if ( ! expressionBuilder.endsWith( string, ')' ) ) {
        throw 'Syntax error. Bad function call: ' + string;
    }
    var functionName = string.substring( 0, leftParent ).trim();
    var argsString = string.substring( leftParent + 1, string.length - 1 );
    var args = expressionBuilder.getArgumentsFromString( argsString );

    return new FunctionExpression( string, functionName, args );
};

//module.exports = FunctionExpression;
