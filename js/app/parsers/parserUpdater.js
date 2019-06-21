/* 
    Class ParserUpdater
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );
var scopeBuilder = require( '../scopes/scopeBuilder.js' );

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
    
    var run = function(){
        
        for ( var varName in dictionaryChanges ){
            var varValue = dictionaryChanges[ varName ];
            processVarChange( varName, varValue );
        }
    };

    var processVarChange = function( varName, varValue ){
        
        // Update scope
        //scope.setVar( varName, varValue );
        
        // Update attributes
        var list = attributeIndex.getVarsList( varName );
        for ( var i = 0; i < list.length; i++ ) {
            updateAttribute( varName, varValue, list[ i ] );
        }
    };

    var updateAttribute = function( varName, varValue, indexItem ){
        
        var attributeInstance = indexItem.attributeInstance;
        var node = document.querySelector( 
            '[' + context.getTags().id + '="' + indexItem.nodeId + '"]' 
        );
        if ( ! node ){
            throw indexItem.nodeId + ' node not found!';
        }
        
        var scope = getNodeScope( indexItem.nodeId, node );
        
        switch ( attributeInstance.type ){
            case TALAttributes.id:
                attributeInstance.process( scope, node, indexItem.groupId );
                break;
            case TALContent.id:
                attributeInstance.process( scope, node );
                break;
            case TALDefine.id:
                //alert( 'varName: '  + varName + '\ngroupId: ' + indexItem.groupId );
                processVarChange( indexItem.groupId );
                break;
                
                
            case I18NDomain.id:
            case I18NLanguage.id:
                attributeInstance.putToAutoDefineHelper( autoDefineHelper );
                break;
            case TALCondition.id:
                attributeInstance.process( scope, node );
                break;
            case TALRepeat.id:

                break;
            case METALUseMacro.id:
                
                break;
                
                
            case TALOmitTag.id:
            case TALReplace.id:
            case TALOnError.id:
            case TALDeclare.id:
                // Nothing to do
                break;
            default:
                throw 'Unsupported attribute type: ' + attributeInstance.type;
        }
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
    
    var self = {
        run: run
    };
    
    return self;
};

module.exports = ParserUpdater;
