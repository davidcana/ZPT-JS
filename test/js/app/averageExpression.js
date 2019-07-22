/*
    AverageExpression class
*/
"use strict";

var $ = require( 'jquery' );
var utils = require( '../../../js/app/utils.js' );
var zpt = require( '../../../js/app/main.js' );
var context = zpt.context;
var evaluateHelper = zpt.evaluateHelper;
var ExpressionTokenizer = zpt.ExpressionTokenizer;
var expressionBuilder = zpt.expressionBuilder;

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
            
            if ( ! Array.isArray( evaluated ) ){ 
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
