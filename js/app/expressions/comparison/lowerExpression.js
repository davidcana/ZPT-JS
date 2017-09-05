/*
    LowerExpression class
*/
"use strict";

var context = require( '../../context.js' );
var comparisonHelper = require( './comparisonHelper.js' );

var LowerExpression = function( stringToApply, expression1ToApply, expression2ToApply ) {
    
    var string = stringToApply;
    var expression1 = expression1ToApply;
    var expression2 = expression2ToApply;
    
    var evaluate = function( scope ){
        var numbers = comparisonHelper.evaluate( scope, expression1, expression2 );
        return numbers.number1 < numbers.number2;
    };
    
    return {
        evaluate: evaluate
    };
};

LowerExpression.removePrefix = true;
LowerExpression.getPrefix = function() {
    return context.getConf().lowerExpression;
};
LowerExpression.getId = LowerExpression.getPrefix;

LowerExpression.build = function( string ) {
    
    var data = comparisonHelper.build( string, 'lower' );

    return new LowerExpression( string, data.expression1, data.expression2 );
}

LowerExpression.prototype.toString = function(){
    return string;
};

module.exports = LowerExpression;