/*
    TALDefine class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var $ = require( 'jquery' );

var TALDefine = function( stringToApply, defineItemsToApply ) {
    
    var string = stringToApply;
    var defineItems = defineItemsToApply;
    
    var process = function( scope, node, forceGlobal ){
        
        // Update scope
        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            scope.set( 
                    defineItem.name, 
                    defineItem.expression.evaluate( scope ), 
                    forceGlobal || defineItem.global );
        }
    };
    
    var toString = function(){
        return "TALDefine: " + string;
    };
    
    return {
        process: process,
        toString: toString
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
    
    return new TALDefine( string, defineItems );
};

TALDefine.buildStringFromArray = function( value ) {
    
    var result = '';
    for ( var i = 0; i < value.length; ++i ){
        if ( i > 0 ){
            result += ' ';
        }
        result += value[ i ];
    }
    
    return '[' + result + ']';
};

TALDefine.buildString = function( name, _value, global ) {
    
    var value = $.isArray( _value )? TALDefine.buildStringFromArray( _value ): _value;
    var result = name + context.getConf().inDefineDelimiter + value;
    
    if ( global ){
        result += context.getConf().inDefineDelimiter + global;
    }

    return result;
};

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

TALDefine.updateAttribute = function( node, currentDefine, newVarName, newVarValue ){

    if ( ! newVarName ){
        return;
    }
    
    var tags = context.getTags();
    var nodeDefine = node.getAttribute( tags.talDefine );
    var newDefine = TALDefine.buildString( newVarName, newVarValue );
    var fullDefine = TALDefine.appendStrings( currentDefine, nodeDefine, newDefine );

    node.setAttribute( tags.talDefine, fullDefine );
};

module.exports = TALDefine;