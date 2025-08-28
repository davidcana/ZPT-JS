/*
    CondExpression class
*/
//var context = require( '../../context.js' );
//var ExpressionTokenizer = require( '../expressionTokenizer.js' );
//var expressionsUtils = require( '../expressionsUtils.js' );
//var evaluateHelper = require( '../evaluateHelper.js' );
import { context } from '../../context.js';
import { ExpressionTokenizer } from '../expressionTokenizer.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { evaluateHelper } from '../evaluateHelper.js';

export const CondExpression = function( stringToApply, expression1ToApply, expression2ToApply, expression3ToApply ) {
    
    var string = stringToApply;
    var expression1 = expression1ToApply;
    var expression2 = expression2ToApply;
    var expression3 = expression3ToApply;
    
    var evaluate = function( scope ){
        
        return evaluateHelper.evaluateBoolean( scope, expression1 )?
            expression2.evaluate( scope ):
            expression3.evaluate( scope );
    };
    
    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expression1, expression2, expression3 );
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

CondExpression.removePrefix = true;
CondExpression.getPrefix = function() {
    return context.getConf().condExpression;
};
CondExpression.getId = CondExpression.getPrefix;

CondExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var string = s.trim();

    if ( string.length === 0 ) {
        throw 'Cond expression void.';
    }

    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false );
    if ( segments.countTokens() !== 3 ) {
        throw 'Syntax error in cond expression "' + string + '". 3 element are needed.';
    }

    return new CondExpression( 
        string,
        expressionBuilder.build( segments.nextToken() ), 
        expressionBuilder.build( segments.nextToken() ), 
        expressionBuilder.build( segments.nextToken() ) 
    );
};

//module.exports = CondExpression;
