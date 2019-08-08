/* 
    Class ParserRenderer
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeCache = require( '../cache/attributeCache.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var nodeRemover = require( './nodeRemover.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );
var ParserNodeRenderer = require( './parserNodeRenderer.js' );

var ParserRenderer = function( _parserOptions, _target, _dictionaryExtension, _notRemoveGeneratedTags, _resetIndex, _goToURLHash ) {
    
    var parserOptions = _parserOptions;
    var target = _target;
    var dictionaryExtension = _dictionaryExtension;
    var notRemoveGeneratedTags = _notRemoveGeneratedTags;
    var resetIndex = _resetIndex;
    var goToURLHash = _goToURLHash;
    
    var run = function(){
        process();
    };
    
    var process = function(){

        try {
            if ( ! target ){
                throw 'Unable to process null root or target!';
            }

            if ( ! notRemoveGeneratedTags ){
                nodeRemover.removeGeneratedNodes( target );
            }

            if ( resetIndex ){
                attributeIndex.reset();
                attributeCache.reset();
            }

            processAllTargetElements();
            
            if ( goToURLHash ){
                processGoToURLHash();
            }

        } catch( e ){
            log.fatal( 'Exiting run method of ZPT with errors: ' + e );
            context.errorFunction( e );
            //throw e;
        }
    };

    var processAllTargetElements = function() {

        // Is multiroot?
        if ( Array.isArray( target ) ){ 
            // There are several roots
            for ( var c = 0; c < target.length; c++ ) {
                process1Target( target[ c ] );
            }
        } else {
            // There is only one root
            process1Target( target );
        }
    };

    var process1Target = function( currentTarget ) {

        var parserNodeRenderer = new ParserNodeRenderer( 
            currentTarget, 
            scopeBuilder.build( 
                parserOptions, 
                currentTarget, 
                dictionaryExtension,
                parserOptions.command == 'partialRender'
            ),
            parserOptions.indexExpressions
        );

        parserNodeRenderer.run();
    };
    
    var processGoToURLHash = function(){
        
        var id = decodeURI( window.location.hash ).substr( 1 );
        if ( ! id ){
            return;
        }
        
        var element = window.document.getElementById( id );
        if ( ! element ){
            log.warn( 'Unable to go to URL hash. Element with id "' + id + '" not found!' );
            return;
        }

        // Go to hash
        window.location.href = '#' + id;
    };
    
    var self = {
        run: run
    };
    
    return self;
};

module.exports = ParserRenderer;
