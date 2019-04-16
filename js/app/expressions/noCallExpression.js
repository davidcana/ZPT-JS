/*
    NoCallExpression class
*/
"use strict";

var context = require( '../context.js' );

var NoCallExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function(){
        return expression;
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

NoCallExpression.removePrefix = true;
NoCallExpression.getPrefix = function() {
    return context.getConf().noCallExpression;
};
NoCallExpression.getId = NoCallExpression.getPrefix;

NoCallExpression.build = function( string ) {
    var expressionBuilder = require( './expressionBuilder.js' );
    
    var expression = expressionBuilder.build( string );
    return new NoCallExpression( string, expression );
};

module.exports = NoCallExpression;