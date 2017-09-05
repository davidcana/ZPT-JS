/*
    TALOnError class
*/
"use strict";

var context = require( '../../context.js' );

var TALOnError = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
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
                string,
                expressionBuilder.build( string.trim() ) );
}

TALOnError.prototype.toString = function(){
    return string;
};

module.exports = TALOnError;