/*
    ListExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );
var RangeExpression = require( './rangeExpression.js' );
var $ = require( 'jquery' );

var ListExpression = function( stringToApply, itemsToApply ) {
    
    var string = stringToApply;
    var items = itemsToApply;
    
    var evaluate = function( scope ){
        
        var result = [];
        
        for ( var i = 0; i < items.length; i++ ) {
            var expression = items[ i ];
            var evaluated = expression.evaluate( scope );
            
            if ( $.isArray( evaluated ) ){ 
                result = result.concat( evaluated );
            } else {
                result.push( evaluated );
            }
        }

        return result;
    };

    return {
        evaluate: evaluate
    };
};

ListExpression.build = function( s ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    if ( s.charAt( 0 ) !== '[' || s.charAt( s.length - 1 ) !==  ']' ) {
        return undefined;
    }
    
    var string = s.substring( 1, s.length - 1 );
    var items = [];
    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().expressionDelimiter, 
            true );

    while ( segments.hasMoreTokens() ) {
        var segment = segments.nextToken().trim();
        var range = RangeExpression.build( segment );

        items.push(
            range?
            range:
            expressionBuilder.build( segment ) );
    }

    return new ListExpression( string, items );
}

ListExpression.prototype.toString = function(){
    return string;
};

module.exports = ListExpression;