/* 
    attributeIndex singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );

module.exports = (function() {
    
    var map = {};
    var tags = context.getTags();
    
    var add = function( node, attributeInstance ){

        var varsList = attributeInstance.dependsOn();
        
        for ( var i = 0; i < varsList.length; i++ ) {
            var varName = varsList[ i ];
            addVar( node, attributeInstance, varName );
        }
    };
    
    var addVar = function( node, attributeInstance, varName ){
        
        var list = map[ varName ];
        if ( ! list ){
            list = [];
            map[ varName ] = list;
        }
        
        list.push(
            {
                attributeInstance: attributeInstance,
                nodeId: node.getAttribute( tags.id )
            }
        );
    };
    
    var getVarsList = function( varName ){
        return map[ varName ];
    };
    
    return {
        add: add,
        getVarsList: getVarsList
    };
})();
