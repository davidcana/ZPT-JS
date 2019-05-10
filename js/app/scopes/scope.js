/* 
    Class Scope 
*/
"use strict";

var context = require( '../context.js' );
var $ = require( 'jquery' );
var loadjs = require( 'loadjs' );

var Scope = function( _dictionary, _dictionaryExtension, addCommonVars, _folderDictionaries ) {
    
    this.dictionary = _dictionary || {};
    this.dictionaryExtension = _dictionaryExtension || {};
    this.vars = {};
    this.changesStack = [];
    this.nocallVars = {};
    this.folderDictionaries = _folderDictionaries || [];
    
    if ( addCommonVars ){
        this.setCommonVars();
    }
    this.setMandatoryVars();
};

Scope.prototype.setMandatoryVars = function(){

    // Register nothing var
    this.setVar( 
        context.getConf().nothingVarName, 
        context.getConf().nothingVarValue 
    );
    
    // Register default var
    this.setVar( 
        context.getConf().defaultVarName, 
        context.getConf().defaultVarValue 
    );
};

Scope.prototype.setCommonVars = function(){
    
    // Register window object if it exists
    if ( window ){
        this.setVar( 
            context.getConf().windowVarName, 
            window 
        );
    }

    // Register context
    this.setVar( 
        context.getConf().contextVarName, 
        context 
    );
};

Scope.prototype.startElement = function(){
    
    var vars = {
        varsToUnset : [],
        varsToSet : {}
    };

    this.changesStack.push( vars );

    return vars;
};

Scope.prototype.currentVars = function(){
    return this.changesStack[ this.changesStack.length - 1 ];
};

Scope.prototype.setVar = function( name, value ) {
    this.vars[ name ] = value;
};

Scope.prototype.getWithoutEvaluating = function( name ) {
    
    var value;
    
    value = this.vars[ name ];
    if ( value !== undefined ){
        return value;
    }
    
    value = this.dictionaryExtension[ name ];
    if ( value !== undefined ){
        return value;
    }
    
    value = this.dictionary[ name ];
    if ( value !== undefined ){
        return value;
    }
    
    for ( var i = 0; i < this.folderDictionaries.length; ++i ){
        value = this.folderDictionaries[ i ][ name ];
        if ( value !== undefined ){
            return value;
        }
    }
    
    return undefined;
};
/*
Scope.prototype.getWithoutEvaluating = function( name ) {

    var valueFromVars = this.vars[ name ];
    if ( valueFromVars !== undefined ){
        return valueFromVars;
    }

    return this.dictionaryExtension[ name ] !== undefined? 
        this.dictionaryExtension[ name ]: 
        this.dictionary[ name ];
};
*/

Scope.prototype.get = function( name ) {

    var value = this.getWithoutEvaluating( name );
    
    if ( ! this.nocallVars[ name ] ){
        return value;
    }
    
    return value && $.isFunction( value.evaluate )?
        value.evaluate( this ): 
        'Error evaluating property "' + name + '": ' + value;
};

Scope.prototype.unset = function( name ) {
    delete this.vars[ name ];
};

Scope.prototype.endElement = function ( ) {

    var vars = this.changesStack.pop(); 

    var varsToUnset = vars.varsToUnset;
    var varsToSet = vars.varsToSet; 

    for ( var i = 0; i < varsToUnset.length; ++i ){
        this.unset( varsToUnset[ i ] );
    }

    for ( var name in varsToSet ){
        var value = varsToSet[ name ];
        this.setVar( name, value );
    }
};

Scope.prototype.set = function ( name, value, isGlobal, nocall ) {
    
    if ( ! isGlobal ){

        // Local vars
        var vars = this.currentVars();
        var currentValue = this.getWithoutEvaluating( name );

        if ( currentValue != null ){
            vars.varsToSet[ name ] = currentValue;

        } else {
            vars.varsToUnset.push( name );
        }
    }

    // Common to global and local vars
    this.setVar( name, value );
    
    // Add to nocallVars if needed
    if ( nocall ){
        this.nocallVars[ name ] = true;
    }
};

Scope.prototype.loadFolderDictionariesAsync = function ( maxFolderDictionaries, location, callback ) {
    
    if ( ! maxFolderDictionaries ) {
        callback();
        return;
    }
    
    var urlList = this.buildUrlListOfFolderDictionaries( maxFolderDictionaries, location );
    this.loadFolderDictionary(
        maxFolderDictionaries,
        callback,
        urlList, 
        0
    );
};

Scope.prototype.loadFolderDictionary = function ( maxFolderDictionaries, callback, urlList, i ) {
    
    var instance = this;
    
    var loadjsCallback = function( url, success ){
        
        // Treat js file only if load is sucessfull
        if ( success && window.folderDictionary ){
            instance.folderDictionaries.push( window.folderDictionary );
        }
            
        // Run callback and return if the urlList is over
        if ( i == urlList.length){
            callback();
            return;
        }

        // Continue, the urlList is not over
        instance.loadFolderDictionary(
            maxFolderDictionaries, 
            callback,
            urlList, 
            i
        )
    };
    
    var url = urlList[ i++ ];
    loadjs(
        url, 
        {
            success: function() { 
                loadjsCallback( url, true );
            },
            error: function() { 
                loadjsCallback( url, false );
            }
        }
    );
};

Scope.prototype.buildUrlListOfFolderDictionaries = function ( maxFolderDictionaries, location ) {
    
    var result = [];
    
    var c = 0;
    var path = location.pathname;
    var lastIndex = path.lastIndexOf( '/' );
    while ( lastIndex != -1 && ++c <= maxFolderDictionaries ){
        var parent = path.substr( 0, lastIndex );
        result.push( 
            location.origin + parent + '/' + 'folderDictionary.js' 
        );
        lastIndex = parent.lastIndexOf( '/' );
    }
    
    return result;
};

module.exports = Scope;
