/*
    ModExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var ModExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            scope,
            expressionList, 
            ModExpression.mathOperation, 
            function( total, value ){
                return total % value;
            } );
    };
    
    return {
        evaluate: evaluate
    };
};

ModExpression.removePrefix = true;
ModExpression.getPrefix = function() {
    return context.getConf().modExpression;
};
ModExpression.mathOperation = 'mod';
ModExpression.getId = ModExpression.mathOperation;

ModExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            ModExpression.mathOperation );

    return new ModExpression( expressionList );
}

module.exports = ModExpression;