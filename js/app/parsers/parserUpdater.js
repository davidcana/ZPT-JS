/* 
    Class ParserUpdater
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );
var ParserNodeRenderer = require( './parserNodeRenderer.js' );
var nodeRemover = require( './nodeRemover.js' );
var utils = require( '../utils.js' );
var dictionaryActionBuilder = require( './dictionaryActions/dictionaryActionBuilder.js' );

var ParserUpdater = function( _dictionaryChanges, _dictionaryActions, _parserOptions ) {
    
    var dictionaryChanges = _dictionaryChanges;
    var dictionaryActions = _dictionaryActions;
    var parserOptions = _parserOptions;
    
    var scopeMap = {};
    var nodeAttributes, 
        statistics;
    var dictionaryActionsInstances;
    
    var initializeDictionaryActionsInstances = function(){
        
        dictionaryActionsInstances = [];
        
        if ( ! dictionaryActions ){
            return;
        }
        
        for ( var i = 0; i < dictionaryActions.length; ++i ){
            var action = dictionaryActions[ i ];
            var newActionInstance = dictionaryActionBuilder.build( action, parserOptions.dictionary );
            dictionaryActionsInstances.push( newActionInstance );
        }
    };
    initializeDictionaryActionsInstances();
    
    var getStatistics = function(){
        return statistics;
    };
    
    var updateDictionaryUsingActions = function(){
    
        for ( var i = 0; i < dictionaryActionsInstances.length; ++i ){
            var actionInstance = dictionaryActionsInstances[ i ];
            
            // Update dictionary using action
            actionInstance.updateDictionary( parserOptions.dictionary );
            
            // Add the var to the varNamesMap
            //varNamesMap[ actionInstance.id ] = dictionary[ actionInstance.id ];
        }
    };
    
    var updateDictionary = function(){
        
        if ( dictionaryChanges ){
            utils.extend( parserOptions.dictionary, dictionaryChanges );
        }
        
        if ( dictionaryActions ){
            updateDictionaryUsingActions();
        }
    };
    
    var buildData = function(){
        
        for ( var varName in dictionaryChanges ){
            buildDataFromVarChange( varName );
        }
        /*
        for ( var varNameFromActionsMap in varNamesFromActionsMap ){
            buildDataFromAction( varNameFromActionsMap );
        }
        */
    };
    
    var addUpdatedToStatistics = function(){
        ++statistics.totalUpdates;
    };
    
    var addRemovedToStatistics = function(){
        ++statistics.removedNodeUpdates;
    };
    
    var run = function(){
        
        try {
            // Check the index was built
            if ( ! parserOptions.indexExpressions ){
                throw 'Unable to update, no index built! Set indexExpressions to true!';
            }
            
            // Init some vars
            nodeAttributes = {};
            statistics = {
                totalUpdates: 0,
                removedNodeUpdates: 0
            };
            
            // Update dictionary
            updateDictionary();

            // Build data
            buildData();

            // Do all required HTML updates
            updateHTML();
            
        } catch( e ){
            log.fatal( 'Exiting run method of update command of ZPT with errors: ' + e );
            context.errorFunction( e );
        }
    };

    var updateHTML = function(){

        updateHTMLFromVarChange();
        updateHTMLFromActions();
    };
    
    var updateHTMLFromActions = function(){

        for ( var i = 0; i < dictionaryActionsInstances.length; ++i ){
            var actionInstance = dictionaryActionsInstances[ i ];
            
            // Get the list of changes related to varName
            var list = attributeIndex.getVarsList( actionInstance.id );
            if ( ! list ){
                continue;
            }
            
            // Iterate list and udate HTML if required
            for ( var j = 0; j < list.length; j++ ) {
                var indexItem = list[ j ];
                if ( ! actionInstance.attributeInstanceIsRelated( indexItem.attributeInstance ) ){
                    continue;
                }
                actionInstance.updateHTML( indexItem, self );
            }
        }
    };
    
    var updateHTMLFromVarChange = function(){
        
        // Update attributes
        for ( var i in nodeAttributes ) {
            var currentNodeAttributeList = nodeAttributes[ i ];
            for ( var j in currentNodeAttributeList ){
                updateAttribute( currentNodeAttributeList[ j ] );   
            }
        }
    };
    /*
    var buildDataFromAction = function( varName ){
        
        // Get the list of changes related to varName
        var list = attributeIndex.getVarsList( varName );
        if ( ! list ){
            return;
        }
        
        // Build data about all changes
        var length = list.length;
        for ( var i = 0; i < length; i++ ) {
            var attributeInstance = list[ i ];
            if ( ! addNewNodeAttribute( varName, list[ i ] ) ){
                attributeIndex.remove( varName, list[ i ].nodeId );
            }
        }
    };
    */
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
        
        return window.document.querySelector( 
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
        
        var attributeInstance = indexItem.attributeInstance;
        var node = findNodeById( indexItem.nodeId );
        if ( ! node ){
            // Removed node!
            ++statistics.removedNodeUpdates;
            return false;
        }
        
        ++statistics.totalUpdates;
        
        var scope = getNodeScope( indexItem.nodeId, node );
        
        attributeInstance.update( self, node, scope, indexItem );
        
        return true;
    };

    var getNodeScope = function( nodeId, node ){
        
        var thisScope = scopeMap[ nodeId ];
        
        if ( ! thisScope ){
            thisScope = scopeBuilder.build( 
                parserOptions, 
                node, 
                undefined,
                true
            );
            scopeMap[ nodeId ] = thisScope;
        }

        return thisScope;
    };
    
    var updateNode = function( node ){
        
        // Remove related to node nodes
        nodeRemover.removeRelatedNodes( node );
        
        // Instance and invoke parserNodeRenderer to update node
        var parserNodeRenderer = new ParserNodeRenderer( 
            node, 
            scopeBuilder.build( 
                parserOptions, 
                node, 
                undefined,
                true
            ),
            true
        );
        parserNodeRenderer.run();
    };

    var deleteNode = function( node ){
        node.parentNode.removeChild( node );
        
        //TODO update next siblings?
    };
    
    var self = {
        run: run,
        updateNode: updateNode,
        deleteNode: deleteNode,
        //updateAttribute: updateAttribute,
        findNodeById: findNodeById,
        getNodeScope: getNodeScope,
        getStatistics: getStatistics,
        addUpdatedToStatistics: addUpdatedToStatistics,
        addRemovedToStatistics: addRemovedToStatistics
    };
    
    return self;
};

module.exports = ParserUpdater;
