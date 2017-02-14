/*
    TALRepeat class
*/
"use strict";

var context = require( '../../context.js' );
var Loop = require( '../../loop.js' );

var TALRepeat = function( varNameToApply, expressionToApply ) {
    
    var varName = varNameToApply;
    var expression = expressionToApply;
    
    var process = function( scope ){
        
        var fullName = context.getConf().repeatVarName;
        var items = expression.evaluate( scope );
        
        var loop = new Loop( fullName, varName, items );

        return loop;
    };

    return {
        process: process
    };
};

TALRepeat.id = 'tal:repeat';

TALRepeat.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();
    var space = expressionString.indexOf( ' ' );
    if ( space == -1 ) {
        throw 'Bad repeat expression: ' + expression;
    }
    var varName = expressionString.substring( 0, space );
    var loopExpression = expressionString.substring( space + 1 );
    
    return new TALRepeat( 
                varName, 
                expressionBuilder.build( loopExpression ) );
}

module.exports = TALRepeat;