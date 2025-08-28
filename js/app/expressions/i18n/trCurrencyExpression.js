/*
    TrCurrencyExpression class
*/
//var context = require( '../../context.js' );
//var trHelper = require( './trHelper.js' );
import { context } from '../../context.js';
import { trHelper } from './trHelper.js';

export const TrCurrencyExpression = function( stringToApply, expressionToApply, argsExpressionsToApply, subformatToApply ) {
    
    var string = stringToApply;
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
    
    var dependsOn = function( depsDataItem, scope ){
        return trHelper.dependsOn( depsDataItem, scope, expression, argsExpressions );
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

    return new TrCurrencyExpression( 
            string, 
            trData.expression, 
            trData.argsExpressions, 
            trData.subformat );
};

//module.exports = TrCurrencyExpression;
