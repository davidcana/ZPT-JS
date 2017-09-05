/*
    TrDateTimeExpression class
*/
"use strict";

var context = require( '../../context.js' );
var trHelper = require( './trHelper.js' );

var TrDateTimeExpression = function( stringToApply, expressionToApply, argsExpressionsToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    var argsExpressions = argsExpressionsToApply;
    
    var evaluate = function( scope ){
        var evaluated = trHelper.evaluate( 
                scope, 
                expression, 
                argsExpressions, 
                'datetime', 
                null );
        return evaluated;
    };
    
    return {
        evaluate: evaluate
    };
};

TrDateTimeExpression.removePrefix = true;
TrDateTimeExpression.getPrefix = function() {
    return context.getConf().trDateTimeExpression;
};
TrDateTimeExpression.getId = TrDateTimeExpression.getPrefix;

TrDateTimeExpression.build = function( string ) {
    
    var trData = trHelper.build( 
            string,
            TrDateTimeExpression.getPrefix(), 
            1, 
            2, 
            false );

    return new TrDateTimeExpression( 
            string, 
            trData.expression, 
            trData.argsExpressions );
}

TrDateTimeExpression.prototype.toString = function(){
    return string;
};

module.exports = TrDateTimeExpression;