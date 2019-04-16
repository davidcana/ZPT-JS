/*
    I18NDomain class
*/
"use strict";

var context = require( '../../context.js' );

var I18NDomain = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToTalDefineHelper = function( scope, talDefineHelper ){
        
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
        
        // Add i18nDomainVarName to the talDefineHelper
        talDefineHelper.put(
            conf.i18nDomainVarName,
            newString
        );
    };

    var toString = function(){
        return string;
    };
    
    return {
        putToTalDefineHelper: putToTalDefineHelper,
        toString: toString
    };
};

I18NDomain.id = 'i18n:domain';

I18NDomain.build = function( string ) {
    return string? new I18NDomain( string ): null;
};

module.exports = I18NDomain;