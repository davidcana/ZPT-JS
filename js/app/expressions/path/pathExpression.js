/*
    PathExpression class
*/
//var context = require( '../../context.js' );
//var ExpressionTokenizer = require( '../expressionTokenizer.js' );
//var StringLiteral = require( './literals/stringLiteral.js' );
//var PathSegmentExpression = require( './pathSegmentExpression.js' );
//var expressionsUtils = require( '../expressionsUtils.js' );
//var expressionBuilder = require( '../expressionBuilder.js' );
import { context } from '../../context.js';
import { ExpressionTokenizer } from '../expressionTokenizer.js';
import { StringLiteral } from './literals/stringLiteral.js';
import { PathSegmentExpression } from './pathSegmentExpression.js';
import { expressionsUtils } from '../expressionsUtils.js';
import { expressionBuilder } from '../expressionBuilder.js';

export const PathExpression = function( stringToApply, expressionListToApply ) {
    
    var string = stringToApply;
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        var exception = undefined;
        
        for ( var i = 0; i < expressionList.length; i++ ) {
            try {
                var expression = expressionList[ i ];
                var result = expression.evaluate( scope );
                if ( result != null ){
                    return result;
                }
            } catch( e ) {
                exception = e;
            }
        }
        
        if ( exception ) {
            throw exception;
        }
        
        return null;
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

PathExpression.removePrefix = false;
PathExpression.getPrefix = function() {
    return context.getConf().pathExpression;
};
PathExpression.getId = function() { 
    return 'path';
};

PathExpression.build = function( s ) {
    //var expressionBuilder = require( '../expressionBuilder.js' );
    
    var string = s.trim();
    
    // Blank expression evaluates to blank string
    if ( string.length === 0 ) {
        return StringLiteral.build( '' );
    }
    
    var segments = new ExpressionTokenizer( 
            string, 
            context.getConf().pathDelimiter, 
            false );

    // If there is only 1 must be a path segment
    if ( segments.countTokens() === 1 ) {
        return PathSegmentExpression.build( string );
    }

    // If there are more than 1 they can be any expression instance
    var expressionList = [];
    while ( segments.hasMoreTokens() ) {
        var nextToken = segments.nextToken();
        if ( ! nextToken ){
            throw 'Null token inside path expression: ' + string;
        }
        expressionList.push( 
            expressionBuilder.build( 
                nextToken
            ) 
        );
    }
    return new PathExpression( string, expressionList );
};

//module.exports = PathExpression;
