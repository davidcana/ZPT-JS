/*
    attributeCache singleton class
*/
"use strict";

var CacheHelper = require( './cacheHelper.js' );
var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );

module.exports = (function() {
    
    var map = {};
    
    var get = function( attribute, string ) {
        
        var attributeMap = map[ attribute ];
        
        if ( ! attributeMap ){
            return null;
        }
         
        return attributeMap[ CacheHelper.hashCode( string ) ];
    };
    
    var put = function( attribute, string, value ){
        
        var attributeMap = map[ attribute ];
        
        if ( ! attributeMap ){
            attributeMap = {};
            map[ attribute ] = attributeMap;
        }
        
        attributeMap[ CacheHelper.hashCode( string ) ] = value;
    };
    
    var index = function( node, attribute ){
        
        if ( node ){
            log.debug( 'Must index!' );
            attributeIndex.add( node, attribute );
            
        } else {
            log.debug( 'Not indexed!' );
        }
        
        return attribute;
    };
    
    var getByDetails = function( attributeType, string, buildFunction, force, node ) {
        
        log.debug( 
            'Request building of ZPT attribute "' + string + '", force "' + force + '"' );
        
        // Get from cache if possible
        if ( force || ! context.getConf().attributeCacheOn ){
            log.debug( 'Cache OFF!' );
            
        } else {
            log.debug( 'Cache ON!' );
            var fromCache = get( attributeType, string );
            if ( fromCache ){
                log.debug( 'Found in cache!' );
                //return fromCache;
                return index( node, fromCache );
            } else {
                log.debug( 'NOT found in cache!' );
            }
        }
        
        // Force build and put into cache
        log.debug( 'Must build!' );
        var builded = buildFunction();
        put( attributeType, string, builded );
        //return builded;
        return index( node, builded );
    };
    
    var getByAttributeClass = function( attributeInstance, string, node ) {
        
        return getByDetails( 
                attributeInstance.id, 
                string, 
                function(){
                    return attributeInstance.build( string );
                }, 
                false,
                node
        );
    };
    
    return {
        //getByDetails: getByDetails,
        getByAttributeClass: getByAttributeClass
    };
})();
