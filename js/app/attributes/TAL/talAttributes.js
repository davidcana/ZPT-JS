/*
    TALAttributes class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );
var expressionsUtils = require( '../../expressions/expressionsUtils.js' );

var $ = require( 'jquery' );

var TALAttributes = function( stringToApply, attributeItemsToApply ) {
    
    var string = stringToApply;
    var attributeItems = attributeItemsToApply;
    
    var process = function( scope, node, attributeName ){
        
        for ( var i = 0; i < attributeItems.length; i++ ) {
            var attributeItem = attributeItems[ i ];
            var name = attributeItem.name;
            
            if ( ! attributeName || name === attributeName ){
                var value = attributeItem.expression.evaluate( scope );

                if ( name ){
                    processSimpleAttributeItem( node, name, value );
                } else {
                    processMapAttributeItem( node, value );
                }
            }
        }
    };

    var processMapAttributeItem = function( node, map ){
    
        // Do nothing if map is null
        if ( ! map ){
            return;
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
        
        // Boolean attributes
        if ( context.isBooleanAttribute( name ) ){
            if ( value ){
                node.setAttribute( name, '' );
            } else {
                node.removeAttribute( name );
            }
            return;
        }
        
        // If value is undefined don't parser the attribute
        if ( value == undefined ) {
            return;
        }
            
        // Alt attributes
        if ( context.isAltAttribute( name ) ) {
            switch ( name ) {
            case "innerHTML":
                throw node; // should use "qtext"
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
            return;
        } 

        // Regular attributes
        node.setAttribute( name, value );
    };

    var dependsOn = function( scope ){

        var result = [];
        var object = {};
        
        for ( var i = 0; i < attributeItems.length; i++ ) {
            var attributeItem = attributeItems[ i ];
            object[ attributeItem.name ] = expressionsUtils.buildDependsOnList( undefined, scope, attributeItem.expression );
        }
        result.push( object );
        
        return result;
    };
    
    var update = function( parserUpdater, node, scope, indexItem ){
        process( scope, node, indexItem.groupId );
    };
    
    var toString = function(){
        return "TALAttributes: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALAttributes.id
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
};

module.exports = TALAttributes;