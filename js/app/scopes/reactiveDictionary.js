/* 
    dictionary improver singleton class 
*/
"use strict";

var zpt = require( '../main.js' );

var ReactiveDictionary = function( nonReactiveDictionary, userObserver ) {
    
    var self = this;
    
    // Init the private scope
    this._privateScope = {
        autoCommit: true,
        dictionaryChanges: {},
        observer: userObserver || {
            notify: function( propertyPath ){
                console.log( propertyPath, 'changed' );
            }
        },
        commit: function( dictionaryActions ){
            zpt.run({
                command: 'update',
                dictionaryChanges: self._privateScope.dictionaryChanges,
                dictionaryActions: dictionaryActions || []
            });
        }
    };

    // Define some methods in dictionary
    this._isAutoCommit = function(){
        return this._privateScope.autoCommit;
    };
    this._setAutoCommit = function( _autoCommit ){
        return this._privateScope.autoCommit = _autoCommit;
    };
    
    // Initialize
    this.initialize = function( dictionary ){
        
        // Copy properties in dictionary to this and define properties with setters and getters
        var keys = Object.keys( dictionary );
        for ( var i = 0; i < keys.length; i++ ){
            var key = keys[ i ];
            
            var property = Object.getOwnPropertyDescriptor( dictionary, key );
            if ( property && property.configurable === false ) {
                continue;
            }
            
            // Copy current property
            this[ key ] = dictionary[ key ];
            
            // Define getter and setter
            Object.defineProperty(
                dictionary,
                key,
                {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return self[ key ];
                    },
                    set: function( value ){
                        self[ key ] = value;
                        self._privateScope.observer.notify( key );
                        
                        // Record this change to commit it later
                        self._privateScope.dictionaryChanges[ key ] = value;
                        
                        // Commit the change only if autoCommit is on
                        if ( self._isAutoCommit() ){
                            self._privateScope.commit();
                            self._privateScope.dictionaryChanges = {};
                        }
                    }
                }
            );   
        }
    };
    this.initialize( nonReactiveDictionary );
};

module.exports = ReactiveDictionary;
