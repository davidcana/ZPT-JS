/* 
    attributeIndex singleton class
*/
"use strict";

var utils = require( '../utils.js' );
var context = require( '../context.js' );

module.exports = (function() {
    
    var map;
    //var tags;
    
    var reset = function(){
        map = {};
        //tags = context.getTags();
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
    
    var getVarsList = function( varName ){
        
        var items = map[ varName ];
        
        // Return an empty list if needed
        if ( items === undefined ){
            return [];
        }
        
        // We must build another list to avoid sync errors
        var result = [];
        result = result.concat( items );
        return result;
    };
    
    var remove = function( varName, nodeId ){

        var list = map[ varName ];

        var filtered = list.filter(
            function( value, index, arr ){
                return value.nodeId !== nodeId;
            }
        );

        map[ varName ] = filtered;
    };
    
    var removeMultiple = function( varName, nodeIds ){

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
            removeMultiple( varName, nodeIds );
        }
    };
    
    return {
        add: add,
        getVarsList: getVarsList,
        remove: remove,
        removeNode: removeNode,
        reset: reset
    };
})();
