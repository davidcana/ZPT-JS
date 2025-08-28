/*
    utils singleton class
*/
export const utils = (function() {
    
    var generateId = function ( len, _charSet ) {
        
        var charSet = _charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for ( var i = 0; i < len; i++ ) {
            var pos = Math.floor( Math.random() * charSet.length );
            result += charSet.substring( pos, pos + 1 );
        }
        return result;
    };
    
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
        if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
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

            if ( ! obj ){
                continue;
            }
            
            for ( var key in obj ) {
                if ( obj.hasOwnProperty( key ) ) {
                    if ( typeof obj[ key ] === 'object' ){
                        out[ key ] = deepExtend( out[ key ], obj[ key ] );
                    } else {
                        out[ key ] = obj[ key ];
                    }
                }
            }
        }

        return out;
    };
    
    var extend = function(out) {
        out = out || {};

        for ( var i = 1; i < arguments.length; i++ ) {
            if ( ! arguments[ i ] ){
                continue;
            }

            for ( var key in arguments[ i ] ) {
                if ( arguments[ i ].hasOwnProperty( key ) ){
                    out[ key ] = arguments[ i ][ key ];
                }
            }
        }

        return out;
    };
    
    var ajax = function( conf ){
        
        // Check conf object
        if ( ! conf ){
            throw 'Error trying to process ajax: no arguments!';
        }
        if ( ! conf.url ){
            throw 'Error trying to process ajax: no URL defined!';
        }
        if ( ! conf.done ){
            throw 'Error trying to process ajax: no done callback defined!';
        }
        
        // Do it!
        var oReq = new window.XMLHttpRequest();
        oReq.addEventListener( 
            'load',
            function(){
                if ( this.status >= 200 && this.status < 400 ) {
                    // Success!
                    conf.done( 
                        conf.parseJSON?
                        JSON.parse( oReq.responseText ):
                        oReq.responseText
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
    
    var getJSON = function( conf ){
        
        conf.parseJSON = true;
        ajax( conf );
    };
    
    /*
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
    */
    /*
    var getNodeId = function ( node ){
        return node.getAttribute( context.getTags().id );
    };
    */
    var deepEqual = function( x, y ) {
        return (x && y && typeof x === 'object' && typeof y === 'object') ?
            (Object.keys(x).length === Object.keys(y).length) && Object.keys(x).reduce(function(isEqual, key) {return isEqual && deepEqual(x[key], y[key]);}, true):
            (x === y);
    };
    
    var copyArray = function( arrayToCopy ){
        
        var result = [];
        
        for ( var i = 0; i < arrayToCopy.length; ++i ){
            result.push( arrayToCopy[ i ] );
        }
        
        return result;
    };
    
    var genericToString = function( element ){
    
        if ( element == undefined ){
            return 'undefined';
        }
        
        if ( Array.isArray( element ) ){
            var result = 'Array[ ';
            for ( var i = 0; i < element.length; ++i ){
                var separator = i === 0? '': ', ';
                result += separator + genericToString( element[ i ] );
            }
            result += ' ]';
            return result;
        }
        
        if ( isPlainObject( element ) ){
            return JSON.stringify( element );
        }
        
        // Must be numeric or string
        return element;
    };
    
    return {
        generateId: generateId,
        //isArray: isArray,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        deepExtend: deepExtend,
        extend: extend,
        getJSON: getJSON,
        ajax: ajax,
        deepEqual: deepEqual,
        copyArray: copyArray,
        genericToString: genericToString
        //getNodeId: getNodeId
    };
})();
