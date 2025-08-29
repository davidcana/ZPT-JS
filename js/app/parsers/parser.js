/* 
    Class Parser 
*/
//var context = require( '../context.js' );
//var ParserRenderer = require( './parserRenderer.js' );
//var ParserUpdater = require( './parserUpdater.js' );
//var ParserPreloader = require( './parserPreloader.js' );
//var ReactiveDictionary = require( '../scopes/reactiveDictionary.js' );
import { context } from '../context.js';
import { ParserRenderer } from './parserRenderer.js';
import { ParserUpdater } from './parserUpdater.js';
import { ParserPreloader } from './parserPreloader.js';
import { ReactiveDictionary } from '../scopes/reactiveDictionary.js';

export const Parser = (function() {
    
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
    
    var updateParserOptions = function( options ){
        
        parserOptions.command = options.command || 'fullRender';
        parserOptions.root = options.root === undefined? parserOptions.root: options.root;
        parserOptions.dictionary = ( options.dictionary instanceof ReactiveDictionary?
            options.dictionary._getNonReactiveDictionary(): 
            options.dictionary )
            || parserOptions.dictionary;
        //parserOptions.dictionary = options.dictionary || parserOptions.dictionary;
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
                    command === 'partialRender'? options.target: parserOptions.root,
                    options.dictionaryExtension,
                    options.notRemoveGeneratedTags,
                    parserOptions.indexExpressions && command === 'fullRender',
                    options.goToURLHash === undefined? context.nextRunCounter() === 1: false
                );
            case 'update':
                return processUpdate( 
                    options.dictionaryChanges,
                    options.dictionaryActions
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
    
    var processRender = function( target, dictionaryExtension, notRemoveGeneratedTags, resetIndex, goToURLHash ){
        
        var parserRenderer = new ParserRenderer( 
            parserOptions, 
            target, 
            dictionaryExtension, 
            notRemoveGeneratedTags, 
            resetIndex,
            goToURLHash
        );

        parserRenderer.run();
        
        return parserRenderer;
    };
    
    var processUpdate = function( dictionaryChanges, dictionaryActions ) {
        
        var parserUpdater = new ParserUpdater( 
            dictionaryChanges,
            dictionaryActions,
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
