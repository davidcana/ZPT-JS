/*
    NotExpression class
*/

import { context } from '../../context.js';
import { evaluateHelper } from '../evaluateHelper.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { expressionBuilder } from '../expressionBuilder.js';

export const NotExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        return ! evaluateHelper.evaluateBoolean( scope, expression );
    };

    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expression );
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

NotExpression.removePrefix = true;
NotExpression.getPrefix = function() {
    return context.getConf().notExpression;
};
NotExpression.getId = NotExpression.getPrefix;

NotExpression.build = function( string ) {
    
    var expression = expressionBuilder.build( string );
    
    return new NotExpression( string, expression );
};

