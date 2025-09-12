/*
    ArrayExpression class
*/

import { expressionsUtils } from '../expressionsUtils.js';
import { expressionBuilder } from '../expressionBuilder.js';

export const ArrayExpression = function( arrayBaseToApply, indexesToApply ) {
    
    var arrayBase = arrayBaseToApply;
    var indexes = indexesToApply;
    
    var evaluate = function( scope ){
        
        // Evaluate and check array bases and indexes
        var evaluatedArrayBase = arrayBase.evaluate( scope );

        // Iterate indexes
        var result = evaluatedArrayBase;
        for ( var i = 0; i < indexes.length; i++ ) {
            
            // Get and evaluate index as integer
            var indexExpression = indexes[ i ];

            // Evaluate array access
            result = result[ indexExpression.evaluate( scope ) ];
        }
        
        return result;
    };
    
    var dependsOn = function( depsDataItem, scope ){
        
        // Build the arrayBaseDependsOn
        var arrayBaseDependsOn = expressionsUtils.buildDependsOnList( depsDataItem, scope, arrayBase );
        
        // This must be rare!
        if ( arrayBaseDependsOn.length === 0 ){
            return [];
        } else if ( arrayBaseDependsOn.length > 1 ){
            return expressionsUtils.buildDependsOnList( depsDataItem, scope, arrayBase, indexes );
        }
        
        // Join all together
        var dep = arrayBaseDependsOn[ 0 ];
        for ( var i = 0; i < indexes.length; ++i ){
            var indexExpression = indexes[ i ];
            var indexEvaluated = indexExpression.evaluate( scope );
            dep += '[' + indexEvaluated + ']';
        }
        
        return [ dep ];
    };
    
    var toString = function(){
        return arrayBase + '[' + indexes + ']';
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

ArrayExpression.build = function( arrayBase, accessor ) {
    
    var indexes = [];
    
    var done = false;
    while ( ! done ){

        // Array accessor must begin and end with brackets
        var close = accessor.indexOf( ']' );
        if ( accessor.charAt( 0 ) !== '[' || close === -1 ) {
            throw 'Bad array accessor: '  + accessor;
        }

        // Get index and add to indexes
        var index = expressionBuilder.build( 
                accessor.substring( 1, close ) 
        );
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

ArrayExpression.buildArrayData = function( token ) {
    
    var bracket = ArrayExpression.findArrayAccessor( token );
    
    if ( bracket <= 0 ) {
        return undefined;
    }
    
    return {
        arrayAccessor: token.substring( bracket ).trim(),
        token: token.substring( 0, bracket ).trim()
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
            if ( ch === ')' ) {
                parenDepth--;
                if ( parenDepth === 0 ) {
                    state = SCANNING;
                }
            } else if ( ch === '(' ) {
                parenDepth++;
            }
            break;

        case IN_QUOTE:
            if ( ch === '\'' ) {
                state = SCANNING;
            }
            break;

        case SCANNING:
            if ( ch === '\'' ) {
                state = IN_QUOTE;
            } else if ( ch === '(' ) {
                parenDepth++;
                state = IN_PAREN;
            } else if ( ch === '[' ) {
                return i;
            }
        }
    }

    return -1;
};

