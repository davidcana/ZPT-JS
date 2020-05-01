/*
    expressionCache singleton class
*/
module.exports = (function() {
    "use strict";
    
    var CacheHelper = require( './cacheHelper.js' );
    var context = require( '../context.js' );
    var log = require( '../logHelper.js' );
    
    var map = {};
    
    var get = function( string ) {
        return map[ CacheHelper.hashCode( string ) ];
    };
    
    var put = function( string, value ){
        map[ CacheHelper.hashCode( string ) ] = value;
    };
    
    var process = function( string, buildFunction, force ) {
        
        log.debug( 
            'Request building of expression "' + string + '", force "' + force + '"' );
        
        // Get from cache if possible
        if ( ! force && context.getConf().expressionCacheOn ){
            log.debug( 'Cache ON!' );
            var fromCache = get( string );
            if ( fromCache ){
                log.debug( 'Found in cache!' );
                return fromCache;
            } 
            log.debug( 'NOT found in cache!' );
            
        } else {
            log.debug( 'Cache OFF!' );
        }
        
        // Force build and put into cache
        log.debug( 'Must build!' );
        var builded = buildFunction();
        put( string, builded );
        return builded;
    };
    
    var clean = function( ) {
        map = {};
    };
    
    return {
        get: process,
        clean: clean
    };
})();
