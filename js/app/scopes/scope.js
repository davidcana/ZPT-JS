/* 
    Class Scope 
*/

import { context } from '../context.js';
import { utils } from '../utils.js';
import loadjs from '../../../lib/loadjs-esm.js';

export const Scope = function( _dictionary, _dictionaryExtension, addCommonVars, _folderDictionaries ) {
    
    this.dictionary = _dictionary || {};
    this.dictionaryExtension = _dictionaryExtension || {};
    this.vars = {};
    this.changesStack = [];
    this.nocallVars = {};
    this.folderDictionaries = _folderDictionaries || [];
    this.globalVarsExpressions = {};
    
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
        varsToUnset: [],
        varsToSet: {},
        expressions: {},
        impliedDeclaredVars: []
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

Scope.prototype.get = function( name ) {

    var value = this.getWithoutEvaluating( name );
    
    if ( ! this.nocallVars[ name ] ){
        return value;
    }
    
    return value && utils.isFunction( value.evaluate )?
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

Scope.prototype.set = function ( name, value, isGlobal, nocall, _expression ) {
    
    var expression = _expression === undefined? null: _expression;
    
    if ( ! isGlobal ){

        // Local vars
        var vars = this.currentVars();
        var currentValue = this.getWithoutEvaluating( name );

        if ( currentValue != null ){
            vars.varsToSet[ name ] = currentValue;
            
        } else {
            vars.varsToUnset.push( name );
        }
        
        vars.expressions[ name ] = expression;
        
        if ( this.isStrictMode() ){
            vars.impliedDeclaredVars.push( name );
        }
        
    } else {
        
        // Global vars
        this.globalVarsExpressions[ name ] = expression; 
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
        if ( i === urlList.length){
            callback();
            return;
        }

        // Continue, the urlList is not over
        instance.loadFolderDictionary(
            maxFolderDictionaries, 
            callback,
            urlList, 
            i
        );
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
    while ( lastIndex !== -1 && ++c <= maxFolderDictionaries ){
        var parent = path.substr( 0, lastIndex );
        result.push( 
            location.origin + parent + '/' + 'folderDictionary.js' 
        );
        lastIndex = parent.lastIndexOf( '/' );
    }
    
    return result;
};

Scope.prototype.isStrictMode = function(){
    return context.isStrictMode() || this.get( context.getConf().strictModeVarName );
};

Scope.prototype.isValidVariable = function( name ){
    
    // If strict mode is off all variable are valid
    if ( ! this.isStrictMode() ){
        return true;
    }
    
    // If the variable is declared return true
    var declared = this.get( context.getConf().declaredVarsVarName );
    var isDeclared = declared && declared.indexOf? 
        declared.indexOf( name ) !== -1: 
        false;
    if ( isDeclared ){
        return true;
    }
    
    // Check if the variable is implicitly declared
    for ( var i = this.changesStack.length - 1; i >= 0; --i ){
        var vars = this.changesStack[ i ];
        var isImplied = vars.impliedDeclaredVars.indexOf( name ) !== -1;
        if ( isImplied ){
            return true;
        }
    }
    
    return false;
};

Scope.prototype.getVarExpression = function ( name ) {
    
    var expression = this.getExpressionFromLocal( name );
    return expression !== undefined? expression: this.globalVarsExpressions[ name ];
};

Scope.prototype.getExpressionFromLocal = function ( name ) {

    for ( var i = this.changesStack.length - 1; i >= 0; --i ){
        var vars = this.changesStack[ i ];
        var expression = vars.expressions[ name ];
        if ( expression !== undefined ){
            return expression;
        }
    }
    
    return undefined;
};

Scope.prototype.isLocalVar = function ( name ) {
    return this.vars[ name ] !== undefined;
};

