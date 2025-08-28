/*
    I18nLanguage class
*/
//var context = require( '../../context.js' );
import { context } from '../../context.js';

export const I18NLanguage = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToAutoDefineHelper = function( autoDefineHelper ){

        // Add i18nLanguageVarName to the autoDefineHelper
        autoDefineHelper.put(
            context.getConf().i18nLanguageVarName,
            string
        );
    };
    
    var dependsOn = function(){
        return [];
    };
    
    var update = function(){
        // Nothing to do
    };
    
    var toString = function(){
        return "I18NLanguage: " + string;
    };
    
    return {
        putToAutoDefineHelper: putToAutoDefineHelper,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: I18NLanguage.id
    };
};

I18NLanguage.id = 'i18n:language';

I18NLanguage.build = function( string ) {
    return string? new I18NLanguage( string.trim() ): null;
};

//module.exports = I18NLanguage;
