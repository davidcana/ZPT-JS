/*
    I18nLanguage class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
//var TALDefine = require( '../TAL/talDefine.js' );

var I18NLanguage = function( stringToApply, expressionToApply, htmlToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( node, scope, stringDefine ){
        
        // Evaluate
        var evaluated = evaluateHelper.evaluateToNotNull( scope, expression );
        
        // Add i18nLanguageVarName to scope
        scope.set( context.getConf().i18nLanguageVarName, evaluated, false );

        return true;
    };
    /*
    var updateThisTalDefineAttribute = function( expression, node, stringDefine ){

        var newVarName = context.getConf().i18nLanguageVarName;
        var newVarValue = expression;

        TALDefine.updateAttribute( 
            node, 
            stringDefine, 
            newVarName, 
            newVarValue
        );
    };
    */
    var toString = function(){
        return "I18NLanguage: " + string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

I18NLanguage.id = 'i18n:language';

I18NLanguage.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();

    if ( ! expressionString ){
        throw 'I18NLanguage expression void.';
    }
    
    return new I18NLanguage( 
                string,
                expressionBuilder.build( expressionString ) );
};

module.exports = I18NLanguage;