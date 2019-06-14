/*
    attributeCache singleton class
*/
module.exports = (function() {
    "use strict";
    
    var CacheHelper = require( './cacheHelper.js' );
    var context = require( '../context.js' );
    var log = require( '../logHelper.js' );
    
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
    
    var getByDetails = function( attribute, string, buildFunction, force ) {
        
        log.debug( 
            'Request building of ZPT attribute "' + string + '", force "' + force + '"' );
        
        // Get from cache if possible
        if ( force || ! context.getConf().attributeCacheOn ){
            log.debug( 'Cache OFF!' );
            
        } else {
            log.debug( 'Cache ON!' );
            var fromCache = get( attribute, string );
            if ( fromCache ){
                log.debug( 'Found in cache!' );
                return fromCache;
            } else {
                log.debug( 'NOT found in cache!' );
            }
        }
        
        // Force build and put into cache
        log.debug( 'Must build!' );
        var builded = buildFunction();
        put( attribute, string, builded );
        return builded;
    };
    
    var getByAttributeClass = function( attributeInstance, string ) {
        
        return getByDetails( 
                attributeInstance.id, 
                string, 
                function(){
                    return attributeInstance.build( string );
                }, 
                false );
    };
    
    var registerAttribute = function(){
        
    };
    
    return {
        getByDetails: getByDetails,
        getByAttributeClass: getByAttributeClass
    };
})();
