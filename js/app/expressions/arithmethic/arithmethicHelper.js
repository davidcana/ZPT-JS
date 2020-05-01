/* 
    arithmethicHelper singleton class
*/
module.exports = (function() {
    "use strict";
    
    var context = require( '../../context.js' );
    var ExpressionTokenizer = require( '../expressionTokenizer.js' );
    var evaluateHelper = require( '../evaluateHelper.js' );
    
    var build = function( string, tag ) {
        var expressionBuilder = require( '../expressionBuilder.js' );

        if ( string.length === 0 ) {
            throw tag + " expression void.";
        }
        
        var segments = new ExpressionTokenizer( 
                string, 
                context.getConf().expressionDelimiter, 
                false 
        );

        return expressionBuilder.buildList( segments );
    };
    
    var evaluate = function( string, scope, expressionList, mathOperation, arithmethicFunction ) {
        
        // Evaluate segments
        var result = 0;
        var c = 0;
        
        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            var evaluated = expression.evaluate( scope );
            
            if ( ! Array.isArray( evaluated ) ){ 
                // Process numeric value
                result = processInteger( 
                    c++, 
                    evaluated, 
                    result, 
                    arithmethicFunction, 
                    mathOperation, 
                    expression );
                
            } else {
                // Process array of numeric
                for ( var j = 0; j < evaluated.length; j++ ) {
                    result = processInteger( 
                        c++, 
                        evaluated[ j ], 
                        result, 
                        arithmethicFunction, 
                        mathOperation, 
                        expression );
                }
            }
        }
        
        if ( c < 2 ) {
            throw 'Error in expression "' + string + '". Only one element in evaluation of "' + mathOperation 
                + '" expression, please add at least one more.';
        }
        
        return result;
    };
    
    var processInteger = function( c, value, result, arithmethicFunction, mathOperation, expression ){
        
        if ( ! evaluateHelper.isNumber( value ) ) {
            throw "Error trying doing math operation, value '" + value 
                    + "' is not a valid number in expression '" + mathOperation + ' ' + expression + "'";
        }

        return c == 0? Number( value ): arithmethicFunction( result, Number( value ) );
    };
    
    return {
        build: build,
        evaluate: evaluate
    };
})();
