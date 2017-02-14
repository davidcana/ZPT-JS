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
        
        log.info( 
            'Request building of expression "' + string + '", force "' + force + '"' );
        
        // Get from cache if possible
        if ( ! force && context.getConf().expressionCacheOn ){
            log.info( 'Cache ON!' );
            var fromCache = get( string );
            if ( fromCache ){
                log.info( 'Found in cache!' );
                return fromCache;
            } else {
                log.info( 'NOT found in cache!' );
            }
        } else {
            log.info( 'Cache OFF!' );
        }
        
        // Force build and put into cache
        log.info( 'Must build!' );
        var builded = buildFunction();
        put( string, builded );
        return builded;
    };
    
    return {
        get: process
    };
})();
