/* 
    scopeCache singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var resolver = require( '../resolver.js' );

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

    var get = function( node ) {
        
        var key = getKey( node );
        return cache[ key ];
    };
    
    var getKey = function( node ) {
        /*
        var key = node.getAttribute( context.getTags().scopeKey );
        if ( key ){
            return key;
        }
        */
        var scopeKeyTag = $( node ).closest( "[" + resolver.filterSelector( getScopeKeyTag() ) + "]" );
        if ( ! scopeKeyTag ){
            throw 'Scope key not found!';
        }
        
        return scopeKeyTag.attr( getScopeKeyTag() );
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
