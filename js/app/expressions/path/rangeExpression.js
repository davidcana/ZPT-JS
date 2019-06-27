/*
    RangeExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../expressionTokenizer.js' );
var expressionsUtils = require( '../expressionsUtils.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var NumericLiteral = require( './literals/numericLiteral.js' );

var RangeExpression = function( stringToApply, startExpressionToApply, endExpressionToApply, stepExpressionToApply ) {
    
    var string = stringToApply;
    var startExpression = startExpressionToApply;
    var endExpression = endExpressionToApply;
    var stepExpression = stepExpressionToApply;
    
    var evaluate = function( scope ){
        
        // Evaluate all expressions
        var start = evaluateHelper.evaluateNumber( scope, startExpression );
        var end = evaluateHelper.evaluateNumber( scope, endExpression );
        var step = evaluateHelper.evaluateNumber( scope, stepExpression );
        
        // The range is valid, evaluate it
        var result = [];
        var forward = step > 0; 
        
        var c = start;
        while( forward? c <= end: c >= end ){
            result.push( c );
            c += step;
        }
        
        return result;
    };

    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( scope, startExpression, endExpression, stepExpression );
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

RangeExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    if ( ! s ) {
        return undefined;
    }

    var string = s.trim();
    
    // If it contains spaces it is not a valid range
    if ( string.indexOf( ' ' ) !== -1 ) {
        return undefined;
    }
    
    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().intervalDelimiter, 
            false );

    var numberOfTokens = segments.countTokens();
    if ( numberOfTokens != 2 && numberOfTokens != 3 ) {
        return undefined;
    }

    var RANGE_DEFAULT_START = 0;
    var RANGE_DEFAULT_STEP = 1;
    
    // Build start expression
    var start = segments.nextToken().trim();
    var startExpression = start == ''? 
            NumericLiteral.build( RANGE_DEFAULT_START ): 
            expressionBuilder.build( start );

    // Build end expression
    var endExpression = expressionBuilder.build( 
            segments.nextToken().trim() );

    // Build step expression
    var stepExpression = numberOfTokens == 3? 
            expressionBuilder.build( segments.nextToken().trim() ):
            NumericLiteral.build ( RANGE_DEFAULT_STEP );
    
    return new RangeExpression( string, startExpression, endExpression, stepExpression );
}

module.exports = RangeExpression;