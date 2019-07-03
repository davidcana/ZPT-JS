/*
    TALOmitTag class
*/
"use strict";

var BooleanLiteral = require( '../../expressions/path/literals/booleanLiteral.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var TALOmitTag = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        var result = expression.evaluate( scope );
        
        if ( result ) {
            // Move children from current node to its parent and then remove it
            var parentNode = node.parentNode;
            while ( node.firstChild ) {
                parentNode.appendChild( node.firstChild );
            }
            parentNode.removeChild( node );
        }

        return result;
    };
    
    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( scope, expression );
    };
    
    var update = function(){
        // Nothing to do
    };
    
    var toString = function(){
        return "TALOmitTag: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALOmitTag.id
    };
};

TALOmitTag.id = 'tal:omit-tag';

TALOmitTag.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();
    var expression = expressionString == ''?
            new BooleanLiteral( true ):
            expressionBuilder.build( expressionString );
    
    return new TALOmitTag( string, expression );
};

module.exports = TALOmitTag;
