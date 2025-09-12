/*
    StringExpression class
*/

import { context } from '../context.js';
import { StringLiteral } from './path/literals/stringLiteral.js';
import { PathExpression } from './path/pathExpression.js';
import { expressionsUtils } from './expressionsUtils.js';

export const StringExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){
        
        var result = '';
        
        for ( var i = 0; i < expressionList.length; i++ ) {
            var expression = expressionList[ i ];
            result += expression.evaluate( scope );
        }
        
        return result;
    };

    var dependsOn = function( depsDataItem, scope ){
        return expressionsUtils.buildDependsOnList( depsDataItem, scope, expressionList );
    };
    
    var toString = function(){
        return string;
    };
    
    return {
        evaluate: evaluate,
        dependsOn: dependsOn,
        toString: toString
    };
};

StringExpression.removePrefix = true;
StringExpression.getPrefix = function() {
    return context.getConf().stringExpression;
};
StringExpression.getId = StringExpression.getPrefix;

StringExpression.build = function( string ) {
    var STATE_SCANNING = 0;
    var STATE_AT_DOLLAR = 1;
    var STATE_IN_EXPRESSION = 2;
    var STATE_IN_BRACKETED_EXPRESSION = 3;

    var expressionList = [];
    var literal = '';
    var subexpression = '';
    var state = STATE_SCANNING;

    for ( var i = 0; i < string.length; i++ ) {
        var ch = string.charAt( i );

        switch ( state ) {
                
        // In the string part of the expression
        case STATE_SCANNING:
            // Found a dollar sign
            if ( ch === '$' ) {
                state = STATE_AT_DOLLAR;
                
            // Just keep appending to buffer
            } else {
                literal += ch;
            }
            break;

        // Next character after dollar sign
        case STATE_AT_DOLLAR:
            // An escaped dollar sign
            if ( ch === '$' ) {
                literal += '$';
                state = STATE_SCANNING;
                
            // Beginning of a bracketed expression
            } else if ( ch === '{' ) {
                // Reset subexpression and change state
                subexpression = '';
                state = STATE_IN_BRACKETED_EXPRESSION;

                // Add literal and reset it if needed
                if ( literal ){
                    expressionList.push( 
                            new StringLiteral( literal ) 
                    );
                    literal = '';
                }
                
            // Beginning of a non bracketed expression
            } else {
                subexpression += ch;
                state = STATE_IN_EXPRESSION;
                
                // Add literal and reset it if needed
                if ( literal ){
                    expressionList.push( 
                            new StringLiteral( literal )
                    );
                    literal = '';
                }
            }
            break;

        // In subexpression
        case STATE_IN_BRACKETED_EXPRESSION:
        case STATE_IN_EXPRESSION:
            // Check for end
            if ( ( state === STATE_IN_BRACKETED_EXPRESSION && ch === '}' )
                    || ( state === STATE_IN_EXPRESSION && ch == ' ' ) ) {
                expressionList.push( 
                        PathExpression.build( subexpression ) 
                );

                if ( state === STATE_IN_EXPRESSION ) {
                    literal += ch;
                }
                state = STATE_SCANNING;
                
            // Keep appending to subexpression
            } else {
                subexpression += ch;
            }
        }
    }

    // Ended in unclosed bracket
    if ( state === STATE_IN_BRACKETED_EXPRESSION ) {
        throw 'Unclosed left curly brace: ' + string;
        
    // Ended at expression
    } else if ( state == STATE_IN_EXPRESSION ) {
        expressionList.push( 
                PathExpression.build( subexpression ) 
        );
    }

    if ( literal ){
        expressionList.push( 
                new StringLiteral( literal ) 
        );
    }

    return new StringExpression( string, expressionList );
};

