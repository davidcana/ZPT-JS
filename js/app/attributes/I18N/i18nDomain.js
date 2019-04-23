/*
    I18NDomain class
*/
"use strict";

var context = require( '../../context.js' );

var I18NDomain = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToAutoDefineHelper = function( scope, autoDefineHelper ){
        
        var newString = string;
        var conf = context.getConf();
        
        // Add the domains defined previously
        var previousValue = scope.get( conf.i18nDomainVarName );
        if ( previousValue ) {
            newString += conf.inDefineDelimiter + conf.i18nDomainVarName;
        }
        
        // Add brackets if not present
        if ( newString[ 0 ] != '[' ){
            newString = '[' + newString + ']'
        }
        
        // Add i18nDomainVarName to the autoDefineHelper
        autoDefineHelper.put(
            conf.i18nDomainVarName,
            newString
        );
    };

    var toString = function(){
        return string;
    };
    
    return {
        putToAutoDefineHelper: putToAutoDefineHelper,
        toString: toString
    };
};

I18NDomain.id = 'i18n:domain';

I18NDomain.build = function( string ) {
    return string? new I18NDomain( string.trim() ): null;
};

module.exports = I18NDomain;