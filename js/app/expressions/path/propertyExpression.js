/*
    PropertyExpression class
*/
"use strict";

var PropertyExpression = function( nameToApply ) {
    
    var name = nameToApply;
    
    var evaluate = function( scope, parent ){
        return parent[ name ];
    };

    return {
        evaluate: evaluate
    };
};

PropertyExpression.build = function( string ) {
    return new PropertyExpression( string );
}

module.exports = PropertyExpression;