/*
    TALReplace class
*/
"use strict";

var evaluateHelper = require( '../../expressions/evaluateHelper.js' );

var TALReplace = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        // Evaluate
        var evaluated = evaluateHelper.evaluateToNotNull( scope, expression );
        
        // Append text node
        var textNode = node.ownerDocument.createTextNode( evaluated );
        node.parentNode.replaceChild( textNode, node );
        
        return true;
    };
    
    var toString = function(){
        return 'TALReplace: ' + string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

TALReplace.id = 'tal:replace';

TALReplace.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALReplace( 
                string,
                expressionBuilder.build( string.trim() ) );
};

module.exports = TALReplace;