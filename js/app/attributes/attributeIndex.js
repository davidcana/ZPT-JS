/* 
    attributeIndex singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );

module.exports = (function() {
    
    var map;
    var tags;
    
    var reset = function(){
        map = {};
        tags = context.getTags();
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
        
        if ( $.isPlainObject( item ) ){
            addObject( node, attributeInstance, item );
        } else if ( $.isArray( item ) ){
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
                nodeId: node.getAttribute( tags.id ),
                groupId: groupId
            }
        );
    };
    
    var getVarsList = function( varName ){
        return map[ varName ];
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
    
    return {
        add: add,
        getVarsList: getVarsList,
        remove: remove,
        reset: reset
    };
})();
