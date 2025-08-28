/* 
    attributeIndex singleton class
*/
//var utils = require( '../utils.js' );
//var context = require( '../context.js' );
import { utils } from '../utils.js';
import { context } from '../context.js';

export const attributeIndex = (function() {
    
    var map;
    
    var reset = function(){
        map = {};
    };
    reset();
    
    var add = function( node, attributeInstance, scope ){
        
        addList(
            node,
            attributeInstance,
            attributeInstance.dependsOn( scope )
        );
    };
    
    var addList = function( node, attributeInstance, list, groupId ){
        
        for ( var i = 0; i < list.length; i++ ) {
            addAny( node, attributeInstance, list[ i ], groupId );
        }
    };
    var addObject = function( node, attributeInstance, item ){
        
        for ( var groupId in item ){
            addAny( node, attributeInstance, item[ groupId ], groupId );
        }
    };
    var addAny = function( node, attributeInstance, item, groupId ){
        
        if ( utils.isPlainObject( item ) ){
            addObject( node, attributeInstance, item );
        } else if ( Array.isArray( item ) ){
            addList( node, attributeInstance, item, groupId );
        } else {
            addVar( node, attributeInstance, item, groupId );
        }
    };
    /*
    var addVar = function( node, attributeInstance, varName, groupId  ){
        
        var list = map[ varName ];
        if ( ! list ){
            list = [];
            map[ varName ] = list;
        }

        list.push(
            {
                attributeInstance: attributeInstance,
                nodeId: node.getAttribute( context.getTags().id ),
                groupId: groupId
            }
        );
    };
    */
    var addVar = function( node, attributeInstance, varName, groupId  ){
        
        var list = map[ varName ];
        if ( ! list ){
            list = [];
            map[ varName ] = list;
        }
        
        var newItem = {
            attributeInstance: attributeInstance,
            nodeId: node.getAttribute( context.getTags().id ),
            groupId: groupId
        };
        
        //var index = list.findIndex( item => utils.deepEqual( item, newItem ) );
        var index = list.findIndex( 
            function( item ) { 
                return utils.deepEqual( item, newItem );
            }
        );
        if ( index === -1 ){
            list.push( newItem );
        } else {
            list[ index ] = newItem;
        }
    };
    
    var getVarsList = function( varName ){
        
        var items = map[ varName ];
        
        // Return an empty list if needed
        if ( items === undefined ){
            return [];
        }
        
        // Remove items with removed nodes
        cleanItems( items );
        
        // We must build another list to avoid sync errors
        var result = [];
        result = result.concat( items );
        return result;
    };
    
    //TODO findNodeById duplicated
    var findNodeById = function ( nodeId ) {
        
        return window.document.querySelector( 
            '[' + context.getTags().id + '="' + nodeId + '"]' 
        );
    };
    
    // Iterate through items and remove them when node does not exist in DOM
    var cleanItems = function( items ){
        
        var indexesToRemove = [];
        
        // Build list of items to remove
        for ( var i = 0; i < items.length; ++i ){
            var item = items[ i ];
            var node = findNodeById( item.nodeId );
            if ( ! node ){
                indexesToRemove.push( i );
            }
        }
        
        // Remove items
        for ( var j = indexesToRemove.length - 1; j >= 0 ; --j ){
            var indexToRemove = indexesToRemove[ j ];
            items.splice( indexToRemove, 1 );
        };
    };
    /*
    var removeVar = function( varName, nodeId ){
        
        var list = map[ varName ];

        var filtered = list.filter(
            function( value, index, arr ){
                return value.nodeId !== nodeId;
            }
        );

        map[ varName ] = filtered;
    };
    
    var removeVarFromNodes = function( varName, nodeIds ){
        
        var list = map[ varName ];

        var filtered = list.filter(
            function( value, index, arr ){
                return nodeIds.indexOf( value.nodeId ) === -1;
            }
        );

        if ( filtered.length === 0 ){
            delete map[ varName ];
        } else {
            map[ varName ] = filtered;
        }
        
    };
    
    var getAllNodeIds = function( target ){
        
        // Get the list
        var list = target.querySelectorAll( '[' + context.getTags().id + ']' );

        // Iterate the list
        var result = [];
        var nodeIdAttributeName = context.getTags().id;
        var node;
        var pos = 0;
        while ( node = list[ pos++ ] ) {
            result.push( 
                node.getAttribute( nodeIdAttributeName ) 
            );
        }
        
        return result;
    };
    
    var removeNode = function( node ){

        var nodeIds = getAllNodeIds( node );

        var nodeId = node.getAttribute( context.getTags().id );
        nodeIds.push( nodeId );
        
        for ( var varName in map ){
            removeVarFromNodes( varName, nodeIds );
        }
    };
    
    var removeMultipleNodes = function( nodeIds ){

        for ( var varName in map ){
            removeVarFromNodes( varName, nodeIds );
        }
    };
    */
    return {
        add: add,
        getVarsList: getVarsList,
        //removeVar: removeVar,
        //removeNode: removeNode,
        //removeMultipleNodes: removeMultipleNodes,
        reset: reset
    };
})();
