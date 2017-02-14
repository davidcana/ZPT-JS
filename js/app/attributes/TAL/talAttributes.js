/*
    TALAttributes class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );

// Attributes which don't support setAttribute()
var altAttr = {
    className : 1,
    "class" : 1,
    innerHTML : 1,
    style : 1,
    src : 1,
    href : 1,
    id : 1,
    value : 1,
    checked : 1,
    selected : 1,
    label : 1,
    htmlFor : 1,
    text : 1,
    title : 1,
    disabled : 1
};

var TALAttributes = function( attributeItemsToApply ) {
    
    var attributeItems = attributeItemsToApply;
    
    var process = function( scope, node ){
        
        for ( var i = 0; i < attributeItems.length; i++ ) {
            var attributeItem = attributeItems[ i ];
            var name = attributeItem.name;
            var value = attributeItem.expression.evaluate( scope );
            
            if ( value != undefined ) {
                if ( altAttr[ name ] ) {
                    switch ( name ) {
                    case "innerHTML":
                        throw node; // should use "qtext"
                    case "disabled":
                    case "checked":
                    case "selected":
                        node[ name ] = !!value;
                        break;
                    case "style":
                        node.style.cssText = value;
                        break;
                    /*
                    case "text":
                        node[ querySelectorAll ? name : innerText ] = value;
                        break; // option.text unstable in IE
                    */
                    case "class":
                        name = "className";
                    default:
                        node[ name ] = value;
                    }
                } else {
                    node.setAttribute( name, value );
                }
            }
        }
    };

    return {
        process: process
    };
};

TALAttributes.id = 'tal:attributes';

TALAttributes.build = function( string ) {

    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var attributeItems = [];
    var expressionString = string.trim();
    var tokens = new ExpressionTokenizer( 
            expressionString, 
            context.getConf().attributeDelimiter, 
            true );

    while ( tokens.hasMoreTokens() ) {
        var attribute = tokens.nextToken().trim();
        var space = attribute.indexOf( context.getConf().inAttributeDelimiter );
        if ( space == -1 ) {
            throw 'Bad attributes expression: ' + attribute;
        }
        var name = attribute.substring( 0, space );
        var valueExpression = attribute.substring( space + 1 ).trim();

        attributeItems.push({
            name: name,
            expression: expressionBuilder.build( valueExpression )
        });
    }
    
    return new TALAttributes( attributeItems );
}

module.exports = TALAttributes;