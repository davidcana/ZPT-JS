/*
    TALAttributes class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressionTokenizer.js' );

var $ = require( 'jquery' );

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
var booleanAttr = {
    checked : 1,
    compact : 1,
    declare : 1,
    defer : 1,
    disabled : 1,
    ismap : 1,
    multiple : 1,
    nohref : 1,
    noresize : 1,
    noshade : 1,
    nowrap : 1,
    readonly : 1,
    selected : 1
};

var TALAttributes = function( stringToApply, attributeItemsToApply ) {
    
    var string = stringToApply;
    var attributeItems = attributeItemsToApply;
    
    var process = function( scope, node ){
        
        for ( var i = 0; i < attributeItems.length; i++ ) {
            var attributeItem = attributeItems[ i ];
            var name = attributeItem.name;
            var value = attributeItem.expression.evaluate( scope );
            
            if ( name ){
                processSimpleAttributeItem( node, name, value );
            } else {
                processMapAttributeItem( node, value );
            }
        }
    };

    var processMapAttributeItem = function( node, map ){
    
        if ( ! map ){
            throw 'Invalid attribute: undefined value. Object expected.';
        }
        
        if ( ! $.isPlainObject( map ) ){
            throw 'Invalid attribute value: "' + map + '". Object expected.';
        }
        
        for ( var name in map ){
            var value = map[ name ];
            processSimpleAttributeItem( node, name, value );
        }
    };
    
    var processSimpleAttributeItem = function( node, name, value ){
        
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
            //throw 'Bad attributes expression: ' + attribute;
            attributeItems.push({
                name: undefined,
                expression: expressionBuilder.build( attribute )
            });
        }
        var name = attribute.substring( 0, space );
        var valueExpression = attribute.substring( space + 1 ).trim();

        attributeItems.push({
            name: name,
            expression: expressionBuilder.build( valueExpression )
        });
    }
    
    return new TALAttributes( string, attributeItems );
}

TALAttributes.prototype.toString = function(){
    return string;
};

module.exports = TALAttributes;