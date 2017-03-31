/*
    TALReplace class
*/
"use strict";

var evaluateHelper = require( '../../expressions/evaluateHelper.js' );

var TALReplace = function( expressionToApply ) {
    
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        // Evaluate
        var evaluated = evaluateHelper.evaluateToNotNull( scope, expression );
        
        // Append text node
        var textNode = node.ownerDocument.createTextNode( evaluated );
        node.parentNode.replaceChild( textNode, node );
        
        return true;
    };

    return {
        process: process
    };
};

TALReplace.id = 'tal:replace';

TALReplace.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALReplace( 
                expressionBuilder.build( string.trim() ) );
}

module.exports = TALReplace;