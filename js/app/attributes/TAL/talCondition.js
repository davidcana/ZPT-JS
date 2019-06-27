/*
    TALCondition class
*/
"use strict";

var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var TALCondition = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        var result = evaluateHelper.evaluateBoolean( scope, expression );
            
        node.style.display = result ? '' : 'none';
        
        return result;
    };

    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( scope, expression );
    };
    
    var toString = function(){
        return "TALCondition: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        toString: toString,
        type: TALCondition.id
    };
};

TALCondition.id = 'tal:condition';

TALCondition.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALCondition( 
                string,
                expressionBuilder.build( string.trim() ) );
};

module.exports = TALCondition;
