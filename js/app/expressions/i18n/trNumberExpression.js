/*
    TrNumberExpression class
*/
"use strict";

var context = require( '../../context.js' );
var trHelper = require( './trHelper.js' );

var TrNumberExpression = function( expressionToApply, argsExpressionsToApply ) {
    
    var expression = expressionToApply;
    var argsExpressions = argsExpressionsToApply;
    
    var evaluate = function( scope ){
        var evaluated = trHelper.evaluate( 
                scope, 
                expression, 
                argsExpressions, 
                'number', 
                null );
        return evaluated;
    };
    
    return {
        evaluate: evaluate
    };
};

TrNumberExpression.removePrefix = true;
TrNumberExpression.getPrefix = function() {
    return context.getConf().trNumberExpression;
};
TrNumberExpression.getId = TrNumberExpression.getPrefix;

TrNumberExpression.build = function( string ) {
    
    var trData = trHelper.build( 
            string,
            TrNumberExpression.getPrefix(), 
            1, 
            2, 
            false );

    return new TrNumberExpression( trData.expression, trData.argsExpressions );
}

module.exports = TrNumberExpression;