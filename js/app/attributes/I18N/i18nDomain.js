/*
    I18NDomain class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var TALDefine = require( '../TAL/talDefine.js' );
var VariableExpression = require( '../../expressions/path/variableExpression.js' );
var $ = require( 'jquery' );

var I18NDomain = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var process = function( node, scope, stringDefine ){

        var currentExpressionList = expressionList;
        
        // Add the domains defined previously
        var previousValue = scope.get( context.getConf().i18nDomainVarName );
        if ( previousValue ) {
            var currentValueExpression = new VariableExpression( context.getConf().i18nDomainVarName );
            currentExpressionList = currentExpressionList.concat( currentValueExpression );
        }
        
        // Add i18nDomainVarName to scope
        updateThisTalDefineAttribute( currentExpressionList, node, stringDefine );
    };
    
    var updateThisTalDefineAttribute = function( i18nList, node, stringDefine ){

        var newVarName = context.getConf().i18nDomainVarName;
        var newVarValue = i18nList;

        TALDefine.updateAttribute( 
            node, 
            stringDefine, 
            newVarName, 
            newVarValue
        );
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

I18NDomain.id = 'i18n:domain';

I18NDomain.build = function( string ) {
    
    if ( ! string ){
        return null;
    }
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    var i18nList = [];

    // Add the domains in this tag
    var tokens = new ExpressionTokenizer( 
            string, 
            context.getConf().domainDelimiter, 
            true );

    while ( tokens.hasMoreTokens() ) {
        i18nList.push( 
            expressionBuilder.build( tokens.nextToken().trim() ) );
    }

    return new I18NDomain( string, i18nList );
};

module.exports = I18NDomain;