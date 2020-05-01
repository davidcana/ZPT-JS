/*
    ModExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );
var expressionsUtils = require( '../expressionsUtils.js' );

var ModExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            ModExpression.mathOperation, 
            function( total, value ){
                return total % value;
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

ModExpression.removePrefix = true;
ModExpression.getPrefix = function() {
    return context.getConf().modExpression;
};
ModExpression.mathOperation = 'mod';
ModExpression.getId = ModExpression.mathOperation;

ModExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            ModExpression.mathOperation 
    );

    return new ModExpression( string, expressionList );
};

module.exports = ModExpression;
