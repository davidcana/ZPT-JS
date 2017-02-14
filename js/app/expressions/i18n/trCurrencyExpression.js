/*
    TrCurrencyExpression class
*/
"use strict";

var context = require( '../../context.js' );
var trHelper = require( './trHelper.js' );

var TrCurrencyExpression = function( expressionToApply, argsExpressionsToApply, subformatToApply ) {
    
    var expression = expressionToApply;
    var argsExpressions = argsExpressionsToApply;
    var subformat = subformatToApply;
    
    var evaluate = function( scope ){
        var evaluated = trHelper.evaluate( 
                scope, 
                expression, 
                argsExpressions, 
                'currency', 
                subformat );
        return evaluated;
    };
    
    return {
        evaluate: evaluate
    };
};

TrCurrencyExpression.removePrefix = true;
TrCurrencyExpression.getPrefix = function() {
    return context.getConf().trCurrencyExpression;
};
TrCurrencyExpression.getId = TrCurrencyExpression.getPrefix;

TrCurrencyExpression.build = function( string ) {
    
    var trData = trHelper.build( 
            string,
            TrCurrencyExpression.getPrefix(), 
            2, 
            3, 
            true );

    return new TrCurrencyExpression( trData.expression, trData.argsExpressions, trData.subformat );
}

module.exports = TrCurrencyExpression;