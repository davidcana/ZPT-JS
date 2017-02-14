/*
    TALDefine class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );

var TALDefine = function( defineItemsToApply ) {
    
    var defineItems = defineItemsToApply;
    
    var process = function( scope, node ){
        
        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            scope.set( 
                    defineItem.name, 
                    defineItem.expression.evaluate( scope ), 
                    defineItem.global );
        }
    };

    return {
        process: process
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
    
    return new TALDefine( defineItems );
}

module.exports = TALDefine;