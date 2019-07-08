/* 
    Class ParserRenderer
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeCache = require( '../cache/attributeCache.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var nodeRemover = require( './nodeRemover.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );
var ParserNodeRenderer = require( './parserNodeRenderer.js' );

var ParserRenderer = function( _parserOptions, _target, _dictionaryExtension, _notRemoveGeneratedTags, _resetIndex ) {
    
    var parserOptions = _parserOptions;
    var target = _target; 
    var dictionaryExtension = _dictionaryExtension;
    var notRemoveGeneratedTags = _notRemoveGeneratedTags;
    var resetIndex = _resetIndex;
    
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

        } catch( e ){
            log.fatal( 'Exiting run method of ZPT with errors: ' + e );
            context.errorFunction( e );
            //throw e;
        }
    };

    var processAllTargetElements = function() {

        // Is multiroot?
        if ( $.isArray( target ) ){ 
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
    
    var self = {
        run: run
    };
    
    return self;
};

module.exports = ParserRenderer;
