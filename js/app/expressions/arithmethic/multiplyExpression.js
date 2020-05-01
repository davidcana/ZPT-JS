/*
    MultiplyExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );
var expressionsUtils = require( '../expressionsUtils.js' );

var MultiplyExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            MultiplyExpression.mathOperation, 
            function( total, value ){
                return total * value;
            } 
        );
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

MultiplyExpression.removePrefix = true;
MultiplyExpression.getPrefix = function() {
    return context.getConf().mulExpression;
};
MultiplyExpression.mathOperation = 'multiply';
MultiplyExpression.getId = MultiplyExpression.mathOperation;

MultiplyExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            MultiplyExpression.mathOperation 
    );

    return new MultiplyExpression( string, expressionList );
};

module.exports = MultiplyExpression;
