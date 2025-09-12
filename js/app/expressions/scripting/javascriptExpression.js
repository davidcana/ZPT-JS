/*
    JavascriptExpression class
*/

import { context } from '../../context.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { StringExpression } from '../stringExpression.js';

export const JavascriptExpression = function( expressionToApply ) {
    
    var stringExpression = expressionToApply;
    
    var evaluate = function( scope ){
        var evaluatedString = stringExpression.evaluate( scope );
        return eval( evaluatedString );
    };
    
    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, stringExpression );
    };
    
    var toString = function(){
        return stringExpression;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

JavascriptExpression.removePrefix = true;

JavascriptExpression.getPrefix = function() {
    if ( JavascriptExpression.prefix === undefined ){
        JavascriptExpression.prefix = context.getConf().javaScriptExpression;
    }
    return JavascriptExpression.prefix;
};

JavascriptExpression.getId = JavascriptExpression.getPrefix;

JavascriptExpression.build = function( string ) {
    return new JavascriptExpression(
            StringExpression.build( string ) );
};

