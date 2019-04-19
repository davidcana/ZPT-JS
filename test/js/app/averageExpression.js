/*
    AverageExpression class
*/
"use strict";

var context = require( '../../../js/app/context.js' );
var evaluateHelper = require( '../../../js/app/expressions/evaluateHelper.js' );
var ExpressionTokenizer = require( '../../../js/app/expressions/expressionTokenizer.js' );
var $ = require( 'jquery' );

var AverageExpression = function( _string, _expressionList ) {
    
    var string = _string;
    var expressionList = _expressionList;
    
    var evaluate = function( scope ){

        // Evaluate segments
        var result = 0;
        var c = 0;
        
        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            var evaluated = expression.evaluate( scope );
            
            if ( ! $.isArray( evaluated ) ){ 
                // Process numeric value
                result = processInteger( 
                    c++, 
                    evaluated, 
                    result, 
                    expression 
                );
                
            } else {
                // Process array of numeric
                for ( var j = 0; j < evaluated.length; j++ ) {
                    result = processInteger( 
                        c++, 
                        evaluated[ j ], 
                        result, 
                        expression 
                    );
                }
            }
        }
        
        if ( c < 2 ) {
            throw 'Error in expression "' + string + '". Only one element in evaluation of Average ' 
                + ' expression, please add at least one more.';
        }
        
        return result / c;
    };
    
    var processInteger = function( c, value, result, expression ){
        
        if ( ! evaluateHelper.isNumber( value ) ) {
            throw "Error trying to do math operation, value '" + value 
                    + "' is not a valid number in average expression '" + expression + "'";
        }

        return c == 0? Number( value ): result + Number( value );
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

AverageExpression.removePrefix = true;
AverageExpression.getPrefix = function() {
    return 'avg' + context.getConf().expressionSuffix;
};
AverageExpression.getId = AverageExpression.getPrefix;

AverageExpression.build = function( string ) {
    
    var expressionBuilder = require( '../../../js/app/expressions/expressionBuilder.js' );
    
    if ( string.length == 0 ) {
        throw AverageExpression.getPrefix + " expression void.";
    }
    
    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false 
    );

    return new AverageExpression( 
        string, 
        expressionBuilder.buildList( segments )
    );
}

module.exports = AverageExpression;
