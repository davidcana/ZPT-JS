/*
    attributeCache singleton class
*/
//var CacheHelper = require( './cacheHelper.js' );
//var context = require( '../context.js' );
//var log = require( '../logHelper.js' );
//var attributeIndex = require( '../attributes/attributeIndex.js' );

import { cacheHelper } from './cacheHelper.js';
import { context } from '../context.js';
import { logHelper as log } from '../logHelper.js';
import { attributeIndex } from '../attributes/attributeIndex.js';

export const attributeCache = (function() {
    
    var map;
    
    var reset = function(){
        map = {};
    };
    reset();
    
    var get = function( attribute, string ) {
        
        var attributeMap = map[ attribute ];
        
        if ( ! attributeMap ){
            return null;
        }
         
        return attributeMap[ cacheHelper.hashCode( string ) ];
    };
    
    var put = function( attribute, string, value ){
        
        var attributeMap = map[ attribute ];
        
        if ( ! attributeMap ){
            attributeMap = {};
            map[ attribute ] = attributeMap;
        }
        
        attributeMap[ cacheHelper.hashCode( string ) ] = value;
    };
    
    var index = function( node, attribute, scope ){
        
        if ( node ){
            log.debug( 'Must index!' );
            attributeIndex.add( node, attribute, scope );
            
        } else {
            log.debug( 'Not indexed!' );
        }
        
        return attribute;
    };
    
    var getByDetails = function( attributeType, string, buildFunction, force, node, scope ) {
        
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
                return index( node, fromCache, scope );
            } else {
                log.debug( 'NOT found in cache!' );
            }
        }
        
        // Force build and put into cache
        log.debug( 'Must build!' );
        var builded = buildFunction();
        put( attributeType, string, builded );
        //return builded;
        return index( node, builded, scope );
    };
    
    var getByAttributeClass = function( attributeInstance, string, node, indexExpressions, scope, constructor ) {
        
        return getByDetails( 
                attributeInstance.id, 
                string, 
                constructor || function(){
                    return attributeInstance.build( string );
                }, 
                false,
                indexExpressions? node: undefined,
                scope
        );
    };
    
    return {
        //getByDetails: getByDetails,
        getByAttributeClass: getByAttributeClass,
        reset: reset
    };
})();
