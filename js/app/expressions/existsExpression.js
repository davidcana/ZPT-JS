/*
    ExistsExpression class
*/
"use strict";

var context = require( '../context.js' );
var expressionsUtils = require( './expressionsUtils.js' );

var ExistsExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        
        try {
            return undefined !== expression.evaluate( scope );
            
        } catch ( e ){
            return false;
        }
    };

    var dependsOn = function(){
        return expressionsUtils.buildDependsOnList( expression );
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
    var expressionBuilder = require( './expressionBuilder.js' );
    
    var expression = expressionBuilder.build( string );
    return new ExistsExpression( string, expression );
};

module.exports = ExistsExpression;
