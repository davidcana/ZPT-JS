/*
    I18nLanguage class
*/
"use strict";

var context = require( '../../context.js' );

var I18NLanguage = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToTalDefineHelper = function( talDefineHelper ){

        // Add i18nLanguageVarName to the talDefineHelper
        talDefineHelper.put(
            context.getConf().i18nLanguageVarName,
            string
        );
    };
    
    var toString = function(){
        return "I18NLanguage: " + string;
    };
    
    return {
        putToTalDefineHelper: putToTalDefineHelper,
        toString: toString
    };
};

I18NLanguage.id = 'i18n:language';

I18NLanguage.build = function( string ) {
    return string? new I18NLanguage( string ): null;
};

module.exports = I18NLanguage;