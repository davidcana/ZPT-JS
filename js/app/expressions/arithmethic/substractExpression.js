/*
    SubstractExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var SubstractExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
            scope,
            expressionList, 
            SubstractExpression.mathOperation, 
            function( total, value ){
                return total - value;
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

SubstractExpression.removePrefix = true;
SubstractExpression.getPrefix = function() {
    return context.getConf().subExpression;
};
SubstractExpression.mathOperation = 'substract';
SubstractExpression.getId = SubstractExpression.mathOperation;

SubstractExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            SubstractExpression.mathOperation );

    return new SubstractExpression( string, expressionList );
}

module.exports = SubstractExpression;