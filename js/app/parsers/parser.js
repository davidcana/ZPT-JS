/* 
    Class Parser 
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var resolver = require( '../resolver.js' );
var log = require( '../logHelper.js' );
var Scope = require( '../scopes/scope.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );
var i18nHelper = require( '../i18n/i18nHelper.js' );
var ParserRenderer = require( './parserRenderer.js' );
var ParserUpdater = require( './parserUpdater.js' );
var ParserPreloader = require( './parserPreloader.js' );
var nodeRemover = require( './nodeRemover.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var attributeCache = require( '../cache/attributeCache.js' );

module.exports = (function() {
    
    var parserOptions = {
        command: undefined, // preload, fullRender or partialRender
        root: undefined,
        dictionary: {},
        indexExpressions: true
        //notRemoveGeneratedTags,
        //target,
        //declaredRemotePageUrls,
        //i18n,
        //callback,
        //failCallback,
    };
    var tags = context.getTags();
    
    var updateParserOptions = function( options ){
        
        parserOptions.command = options.command || 'fullRender';
        parserOptions.root = options.root === undefined? parserOptions.root: options.root;
        parserOptions.dictionary = options.dictionary || parserOptions.dictionary;
        parserOptions.indexExpressions = options.indexExpressions === undefined? parserOptions.indexExpressions: options.indexExpressions;
    };
    
    var run = function( _options ){
        
        var options = _options || {};
        
        // Init parser options
        updateParserOptions( options );
    
        var command = options.command || 'fullRender';
        switch ( command ) {
            case 'preload':
                return processPreload(
                    options.callback,
                    options.failCallback,
                    options.declaredRemotePageUrls || [],
                    options.i18n,
                    options.notRemoveGeneratedTags,
                    options.maxFolderDictionaries
                );
            case 'fullRender':
            case 'partialRender':
                return processRender(
                    command == 'partialRender'? options.target: parserOptions.root,
                    options.dictionaryExtension,
                    options.notRemoveGeneratedTags,
                    parserOptions.indexExpressions && command == 'fullRender'
                );
            case 'update':
                return processUpdate( 
                    options.dictionaryChanges
                );
            default:
                throw 'Unknown command: ' + command;
        }
    };
    
    var processPreload = function( callback, failCallback, declaredRemotePageUrls, i18n, notRemoveGeneratedTags, maxFolderDictionaries ){
        
        var parserPreloader = new ParserPreloader( 
            parserOptions, 
            callback, 
            failCallback, 
            declaredRemotePageUrls, 
            i18n, 
            notRemoveGeneratedTags, 
            maxFolderDictionaries
        );

        parserPreloader.run();

        return parserPreloader;
    };
    
    var processRender = function( target, dictionaryExtension, notRemoveGeneratedTags, resetIndex ){
        
        var parserRenderer = new ParserRenderer( 
            parserOptions, 
            target, 
            dictionaryExtension, 
            notRemoveGeneratedTags, 
            resetIndex
        );

        parserRenderer.run();
        
        return parserRenderer;
    };
    
    var processUpdate = function( dictionaryChanges ) {
        
        var parserUpdater = new ParserUpdater( 
            dictionaryChanges,
            parserOptions
        );

        parserUpdater.run();
        
        return parserUpdater;
    };
    
    var getOptions = function(){
        return parserOptions;
    };
    
    var self = {
        run: run,
        getOptions: getOptions
    };
    
    return self;
})();
