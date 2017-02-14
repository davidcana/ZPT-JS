/*
    CondExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var CondExpression = function( expression1ToApply, expression2ToApply, expression3ToApply ) {
    
    var expression1 = expression1ToApply;
    var expression2 = expression2ToApply;
    var expression3 = expression3ToApply;
    
    var evaluate = function( scope ){
        
        return evaluateHelper.evaluateBoolean( scope, expression1 )?
            expression2.evaluate( scope ):
            expression3.evaluate( scope );
    };
    
    return {
        evaluate: evaluate
    };
};

CondExpression.removePrefix = true;
CondExpression.getPrefix = function() {
    return context.getConf().condExpression;
};
CondExpression.getId = CondExpression.getPrefix;

CondExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var string = s.trim();

    if ( string.length == 0 ) {
        throw 'Cond expression void.';
    }

    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false );
    if ( segments.countTokens() != 3 ) {
        throw '3 element are needed in cond expression.';
    }

    return new CondExpression( 
        expressionBuilder.build( segments.nextToken().trim() ), 
        expressionBuilder.build( segments.nextToken().trim() ), 
        expressionBuilder.build( segments.nextToken().trim() ) );
}

module.exports = CondExpression;