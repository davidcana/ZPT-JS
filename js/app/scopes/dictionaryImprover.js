/* 
    dictionary improver singleton class 
*/
"use strict";

var utils = require( '../utils.js' );

module.exports = (function() {
    
    var run = function ( dictionary, userObserver ){
        
        // Define the observer
        var observer = userObserver || {
            notify: function( propertyPath ){
                console.log( propertyPath, 'changed' );
            }
        };
        
        // Define the _privateScope
        //var _privateScope = {};
        //dictionary._privateScope = _privateScope;
        dictionary._privateScope = {};
        
        // Init some properties in dictionary
        dictionary._privateScope.autoCommit = true;
        dictionary._privateScope.dictionaryChanges = {};
        
        // Define some methods in dictionary
        dictionary.isAutoCommit = function(){
            return dictionary._privateScope.autoCommit;
        };
        
        // Copy properties in dictionary to _privateScope and define properties with setters and getters
        var keys = Object.keys( dictionary );
        for ( var i = 0; i < keys.length; i++ ){
            var key = keys[ i ];
            
            var property = Object.getOwnPropertyDescriptor( dictionary, key );
            if ( property && property.configurable === false ) {
                continue;
            }
            
            //copy( dictionary, _privateScope, key );
            
            Object.defineProperty(
                dictionary,
                key,
                {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return dictionary[ key ];
                        //return dictionary._privateScope[ key ];
                    },
                    set: function( value ){
                        dictionary[ key ] = value;
                        //dictionary._privateScope[ key ] = value;
                        observer.notify( key );
                        
                        // Record this change to commit it later
                        dictionary._dictionaryChanges[ key ] = value;
                        
                        if ( dictionary._autoCommit ){
                            dictionary._commit();
                        }
                    }
                }
            );   
        }
        
        //
        
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
