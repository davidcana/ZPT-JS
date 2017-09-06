/*
    AddExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var AddExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            string,
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

    return new AddExpression( string, expressionList );
}

AddExpression.prototype.toString = function(){
    return string;
};

module.exports = AddExpression;