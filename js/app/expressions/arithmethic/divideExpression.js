/*
    DivideExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var DivideExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            DivideExpression.mathOperation, 
            function( total, value ){
                return total / value;
            } );
    };

    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
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

    return new DivideExpression( string, expressionList );
}

module.exports = DivideExpression;