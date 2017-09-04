/*
    METALUseMacro class
*/
"use strict";

var context = require( '../../context.js' );
var Scope = require( '../../scope.js' );
var expressionBuilder = require( '../../expressions/expressionBuilder.js' );

var $ = require( 'jquery' );

var METALUseMacro = function( macroExpressionToApply, defineToApply ) {
    
    var macroExpression = macroExpressionToApply;
    var define = defineToApply;
    
    var process = function( scope, node ){

        // Init some vars
        var macroKey = scope.getResolver().getMacroKey( macroExpression, scope );
        var tags = context.getTags();
        var newNode = scope.getResolver().getNode( macroKey, scope ); 
        
        // Hide use macro node
        node.style.display = 'none';

        // Remove style attribute to force showing the new node
        newNode.removeAttribute( 'style' );

        // Set tal define
        updateTalDefineAttribute( scope, macroKey, tags, newNode );
        
        // Fill slots
        fillSlots( scope, node, tags, newNode );

        // Add the macro node
        node.parentNode.insertBefore( newNode, node.nextSibling );
    };

    var updateTalDefineAttribute = function( scope, macroKey, tags, newNode ){
        
        // Build define tag
        var fullDefine = undefined;
        var macroData = scope.getResolver().getMacroData( macroKey );
        if ( macroData.url ){
            var externalMacroUrlDefine = context.getConf().externalMacroUrlVarName + context.getConf().expressionDelimiter + "'" + macroData.url + "'";
            fullDefine = define? 
                define + context.getConf().defineDelimiter + context.getConf().expressionDelimiter + externalMacroUrlDefine: 
            externalMacroUrlDefine;
        } else {
            fullDefine = define;
        }

        // Copy talDefine attribute from use-macro tag to the macro tag
        if ( fullDefine ) {
            newNode.setAttribute( tags.talDefine, fullDefine );
        }
    };
    
    var fillSlots = function( scope, node, tags, newNode ){
        
        $( node ).find( "[" + tags.metalFillSlot + "]" ).each(
            
            function( index, value ) {
                
                var slotIdExpressionString = $( this ).attr( tags.metalFillSlot );
                var slotIdExpression = expressionBuilder.build( slotIdExpressionString );
                var slotId = slotIdExpression.evaluate( scope );
                //console.log( 'replacing ' + slotId + '...' );

                // Do nothing if slotIdExpression evaluates to false
                if ( ! slotId ){
                    return;
                }

                var slotContent = $( this )[0].cloneNode( true );
                var currentNode = $( newNode ).find(
                    "[" + tags.metalDefineSlot + "='" + slotId + "']")[0];
                if ( ! currentNode ){
                    throw 'Slot "' + slotId + '" in expression "' + slotIdExpressionString +'" not found!';
                }
                currentNode.parentNode.insertBefore( 
                    slotContent, 
                    currentNode.nextSibling );

                slotContent.removeAttribute( tags.metalFillSlot );
                currentNode.remove();
            }
        );
    };
    
    return {
        process: process
    };
};

METALUseMacro.id = 'metal:use-macro';

METALUseMacro.build = function( string, stringDefine, scope ) {
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new METALUseMacro( 
            expressionBuilder.build( string.trim() ),
            stringDefine? stringDefine.trim(): undefined );
}

module.exports = METALUseMacro;