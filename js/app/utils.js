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
    
    //var isArray = Array.isArray;
    
    var isFunction = function isFunction( obj ) {

        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };
    
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
    var class2type = {};
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call( Object );
    
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
    
    var getJSON = function( conf ){
        
        // Check conf object
        if ( ! conf ){
            throw 'Error trying to getJSON: no arguments!';
        }
        if ( ! conf.url ){
            throw 'Error trying to getJSON: no URL defined!';
        }
        if ( ! conf.done ){
            throw 'Error trying to getJSON: no done callback defined!';
        }
        
        // Do it!
        var oReq = new window.XMLHttpRequest();
        oReq.addEventListener( 
            'load',
            function(){
                if ( this.status >= 200 && this.status < 400 ) {
                    // Success!
                    conf.done( 
                        JSON.parse( 
                            oReq.responseText 
                        ) 
                    );
                } else {
                    // We reached our target server, but it returned an error
                    conf.fail( undefined, undefined, this.statusText );
                }
            }
        );
        if ( conf.fail ){
            oReq.addEventListener( 'error', conf.fail );
        }
        oReq.open( 'GET', conf.url );
        oReq.send();
    };
    
    return {
        generateId: generateId,
        //isArray: isArray,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        deepExtend: deepExtend,
        extend: extend,
        getJSON: getJSON
    };
})();
