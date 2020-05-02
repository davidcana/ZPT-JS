/* 
    ReactiveDictionary class 
*/
"use strict";

var zpt = require( '../main.js' );

var ReactiveDictionary = function( _nonReactiveDictionary, _initialAutoCommit ) {
    
    // Init some vars
    var self = this;
    this._privateScope = {
        nonReactiveDictionary: _nonReactiveDictionary,
        autoCommit: true,
        dictionaryChanges: {},
        commitChanges: function(){
            zpt.run({
                command: 'update',
                dictionaryChanges: self._privateScope.dictionaryChanges
            });
            self._privateScope.dictionaryChanges = {};
        },
        commitActions: function( dictionaryActions ){
            zpt.run({
                command: 'update',
                dictionaryActions: dictionaryActions
            });
        }
    };

    // Define some methods
    this._getNonReactiveDictionary = function(){
        return this._privateScope.nonReactiveDictionary;
    };
    this._isAutoCommit = function(){
        return this._privateScope.autoCommit;
    };
    this._setAutoCommit = function( _autoCommit ){
        this._privateScope.autoCommit = _autoCommit;
    };
    this._commitChanges = function(){
        this._privateScope.commitChanges();
    };
    this._commitActions = function(){
        this._privateScope.commitActions();
    };
    
    // Initialize
    this._initialize = function( dictionary ){
        
        // Initialize autoCommit
        if ( _initialAutoCommit !== undefined ){
            this._setAutoCommit( _initialAutoCommit );
        }
        
        // Iterate properties in dictionary to define setters and getters
        var keys = Object.keys( dictionary );
        for ( var i = 0; i < keys.length; i++ ){
            var key = keys[ i ];
            var property = Object.getOwnPropertyDescriptor( dictionary, key );
            if ( property && property.configurable === false ) {
                continue;
            }
            
            // Define getter and setter
            (function( key ) {
                Object.defineProperty(
                    self, 
                    key, 
                    {
                        enumerable: true,
                        configurable: true,
                        get: function () { 
                            return dictionary[ key ];
                        },
                        set: function ( value ) {
                            // Record this change to commit it later
                            self._privateScope.dictionaryChanges[ key ] = value;

                            // Commit the change only if autoCommit is on
                            if ( self._isAutoCommit() ){
                                self._privateScope.commitChanges();
                            }
                        }
                    }
                );
            })( key );
        }
    };
    this._initialize( this._privateScope.nonReactiveDictionary );
};

module.exports = ReactiveDictionary;
