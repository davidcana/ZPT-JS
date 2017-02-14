/*
    IncExpression class
*/
"use strict";

var context = require( '../../../js/app/context.js' );
var evaluateHelper = require( '../../../js/app/evaluateHelper.js' );
var $ = require( 'jquery' );

var IncExpression = function( expressionToApply ) {
    
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        
        var evaluated = expression.evaluate( scope );
        
        if ( ! evaluateHelper.isNumber( value ) ) {
            throw 'Error trying to inc number, not a number!';
        }

        return 1 + evaluated;
    };
    
    return {
        evaluate: evaluate
    };
};

IncExpression.removePrefix = true;
IncExpression.getPrefix = function() {
    return '++' + context.getConf().expressionSuffix;
};
IncExpression.getId = IncExpression.getPrefix;

IncExpression.build = function( string ) {
    var expressionBuilder = require( '../../../js/app/expressions/expressionBuilder.js' );
    
    var expression = expressionBuilder.build(
        string, 
        IncExpression.prefix );
    
    return new IncExpression( expression );
}

module.exports = IncExpression;