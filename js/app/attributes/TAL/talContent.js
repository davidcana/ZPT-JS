/*
    TALContent class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
var contentHelper = require( './contentHelper.js' );

var TALContent = function( stringToApply, expressionToApply, structureToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    var structure = structureToApply;
    var formInputHasBody = {
        BUTTON : 1,
        LABEL : 1,
        LEGEND : 1,
        FIELDSET : 1,
        OPTION : 1
    };
    
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
        
        // Add it to node
        node.innerHTML = evaluated;
        if ( ! structure ) {
            node[ "form" in node && !formInputHasBody[ node.tagName ] ? "value": "innerText" ] = evaluated;
        }

        return true;
    };

    var toString = function(){
        return "TALContent: " + string;
    };
    
    return {
        process: process,
        toString: toString
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
