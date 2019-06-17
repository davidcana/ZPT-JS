/*
    PathSegmentExpression class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../expressionTokenizer.js' );
var expressionsUtils = require( '../expressionsUtils.js' );
var evaluateHelper = require( '../evaluateHelper.js' );
var ArrayExpression = require( './arrayExpression.js' );
var StringLiteral = require( './literals/stringLiteral.js' );
var NumericLiteral = require( './literals/numericLiteral.js' );
var BooleanLiteral = require( './literals/booleanLiteral.js' );
var ListExpression = require( './listExpression.js' );
var FunctionExpression = require( './functionExpression.js' );
var VariableExpression = require( './variableExpression.js' );
var IndirectionExpression = require( './indirectionExpression.js' );
var MethodExpression = require( './methodExpression.js' );
var PropertyExpression = require( './propertyExpression.js' );

var PathSegmentExpression = function( stringToApply, itemsToApply ) {
    
    var string = stringToApply;
    var items = itemsToApply;
    
    var evaluate = function( scope ){
        
        var token = items[ 0 ];
        var result = token.evaluate( scope );
        for ( var i = 1; i < items.length; i++ ) {
            // Only last element can be null
            if ( result == null ) {
                throw 'Error evaluating "' + string + '": "'  + token + '" is null';
            }
            token = items[ i ];
            result = token.evaluate( scope, result );
        }
        
        return result;
    };
    
    var dependsOn = function(){
        return expressionsUtils.buildDependsOnList( items[ 0 ] );
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

PathSegmentExpression.build = function( string ) {
    
    var items = [];
    
    // Blank expression evaluates to blank string
    if ( string.length == 0 ) {
        items.push( 
            StringLiteral.build( '' ) );
        return items;
    }

    // Build first token
    var path = new ExpressionTokenizer( 
            string, 
            context.getConf().pathSegmentDelimiter, 
            false );
    var token = path.nextToken().trim();
    items.push(
            PathSegmentExpression.buildFirstPathToken( token ) );

    // Traverse the path
    while ( path.hasMoreTokens() ) {
        token = path.nextToken().trim();
        items.push(
            PathSegmentExpression.buildNextPathToken( token ) );
    }
    
    return new PathSegmentExpression( string, items );
}


PathSegmentExpression.buildFirstPathToken = function( t ){

    // Separate identifier from any array accessors
    var arrayData = ArrayExpression.buildArrayData( t );
    var arrayAccessor = arrayData? arrayData.arrayAccessor: undefined;
    var token = arrayData? arrayData.token: t;

    // First token must come from dictionary or be a literal

    // First see if it's a string literal
    var result = StringLiteral.build( token );

    // If it's not, try to see if it's a number
    if ( result === undefined ) {
        result = NumericLiteral.build( token );

        // Maybe it's a boolean literal
        if ( result === undefined ) {
            result = BooleanLiteral.build( token );

            // A list?
            if ( result === undefined ){
                result = ListExpression.build( token );

                // A function call?
                if ( result === undefined ) {
                    result = FunctionExpression.build( token );

                    // Must be an object in scope
                    if ( result === undefined ) {
                        result = VariableExpression.build( token );
                        
                        // Not recognized expression
                        if ( result === undefined ) {
                            throw 'Unknown expression: ' + token;
                        }
                    }
                }
            }
        }
    }

    if ( arrayAccessor !== undefined ) {
        result = ArrayExpression.build( result, arrayAccessor );
    }

    return result;
};

PathSegmentExpression.buildNextPathToken = function( t ){
    
    // Separate identifier from any array accessors
    var arrayData = ArrayExpression.buildArrayData( t );
    var arrayAccessor = arrayData? arrayData.arrayAccessor: undefined;
    var token = arrayData? arrayData.token: t;

    // Test for indirection
    var result = IndirectionExpression.build( token );
    
    // A method call?
    if ( result === undefined ) {
        result = MethodExpression.build( token );

        // A property
        if ( result === undefined ) {
            result = PropertyExpression.build( token );
        }
    }

    if ( arrayAccessor !== undefined ) {
        result = ArrayExpression.build( result, arrayAccessor );
    }

    return result;
};

module.exports = PathSegmentExpression;