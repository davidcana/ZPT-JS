/*
    TALContent class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
var contentHelper = require( './contentHelper.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var TALContent = function( stringToApply, expressionToApply, structureToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    var structure = structureToApply;
    
    var process = function( scope, node ){
        
        return contentHelper.updateNode( 
            node, 
            structure, 
            evaluateHelper.evaluateToNotNull( scope, expression ) 
        );
    };

    var dependsOn = function( scope ){
        //return expressionsUtils.buildDependsOnList( selfVarName, scope, expression );
        return expressionsUtils.buildDependsOnList( undefined, scope, expression );
    };
    
    var update = function( parserUpdater, node, scope ){
        process( scope, node );
    };
    
    var toString = function(){
        return "TALContent: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALContent.id
    };
};

TALContent.id = 'tal:content';

TALContent.build = function( string ) {
    
    return contentHelper.build( 
        'TALContent',
        string,
        function( _string, _expression, _structure ){
            return new TALContent( _string, _expression, _structure );
        }
    );
};

module.exports = TALContent;
