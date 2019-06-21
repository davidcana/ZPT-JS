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
var ParserWorker = require( './parserWorker.js' );
var ParserUpdater = require( './parserUpdater.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var attributeCache = require( '../cache/attributeCache.js' );

module.exports = (function() {
    
    var parserOptions = {
        command: undefined, // preload, fullRender or partialRender
        root: undefined,
        dictionary: {},
        indexExpressions: false
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
    
    var preload = function( callback, failCallback, declaredRemotePageUrls, i18n, notRemoveGeneratedTags, maxFolderDictionaries ){
        
        try {
            if ( ! notRemoveGeneratedTags ){
                removeGeneratedTagsFromAllTargetElements( parserOptions.root );
            }
            
            var scope = new Scope( 
                parserOptions.dictionary, 
                parserOptions.dictionaryExtension, 
                true 
            );
            
            scope.loadFolderDictionariesAsync( 
                maxFolderDictionaries, 
                window.location,
                function(){
                    context.setFolderDictionaries( scope.folderDictionaries );
                    
                    i18nHelper.loadAsyncAuto( 
                        parserOptions.dictionary,
                        i18n,
                        function(){
                            resolver.loadRemotePages( 
                                scope,
                                declaredRemotePageUrls,
                                callback,
                                failCallback
                            );
                        },
                        failCallback
                    );
                } 
            );
            
        } catch( e ){
            log.fatal( 'Exiting init method of ZPT with errors: ' + e );
            throw e;
        }
    };
    
    var run = function( _options ){
        
        var options = _options || {};
        
        // Init parser options
        updateParserOptions( options );
    
        var command = options.command || 'fullRender';
        switch ( command ) {
            case 'preload':
                preload(
                    options.callback,
                    options.failCallback,
                    options.declaredRemotePageUrls || [],
                    options.i18n,
                    options.notRemoveGeneratedTags,
                    options.maxFolderDictionaries
                );
                break;
            case 'fullRender':
            case 'partialRender':
                render(
                    command == 'partialRender'? options.target: parserOptions.root,
                    options.dictionaryExtension,
                    options.notRemoveGeneratedTags,
                    options.indexExpressions,
                    options.indexExpressions && command == 'fullRender'
                );
                break;
            case 'update':
                processUpdate( 
                    options.dictionaryChanges
                );
                break;
            default:
                throw 'Unknown command: ' + command;
        }
    };
    
    var render = function( target, dictionaryExtension, notRemoveGeneratedTags, indexExpressions, resetIndex ){
        
        try {
            if ( ! target ){
                throw 'Unable to process null root or target!';
            }
            
            if ( ! notRemoveGeneratedTags ){
                removeGeneratedTagsFromAllTargetElements( target );
            }
            
            if ( resetIndex ){
                attributeIndex.reset();
                attributeCache.reset();
            }
            
            processAllTargetElements( target, dictionaryExtension, indexExpressions );
            
        } catch( e ){
            log.fatal( 'Exiting run method of ZPT with errors: ' + e );
            context.errorFunction( e );
            //throw e;
        }
    };
        
    var removeGeneratedTagsFromAllTargetElements = function( target ) {
        
        // Is multiroot?
        if ( $.isArray( target ) ){ 
            // There are several roots
            for ( var c = 0; c < target.length; c++ ) {
                removeGeneratedTags( target[ c ] );
            }
        } else {
            // There is only one root
            removeGeneratedTags( target );
        }
    };
    
    var removeGeneratedTags = function( target ) {
        
        removeTags( target, tags.qdup );       // Remove all generated nodes (repeats)
        removeTags( target, tags.metalMacro ); // Remove all generated nodes (macros)
    };
    
    var removeTags = function( target, tag ){
        
        var node;
        var pos = 0;
        var list = target.querySelectorAll( "*[" + tag + "]" );
        while ( node = list[ pos++ ] ) {
            node.parentNode.removeChild( node );
        }
    };
    
    var processAllTargetElements = function( target, dictionaryExtension, indexExpressions ) {
        
        // Is multiroot?
        if ( $.isArray( target ) ){ 
            // There are several roots
            for ( var c = 0; c < target.length; c++ ) {
                processTarget( target[ c ], dictionaryExtension, indexExpressions );
            }
        } else {
            // There is only one root
            processTarget( target, dictionaryExtension, indexExpressions );
        }
    };
    
    var processTarget = function( target, dictionaryExtension, indexExpressions ) {
        
        var parserWorker = new ParserWorker( 
            target, 
            scopeBuilder.build( 
                parserOptions, 
                target, 
                dictionaryExtension,
                parserOptions.command == 'partialRender'
            ),
            indexExpressions
        );
        
        parserWorker.run();
    };
    
    var processUpdate = function( dictionaryChanges ) {

        var parserUpdater = new ParserUpdater( 
            dictionaryChanges,
            parserOptions
        );

        parserUpdater.run();
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
