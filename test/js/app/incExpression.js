/*
    IncExpression class
*/
"use strict";

var context = require( '../../../js/app/context.js' );
var evaluateHelper = require( '../../../js/app/expressions/evaluateHelper.js' );

var IncExpression = function( varNameToApply ) {
    
    var varName = varNameToApply;
    
    var evaluate = function( scope ){
        
        var value = scope.get( varName );
        
        if ( ! evaluateHelper.isNumber( value ) ) {
            throw 'Error trying to inc number, not a number!';
        }
        
        scope.set( varName, ++value, true );
        
        return value;
    };
    
    return {
        evaluate: evaluate
    };
};

IncExpression.removePrefix = true;
IncExpression.getPrefix = function() {
    return '++' + context.getConf().expressionSuffix;
};
IncExpression.getId = IncExpression.getPrefix;

IncExpression.build = function( string ) {
    return new IncExpression( string.trim() );
}

module.exports = IncExpression;