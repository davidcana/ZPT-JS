/*
    TALDefine class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );
var $ = require( 'jquery' );

var TALDefine = function( stringToApply, defineItemsToApply ) {
    
    var string = stringToApply;
    var defineItems = defineItemsToApply;
    
    var process = function( scope, forceGlobal ){
        
        // Update scope
        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            scope.set( 
                    defineItem.name, 
                    defineItem.nocall? defineItem.expression: defineItem.expression.evaluate( scope ), 
                    forceGlobal || defineItem.global,
                    defineItem.nocall,
                    defineItem.expression
            );
        }
    };
    
    var dependsOn = function(){
        return [];
    };
    /*
    var dependsOn = function(){

        var result = [];
        var object = {};

        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            if ( ! defineItem.nocall ){
                object[ defineItem.name ] = expressionsUtils.buildDependsOnList( defineItem.expression );
            }
        }
        result.push( object );

        return result;
    };
    */
    /*
    var dependsOn = function(){
        
        var result = [];
        
        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            if ( ! defineItem.nocall ){
                result = result.concat( 
                    expressionsUtils.buildDependsOnList( defineItem.expression )
                );
            }
        }

        return result;
    };
    */
    
    var toString = function(){
        return "TALDefine: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        toString: toString,
        type: TALDefine.id
    };
};

TALDefine.id = 'tal:define';

TALDefine.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );

    var defineItems = [];
    var expressionString = string.trim();
    var tokens = new ExpressionTokenizer( 
        expressionString, 
        context.getConf().defineDelimiter, 
        true );

    while ( tokens.hasMoreTokens() ) {
        var variable = tokens.nextToken().trim();
        var space = variable.indexOf( context.getConf().inDefineDelimiter );
        if ( space == -1 ) {
            throw 'Bad variable definition: ' + variable;
        }

        var nocall = false;
        var global = false;
        var currentToken = variable.substring( 0, space );
        var nextTokens = variable.substring( space + 1 ).trim();
        var tokenDone = false;
        do {
            var specialToken = false;
            if ( context.getConf().globalVariableExpressionPrefix === currentToken ){
                global = true;
                specialToken = true;
            } else if ( context.getConf().nocallVariableExpressionPrefix === currentToken ){
                nocall = true;  
                specialToken = true;
            } 
            
            if ( specialToken ){
                space = nextTokens.indexOf( context.getConf().inDefineDelimiter );
                currentToken = nextTokens.substring( 0, space );
                nextTokens = nextTokens.substring( space + 1 ).trim();
                
            } else {
                defineItems.push({
                    name: currentToken,
                    expression: expressionBuilder.build( nextTokens ),
                    global: global,
                    nocall: nocall
                });
                tokenDone = true;
            }

        } while( ! tokenDone && space != -1 );
    }

    return new TALDefine( string, defineItems );
};
/*
TALDefine.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var defineItems = [];
    var expressionString = string.trim();
    var tokens = new ExpressionTokenizer( 
            expressionString, 
            context.getConf().defineDelimiter, 
            true );

    while ( tokens.hasMoreTokens() ) {
        var variable = tokens.nextToken().trim();
        var space = variable.indexOf( context.getConf().inDefineDelimiter );
        if ( space == -1 ) {
            throw 'Bad variable definition: ' + variable;
        }

        var token1 = variable.substring( 0, space );
        var token2 = variable.substring( space + 1 ).trim();
        var global = context.getConf().globalVariableExpressionPrefix === token1;
        var name;
        var valueExpression;

        if ( ! global ) {
            name = token1;
            valueExpression = token2.trim();
        } else {
            space = token2.indexOf( context.getConf().inDefineDelimiter );
            name = token2.substring( 0, space );
            valueExpression = token2.substring( space + 1 ).trim();
        }

        defineItems.push({
            name: name,
            expression: expressionBuilder.build( valueExpression ),
            global: global
        });
    }
    
    return new TALDefine( string, defineItems );
};
*/

TALDefine.appendStrings = function() {
    
    var result = arguments[ 0 ];
    
    for ( var c = 1; c < arguments.length; ++c ){
        var string = arguments[ c ];
        if ( string ){
            result = result? result + context.getConf().defineDelimiter + string: string;
        }
    }
    
    return result;
};

TALDefine.updateAttribute = function( node, defineToAdd ){

    var tags = context.getTags();
    var nodeDefine = node.getAttribute( tags.talDefine );
    var fullDefine = TALDefine.appendStrings( defineToAdd, nodeDefine );

    if ( fullDefine ){
        node.setAttribute( tags.talDefine, fullDefine );
    }
};

module.exports = TALDefine;
