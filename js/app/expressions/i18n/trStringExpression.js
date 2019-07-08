/*
    TrStringExpression class
*/
"use strict";

var context = require( '../../context.js' );
var trHelper = require( './trHelper.js' );

var TrStringExpression = function( stringToApply, expressionToApply, argsExpressionsToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    var argsExpressions = argsExpressionsToApply;
    
    var evaluate = function( scope ){
        var evaluated = trHelper.evaluate( 
                scope, 
                expression, 
                argsExpressions, 
                'string', 
                null );
        return evaluated;
    };
    
    var dependsOn = function( selfVarName, scope ){
        return trHelper.dependsOn( selfVarName, scope, expression, argsExpressions );
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

TrStringExpression.removePrefix = true;
TrStringExpression.getPrefix = function() {
    return context.getConf().trExpression;
};
TrStringExpression.getId = TrStringExpression.getPrefix;

TrStringExpression.build = function( string ) {
    
    var trData = trHelper.build( 
            string,
            TrStringExpression.getPrefix(), 
            1, 
            2, 
            false );

    return new TrStringExpression( 
            string, 
            trData.expression, 
            trData.argsExpressions );
}

module.exports = TrStringExpression;
