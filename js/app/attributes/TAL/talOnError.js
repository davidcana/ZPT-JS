/*
    TALOnError class
*/
"use strict";

var context = require( '../../context.js' );

var TALOnError = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToAutoDefineHelper = function( autoDefineHelper ){

        // Add onErrorVarName to the autoDefineHelper
        autoDefineHelper.put(
            context.getConf().onErrorVarName,
            string,
            true
        );
    };

    var toString = function(){
        return "TALOnError: " + string;
    };
    
    return {
        putToAutoDefineHelper: putToAutoDefineHelper,
        toString: toString
    };
};

TALOnError.id = 'tal:on-error';

TALOnError.build = function( string ) {
    return string? new TALOnError( string.trim() ): null;
};

module.exports = TALOnError;