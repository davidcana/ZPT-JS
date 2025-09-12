/*
    METALUseMacro class
*/

import { context } from '../../context.js';
import { expressionBuilder } from '../../expressions/expressionBuilder.js';
import { expressionsUtils } from '../../expressions/expressionsUtils.js';
import { attributeIndex } from '../attributeIndex.js';
import { attributeCache } from '../../cache/attributeCache.js';
import { TALDefine } from '../TAL/talDefine.js';
import { METALFillSlot } from './metalFillSlot.js';
import { resolver } from '../../resolver.js';

export const METALUseMacro = function( stringToApply, macroExpressionToApply, defineToApply ) {
    
    var string = stringToApply;
    var macroExpression = macroExpressionToApply;
    var define = defineToApply;
    
    var process = function( scope, node, autoDefineHelper, indexExpressions ){

        // Init some vars
        var macroKey = resolver.getMacroKey( macroExpression, scope );
        var tags = context.getTags();
        var newNode = resolver.getNode( macroKey, scope ); 
        
        // Hide use macro node
        node.style.display = 'none';

        // Remove style attribute to force showing the new node
        newNode.removeAttribute( 'style' );

        // Update define and autoDefine attributes of the new node
        updateNewNodeAttributes( macroKey, newNode, autoDefineHelper, tags, node, indexExpressions );
        
        // Fill slots
        fillSlots( scope, node, tags, newNode, indexExpressions );

        // Add the macro node
        node.parentNode.insertBefore( newNode, node.nextSibling );
        
        return newNode;
    };
    
    var updateNewNodeAttributes = function( macroKey, newNode, autoDefineHelper, tags, node, indexExpressions ){

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
        
        // Set related id attribute if needed
        if ( indexExpressions ){
            newNode.setAttribute( 
                tags.relatedId, 
                node.getAttribute( tags.id ) 
            );
        }
    };
    
    var fillSlots = function( scope, node, tags, newNode, indexExpressions ){
        
        var list = node.querySelectorAll( 
            "[" + resolver.filterSelector( tags.metalFillSlot ) + "]"
        );
        var element;
        var pos = 0;
        while ( element = list[ pos++ ] ) {
            var slotIdExpressionString = element.getAttribute( tags.metalFillSlot );
            var slotIdExpression = expressionBuilder.build( slotIdExpressionString );
            var slotId = slotIdExpression.evaluate( scope );

            // Index fill slot element
            if ( indexExpressions ){
                var metalFillSlot = attributeCache.getByAttributeClass( 
                    METALFillSlot, 
                    slotIdExpressionString, 
                    element,
                    indexExpressions,
                    scope,
                    function(){
                        return METALFillSlot.build( slotIdExpressionString, node );
                    }
                );
                attributeIndex.add( element, metalFillSlot, scope );   
            }

            // Do nothing if slotIdExpression evaluates to false
            if ( ! slotId ){
                return;
            }

            var slotContent = element.cloneNode( true );
            var currentNode = newNode.querySelector( 
                "[" + resolver.filterSelector( tags.metalDefineSlot ) + "='" + slotId + "']"
            );
            if ( ! currentNode ){
                throw 'Slot "' + slotId + '" in expression "' + slotIdExpressionString +'" not found!';
            }
            currentNode.parentNode.insertBefore( 
                slotContent, 
                currentNode.nextSibling
            );
            slotContent.removeAttribute( tags.metalFillSlot );
            slotContent.setAttribute( tags.id, context.nextExpressionCounter() ); // Set a new id attribute to avoid id conflicts
            currentNode.remove();
        }
    };
    
    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( undefined, scope, macroExpression );
    };
    
    var update = function( parserUpdater, node ){
        parserUpdater.updateNode( node );
    };
    
    var toString = function(){
        return "METALUseMacro: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: METALUseMacro.id
    };
};

METALUseMacro.id = 'metal:use-macro';

METALUseMacro.build = function( string, stringDefine ) {
    
    return new METALUseMacro( 
            string,
            expressionBuilder.build( string.trim() ),
            stringDefine? stringDefine.trim(): undefined
    );
};
