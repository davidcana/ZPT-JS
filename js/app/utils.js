/*
    utils singleton class
*/
"use strict";

module.exports = (function() {
    
    var generateId = function ( len, _charSet ) {
        
        var charSet = _charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < len; i++ ) {
            var pos = Math.floor( Math.random() * charSet.length );
            result += charSet.substring( pos, pos + 1 );
        }
        return result;
    }
    
    var isArray = Array.isArray;
    
    var isPlainObject = function( obj ) {
        var proto, Ctor;

        // Detect obvious negatives
        // Use toString instead of jQuery.type to catch host objects
        if ( !obj || toString.call( obj ) !== "[object Object]" ) {
            return false;
        }

        proto = getProto( obj );

        // Objects with no prototype (e.g., `Object.create( null )`) are plain
        if ( !proto ) {
            return true;
        }

        // Objects with prototype are plain iff they were constructed by a global Object function
        Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
        return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    };
    var getProto = Object.getPrototypeOf;
    
    var deepExtend = function( out ) {
        out = out || {};

        for ( var i = 1; i < arguments.length; i++ ) {
            var obj = arguments[ i ];

            if ( ! obj )
                continue;

            for ( var key in obj ) {
                if ( obj.hasOwnProperty( key ) ) {
                    if ( typeof obj[ key ] === 'object' )
                        out[ key ] = deepExtend( out[ key ], obj[ key ] );
                    else
                        out[ key ] = obj[ key ];
                }
            }
        }

        return out;
    };
    
    var extend = function(out) {
        out = out || {};

        for ( var i = 1; i < arguments.length; i++ ) {
            if ( ! arguments[ i ] )
                continue;

            for ( var key in arguments[ i ] ) {
                if ( arguments[ i ].hasOwnProperty( key ) )
                    out[ key ] = arguments[ i ][ key ];
            }
        }

        return out;
    };
    
    var getJSON = function( url, doneListener, failListener ){
        
        var oReq = new window.XMLHttpRequest();
        oReq.addEventListener( 
            "load",
            function(){
                doneListener( 
                    JSON.parse( 
                        oReq.responseText 
                    ) 
                );
            }
        );
        oReq.addEventListener( "error", failListener );
        oReq.open( "GET", url );
        oReq.send();
    };
    
    return {
        generateId: generateId,
        isArray: isArray,
        isPlainObject: isPlainObject,
        deepExtend: deepExtend,
        extend: extend,
        getJSON: getJSON
    };
})();
