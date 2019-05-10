/* 
    contentHelper singleton class
*/
"use strict";

var context = require( '../../context.js' );
var expressionBuilder = require( '../../expressions/expressionBuilder.js' );

module.exports = (function() {

    var build = function( tag, string, constructorFunction ) {

        // Process it
        var content = string.trim();

        // Check if is an HTML expression
        var structure = content.indexOf( context.getConf().htmlStructureExpressionPrefix + ' ' ) == 0;
        var expressionString = structure? 
            content.substr( 1 + context.getConf().htmlStructureExpressionPrefix.length ): 
            content;
        if ( ! expressionString ){
            throw tag + ' expression void.';
        }
        
        return constructorFunction(
            string,
            expressionBuilder.build( expressionString ),
            structure 
        );
    };
    
    return {
        build: build
    };
})();
