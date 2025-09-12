/*
    AndExpression class
*/

import { context } from '../../context.js';
import { evaluateHelper } from '../evaluateHelper.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { boolHelper } from './boolHelper.js';

export const AndExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            if ( ! evaluateHelper.evaluateBoolean( scope, expression ) ){
                return false;
            }
        }

        return true;
    };
    
    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expressionList );
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

AndExpression.removePrefix = true;
AndExpression.getPrefix = function() {
    return context.getConf().andExpression;
};
AndExpression.getId = AndExpression.getPrefix;

AndExpression.build = function( string ) {
    
    var expressionList = boolHelper.build( string, 'And' );

    return new AndExpression( string, expressionList );
};

