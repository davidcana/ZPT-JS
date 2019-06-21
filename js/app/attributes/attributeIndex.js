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
    
    var add = function( node, attributeInstance ){
        
        addList(
            node,
            attributeInstance,
            attributeInstance.dependsOn()
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
    /*
    var add = function( node, attributeInstance ){

        var varsList = attributeInstance.dependsOn();

        for ( var i = 0; i < varsList.length; i++ ) {
            var varName = varsList[ i ];
            addVar( node, attributeInstance, varName );
        }
    };
    */
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
    
    return {
        add: add,
        getVarsList: getVarsList,
        reset: reset
    };
})();
