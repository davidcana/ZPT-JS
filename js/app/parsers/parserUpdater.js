/* 
    Class ParserUpdater
*/
"use strict";

var context = require( '../context.js' );
var log = require( '../logHelper.js' );
var attributeIndex = require( '../attributes/attributeIndex.js' );

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

var ParserUpdater = function( _scope, _dictionaryChanges ) {
    
    var scope = _scope;
    var dictionaryChanges = _dictionaryChanges;
    
    var run = function(){
        
        for ( var varName in dictionaryChanges ){
            var varValue = dictionaryChanges[ varName ];
            processVarChange( varName, varValue );
        }
    };

    var processVarChange = function( varName, varValue ){
        
        // Update scope
        scope.setVar( varName, varValue );
        
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
            throw 'Node ' + indexItem.nodeId + ' not found!';
        }
        
        switch ( attributeInstance.type ){
            case TALDefine.id:
                
                break;
            case TALRepeat.id:
                
                break;
            case I18NDomain.id:
            case I18NLanguage.id:
            case TALOnError.id:
                attributeInstance.putToAutoDefineHelper( autoDefineHelper );
                break;
            case TALAttributes.id:
                attributeInstance.process( scope, node, indexItem.groupId );
                break;
            case TALCondition.id:
            case TALContent.id:
            case METALDefineMacro.id:
            //case TALOmitTag.id:
            //case TALReplace.id:
                attributeInstance.process( scope, node );
                break;
            case METALUseMacro.id:
                
                break;
            case TALDeclare.id:
                attributeInstance.process( scope, autoDefineHelper );
                break;
            default:
                throw 'Unsupported attribute type: ' + attributeInstance.type;
        }
    };
    
    var self = {
        run: run
    };
    
    return self;
};

module.exports = ParserUpdater;
