/*
    AndExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var AndExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            if ( ! evaluateHelper.evaluateBoolean( scope, expression ) ){
                return false;
            }
        }

        return true;
    };
    
    return {
        evaluate: evaluate
    };
};

AndExpression.removePrefix = true;
AndExpression.getPrefix = function() {
    return context.getConf().andExpression;
};
AndExpression.getId = AndExpression.getPrefix;

AndExpression.build = function( string ) {
    var boolHelper = require( './boolHelper.js' );
    
    var expressionList = boolHelper.build( string, 'And' );

    return new AndExpression( string, expressionList );
}

AndExpression.prototype.toString = function(){
    return string;
};

module.exports = AndExpression;