/* 
    Class nodeRemover 
*/

import { context } from '../context.js';

export const nodeRemover = (function() {
    
    var tags = context.getTags();
    
    var removeGeneratedNodes = function( target ) {
        
        // Is multiroot?
        if ( Array.isArray( target ) ){ 
            // There are several roots
            
            var result = [];
            for ( var c = 0; c < target.length; c++ ) {
                result = result.concat( 
                    removeNodes( target[ c ] )
                );
            }
            return result;
        }
        
        // There is only one root
        return removeNodes( target );
    };
    
    var removeNodes = function( target ) {
        
        var result = [];
        
        result = result.concat( removeNodesByTag( target, tags.qdup ) );       // Remove all generated nodes (repeats)
        result = result.concat( removeNodesByTag( target, tags.metalMacro ) ); // Remove all generated nodes (macros)
        
        return result;
    };
    
    var removeNodesByTag = function( target, tag ){
        
        var list = target.querySelectorAll( "*[" + tag + "]" );
        return removeList( list );
    };
    
    var removeRelatedNodes = function( target ){
        
        var list = target.parentNode.querySelectorAll( 
            '[' + context.getTags().relatedId + '="' + target.getAttribute( context.getTags().id ) + '"]' 
        );
        return removeList( list );
    };
    
    var removeList = function( list ){

        var result = [];
        
        var node;
        var pos = 0;
        while ( node = list[ pos++ ] ) {
            // Add nodeId to result if needed
            var nodeId = getNodeId( node );
            if ( nodeId !== undefined ){
                result.push( nodeId );
            }
            
            // Add the nodeIds of its children
            addNodeIdsToList( node, result );
            
            // Remove node
            node.parentNode.removeChild( node );
        }
        
        return result;
    };
    
    var addNodeIdsToList = function( target, result ){
        
        // Get the nodes with data-id
        var nodeIdAttributeName = context.getTags().id;
        var list = target.querySelectorAll( '[' + nodeIdAttributeName + ']' );
        
        // Iterate the list
        var node;
        var pos = 0;
        while ( node = list[ pos++ ] ) {
            result.push( 
                node.getAttribute( nodeIdAttributeName ) 
            );
        }
    };
    
    var getNodeId = function( node ){
        
        var nodeIdAttributeName = context.getTags().id;
        
        return node.hasAttribute( nodeIdAttributeName )?
            node.getAttribute( nodeIdAttributeName ):
            undefined;
    };
    
    var removeNode = function( node ){
        var nodeId = getNodeId( node );
        var parentNode = node.parentNode;
        if ( parentNode ){
            parentNode.removeChild( node );
        }
        return nodeId;
    };
    
    var removeMultipleNodes = function( node, mustRemoveGeneratedNodes ){
        
        var result = removeRelatedNodes( node );
        
        if ( mustRemoveGeneratedNodes ){
            result = result.concat(
                removeGeneratedNodes( node )
            );
        }
        
        return result;
    };
    
    var self = {
        removeGeneratedNodes: removeGeneratedNodes,
        //removeRelatedNodes: removeRelatedNodes,
        removeNode: removeNode,
        removeMultipleNodes: removeMultipleNodes
    };
    
    return self;
})();
