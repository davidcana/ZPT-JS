/* ZPTContext singleton class */
var zptContext = (function() {
    
    /* Tags */
    var defaultTags = {
            talCondition:     "data-tcondition",
            talRepeat:        "data-trepeat",
            talAttributes:    "data-tattributes",
            talContent:       "data-tcontent",
            talDefine:        "data-tdefine",
            talOmitTag:       "data-tomit-tag",
            talReplace:       "data-treplace",
            talOnError:       "data-ton-error",
            qdup:             "data-qdup",
            metalDefineMacro: "data-mdefine-macro",
            metalUseMacro:    "data-muse-macro",
            metalDefineSlot:  "data-mdefine-slot",
            metalFillSlot:    "data-mfill-slot",
            metalMacro:       "data-mmacro",
            i18nAttributes:    "data-iattributes",
            i18nContent:       "data-icontent",
            i18nDefine:        "data-idefine",
            i18nDomain:        "data-idomain",
            i18nReplace:       "data-ireplace",
            i18nOnError:       "data-ion-error"
    };
    var tags = defaultTags;
    var tal = '';
    //var self = this;
    
    var getTags = function (){
        return tags;
    };
    
    var setTags = function ( tagsToSet ){
        tags = tagsToSet;
        tal = '';
    };
    
    var getTal = function (){
        if ( tal == '' ){
            var c = 0;
            var notInclude = tags.qdup;
            for ( property in tags ) {
                if ( notInclude == tags[ property ] ){
                    continue;
                }
                if ( c++ > 0){
                    tal += ",";
                }
                tal += "*[" + tags[ property ] + "]";
            }
        }
        
        return tal;
    };
    /* End Tags */
    
    /* Formatters */
    var formatters = {};
    formatters.lowerCase = function ( value ){
        return value.toLocaleLowerCase();
    };
    formatters.upperCase = function ( value ){
        return value.toLocaleUpperCase();
    };
    formatters.localeDate = function ( value ){
        return value.toLocaleDateString;
    };
    formatters.localeTime = function ( value ){
        return value.toLocaleTimeString;
    };
    formatters.localeString = function ( value, locale ){
        return locale? 
               value.toLocaleString( value, locale ): 
               value.toLocaleString( value );
    };
    formatters.fix = function ( number, fixTo ){
        return number.toFixed( fixTo );
    };
    
    var getFormatter = function ( id ){
        return formatters[ id ];
    };
    
    var registerFormatter = function ( id, formatter ){
        formatters[ id ] = formatter;
    };
    /* End Formatters */
    
    /* Expresions */
    var EXPRESSION_SUFFIX = ":";
    var defaultExpressionsConf = {
            pathDelimiter:          '|',
            pathSegmentDelimiter:   '/',
            expressionDelimiter:    ' ',
            intervalDelimiter:      ':',
            propertyDelimiter:      '/',
        
            stringExpression: "string" + EXPRESSION_SUFFIX,
            existsExpression: "exists" + EXPRESSION_SUFFIX,
            noCallExpression: "nocall" + EXPRESSION_SUFFIX,
            notExpression: "not" + EXPRESSION_SUFFIX,
            javaScriptExpression: "js" + EXPRESSION_SUFFIX,
            equalsExpression: "eq" + EXPRESSION_SUFFIX,
            greaterExpression: "gt" + EXPRESSION_SUFFIX,
            lowerExpression: "lt" + EXPRESSION_SUFFIX,
            addExpression: "+" + EXPRESSION_SUFFIX,
            subExpression: "-" + EXPRESSION_SUFFIX,
            mulExpression: "*" + EXPRESSION_SUFFIX,
            divExpression: ":" + EXPRESSION_SUFFIX,
            modExpression: "%" + EXPRESSION_SUFFIX,
            orExpression: "or" + EXPRESSION_SUFFIX,
            andExpression: "and" + EXPRESSION_SUFFIX,
            condExpression: "cond" + EXPRESSION_SUFFIX,
            formatExpression: "format" + EXPRESSION_SUFFIX,
            jqueryExpression: "$"
    };
    var expressionsConf = defaultExpressionsConf;
    
    var getExpressionsConf = function (){
        return expressionsConf;
    };
    
    var setExpressionsConf = function ( expressionsConfToSet ){
        expressionsConf = expressionsConfToSet;
        expressionEvaluator.updateConf( expressionsConf );
    };
    /* End Expresions */
    
    /* Translators */
    /*
    var translator = undefined;
    
    var getTranslator = function (){
        if ( translator == undefined ){
            translator = defaultTranslator;
        }
        return translator;
    };
    
    var setTranslator = function ( translatorToSet ){
        translator = translatorToSet;
    };*/
    /* End Translators */
    
    return {
        getTags: getTags,
        setTags: setTags,
        getTal: getTal,
        getFormatter: getFormatter,
        registerFormatter: registerFormatter,
        getExpressionsConf: getExpressionsConf,
        setExpressionsConf: setExpressionsConf
        /*getTranslator: getTranslator,
        setTranslator: setTranslator*/
    };
})();
