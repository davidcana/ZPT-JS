/*
    TALReplace class
*/
"use strict";

var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
var contentHelper = require( './contentHelper.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var TALReplace = function( stringToApply, expressionToApply, structureToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    var structure = structureToApply;
    
    var process = function( scope, node ){
        
        // Evaluate
        var evaluated = evaluateHelper.evaluateToNotNull( scope, expression );
        
        // Check default
        if ( evaluateHelper.isDefault( evaluated ) ){
            return true;
        }

        // Check nothing
        if ( evaluateHelper.isNothing( evaluated ) ){
            evaluated = "";
        }
        
        if ( structure ){
            // Replace HTML
            node.outerHTML = evaluated;
            
        } else {
            // Replace original node by new text node
            var textNode = node.ownerDocument.createTextNode( evaluated );
            node.parentNode.replaceChild( textNode, node );
        }
        
        return true;
    };
    
    var dependsOn = function( scope ){
        //return expressionsUtils.buildDependsOnList( selfVarName, scope, expression );
        return expressionsUtils.buildDependsOnList( undefined, scope, expression );
    };
    
    var update = function(){
        // Nothing to do
    };
    
    var toString = function(){
        return 'TALReplace: ' + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALReplace.id
    };
};

TALReplace.id = 'tal:replace';

TALReplace.build = function( string ) {

    return contentHelper.build( 
        'TALReplace',
        string,
        function( _string, _expression, _structure ){
            return new TALReplace( _string, _expression, _structure );
        }
    );
};

module.exports = TALReplace;
