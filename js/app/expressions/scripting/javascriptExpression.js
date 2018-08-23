/*
    JavascriptExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var expressionBuilder = require( '../expressionBuilder.js' );
var StringExpression = require( '../stringExpression.js' );

var JavascriptExpression = function( expressionToApply ) {
    
    var stringExpression = expressionToApply;
    
    var evaluate = function( scope ){
        var evaluatedString = stringExpression.evaluate( scope );
        return eval( evaluatedString );
    };
    
    var toString = function(){
        return stringExpression;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

JavascriptExpression.removePrefix = true;

JavascriptExpression.getPrefix = function() {
    if ( JavascriptExpression.prefix === undefined ){
        JavascriptExpression.prefix = context.getConf().javaScriptExpression;
    }
    return JavascriptExpression.prefix;
};

JavascriptExpression.getId = JavascriptExpression.getPrefix

JavascriptExpression.build = function( string ) {
    return new JavascriptExpression(
            StringExpression.build( string ) );
}

module.exports = JavascriptExpression;