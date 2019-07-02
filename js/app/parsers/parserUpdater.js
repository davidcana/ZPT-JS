/* 
    Class ParserUpdater
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );
var ParserWorker = require( './parserWorker.js' );
var nodeRemover = require( './nodeRemover.js' );

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

var ParserUpdater = function( _dictionaryChanges, _parserOptions ) {
    
    var dictionaryChanges = _dictionaryChanges;
    var parserOptions = _parserOptions;
    
    var scopeMap = {};
    var nodeAttributes, 
        statistics;
    
    var getStatistics = function(){
        return statistics;
    };
    
    var run = function(){
        
        // Init some vars
        nodeAttributes = {};
        statistics = {
            totalUpdates: 0,
            removedNodeUpdates: 0
        };
        
        // Build data form changed vars
        for ( var varName in dictionaryChanges ){
            buildDataFromVarChange( varName );
        }
        
        // Update attributes
        for ( var i in nodeAttributes ) {
            var currentNodeAttributeList = nodeAttributes[ i ];
            for ( var j in currentNodeAttributeList ){
                updateAttribute( currentNodeAttributeList[ j ] );   
            }
        } 
    };

    var buildDataFromVarChange = function( varName ){
        
        // Get the list of changes related to varName
        var list = attributeIndex.getVarsList( varName );
        if ( ! list ){
            return;
        }
        
        // Build data about all changes
        var length = list.length;
        for ( var i = 0; i < length; i++ ) {
            if ( ! addNewNodeAttribute( varName, list[ i ] ) ){
                attributeIndex.remove( varName, list[ i ].nodeId );
            }
        }
    };
    
    var findNodeById = function ( nodeId ) {
        
        return document.querySelector( 
            '[' + context.getTags().id + '="' + nodeId + '"]' 
        );
    }

    var addNewNodeAttribute = function( varName, indexItem ){

        var attributeInstance = indexItem.attributeInstance;
        var node = findNodeById( indexItem.nodeId );
        if ( ! node ){
            // Removed node!
            ++statistics.removedNodeUpdates;
            return false;
        }

        // Add data to nodeData
        var thisNodeData = nodeAttributes[ indexItem.nodeId ];
        if ( ! thisNodeData ){
            thisNodeData = {};
            nodeAttributes[ indexItem.nodeId ] = thisNodeData;
        }
        var elementId = indexItem.groupId? 
            attributeInstance.type + '/' + indexItem.groupId: 
            attributeInstance.type;
        thisNodeData[ elementId ] = indexItem;

        return true;
    };
    
    var updateAttribute = function( indexItem ){
        
        ++statistics.totalUpdates;
        
        var attributeInstance = indexItem.attributeInstance;
        var node = findNodeById( indexItem.nodeId );
        if ( ! node ){
            // Removed node!
            ++statistics.removedNodeUpdates;
            return false;
        }
        
        var scope = getNodeScope( indexItem.nodeId, node );
        
        switch ( attributeInstance.type ){
                
            case TALAttributes.id:
                attributeInstance.process( scope, node, indexItem.groupId );
                break;
                
            case TALContent.id:
                attributeInstance.process( scope, node );
                break;
                
            case TALRepeat.id:
            case TALCondition.id:
            case METALUseMacro.id:
                updateNode( node );
                break;
                
            case TALDefine.id:
            case TALOmitTag.id:
            case TALReplace.id:
            case TALOnError.id:
            case TALDeclare.id:
            case I18NDomain.id:
            case I18NLanguage.id:
                // Nothing to do
                break;
                
            default:
                throw 'Unsupported attribute type: ' + attributeInstance.type;
        }
        
        return true;
    };

    var getNodeScope = function( nodeId, node ){
        
        var thisScope = scopeMap[ nodeId ];
        
        if ( ! thisScope ){
            thisScope = scopeBuilder.build( 
                parserOptions, 
                node, 
                dictionaryChanges,
                true
            );
            scopeMap[ nodeId ] = thisScope;
        }

        return thisScope;
    };
    
    var updateNode = function( node ){
        
        // Remove related to node nodes
        nodeRemover.removeRelatedNodes( node );
        
        // Instance and invoke parserWorker to update node
        var parserWorker = new ParserWorker( 
            node, 
            scopeBuilder.build( 
                parserOptions, 
                node, 
                dictionaryChanges,
                true
            ),
            true
        );
        parserWorker.run();
    };

    var self = {
        run: run,
        getStatistics: getStatistics
    };
    
    return self;
};

module.exports = ParserUpdater;
