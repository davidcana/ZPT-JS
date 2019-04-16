/*
    TALOnError class
*/
"use strict";

var context = require( '../../context.js' );

var TALOnError = function( stringToApply ) {
    
    var string = stringToApply;
    
    var putToTalDefineHelper = function( talDefineHelper ){

        // Add onErrorVarName to the talDefineHelper
        talDefineHelper.put(
            context.getConf().onErrorVarName,
            'nocall:' + string
        );
    };

    var toString = function(){
        return "TALOnError: " + string;
    };
    
    return {
        putToTalDefineHelper: putToTalDefineHelper,
        toString: toString
    };
};

TALOnError.id = 'tal:on-error';

TALOnError.build = function( string ) {
    return string? new TALOnError( string.trim() ): null;
};

module.exports = TALOnError;