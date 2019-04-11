/* 
    scopeBuilder singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var Scope = require( './scope.js' );
var utils = require( '../utils.js' );

module.exports = (function() {
    
    var keyLength = 6;
    
    var build = function( parserOptions, target, parser ) {

        var scope = new Scope( parserOptions.dictionary, true );
        
        if ( parserOptions.command == 'partialRender' ){
            updateForPartialRender( parserOptions, target, scope, parser );
        }
        
        return scope;
    };
    
    var updateForPartialRender = function( parserOptions, target, scope, parser ) {
        
        // Get root key
        var rootKeyTag = getRootKeyTag();
        var root = getRoot( parserOptions );
        var rootKey =  root.getAttribute( rootKeyTag );
        
        var talDefineTag = context.getTags().talDefine;
        
        var node = target.parentNode;
        var c = 0;
        var itemsList = [];
        
        do {
            var talDefine = node.getAttribute( talDefineTag );
            if ( talDefine ){
                //parser.processDefine( scope, talDefine, node, true );
                itemsList.push({
                    talDefine: talDefine,
                    node: node
                });
            }
            
            var nodeKey = node.getAttribute( rootKeyTag );
            if ( nodeKey && nodeKey === rootKey ){
                return processListOfDefines( parser, scope, itemsList );
            }
            
            node = node.parentNode;
            
        } while ( node && ++c < 100 );
        
        throw 'Error trying to update scope in partial render: root not found!';
    };
    
    var processListOfDefines = function( parser, scope, itemsList ){
        
        for ( var c = itemsList.length - 1; c >= 0; c-- ) {
            var item = itemsList[ c ];
            parser.processDefine( 
                scope, 
                item.talDefine, 
                item.node, 
                true
            );
        }
    };
    
    var getRoot = function( parserOptions ){
        
        var rootReference = markAllRoots( parserOptions );
        
        if ( ! $.isArray( parserOptions.root ) ){ 
            return parserOptions.root;
        }
        // TODO Implement this when parserOptions.root is an array
    };
    
    var markAllRoots = function( parserOptions ){

        var rootReference = {};
        var root = parserOptions.root;

        // Is multiroot?
        if ( $.isArray( root ) ){ 
            // There are several roots
            for ( var c = 0; c < root.length; c++ ) {
                markAsRoot( root[ c ], rootReference );
            }
        } else {
            // There is only one root
            markAsRoot( root, rootReference );
        }

        return rootReference;
    };
    
    var markAsRoot = function( node, rootReference ){
        
        // Build the key
        var key = buildKey();

        // Put a copy of scope into the cache
        rootReference[ key ] = node;

        // Save the key as an attribute of the node
        node.setAttribute( getRootKeyTag(), key );
    };
    
    var buildKey = function(){
        return utils.generateId( keyLength );
    };
    
    var getRootKeyTag = function(){
        return context.getTags().rootKey;
    };
    
    return {
        build: build
    };
})();
