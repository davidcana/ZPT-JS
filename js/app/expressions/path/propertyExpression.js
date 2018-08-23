/*
    PropertyExpression class
*/
"use strict";

var PropertyExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope, parent ){
        return parent[ name ];
    };
    
    var toString = function(){
        return name;
    };
    
    return {
        evaluate: evaluate,
        toString: toString
    };
};

PropertyExpression.build = function( string ) {
    return new PropertyExpression( string );
};

module.exports = PropertyExpression;