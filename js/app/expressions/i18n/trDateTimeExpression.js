/*
    TrDateTimeExpression class
*/
//var context = require( '../../context.js' );
//var trHelper = require( './trHelper.js' );
import { context } from '../../context.js';
import { trHelper } from './trHelper.js';

export const TrDateTimeExpression = function( stringToApply, expressionToApply, argsExpressionsToApply ) {
    
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
};

//module.exports = TrDateTimeExpression;
