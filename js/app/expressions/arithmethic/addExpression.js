/*
    AddExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var AddExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            scope,
            expressionList, 
            AddExpression.mathOperation, 
            function( total, value ){
                return total + value;
            } );
    };
    
    return {
        evaluate: evaluate
    };
};

AddExpression.removePrefix = true;
AddExpression.getPrefix = function() {
    return context.getConf().addExpression;
};
AddExpression.mathOperation = 'add';
AddExpression.getId = AddExpression.mathOperation;

AddExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            AddExpression.mathOperation );

    return new AddExpression( expressionList );
}

module.exports = AddExpression;