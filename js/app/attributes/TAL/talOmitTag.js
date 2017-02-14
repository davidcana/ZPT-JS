/*
    TALOmitTag class
*/
"use strict";

var BooleanLiteral = require( '../../expressions/path/literals/booleanLiteral.js' );

var TALOmitTag = function( expressionToApply ) {
    
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

    return {
        process: process
    };
};

TALOmitTag.id = 'tal:ommit-tag';

TALOmitTag.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();
    var expression = expressionString == ''?
            new BooleanLiteral( true ):
            expressionBuilder.build( expressionString );
    
    return new TALOmitTag( expression );
}

module.exports = TALOmitTag;