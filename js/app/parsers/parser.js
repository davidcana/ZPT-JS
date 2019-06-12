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
var NodeAttributes = require( './nodeAttributes.js' );
var attributeCache = require( '../cache/attributeCache.js' );
var i18nHelper = require( '../i18n/i18nHelper.js' );
var AutoDefineHelper = require( './autoDefineHelper.js' );
var evaluateHelper = require( '../expressions/evaluateHelper.js' );

var I18NDomain = require( '../attributes/I18N/i18nDomain.js' );
var I18NLanguage = require( '../attributes/I18N/i18nLanguage.js' );
var METALDefineMacro = require( '../attributes/METAL/metalDefineMacro.js' );
var METALUseMacro = require( '../attributes/METAL/metalUseMacro.js' );
var TALAttributes = require( '../attributes/TAL/talAttributes.js' );
var TALCondition = require( '../attributes/TAL/talCondition.js' );
var TALContent = require( '../attributes/TAL/talContent.js' );
var TALDefine = require( '../attributes/TAL/talDefine.js' );
var TALOmitTag = require( '../attributes/TAL/talOmitTag.js' );
var TALOnError = require( '../attributes/TAL/talOnError.js' );
var TALRepeat = require( '../attributes/TAL/talRepeat.js' );
var TALReplace = require( '../attributes/TAL/talReplace.js' );
var TALDeclare = require( '../attributes/TAL/talDeclare.js' );
var contentHelper = require( '../attributes/TAL/contentHelper.js' );

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
    
        // command == 'preload'
        if ( options.command == 'preload' ){
            preload(
                options.callback,
                options.failCallback,
                options.declaredRemotePageUrls || [],
                options.i18n,
                options.notRemoveGeneratedTags,
                options.maxFolderDictionaries
            );
            return;
        } 
        
        // command == 'partialRender' or command == 'fullRender'
        render(
            parserOptions.command == 'partialRender'? options.target: parserOptions.root,
            options.dictionaryExtension,
            options.notRemoveGeneratedTags,
            options.indexExpressions
        );
    };
    
    var render = function( target, dictionaryExtension, notRemoveGeneratedTags, indexExpressions ){
        
        try {
            if ( ! target ){
                throw 'Unable to process null root or target!';
            }
            
            if ( ! notRemoveGeneratedTags ){
                removeGeneratedTagsFromAllTargetElements( target );
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
        
        process( 
            target, 
            scopeBuilder.build( 
                parserOptions, 
                target, 
                self, 
                dictionaryExtension
            ),
            indexExpressions
        );
    };
    
    var process = function( node, scope, indexExpressions ) {

        try {
            // Get the attributes from the node
            var attributes = new NodeAttributes( node, indexExpressions );
            
            scope.startElement();

            // Process instructions
            attributes.talRepeat != null ? 
                processLoop( node, attributes, scope, indexExpressions ):
                processElement( node, attributes, scope, undefined, indexExpressions );

            scope.endElement();

        } catch ( e ) {
            
            // Try to treat error
            if ( ! treatError( node, scope, e ) ) {
                throw e;
            }
        }
    };
    
    var processLoopNextSibling = function( node ){

        var counter = -1;
        var nextSibling = node;
        do {
            ++counter;
            nextSibling = nextSibling.nextElementSibling;
            if ( ! nextSibling ){
                return {
                    nextSibling: null,
                    counter: counter
                };
            }
        } while ( nextSibling.hasAttribute( tags.qdup ) );

        return {
            nextSibling: nextSibling,
            counter: counter
        };
    };
    
    var processLoop = function( node, attributes, scope, indexExpressions ) {
        
        // Process repeat
        var talRepeat = TALRepeat.build( attributes.talRepeat );
        var loop = talRepeat.process( scope, node );

        // Check default
        if ( evaluateHelper.isDefault( loop.getItems() ) ){
            processElement( node, attributes, scope, undefined, indexExpressions );
            return true;
        }
        
        // Configure the node to clone it later
        node.removeAttribute( tags.talRepeat );
        node.removeAttribute( 'style' );
        node.setAttribute( tags.qdup, 1 );
        var nodeId = node.getAttribute( 'id' );
        node.removeAttribute( 'id' );
        
        var nextSiblingData = processLoopNextSibling( node );
        var nextSibling = nextSiblingData.nextSibling;
        loop.setOffset( nextSiblingData.counter );
        //log.warn( 'loop counter: ' + nextSiblingData.counter );
        
        var autoDefineHelper;
        while ( autoDefineHelper = loop.repeat() ) {
            
            scope.startElement();
            
            // Get tmpNode
            var tmpNode = node.cloneNode( true );
            if ( 'form' in tmpNode ) {
                tmpNode.checked = false;
            }

            // Insert it
            var parentNode = node.parentNode;
            parentNode.insertBefore( tmpNode, nextSibling );
            
            // Process it
            if ( ! processElement( tmpNode, attributes, scope, autoDefineHelper, indexExpressions ) ) {
                scope.endElement();
                return false;
            }
            
            scope.endElement();
        }

        // Configure repeat node (the original) to enable future reevaluation
        node.style.display = 'none';
        node.setAttribute( tags.talRepeat, attributes.talRepeat );
        if ( nodeId !== '' && nodeId != null ){
            node.setAttribute( 'id', nodeId );
        }
        node.removeAttribute( tags.qdup );
        
        return true;
    };

    var treatError = function( node, scope, exception ) {

        try {
            // Set the error variable
            var templateError = {
                type: exception.name,
                value: exception.message,
                traceback: exception.stack
            };
            scope.set( 
                context.getConf().templateErrorVarName, 
                templateError 
            );
            
            // Exit if there is no on-error expression defined
            var content = scope.get( context.getConf().onErrorVarName );
            if ( content == null ) {
                log.fatal( exception );
                scope.endElement();
                return false;
            }
            
            log.error( exception );
            scope.endElement();
            
            contentHelper.updateNode( 
                node, 
                scope.get( context.getConf().onErrorStructureVarName ), 
                content 
            );
            
            return content;
            
        } catch ( e ) {
            log.fatal( e );
            scope.endElement();
            throw e;
        }
    };
    
    var processElement = function( node, attributes, scope, _autoDefineHelper, indexExpressions ) {

        // If it is defined a metalFillSlot or a metalDefineMacro do nothing
        if ( attributes.metalFillSlot || ! processMETALDefineMacro(
            node, 
            scope, 
            attributes.metalDefineMacro 
        ) ) {
            // Stop processing the rest of this node as it is invisible
            return false;
        }
        
        var autoDefineHelper = _autoDefineHelper || new AutoDefineHelper( node );
        
        if ( ! processDeclare( 
            attributes.talDeclare,
            scope,
            autoDefineHelper
        ) ) {
            // Stop processing the rest of this node as it is invisible
            return false;
        }
        
        processOnError( 
            attributes.talOnError,
            autoDefineHelper
        );
        
        processI18nLanguage( 
            attributes.i18nLanguage,
            autoDefineHelper
        );
        
        processI18nDomain(  
            scope, 
            attributes.i18nDomain, 
            autoDefineHelper
        );
        
        processAutoDefine( 
            scope, 
            node, 
            autoDefineHelper
        );
        
        processDefine( 
            scope, 
            attributes.talDefine,  
            false
        );
        
        if ( ! processCondition(
                node, 
                scope, 
                attributes.talCondition 
        ) ) {
            // Stop processing the rest of this node as it is invisible
            return false;
        }

        var omittedTag = processOmitTag(
                node, 
                scope, 
                attributes.talOmitTag 
        );

        var replaced = processReplace(
                node, 
                scope, 
                attributes.talReplace 
        );

        if ( ! omittedTag && ! replaced ) {
            
            processAttributes(
                    node, 
                    scope, 
                    attributes.talAttributes 
            );

            if ( ! processContent(
                    node, 
                    scope, 
                    attributes.talContent ) ) {

                defaultContent( node, scope, indexExpressions );
            }
        }

        processMETALUseMacro(
                node, 
                scope, 
                attributes.metalUseMacro, 
                attributes.talDefine,
                autoDefineHelper
        );
        
        return true;
    };

    var defaultContent = function( node, scope, indexExpressions ) {

        var childNodes = node.childNodes;
        if ( ! childNodes ) {
            return;
        }

        for ( var i = 0; i < childNodes.length; i++ ) {
            var currentChildNode = childNodes[ i ];

            // Check if node is ELEMENT_NODE and not parsed yet
            if ( currentChildNode && currentChildNode.nodeType == 1
                    && ! currentChildNode.getAttribute( tags.qdup ) ) {
                process( currentChildNode, scope, indexExpressions );
            }
        }
    };
    
    var processOnError = function( string, autoDefineHelper ) {

        if ( ! string ) {
            return;
        }

        var talOnError = attributeCache.getByAttributeClass( TALOnError, string );
        return talOnError.putToAutoDefineHelper( autoDefineHelper );
    };
    
    var processAutoDefine = function( scope, node, autoDefineHelper ) {
        
        var string = autoDefineHelper.updateNode( node );
        if ( ! string ) {
            return;
        }
        
        var talDefine = attributeCache.getByAttributeClass( TALDefine, string );
        return talDefine.process( scope, false );
    };
    
    var processDefine = function( scope, string, forceGlobal ) {

        if ( ! string ) {
            return;
        }
        
        var talDefine = attributeCache.getByAttributeClass( TALDefine, string );
        return talDefine.process( scope, forceGlobal );
    };

    var processI18nDomain = function( scope, string, autoDefineHelper ) {

        if ( ! string ) {
            return;
        }

        var i18nDomain = attributeCache.getByAttributeClass( I18NDomain, string );
        return i18nDomain.putToAutoDefineHelper( scope, autoDefineHelper );
    };
    
    var processI18nLanguage = function( string, autoDefineHelper ) {

        if ( ! string ) {
            return;
        }

        var i18nLanguage = attributeCache.getByAttributeClass( I18NLanguage, string );
        return i18nLanguage.putToAutoDefineHelper( autoDefineHelper );
    };
    
    var processDeclare = function( string, scope, autoDefineHelper ) {

        if ( ! string ) {
            return true;
        }

        var talDeclare = attributeCache.getByAttributeClass( TALDeclare, string );
        return talDeclare.process( scope, autoDefineHelper );
    };
    
    var processMETALDefineMacro = function( node, scope, string ) {

        if ( ! string ) {
            return true;
        }

        // No sense to cache macro definitions!
        var metalDefineMacro = METALDefineMacro.build( string );
        return metalDefineMacro.process( scope, node );
    };

    var processMETALUseMacro = function( node, scope, string, stringDefine, autoDefineHelper ) {

        if ( ! string ) {
            return;
        }
        
        // No sense to cache macro uses!
        var metalUseMacro = METALUseMacro.build( string, stringDefine, scope );
        var newNode = metalUseMacro.process( scope, node, autoDefineHelper );
        newNode.setAttribute( tags.qdup, 1 );
        
        // Process new node
        return process( newNode, scope );
    };

    var processCondition = function( node, scope, string ) {

        if ( ! string ) {
            return true;
        }

        var talCondition = attributeCache.getByAttributeClass( TALCondition, string );
        return talCondition.process( scope, node );
    };
    
    var processReplace = function( node, scope, string ) {
        
        if ( ! string ){
            return false;
        }
        
        var talReplace = attributeCache.getByAttributeClass( TALReplace, string );
        return talReplace.process( scope, node );
    };

    var processOmitTag = function( node, scope, string ) {

        if ( string == null ) {
            return false;
        }

        var talOmitTag = attributeCache.getByAttributeClass( TALOmitTag, string );
        return talOmitTag.process( scope, node );
    };
    
    var processContent = function( node, scope, string ) {
        
        if ( ! string ){
            return false;
        }

        var talContent = attributeCache.getByAttributeClass( TALContent, string );
        return talContent.process( scope, node );
    };
  
    var processAttributes = function( node, scope, string ) {

        if ( ! string ) {
            return;
        }

        var talAttributes = attributeCache.getByAttributeClass( TALAttributes, string );
        return talAttributes.process( scope, node );
    };
    
    var getOptions = function(){
        return parserOptions;
    };
    
    var self = {
        run: run,
        getOptions: getOptions,
        processDefine: processDefine
    };
    
    return self;
})();
