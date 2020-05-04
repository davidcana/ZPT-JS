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
        dictionaryActions: [],
        commit: function(){
            zpt.run({
                command: 'update',
                dictionaryChanges: self._privateScope.dictionaryChanges,
                dictionaryActions: self._privateScope.dictionaryActions
            });
            self._privateScope.dictionaryChanges = {};
            self._privateScope.dictionaryActions = [];
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
    
    this._commit = function(){
        this._privateScope.commit();
    };

    this._addActions = function( dictionaryActions ){
        
        // Record this actions to commit it later
        self._privateScope.dictionaryActions = self._privateScope.dictionaryActions.concat( dictionaryActions );
        
        // Commit the change only if autoCommit is on
        if ( self._isAutoCommit() ){
            self._privateScope.commit();
        }
    };
    
    this._addVariable = function( key, value ){
        
        // Set the value in nonReactiveDictionary
        self._privateScope.nonReactiveDictionary[ key ] = value;
        
        // Define getter and setter
        this._defineProperty( 
            this._privateScope.nonReactiveDictionary, 
            key 
        );
    };

    this._defineProperty = function( dictionary, key ){

        // Define property to set getter and setter
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
                        self._privateScope.commit();
                    }
                }
            }
        );
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
                self._defineProperty( dictionary, key );
            })( key );
        }
    };
    this._initialize( this._privateScope.nonReactiveDictionary );
};

module.exports = ReactiveDictionary;
