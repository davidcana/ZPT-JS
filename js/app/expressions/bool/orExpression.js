/*
    OrExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var OrExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            if ( evaluateHelper.evaluateBoolean( scope, expression ) ){
                return true;
            }
        }

        return false;
    };
    
    return {
        evaluate: evaluate
    };
};

OrExpression.removePrefix = true;
OrExpression.getPrefix = function() {
    return context.getConf().orExpression;
};
OrExpression.getId = OrExpression.getPrefix;

OrExpression.build = function( string ) {
    var boolHelper = require( './boolHelper.js' );
    
    var expressionList = boolHelper.build( string, 'Or' );

    return new OrExpression( expressionList );
}

module.exports = OrExpression;