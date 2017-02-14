/*
    DivideExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var DivideExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            scope,
            expressionList, 
            DivideExpression.mathOperation, 
            function( total, value ){
                return total / value;
            } );
    };
    
    return {
        evaluate: evaluate
    };
};

DivideExpression.removePrefix = true;
DivideExpression.getPrefix = function() {
    return context.getConf().divExpression;
};
DivideExpression.mathOperation = 'divide';
DivideExpression.getId = DivideExpression.mathOperation;

DivideExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            DivideExpression.mathOperation );

    return new DivideExpression( expressionList );
}

module.exports = DivideExpression;