/*
    ExistsExpression class
*/
"use strict";

var context = require( '../context.js' );
var evaluateHelper = require( './evaluateHelper.js' );

var ExistsExpression = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        
        try {
            return evaluateHelper.evaluateBoolean( scope, expression );
        } catch ( e ){
            return false;
        }
    };

    return {
        evaluate: evaluate
    };
};

ExistsExpression.removePrefix = true;
ExistsExpression.getPrefix = function() {
    return context.getConf().existsExpression;
};
ExistsExpression.getId = ExistsExpression.getPrefix;

ExistsExpression.build = function( string ) {
    var expressionBuilder = require( './expressionBuilder.js' );
    
    var expression = expressionBuilder.build( string );
    return new ExistsExpression( string, expression );
}

ExistsExpression.prototype.toString = function(){
    return string;
};

module.exports = ExistsExpression;