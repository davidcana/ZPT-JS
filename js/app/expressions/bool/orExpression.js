/*
    OrExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var expressionsUtils = require( '../expressionsUtils.js' );

var OrExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
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

    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expressionList );
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

OrExpression.removePrefix = true;
OrExpression.getPrefix = function() {
    return context.getConf().orExpression;
};
OrExpression.getId = OrExpression.getPrefix;

OrExpression.build = function( string ) {
    var boolHelper = require( './boolHelper.js' );
    
    var expressionList = boolHelper.build( string, 'Or' );

    return new OrExpression( string, expressionList );
}

module.exports = OrExpression;
