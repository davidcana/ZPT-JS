/*
    EqualsExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../expressionTokenizer.js' );
var expressionsUtils = require( '../expressionsUtils.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var EqualsExpression = function( stringToApply, argsToApply ) {
    
    var string = stringToApply;
    var args = argsToApply;
    
    var evaluate = function( scope ){
        var arg0 = args[ 0 ];
        var result0 = arg0.evaluate( scope );
        
        for ( var i = 1; i < args.length; i++ ) {
            var arg = args[ i ];
            var result = arg.evaluate( scope );
            if ( result0 != result ){
                return false;
            }
        }
        
        return true;
    };

    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( scope, args );
    };
    
    var toString = function(){
        return string;
    };

    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

EqualsExpression.removePrefix = true;
EqualsExpression.getPrefix = function() {
    return context.getConf().equalsExpression;
};
EqualsExpression.getId = EqualsExpression.getPrefix;

EqualsExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var string = s.trim();
    
    if ( string.length == 0 ) {
        throw 'Equals expression void.';
    }

    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false );
    if ( segments.countTokens() == 1 ) {
        throw 'Only one element in equals expression "' + string + '", please add at least one more.';
    }

    return new EqualsExpression( 
        string,
        expressionBuilder.buildList( segments ) );
}

module.exports = EqualsExpression;
