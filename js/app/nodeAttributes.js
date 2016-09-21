/* Class NodeAttributes */
var NodeAttributes = function( node ) {
    
    var tags = jsptContext.getTags();
    
    // tal namespace
    this.talDefine = node.getAttribute( tags.talDefine );
    this.talCondition = node.getAttribute( tags.talCondition );
    this.talRepeat = node.getAttribute( tags.talRepeat );
    this.talContent = node.getAttribute( tags.talContent );
    this.talAttributes = node.getAttribute( tags.talAttributes );
    this.talOmitTag = node.getAttribute( tags.talOmitTag );
    this.talReplace = node.getAttribute( tags.talReplace );
    this.talOnError = node.getAttribute( tags.talOnError );
    this.talTag = undefined;
    
    // metal namespace
    this.metalDefineMacro = node.getAttribute( tags.metalDefineMacro );
    this.metalUseMacro = node.getAttribute( tags.metalUseMacro );
    this.metalDefineSlot = node.getAttribute( tags.metalDefineSlot );
    this.metalFillSlot = node.getAttribute( tags.metalFillSlot );;
    
    // i18n namespace
    this.i18nDomain = undefined;
    this.i18nDefine = undefined;
    this.i18nContent = undefined;
    this.i18nParams = undefined;
    this.i18nAttributes = undefined;
    this.i18nOnError = undefined;
    
};
