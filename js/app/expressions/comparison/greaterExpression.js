/*
    GreaterExpression class
*/
"use strict";

var context = require( '../../context.js' );
var comparisonHelper = require( './comparisonHelper.js' );
var expressionsUtils = require( '../expressionsUtils.js' );

var GreaterExpression = function( stringToApply, expression1ToApply, expression2ToApply ) {
    
    var string = stringToApply;
    var expression1 = expression1ToApply;
    var expression2 = expression2ToApply;
    
    var evaluate = function( scope ){
        var numbers = comparisonHelper.evaluate( scope, expression1, expression2 );
        return numbers.number1 > numbers.number2;
    };

    var dependsOn = function( selfVarName, scope ){
        return expressionsUtils.buildDependsOnList( selfVarName, scope, expression1, expression2 );
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

GreaterExpression.removePrefix = true;
GreaterExpression.getPrefix = function() {
    return context.getConf().greaterExpression;
};
GreaterExpression.getId = GreaterExpression.getPrefix;

GreaterExpression.build = function( string ) {
    
    var data = comparisonHelper.build( string, 'greater' );

    return new GreaterExpression( string, data.expression1, data.expression2 );
}

module.exports = GreaterExpression;
