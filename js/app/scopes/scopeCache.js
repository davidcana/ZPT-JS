/* 
    scopeCache singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var resolver = require( '../resolver.js' );
var Scope = require( './scope.js' );

module.exports = (function() {
    
    var cache;
    var c;
    
    var reset = function() {
        cache = {};
        c = 0;
    };
    
    var put = function( scope, node ) {

        // Get the key
        var key = ++c;
        
        // Put a copy of scope into the cache
        var newScope = $.extend( true, {}, scope );
        cache[ key ] = newScope;
        
        // Save the key of the scope as an attribute of the node
        node.setAttribute( getScopeKeyTag(), key );
    };

    var get = function( node, dictionary ) {
        
        //return new Scope( dictionary );
        
        // Return a new scope if node is the body
        /*
        if ( node.nodeName == 'BODY'){
            return new Scope( dictionary );
        }
        */
        
        var scope = undefined;
        
        // Search scope in cache
        var key = getKey( node );
        if ( key !== undefined ){
            scope = cache[ key ];
        } else {
            scope = new Scope( dictionary );
        }
        
        return scope;
    };
    
    var getKey = function( node ) {

        var key = undefined;
        var attr = resolver.filterSelector( getScopeKeyTag() );
        var $current = $( node );
        do {
            $current = $current.parent();
            key = $current.attr( attr );
        } while ( key == undefined && $current.length != 0 );
        
        return key;
    };
    
    var getScopeKeyTag = function(){
        return context.getTags().scopeKey;
    };
    
    reset();
    
    return {
        reset: reset,
        put: put,
        get: get
    };
})();
