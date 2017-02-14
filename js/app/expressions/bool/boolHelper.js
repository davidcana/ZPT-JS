/* 
    boolHelper singleton class
*/
"use strict";

module.exports = (function() {    
    var context = require( '../../context.js' );
    var ExpressionTokenizer = require( '../../expressionTokenizer.js' );
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var build = function( s, tag ) {
        
        var string = s.trim();
        
        if ( string.length == 0 ) {
            throw tag + ' expression void.';
        }

        var segments = new ExpressionTokenizer( 
                string, 
                context.getConf().expressionDelimiter, 
                false );
        if ( segments.countTokens() == 1 ) {
            throw 'Only one element in ' + tag + ' expression, please add at least one more.';
        }
        
        return expressionBuilder.buildList( segments );
    };
    
    return {
        build: build
    };
})();
