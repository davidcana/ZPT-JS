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
        
        try {
            // Check the index was built
            if ( ! parserOptions.indexExpressions ){
                throw 'Unable to update, no index built! Set indexExpressions to true!';
            }

            // Update dictionary
            utils.extend( parserOptions.dictionary, dictionaryChanges );

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
            
        } catch( e ){
            log.fatal( 'Exiting run method of update command of ZPT with errors: ' + e );
            context.errorFunction( e );
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

    var self = {
        run: run,
        updateNode: updateNode,
        getStatistics: getStatistics
    };
    
    return self;
};

module.exports = ParserUpdater;
