/*
    FormatExpression class
*/
"use strict";

var utils = require( '../utils.js' );
var context = require( '../context.js' );
var ExpressionTokenizer = require( './expressionTokenizer.js' );
var expressionsUtils = require( './expressionsUtils.js' );
var evaluateHelper = require( './evaluateHelper.js' );

var FormatExpression = function( stringToApply, formatterExpressionToApply, argsExpressionsToApply ) {
    
    var string = stringToApply;
    var formatterExpression = formatterExpressionToApply;
    var argsExpressions = argsExpressionsToApply;
    
    var evaluate = function( scope ){
        
        // Get formatter
        var formatter = evaluateFormatter( scope, formatterExpression );
        
        // Get arguments
        var args = evaluateHelper.evaluateExpressionList( argsExpressions, scope );
        
        return formatter.apply( formatter, args );
    };
    
    var evaluateFormatter = function( scope, expression ) {
        
        // Try to get a built-in formatter
        var formatter = context.getFormatter( expression );
        
        // Try to get a function with a name
        if ( ! isValidFormatter( formatter ) ){
            formatter = scope.get( expression );
        }
    
        // Try to get a function evaluating the expression
        if ( ! isValidFormatter( formatter ) ){
            try {
                var expressionBuilder = require( './expressionBuilder.js' );
                var formatterExpression = expressionBuilder.build( expression );
                var value = formatterExpression.evaluate( scope );
                
                return evaluateFormatter( scope, value );

            } catch( e ){
                // Nothing to do
            }
        }
        
        // Return the formatter only if it is valid
        if ( isValidFormatter( formatter ) ){
            return formatter;
        }
        
        throw 'No valid formatter found: ' + string;
    };
    
    var isValidFormatter = function( formatter ){
        return formatter && utils.isFunction( formatter );
    };
    
    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, formatterExpression, argsExpressions );
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

FormatExpression.removePrefix = true;
FormatExpression.getPrefix = function() {
    return context.getConf().formatExpression;
};
FormatExpression.getId = FormatExpression.getPrefix;

FormatExpression.build = function( s ) {
    var expressionBuilder = require( './expressionBuilder.js' );
    
    var string = s.trim();
    if ( string.length === 0 ) {
        throw 'Format expression void.';
    }

    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false );
    var numberOfTokens = segments.countTokens();
    if ( numberOfTokens === 1 ) {
        throw 'Only one element in format expression: "' + string + '". Please add at least one more.';
    }

    // Get formatter
    var formatter = segments.nextToken().trim();

    // Get arguments
    var argsExpressions = [];
    while ( segments.hasMoreTokens() ) {
        var argExpression = expressionBuilder.build( segments.nextToken() );
        argsExpressions.push( argExpression );
    }

    return new FormatExpression( string, formatter, argsExpressions );
};

module.exports = FormatExpression;
