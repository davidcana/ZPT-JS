/*
    InExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var $ = require( 'jquery' );

var InExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){
        var expression0 = expressionList[ 0 ];
        var evaluated0 = expression0.evaluate( scope );
        
        for ( var i = 1; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            var evaluated = expression.evaluate( scope );
            
            if ( $.isArray( evaluated ) ){ 
                for ( var j = 0; j < evaluated.length; j++ ) {
                    if ( evaluated0 == evaluated[ j ] ){
                        return true;
                    }
                }
                continue;
            }
            
            if ( evaluated0 == evaluated ){
                return true;
            }
        }
        
        return false;
    };
    
    return {
        evaluate: evaluate
    };
};

InExpression.removePrefix = true;
InExpression.getPrefix = function() {
    return context.getConf().inExpression;
};
InExpression.getId = InExpression.getPrefix;

InExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var string = s.trim();
    
    if ( string.length == 0 ) {
        throw 'In expression void.';
    }

    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            false );
    if ( segments.countTokens() == 1 ) {
        throw 'Only one element in in expression "' + string + '", please add at least one more.';
    }

    return new InExpression( 
        string,
        expressionBuilder.buildList( segments ) );
}

InExpression.prototype.toString = function(){
    return string;
};

module.exports = InExpression;