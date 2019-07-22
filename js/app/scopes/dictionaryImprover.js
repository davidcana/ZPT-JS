/* 
    dictionary improver singleton class 
*/
"use strict";

var utils = require( '../utils.js' );

module.exports = (function() {
    
    var run = function ( dictionary, userObserver ){

        var observer = userObserver || {
            notify: function( propertyPath ){
                console.log( propertyPath, 'changed' );
            }
        };
        var _privateScope = {};
        
        var keys = Object.keys( dictionary );
        dictionary._privateScope = _privateScope;
        
        for ( var i = 0; i < keys.length; i++ ){
            var key = keys[ i ];
            
            var property = Object.getOwnPropertyDescriptor( dictionary, key );
            if ( property && property.configurable === false ) {
                continue;
            }
            
            copy( dictionary, _privateScope, key );
            
            Object.defineProperty(
                dictionary,
                key,
                {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return dictionary._privateScope[ key ];
                    },
                    set: function( value ){
                        dictionary._privateScope[ key ] = value;
                        observer.notify( key );
                    }
                }
            );   
        }
    };
    
    var copy = function( from, to, key ){
        
        var value = from[ key ];
        var newValue = utils.isPlainObject( value )? utils.deepExtend( {}, value ): value;
        to[ key ] = newValue;
    };
    
    return {
        run: run
    };
})();
