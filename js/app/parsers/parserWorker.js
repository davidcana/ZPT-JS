/* 
    Class ParserWorker
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var NodeAttributes = require( './nodeAttributes.js' );
var attributeCache = require( '../cache/attributeCache.js' );
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

var ParserWorker = function( _target, _scope, _indexExpressions ) {
    
    var target = _target; 
    var scope = _scope;
    var indexExpressions = _indexExpressions;
    
    var tags = context.getTags();
    
    var run = function(){
        process( target );
    };
    
    var process = function( node ) {

        try {
            // Get the attributes from the node
            var attributes = new NodeAttributes( node, indexExpressions );
            
            scope.startElement();

            // Process instructions
            attributes.talRepeat != null ? 
                processLoop( node, attributes ):
                processElement( node, attributes );

            scope.endElement();

        } catch ( e ) {
            
            // Try to treat error
            if ( ! treatError( node, e ) ) {
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
    
    var processLoop = function( node, attributes ) {
        
        // Process repeat
        var talRepeat = TALRepeat.build( attributes.talRepeat );
        var loop = talRepeat.process( scope, node );

        // Check default
        if ( evaluateHelper.isDefault( loop.getItems() ) ){
            processElement( node, attributes );
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
            if ( ! processElement( tmpNode, attributes, autoDefineHelper ) ) {
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

    var treatError = function( node, exception ) {

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
    
    var processElement = function( node, attributes, _autoDefineHelper ) {

        // If it is defined a metalFillSlot or a metalDefineMacro do nothing
        if ( attributes.metalFillSlot || ! processMETALDefineMacro(
            node, 
            attributes.metalDefineMacro 
        ) ) {
            // Stop processing the rest of this node as it is invisible
            return false;
        }
        
        var autoDefineHelper = _autoDefineHelper || new AutoDefineHelper( node );
        
        if ( ! processDeclare( 
            attributes.talDeclare,
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
            attributes.i18nDomain, 
            autoDefineHelper
        );
        
        processAutoDefine( 
            node, 
            autoDefineHelper
        );
        
        ParserWorker.processDefine( 
            attributes.talDefine,  
            false,
            scope
        );
        
        if ( ! processCondition(
                node, 
                attributes.talCondition 
        ) ) {
            // Stop processing the rest of this node as it is invisible
            return false;
        }

        var omittedTag = processOmitTag(
                node, 
                attributes.talOmitTag 
        );

        var replaced = processReplace(
                node, 
                attributes.talReplace 
        );

        if ( ! omittedTag && ! replaced ) {
            
            processAttributes(
                    node, 
                    attributes.talAttributes 
            );

            if ( ! processContent(
                    node, 
                    attributes.talContent ) ) {

                defaultContent( node );
            }
        }

        processMETALUseMacro(
                node, 
                attributes.metalUseMacro, 
                attributes.talDefine,
                autoDefineHelper
        );
        
        return true;
    };

    var defaultContent = function( node ) {

        var childNodes = node.childNodes;
        if ( ! childNodes ) {
            return;
        }

        for ( var i = 0; i < childNodes.length; i++ ) {
            var currentChildNode = childNodes[ i ];

            // Check if node is ELEMENT_NODE and not parsed yet
            if ( currentChildNode && currentChildNode.nodeType == 1
                    && ! currentChildNode.getAttribute( tags.qdup ) ) {
                process( currentChildNode );
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
    
    var processAutoDefine = function( node, autoDefineHelper ) {
        
        var string = autoDefineHelper.updateNode( node );
        if ( ! string ) {
            return;
        }
        
        var talDefine = attributeCache.getByAttributeClass( TALDefine, string );
        return talDefine.process( scope, false );
    };

    var processI18nDomain = function( string, autoDefineHelper ) {

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
    
    var processDeclare = function( string, autoDefineHelper ) {

        if ( ! string ) {
            return true;
        }

        var talDeclare = attributeCache.getByAttributeClass( TALDeclare, string );
        return talDeclare.process( scope, autoDefineHelper );
    };
    
    var processMETALDefineMacro = function( node, string ) {

        if ( ! string ) {
            return true;
        }

        // No sense to cache macro definitions!
        var metalDefineMacro = METALDefineMacro.build( string );
        return metalDefineMacro.process( scope, node );
    };

    var processMETALUseMacro = function( node, string, stringDefine, autoDefineHelper ) {

        if ( ! string ) {
            return;
        }
        
        // No sense to cache macro uses!
        var metalUseMacro = METALUseMacro.build( string, stringDefine, scope );
        var newNode = metalUseMacro.process( scope, node, autoDefineHelper );
        newNode.setAttribute( tags.qdup, 1 );
        
        // Process new node
        return process( newNode );
    };

    var processCondition = function( node, string ) {

        if ( ! string ) {
            return true;
        }

        var talCondition = attributeCache.getByAttributeClass( TALCondition, string );
        return talCondition.process( scope, node );
    };
    
    var processReplace = function( node, string ) {
        
        if ( ! string ){
            return false;
        }
        
        var talReplace = attributeCache.getByAttributeClass( TALReplace, string );
        return talReplace.process( scope, node );
    };

    var processOmitTag = function( node, string ) {

        if ( string == null ) {
            return false;
        }

        var talOmitTag = attributeCache.getByAttributeClass( TALOmitTag, string );
        return talOmitTag.process( scope, node );
    };
    
    var processContent = function( node, string ) {
        
        if ( ! string ){
            return false;
        }

        var talContent = attributeCache.getByAttributeClass( TALContent, string );
        return talContent.process( scope, node );
    };
  
    var processAttributes = function( node, string ) {

        if ( ! string ) {
            return;
        }

        var talAttributes = attributeCache.getByAttributeClass( TALAttributes, string );
        return talAttributes.process( scope, node );
    };
    
    var self = {
        run: run
    };
    
    return self;
};

ParserWorker.processDefine = function( string, forceGlobal, _scope ) {

    if ( ! string ) {
        return;
    }

    var talDefine = attributeCache.getByAttributeClass( TALDefine, string );
    return talDefine.process( _scope, forceGlobal );
};

module.exports = ParserWorker;
