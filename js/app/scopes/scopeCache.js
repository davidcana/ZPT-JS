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

        // Build the key
        var key = buildKey();
        
        // Put a copy of scope into the cache
        cache[ key ] = $.extend( true, {}, scope );
        
        // Save the key of the scope as an attribute of the node
        node.setAttribute( getScopeKeyTag(), key );
    };

    var buildKey = function(){
        return ++c;
    };
    
    var get = function( node, dictionary ) {
        
        // Return a new scope if node is the body
        /*
        if ( node.nodeName == 'BODY'){
            return new Scope( dictionary );
        }
        */
        
        var scope = getFromCache( node, dictionary );
        return scope? scope: new Scope( dictionary );
    };
    
    var getFromCache = function( node, dictionary ) {
        
        var key = getKey( node );
        if ( key === undefined ){
            return undefined;
        }
        
        var scope = cache[ key ];
        scope.update( dictionary );
        
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
