/*
    I18nLanguage class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../../expressions/evaluateHelper.js' );

var I18NLanguage = function( stringToApply, expressionToApply, htmlToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        // Evaluate
        var evaluated = evaluateHelper.evaluateToNotNull( scope, expression );
        
        // Add i18nLanguageVarName to scope
        scope.set( context.getConf().i18nLanguageVarName, evaluated, false );

        return true;
    };

    return {
        process: process
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
}

I18NLanguage.prototype.toString = function(){
    return string;
};

module.exports = I18NLanguage;