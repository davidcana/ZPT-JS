/*
    TALOnError class
*/
"use strict";

var context = require( '../../context.js' );

var TALOnError = function( expressionToApply ) {
    
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        scope.set( context.getConf().onErrorVarName, expression );
        return true;
    };

    return {
        process: process
    };
};

TALOnError.id = 'tal:on-error';

TALOnError.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALOnError( 
                expressionBuilder.build( string.trim() ) );
}

module.exports = TALOnError;