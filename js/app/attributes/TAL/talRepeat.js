/*
    TALRepeat class
*/
"use strict";

var Loop = require( '../../parsers/loop.js' );

var TALRepeat = function( stringToApply, varNameToApply, expressionStringToApply ) {
    
    var string = stringToApply;
    var varName = varNameToApply;
    var expressionString = expressionStringToApply;
    
    var process = function( scope ){
        return new Loop( varName, expressionString, scope );
    };
    
    var toString = function(){
        return "TALRepeat: " + string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

TALRepeat.id = 'tal:repeat';

TALRepeat.build = function( string ) {
    
    var expressionString = string.trim();
    var space = expressionString.indexOf( ' ' );
    if ( space == -1 ) {
        throw 'Bad repeat expression: ' + expressionString;
    }
    var varName = expressionString.substring( 0, space );
    var loopExpression = expressionString.substring( space + 1 );
    
    return new TALRepeat( string, varName, loopExpression );
};

module.exports = TALRepeat;
