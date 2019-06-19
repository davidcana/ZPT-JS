/*
    METALUseMacro class
*/
"use strict";

var context = require( '../../context.js' );
var Scope = require( '../../scopes/scope.js' );
var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
var TALDefine = require( '../TAL/talDefine.js' );
var resolver = require( '../../resolver.js' );
var $ = require( 'jquery' );

var METALUseMacro = function( stringToApply, macroExpressionToApply, defineToApply ) {
    
    var string = stringToApply;
    var macroExpression = macroExpressionToApply;
    var define = defineToApply;
    
    var process = function( scope, node, autoDefineHelper ){

        // Init some vars
        var macroKey = resolver.getMacroKey( macroExpression, scope );
        var tags = context.getTags();
        var newNode = resolver.getNode( macroKey, scope ); 
        
        // Hide use macro node
        node.style.display = 'none';

        // Remove style attribute to force showing the new node
        newNode.removeAttribute( 'style' );

        // Update define and autoDefine attributes of the new node
        updateNewNodeAttributes( macroKey, newNode, autoDefineHelper );
        
        // Fill slots
        fillSlots( scope, node, tags, newNode );

        // Add the macro node
        node.parentNode.insertBefore( newNode, node.nextSibling );
        
        return newNode;
    };
    
    var updateNewNodeAttributes = function( macroKey, newNode, autoDefineHelper ){

        // Update the talDefine attribute
        TALDefine.updateAttribute( newNode, define );
        
        // Update the talAutoDefine attribute
        var macroData = resolver.getMacroData( macroKey );
        if ( macroData.url ){
            autoDefineHelper.put( 
                context.getConf().externalMacroUrlVarName, 
                "'" + macroData.url + "'"
            );
            autoDefineHelper.updateNode( newNode );
        }
    };
    
    var fillSlots = function( scope, node, tags, newNode ){
        
        $( node ).find( "[" + resolver.filterSelector( tags.metalFillSlot ) + "]" ).each(
            
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
                    "[" + resolver.filterSelector( tags.metalDefineSlot ) + "='" + slotId + "']")[0];
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
    
    var dependsOn = function(){
        return [];
    };
    
    var toString = function(){
        return "METALUseMacro: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        toString: toString,
        type: METALUseMacro.id
    };
};

METALUseMacro.id = 'metal:use-macro';

METALUseMacro.build = function( string, stringDefine, scope ) {
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    return new METALUseMacro( 
            string,
            expressionBuilder.build( string.trim() ),
            stringDefine? stringDefine.trim(): undefined
    );
};

module.exports = METALUseMacro;