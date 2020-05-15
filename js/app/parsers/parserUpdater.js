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
var AbstractArrayAction = require( './dictionaryActions/abstractArrayAction.js' );

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
            if ( Array.isArray( newActionInstance ) ){
                dictionaryActionsInstances = dictionaryActionsInstances.concat( newActionInstance );
            } else {
                dictionaryActionsInstances.push( newActionInstance );
            }
        }
    };
    initializeDictionaryActionsInstances();
    
    var getStatistics = function(){
        return statistics;
    };

    var updateDictionaryForDictionaryChanges = function(){
        
        if ( dictionaryChanges ){
            utils.extend( parserOptions.dictionary, dictionaryChanges );
        }
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

            // Do all required HTML updates
            updateHTML();
            
        } catch( e ){
            log.fatal( 'Exiting run method of update command of ZPT with errors: ' + e );
            context.errorFunction( e );
        }
    };

    var updateHTML = function(){

        if ( updateHTMLFromActions( 0 ) ){
            updateHTMLFromVarChange();
        }
    };
    
    var updateHTMLFromActions = function( initial ){

        for ( var i = initial; i < dictionaryActionsInstances.length; ++i ){
            var actionInstance = dictionaryActionsInstances[ i ];
            
            // Update dictionary using action
            actionInstance.updateDictionary( parserOptions.dictionary );
            
            // Get the list of changes related to varName
            var list = attributeIndex.getVarsList( actionInstance.id );
            if ( ! list ){
                continue;
            }
            
            // Iterate list and update HTML if required
            if ( ! updateHTMLFromVarsList( actionInstance, i, 0, list ) ){
                return false;
            }
            /*
            for ( var j = 0; j < list.length; j++ ) {
                var indexItem = list[ j ];
                if ( ! actionInstance.attributeInstanceIsRelated( indexItem.attributeInstance ) ){
                    if ( ! utils.isFunction( indexItem.attributeInstance.updatableFromAction ) 
                            || indexItem.attributeInstance.updatableFromAction( self, findNodeById( indexItem.nodeId ) ) ){
                        buildDataFromVarChangeExcluding( actionInstance.id );
                    }
                    continue;
                }
                
                if ( ! actionInstance.updateHTML( 
                    indexItem, 
                    self, 
                    actionInstance, 
                    { 
                        actionInstance: actionInstance,
                        i: i, 
                        list: list,
                        initialJ: j 
                    }
                ) ){
                    return false;
                }
            }
            */
        }
        
        return true;
    };
    
    var updateHTMLFromVarsList = function( actionInstance, i, initialJ, list ){
        
        // Iterate list and update HTML if required
        for ( var j = initialJ; j < list.length; j++ ) {
            var indexItem = list[ j ];
            if ( ! actionInstance.attributeInstanceIsRelated( indexItem.attributeInstance ) ){
                if ( ! utils.isFunction( indexItem.attributeInstance.updatableFromAction ) 
                        || indexItem.attributeInstance.updatableFromAction( self, findNodeById( indexItem.nodeId ) ) ){
                    buildDataFromVarChangeExcluding( actionInstance.id );
                }
                continue;
            }

            if ( ! actionInstance.updateHTML( 
                indexItem, 
                self, 
                actionInstance, 
                { 
                    actionInstance: actionInstance,
                    i: i, 
                    initialJ: j,
                    list: list
                }
            ) ){
                return false;
            }
        }
        
        return true;
    };
    
    var continueUpdateHTML = function( continueData ){

        updateHTMLFromVarsList(
            continueData.actionInstance, 
            continueData.i, 
            continueData.initialJ + 1, 
            continueData.list
        );
        
        if ( updateHTMLFromActions( continueData.i + 1 ) ){
            updateHTMLFromVarChange();
        }
    };
    
    var runAnimation = function( actionInstance, node, callback ){
        
        // Build combinedCallback combining callback and actionInstance.animationCallback
        var combinedCallback = ! callback && ! actionInstance.animationCallback? 
            undefined:
            function(){
                if ( callback ){
                    callback();
                }
                if ( actionInstance.animationCallback ){
                    actionInstance.animationCallback();
                }
            };
        
        // Get animation manager to run animation
        context.getAnimationManager().animate( actionInstance, node, combinedCallback );
    };
    
    var updateHTMLFromVarChange = function(){
        
        // Update dictionary
        updateDictionaryForDictionaryChanges();
        
        // Build data
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
        buildDataFromList( varName, list );
    };
    
    var buildDataFromVarChangeExcluding = function( varName ){
        
        // Get the list of changes related to varName
        var list = attributeIndex.getVarsList( varName );
        
        var filtered = list.filter(
            function( indexItem, index, arr ){
                return ! AbstractArrayAction.staticAttributeInstanceIsRelated(
                    indexItem.attributeInstance
                );
            }
        );
        
        buildDataFromList( varName, filtered );
    };
    
    var buildDataFromList = function( varName, list ){
        
        if ( ! list ){
            return;
        }
        
        // Build data about all changes
        var length = list.length;
        for ( var i = 0; i < length; i++ ) {
            if ( ! addNewNodeAttribute( varName, list[ i ] ) ){
                attributeIndex.removeVar( varName, list[ i ].nodeId );
            }
        }
    };
    
    var findNodeById = function ( nodeId ) {
        
        return window.document.querySelector( 
            '[' + context.getTags().id + '="' + nodeId + '"]' 
        );
    };

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
        
        var scope = getNodeScope( node, indexItem.nodeId );
        
        attributeInstance.update( self, node, scope, indexItem );
        
        return true;
    };

    var getNodeScope = function( node, nodeId ){
        
        if ( ! nodeId ){
            nodeId = node.getAttribute( context.getTags().id );
        }
        
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
    
    var updateNode = function( node, mustRemoveGeneratedNodes ){
        
        // Remove related to node nodes
        attributeIndex.removeMultipleNodes(
            nodeRemover.removeMultipleNodes( node, mustRemoveGeneratedNodes )
        );
        
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
    /*
    var deleteNode = function( node ){
        node.parentNode.removeChild( node );
    };
    */
    var self = {
        run: run,
        updateNode: updateNode,
        //deleteNode: deleteNode,
        findNodeById: findNodeById,
        getNodeScope: getNodeScope,
        getStatistics: getStatistics,
        addUpdatedToStatistics: addUpdatedToStatistics,
        addRemovedToStatistics: addRemovedToStatistics,
        runAnimation: runAnimation,
        continueUpdateHTML: continueUpdateHTML
    };
    
    return self;
};

module.exports = ParserUpdater;
