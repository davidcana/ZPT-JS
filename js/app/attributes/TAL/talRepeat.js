/*
    TALRepeat class
*/
"use strict";

var Loop = require( '../../parsers/loop.js' );

var TALRepeat = function( stringToApply, varNameToApply, expressionStringToApply ) {
//var TALRepeat = function( stringToApply, varNameToApply, expressionToApply ) {
    
    var string = stringToApply;
    var varName = varNameToApply;
    var expressionString = expressionStringToApply;
    //var expression = expressionToApply;
    
    var process = function( scope ){
        return new Loop( varName, expressionString, scope );
    };
    /*
    var process = function( scope ){
        
        var items = expression.evaluate( scope );
        var loop = new Loop( varName, items );
        
        return loop;
    };
    */
    
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

    //var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();
    var space = expressionString.indexOf( ' ' );
    if ( space == -1 ) {
        throw 'Bad repeat expression: ' + expressionString;
    }
    var varName = expressionString.substring( 0, space );
    var loopExpression = expressionString.substring( space + 1 );
    
    return new TALRepeat( string, varName, loopExpression );
    /*
    return new TALRepeat( 
                string,
                varName, 
                expressionBuilder.build( loopExpression ) 
    );*/
};

module.exports = TALRepeat;