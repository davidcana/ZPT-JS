/* 
    comparisonHelper singleton class
*/
"use strict";

module.exports = (function() {
    var context = require( '../../context.js' );
    var ExpressionTokenizer = require( '../expressionTokenizer.js' );
    var evaluateHelper = require( '../evaluateHelper.js' );
    
    var build = function( s, tag ) {
        var expressionBuilder = require( '../expressionBuilder.js' );
        
        var string = s.trim();
        
        if ( string.length === 0 ) {
            throw tag + ' expression void.';
        }

        var segments = new ExpressionTokenizer( 
                string, 
                context.getConf().expressionDelimiter, 
                false );
        if ( segments.countTokens() !== 2 ) {
            throw 'Wrong number of elements in expression "' + string + '", ' + tag + ' expressions only support two.';
        }

        var expression1 = expressionBuilder.build( segments.nextToken() );
        var expression2 = expressionBuilder.build( segments.nextToken() );
        
        return {
            expression1: expression1,
            expression2: expression2
        };
    };
    
    var evaluate = function( scope, valueExpression1, valueExpression2 ) {
        
        return {
            number1: evaluateHelper.evaluateNumber( scope, valueExpression1 ),
            number2: evaluateHelper.evaluateNumber( scope, valueExpression2 )
        };
    };
    
    return {
        build: build,
        evaluate: evaluate
    };
})();
