/* 
    Class ParserPreloader
*/
//var context = require( '../context.js' );
//var log = require( '../logHelper.js' );
//var nodeRemover = require( './nodeRemover.js' );
//var Scope = require( '../scopes/scope.js' );
//var i18nHelper = require( '../i18n/i18nHelper.js' );
//var resolver = require( '../resolver.js' );
//var attributeIndex = require( '../attributes/attributeIndex.js' );

import { context } from '../context.js';
import { logHelper as log } from '../logHelper.js';
import { nodeRemover } from './nodeRemover.js';
import { Scope } from '../scopes/scope.js';
import { i18nHelper } from '../i18n/i18nHelper.js';
import { resolver } from '../resolver.js';

export const ParserPreloader = function( _parserOptions, _callback, _failCallback, _declaredRemotePageUrls, _i18n, _notRemoveGeneratedTags, _maxFolderDictionaries ) {
    
    var parserOptions = _parserOptions;
    var callback = _callback;
    var failCallback = _failCallback;
    var declaredRemotePageUrls = _declaredRemotePageUrls;
    var i18n = _i18n;
    var notRemoveGeneratedTags = _notRemoveGeneratedTags;
    var maxFolderDictionaries = _maxFolderDictionaries;
    
    var run = function(){

        try {
            if ( ! notRemoveGeneratedTags ){
                nodeRemover.removeGeneratedNodes( parserOptions.root );
                /*
                attributeIndex.removeMultipleNodes(
                    nodeRemover.removeGeneratedNodes( parserOptions.root )
                );
                */
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

    
    var self = {
        run: run
    };
    
    return self;
};

//module.exports = ParserPreloader;
