/*
    TALCondition class
*/
"use strict";

var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );
var context = require( '../../context.js' );

var TALCondition = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        var result = evaluateHelper.evaluateBoolean( scope, expression );
        
        node.setAttribute( context.getTags().conditionResult, result );
        node.style.display = result ? '' : 'none';
        
        return result;
    };

    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( undefined, scope, expression );
    };
    
    var update = function( parserUpdater, node ){
        parserUpdater.updateNode( node, true );
    };
    
    var updatableFromAction = function( parserUpdater, node ){
        
        var scope = parserUpdater.getNodeScope( node );
        var result = evaluateHelper.evaluateBoolean( scope, expression );
        var valueFromTag = 'true' === node.getAttribute( context.getTags().conditionResult );
        
        return result !== valueFromTag;
    };
    
    var toString = function(){
        return "TALCondition: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        updatableFromAction: updatableFromAction,
        toString: toString,
        type: TALCondition.id
    };
};

TALCondition.id = 'tal:condition';

TALCondition.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALCondition( 
                string,
                expressionBuilder.build( string ) );
};

module.exports = TALCondition;
