/* 
    Class NodeRemover 
*/
"use strict";

var context = require( '../context.js' );

module.exports = (function() {
    
    var tags = context.getTags();
    
    var removeGeneratedNodes = function( target ) {
        
        // Is multiroot?
        if ( Array.isArray( target ) ){ 
            // There are several roots
            for ( var c = 0; c < target.length; c++ ) {
                removeNodes( target[ c ] );
            }
        } else {
            // There is only one root
            removeNodes( target );
        }
    };
    
    var removeNodes = function( target ) {
        
        removeNodesByTag( target, tags.qdup );       // Remove all generated nodes (repeats)
        removeNodesByTag( target, tags.metalMacro ); // Remove all generated nodes (macros)
    };
    
    var removeNodesByTag = function( target, tag ){
        
        var list = target.querySelectorAll( "*[" + tag + "]" );
        removeList( list );
    };
    
    var removeRelatedNodes = function( target ){
        
        var list = target.parentNode.querySelectorAll( 
            '[' + context.getTags().relatedId + '="' + target.getAttribute( context.getTags().id ) + '"]' 
        );
        removeList( list );
    };
    
    var removeList = function( list ){

        var node;
        var pos = 0;
        while ( node = list[ pos++ ] ) {
            node.parentNode.removeChild( node );
        }
    };
    
    var removeNode = function( node ){
        node.parentNode.removeChild( node );
    };
    
    var self = {
        removeGeneratedNodes: removeGeneratedNodes,
        removeRelatedNodes: removeRelatedNodes,
        removeNode: removeNode
    };
    
    return self;
})();
