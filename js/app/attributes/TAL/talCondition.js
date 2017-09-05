/*
    TALCondition class
*/
"use strict";

var TALCondition = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node ){
        
        var result = expression.evaluate( scope );
        
        node.style.display = result ? '' : 'none';
        
        return result;
    };

    return {
        process: process
    };
};

TALCondition.id = 'tal:condition';

TALCondition.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new TALCondition( 
                string,
                expressionBuilder.build( string.trim() ) );
}

TALCondition.prototype.toString = function(){
    return string;
};

module.exports = TALCondition;