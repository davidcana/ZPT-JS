/*
    ExistsExpression class
*/
//var context = require( '../context.js' );
//var expressionsUtils = require( './expressionsUtils.js' );
//var expressionBuilder = require( './expressionBuilder.js' );
import { context } from '../context.js';
import { expressionsUtils } from './expressionsUtils.js';
import { expressionBuilder }  from './expressionBuilder.js';

export const ExistsExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        
        try {
            return undefined !== expression.evaluate( scope );
            
        } catch ( e ){
            return false;
        }
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

ExistsExpression.removePrefix = true;
ExistsExpression.getPrefix = function() {
    return context.getConf().existsExpression;
};
ExistsExpression.getId = ExistsExpression.getPrefix;

ExistsExpression.build = function( string ) {
    //var expressionBuilder = require( './expressionBuilder.js' );
    
    var expression = expressionBuilder.build( string );
    return new ExistsExpression( string, expression );
};

//module.exports = ExistsExpression;
