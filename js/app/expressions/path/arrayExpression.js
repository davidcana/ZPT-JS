/*
    ArrayExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var $ = require( 'jquery' );

var ArrayExpression = function( arrayBaseToApply, indexesToApply ) {
    
    var arrayBase = arrayBaseToApply;
	var indexes = indexesToApply;
    
    var evaluate = function( scope ){
        
        // Evaluate and check array bases and indexes
        var evaluatedArrayBase = arrayBase.evaluate( scope );
        var evaluatedIndexes = evaluateHelper.evaluateExpressionList( indexes );

        // Iterate indexes
        var result = evaluatedArrayBase;
        for ( var i = 0; i < indexes.length; i++ ) {
            
            // Array accessor must operate on an array
            if( ! $.isArray( result ) ) {
                throw arrayBase + ' is not an array';
            }
            
            // Get and evaluate index as integer
            var indexExpression = indexes[ i ];
            var evaluatedIndex = evaluateHelper.evaluateInteger(
                scope,
                indexExpression,
                'Array index must be an integer' );

            // Evaluate array access
            var result = result[ evaluatedIndex ];
        }
        
        return result;
    };

    return {
        evaluate: evaluate
    };
};

ArrayExpression.build = function( arrayBase, accessor ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var indexes = [];
    
    var done = false;
    while ( ! done ){

        // Array accessor must begin and end with brackets
        var close = accessor.indexOf( ']' );
        if ( accessor.charAt( 0 ) != '[' || close == -1 ) {
            throw "Bad array accessor for " + token + ": "  + accessor;
        }

        // Get index and add to indexes
        var index = expressionBuilder.build( 
                accessor.substring( 1, close ) );
        indexes.push( index );

        // continue processing array access for multidimensional arrays
        close++;
        if ( accessor.length > close ) {
            accessor = accessor.substring( close );
        } else {
            done = true;
        }
    }
    
    return new ArrayExpression( arrayBase, indexes );
};

ArrayExpression.buildAccessor = function( accessor ) {
    
    // Array accessor must begin and end with brackets
    var close = accessor.indexOf( ']' );
    if ( accessor.charAt( 0 ) != '[' || close == -1 ) {
        throw 'Bad array accessor for ' + token + ': '  + accessor;
    }

    var index = accessor.substring( 1, close );

    // Continue evaluating array access for multidimensional arrays
    close++;
    if ( accessor.length > close ) {
        token += accessor.substring( 0, close );
        accessor = accessor.substring( close );
    }

    return new ArrayExpression( arrayBase, indexes );
};

ArrayExpression.buildArrayData = function( token ) {
    
    var bracket = ArrayExpression.findArrayAccessor( token );
    
    if ( bracket <= 0 ) {
        return undefined;
    }
    
    return {
        arrayAccessor : token.substring( bracket ).trim(),
        token : token.substring( 0, bracket ).trim()
    };
};

ArrayExpression.findArrayAccessor = function( token ) {
    var SCANNING = 0;
    var IN_PAREN = 1;
    var IN_QUOTE = 2;

    var length = token.length;
    var state = SCANNING;
    var parenDepth = 0;
    for ( var i = 0; i < length; i++ ) {
        var ch = token.charAt( i );
        switch( state ) {
        case IN_PAREN:
            if ( ch == ')' ) {
                parenDepth--;
                if ( parenDepth == 0 ) {
                    state = SCANNING;
                }
            }
            else if ( ch == '(' ) {
                parenDepth++;
            }
            break;

        case IN_QUOTE:
            if ( ch == '\'' ) {
                state = SCANNING;
            }
            break;

        case SCANNING:
            if ( ch == '\'' ) {
                state = IN_QUOTE;
            }
            else if ( ch == '(' ) {
                parenDepth++;
                state = IN_PAREN;
            }
            else if ( ch == '[' ) {
                return i;
            }
        }
    }

    return -1;
};

module.exports = ArrayExpression;