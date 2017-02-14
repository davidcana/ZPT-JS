/*
    MultiplyExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var MultiplyExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            scope,
            expressionList, 
            MultiplyExpression.mathOperation, 
            function( total, value ){
                return total * value;
            } );
    };
    
    return {
        evaluate: evaluate
    };
};

MultiplyExpression.removePrefix = true;
MultiplyExpression.getPrefix = function() {
    return context.getConf().mulExpression;
};
MultiplyExpression.mathOperation = 'multiply';
MultiplyExpression.getId = MultiplyExpression.mathOperation;

MultiplyExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            MultiplyExpression.mathOperation );

    return new MultiplyExpression( expressionList );
}

module.exports = MultiplyExpression;