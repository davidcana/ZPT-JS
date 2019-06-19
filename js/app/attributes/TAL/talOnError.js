/*
    TALOnError class
*/
"use strict";

var context = require( '../../context.js' );
var contentHelper = require( './contentHelper.js' );

var TALOnError = function( stringToApply, structureToApply ) {
    
    var string = stringToApply;
    var structure = false || structureToApply;
    
    var putToAutoDefineHelper = function( autoDefineHelper ){

        // Add onErrorVarName to the autoDefineHelper
        autoDefineHelper.put(
            context.getConf().onErrorVarName,
            string,
            true
        );
        
        // Add onErrorStructureVarName to the autoDefineHelper
        autoDefineHelper.put(
            context.getConf().onErrorStructureVarName,
            structure,
            false
        );
    };

    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return "TALOnError: " + string;
    };
    
    return {
        putToAutoDefineHelper: putToAutoDefineHelper,
        dependsOn: dependsOn,
        toString: toString,
        type: TALOnError.id
    };
};

TALOnError.id = 'tal:on-error';

TALOnError.build = function( string ) {

    return contentHelper.build( 
        'TALOnError',
        string,
        function( _string, _expression, _structure, _expressionString ){
            return new TALOnError( _expressionString, _structure );
        }
    );
};

module.exports = TALOnError;
