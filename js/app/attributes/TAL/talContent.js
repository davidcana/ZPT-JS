/*
    TALContent class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../../expressions/evaluateHelper.js' );

var TALContent = function( expressionToApply, htmlToApply ) {
    
    var expression = expressionToApply;
    var html = htmlToApply;
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
        
        // Add it to node
        if ( html ) {
            node.innerHTML = evaluated;
        } else {
            /*node.value = evaluated;*/
            
            node[ "form" in node && !formInputHasBody[ node.tagName ] ? "value": "innerText" ] = evaluated;
        }

        return true;
    };

    return {
        process: process
    };
};

TALContent.id = 'tal:content';

TALContent.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    // Process it
    var content = string.trim();
    
    // Check if is an HTML expression
    var html = content.indexOf( context.getConf().htmlStructureExpressionPrefix + ' ' ) == 0;
    var expressionString = html? 
                content.substr( 1 + context.getConf().htmlStructureExpressionPrefix.length ): 
                content;
    if ( ! expressionString ){
        throw 'data-tcontent expression void.';
    }
    
    return new TALContent( 
                expressionBuilder.build( expressionString ),
                html );
}

module.exports = TALContent;