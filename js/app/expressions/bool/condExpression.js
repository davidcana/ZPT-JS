/*
    CondExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../expressionTokenizer.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var CondExpression = function( stringToApply, expression1ToApply, expression2ToApply, expression3ToApply ) {
    
    var string = stringToApply;
    var expression1 = expression1ToApply;
    var expression2 = expression2ToApply;
    var expression3 = expression3ToApply;
    
    var evaluate = function( scope ){
        
        return evaluateHelper.evaluateBoolean( scope, expression1 )?
            expression2.evaluate( scope ):
            expression3.evaluate( scope );
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
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
        throw 'Syntax error in cond expression "' + string + '". 3 element are needed.';
    }

    return new CondExpression( 
        string,
        expressionBuilder.build( segments.nextToken().trim() ), 
        expressionBuilder.build( segments.nextToken().trim() ), 
        expressionBuilder.build( segments.nextToken().trim() ) );
}

module.exports = CondExpression;