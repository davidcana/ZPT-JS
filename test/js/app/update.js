"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );
var utils = require( './utils.js' );
var context = zpt.context;

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    //alert( errorsArray );
};
zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "simple TALContent test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t1-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t1-2').text() , "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );

    var dictionaryChanges = {
        number1: 2
    };
    dictionary.text1 = 'test 2';

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, 'test 1' );
});

QUnit.test( "simple TALAttributes test", function( assert ) {

    var dictionary = {
        number1: 100,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't2' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t2-1').attr('maxlength') , "" + arguments[ 0 ] );
        assert.equal( $('#t2-1').attr('placeholder') , "" + arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 100, 'test 1' );

    var dictionaryChanges = {
        text1: 'test 2'
    };
    dictionary.number1 = 200;

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 100, 'test 2' );
});

QUnit.test( "simple TALDefine test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't3' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t3-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t3-2').text() , "" + arguments[ 1 ] );
        assert.equal( $('#t3-3').text() , "" + arguments[ 2 ] );
        assert.equal( $('#t3-4').text() , "" + arguments[ 3 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test', 'test1', 'test100' );

    var dictionaryChanges = {
        number1: 2
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, 'test', 'test2', 'test100' );
});

QUnit.test( "simple TALDefine (2) test", function( assert ) {

    var dictionary = {
        number1: 1,
        number2: 2,
        number3: 3,
        text1: 'test'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't3b' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t3b-1').text() , "" + arguments[ 0 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'test1test23' );

    var dictionaryChanges = {
        number1: 111
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 'test111test23' );
});

QUnit.test( "simple TALRepeat test", function( assert ) {

    var dictionary = {
        items: [ 1, 4, 9 ]
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't4' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryChanges = {
        items: [ 2, 6, 8 ]
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( '2/6/8' );
});

QUnit.test( "simple METALUseMacro test", function( assert ) {
    
    var done = assert.async();
    
    context.setExpressionCounter( 100 );
    
    var dictionary = {
        externalMacro: 'copyright@externalMacros-definitions.html'
    };

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( 't5' ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run();
            
            var t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"101\" style=\"display: none;\">
                Macro goes here
            </div><p data-mmacro=\"copyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"101\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>`;
            assert.equal( $('#t5').html().trim(), t5 );

            var dictionaryChanges = {
                externalMacro: 'enhancedCopyright@externalMacros-definitions.html'
            };

            //debugger;
            
            zpt.run({
                command: 'update',
                dictionaryChanges: dictionaryChanges
            });
            
            t5 = 
`<div data-use-macro=\"externalMacro\" data-id=\"101\" style=\"display: none;\">
                Macro goes here
            </div><div data-mmacro=\"enhancedCopyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"101\" data-qdup=\"1\">
            <p>
                This macro calls another macro.
            </p>
            <p data-use-macro=\"'copyright'\" data-id=\"102\" style=\"display: none;\">
                Macro goes here
            </p><p data-mmacro=\"copyright\" data-related-id=\"102\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
        </div>`;
            assert.equal( $('#t5').html().trim(), t5 );
            
            done();
        }
    });
});

QUnit.test( "simple TALCondition test", function( assert ) {

    // First invokation
    var dictionary = {
        number1: 1,
        text1: 'test 1',
        boolean1: false,
        boolean2: false
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't6' ),
        dictionary: dictionary
    });
    
    var testFunction = function(){
        assert.equal( $('#t6-1').text() , "" + arguments[ 0 ] );
        assert.ok( arguments[ 1 ] == $('#t6-1').is(':visible') );
        assert.equal( $('#t6-2').text() , "" + arguments[ 2 ] );  
        assert.ok( arguments[ 3 ] == $('#t6-2').is(':visible') );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'an integer', false, 'a text', false );
    
    // Second invokation
    var dictionaryChanges = {
        boolean2: true
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 1, true, 'test 1', true );
    
    // Second invokation
    var dictionaryChanges = {
        boolean2: false
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 1, false, 'test 1', false );
    
    // Fourth invokation
    var dictionaryChanges = {
        number1: 2,
        text1: 'test 2',
        boolean2: true
    };

    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 2, true, 'test 2', true );
});

QUnit.test( "simple I18NLanguage and I18nDomain test", function( assert ) {

    var I18n = zpt.I18n;
    var I18nBundle = zpt.I18nBundle;

    /* I18n maps init */
    var msg = {
        en : {},
        es : {}
    };

    /* English i18n messages */
    msg.en[ '/CONF/' ] = {
        language: 'en',
        locale: 'en-US'
    };
    msg.en[ 'Hello world!' ] = 'Hello world!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} }';

    /* Spanish i18n messages */
    msg.es[ '/CONF/' ] = {
        language: 'es',
        locale: 'es-ES'
    };
    msg.es[ 'Hello world!' ] = '¡Hola mundo!';
    msg.es[ 'Results msg' ] = '{ GENDER, select, male{Él} female{Ella} other{Ellos} }' +
        ' ' +
        '{ RES, plural, =0{no } other{} }' +
        '{ GENDER, select, male{ha} female{ha} other{han} }' +
        ' encontrado ' +
        '{ RES, plural, =0{ningún resultado} one{un único resultado} other{# resultados} }';

    // Create I18n and I18nBundle instances
    var i18nES = new I18n( 'es', msg[ 'es' ] );
    var i18nEN = new I18n( 'en', msg[ 'en' ] );
    var i18nBundle = new I18nBundle( i18nES, i18nEN );

    // Init dictionary
    var dictionary = {
        i18nES:  i18nES,
        i18nEN:  i18nEN,
        i18nBundle: i18nBundle,
        language: 'es'
    };
    
    errorsArray = undefined;

    // First ZPT invokation
    zpt.run({
        root: document.getElementById( 't7' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t7-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t7-2').text() , "" + arguments[ 1 ] );
        assert.ok( arguments[ 3 ].indexOf( $('#t7-3').html() ) != -1 );
        assert.ok( arguments[ 3 ].indexOf( $('#t7-4').html() ) != -1 );
        assert.equal( $('#t7-5').text() , "" + arguments[ 4 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        '¡Hola mundo!', 
        'Ella ha encontrado 10 resultados', 
        [ '1.355,23', '1355,23' ], 
        [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ],
        'viernes, 21 de diciembre de 2012' 
    );
    
    // Second ZPT invokation: language changes
    var dictionaryChanges = {
        language: 'en'
    };
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    testFunction( 
        'Hello world!', 
        'She found 10 results', 
        [ '1,355.23' ], 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
    
    // Third ZPT invokation: domain changes
    msg.en[ 'Hello world!' ] = 'Hello world v2!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} } v2';
    i18nEN = new I18n( 'en', msg[ 'en' ] );
    i18nBundle = new I18nBundle( i18nES, i18nEN );
    
    var dictionaryChanges = {
        i18nBundle: i18nBundle
    };
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 
        'Hello world v2!', 
        'She found 10 results v2', 
        '1,355.23', 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
});

QUnit.test( "2 vars in TALContent test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't8' ),
        dictionary: dictionary
    });

    var testFunction = function( content, parserUpdater, expectedStatistics ){
        assert.equal( $('#t8-1').text() , content );
        assert.equal( errorsArray, undefined );
        if ( parserUpdater ){
            assert.deepEqual( parserUpdater.getStatistics(), expectedStatistics );
        }
    };

    testFunction( 'test1' );
    
    var dictionaryChanges = {
        number1: 2,
        text1: 'test 2'
    };

    var parserUpdater = zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 
        'test 22', 
        parserUpdater,
        {
            totalUpdates: 1,
            removedNodeUpdates: 0
        }
    );
    
});

QUnit.test( "var in macro test", function( assert ) {

    var dictionary = {
        internalMacro: 'macro1',
        var1: 1
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't9' ),
        dictionary: dictionary
    });

    var testFunction = function( content, parserUpdater, expectedStatistics ){
        assert.equal( $('#t9-1').text() , content );
        assert.equal( errorsArray, undefined );
        if ( parserUpdater ){
            assert.deepEqual( parserUpdater.getStatistics(), expectedStatistics );
        }
    };

    testFunction( 1 );

    var dictionaryChanges = {
        internalMacro: 'macro2',
        var1: 10
    };
    
    var parserUpdater = zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 
        10, 
        parserUpdater,
        {
            totalUpdates: 1,
            removedNodeUpdates: 1
        }
    );
});

QUnit.test( "simple METALFillSlot test", function( assert ) {
    
    var done = assert.async();
    var id = 't11';
    context.setExpressionCounter( 200 );
    
    var dictionary = {
        items: [ 'item0', 'item1', 'item2' ],
        slot: 'header'
    };

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( id ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run();
            
            var t = `
<div data-use-macro=\"'dynamicListWith2Slots@externalMacros-definitions.html'\" data-id=\"201\" style=\"display: none;\">
    <div data-fill-slot=\"slot\" data-id=\"202\">
        My custom slot
    </div>
</div>
<div data-mmacro=\"dynamicListWith2Slots\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"201\" data-qdup=\"1\">
    <div data-id=\"203\">
            My custom slot
        </div>
    <ul>
        <li data-repeat=\"item items\" data-id=\"204\" style=\"display: none;\">
            <span data-content=\"item\">An item</span>
        </li>
        <li data-qdup=\"1\" data-id=\"205\" data-related-id=\"204\" data-tauto-define=\"item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"206\">item0</span>
        </li>
        <li data-qdup=\"1\" data-id=\"207\" data-related-id=\"204\" data-tauto-define=\"item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"208\">item1</span>
        </li>
        <li data-qdup=\"1\" data-id=\"209\" data-related-id=\"204\" data-tauto-define=\"item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"210\">item2</span>
        </li>
    </ul>
    <div data-define-slot=\"footer\">
        Default footer
    </div>
</div>
`;
            utils.assertHtml( assert, id, t );

            var dictionaryChanges = {
                slot: 'footer'
            };

            //debugger;
            
            zpt.run({
                command: 'update',
                dictionaryChanges: dictionaryChanges
            });
            
            t = `
<div data-use-macro=\"'dynamicListWith2Slots@externalMacros-definitions.html'\" data-id=\"201\" style=\"display: none;\">
    <div data-fill-slot=\"slot\" data-id=\"202\">
        My custom slot
    </div>
</div>
<div data-mmacro=\"dynamicListWith2Slots\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"201\" data-qdup=\"1\">
    <div data-define-slot=\"header\">
        Default header
    </div>
    <ul>
        <li data-repeat=\"item items\" data-id=\"212\" style=\"display: none;\">
            <span data-content=\"item\">An item</span>
        </li>
        <li data-qdup=\"1\" data-id=\"213\" data-related-id=\"212\" data-tauto-define=\"item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"214\">item0</span>
        </li>
        <li data-qdup=\"1\" data-id=\"215\" data-related-id=\"212\" data-tauto-define=\"item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"216\">item1</span>
        </li>
        <li data-qdup=\"1\" data-id=\"217\" data-related-id=\"212\" data-tauto-define=\"item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"218\">item2</span>
        </li>
    </ul>
    <div data-id=\"211\">
        My custom slot
    </div>
</div>
`;
            utils.assertHtml( assert, id, t );
            //assert.equal( $('#' + id).html().trim(), t );

            done();
        }
    });
});

QUnit.test( "mixing TALContent and TALAttributes test", function( assert ) {

    var dictionary = {
        number1: 100,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't12' ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t12-1').attr('maxlength') , "" + arguments[ 0 ] );
        assert.equal( $('#t12-1').attr('placeholder') , "" + arguments[ 1 ] );
        assert.equal( $('#t12-1').text() , "" + arguments[ 2 ] );
        if ( arguments[ 3 ] ){
            assert.deepEqual( arguments[ 3 ], arguments[ 4 ] );
        }   
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        100, 
        'test 1', 
        'placeholder is test 1'
    );
    
    var dictionaryChanges = {
        text1: 'test 2'
    };
    dictionary.number1 = 200;

    var parserUpdater = zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });

    testFunction( 
        100, 
        'test 2', 
        'placeholder is test 2',
        parserUpdater.getStatistics(),
        {
            "removedNodeUpdates": 0,
            "totalUpdates": 2
        }
    );
});

QUnit.test( "update text element by index TALRepeat test", function( assert ) {

    var testNumber = 13;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'update',
            index: 1,
            newElement: 5
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/5/9' );
});

QUnit.test( "update text element by element TALRepeat test", function( assert ) {

    var testNumber = 14;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'update',
            currentElement: 4,
            newElement: 5
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/5/9' );
});

QUnit.test( "delete text element by index TALRepeat test", function( assert ) {

    var testNumber = 15;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'delete',
            index: 1
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/9' );
});

QUnit.test( "delete text element by element TALRepeat test", function( assert ) {

    var testNumber = 16;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'delete',
            currentElement: 4
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/9' );
});

QUnit.test( "insert text element by index = 2 TALRepeat test", function( assert ) {

    var testNumber = 17;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: 2,
            newElement: 5
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/4/5/9' );
});

QUnit.test( "insert text element by index = '_first_' TALRepeat test", function( assert ) {

    var testNumber = 18;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: '_first_',
            newElement: 5
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '5/1/4/9' );
});

QUnit.test( "insert text element by index = '_last_' TALRepeat test", function( assert ) {

    var testNumber = 19;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 1, 4, 9 ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ) , arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: 5
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( '1/4/9/5' );
});

QUnit.test( "update object element by index TALRepeat test", function( assert ) {

    var testNumber = 20;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'update',
            index: 1,
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Dave/Luke', 'The number 1/The number 4/The number 3' );
});

QUnit.test( "update object element by element TALRepeat test", function( assert ) {

    var testNumber = 21;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'update',
            currentElement: {
                name: 'Peter',
                description: 'The number 2'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Dave/Luke', 'The number 1/The number 4/The number 3' );
});

QUnit.test( "delete object element by index TALRepeat test", function( assert ) {

    var testNumber = 22;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'delete',
            index: 1
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Luke', 'The number 1/The number 3' );
});

QUnit.test( "delete object element by object TALRepeat test", function( assert ) {

    var testNumber = 23;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'delete',
            currentElement: {
                name: 'Peter',
                description: 'The number 2'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Luke', 'The number 1/The number 3' );
});

QUnit.test( "insert object element by index = 2 TALRepeat test", function( assert ) {

    var testNumber = 24;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: 2,
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Peter/Dave/Luke', 'The number 1/The number 2/The number 4/The number 3' );
});

QUnit.test( "insert object element by index = '_first_' TALRepeat test", function( assert ) {

    var testNumber = 25;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: '_first_',
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'Dave/John/Peter/Luke', 'The number 4/The number 1/The number 2/The number 3' );
});

QUnit.test( "insert object element by index = '_last_' TALRepeat test", function( assert ) {

    var testNumber = 26;
    var dictionary = {};
    dictionary[ 'items' + testNumber ] = [ 
        {
            name: 'John',
            description: 'The number 1'
        }, 
        {
            name: 'Peter',
            description: 'The number 2'
        },
        {
            name: 'Luke',
            description: 'The number 3'
        },
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    var dictionaryActions = [
        {
            id: 'items' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Peter/Luke/Dave', 'The number 1/The number 2/The number 3/The number 4' );
});

QUnit.test( "update object nested element by index TALRepeat test", function( assert ) {

    var testNumber = 27;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'update',
            index: 0,
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Dave/Chris/Lars', 'The number 1/The number 2/The number 3/The number 7/The number 5/The number 6' );
});

QUnit.test( "update object nested element by index and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 28;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'update',
            index: 0,
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Dave/Chris/Lars', 'The number 1/The number 2/The number 3/The number 7/The number 5/The number 6' );
});

QUnit.test( "update object nested element by element TALRepeat test", function( assert ) {

    var testNumber = 29;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'update',
            currentElement: {
                name: 'Chris',
                description: 'The number 5'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Dave/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 7/The number 6' );
});

QUnit.test( "update object nested element by element and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 30;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'update',
            currentElement: {
                name: 'Chris',
                description: 'The number 5'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Dave/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 7/The number 6' );
});

QUnit.test( "delete object nested element by element TALRepeat test", function( assert ) {

    var testNumber = 31;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'delete',
            index: 1
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 6' );
});

QUnit.test( "delete object nested element by element and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 32;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'delete',
            index: 1
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 6' );
});

QUnit.test( "Insert object nested element by index = 2 TALRepeat test", function( assert ) {

    var testNumber = 33;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'create',
            index: 2,
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Dave/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 7/The number 6' );
});

QUnit.test( "Insert object nested element by index = 2 and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 34;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'create',
            index: 2,
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Dave/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 7/The number 6' );
});

QUnit.test( "Insert object nested element by index = '_first_' TALRepeat test", function( assert ) {

    var testNumber = 35;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'create',
            index: '_first_',
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Dave/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 7/The number 4/The number 5/The number 6' );
});

QUnit.test( "Insert object nested element by index = '_first_' and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 36;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'create',
            index: '_first_',
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });
    
    testFunction( 'John/Peter/Luke/Dave/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 7/The number 4/The number 5/The number 6' );
});

QUnit.test( "Insert object nested element by index = '_last_' TALRepeat test", function( assert ) {

    var testNumber = 37;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            id: 'objectList' + testNumber + '[1].items',
            var: dictionary["objectList" + testNumber][1].items,
            action: 'create',
            index: '_last_',
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Peter/Luke/Michael/Chris/Lars/Dave', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6/The number 7' );
});

QUnit.test( "Insert object nested element by index = '_last_' and selecting by search TALRepeat test", function( assert ) {

    var testNumber = 38;
    var dictionary = {};
    dictionary[ 'objectList' + testNumber ] = [ 
        {
            id: 'object1',
            items: [
                {
                    name: 'John',
                    description: 'The number 1'
                }, 
                {
                    name: 'Peter',
                    description: 'The number 2'
                },
                {
                    name: 'Luke',
                    description: 'The number 3'
                }
            ]
        },
        {
            id: 'object2',
            items: [
                {
                    name: 'Michael',
                    description: 'The number 4'
                }, 
                {
                    name: 'Chris',
                    description: 'The number 5'
                },
                {
                    name: 'Lars',
                    description: 'The number 6'
                }
            ]
        }
    ];

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ) , arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ) , arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( 'John/Peter/Luke/Michael/Chris/Lars', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6' );
    
    var dictionaryActions = [
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object2'
                },
                'items'
            ],
            action: 'create',
            index: '_last_',
            newElement: {
                name: 'Dave',
                description: 'The number 7'
            }
        }
    ];
    
    zpt.run({
        command: 'update',
        dictionaryActions: dictionaryActions
    });

    testFunction( 'John/Peter/Luke/Michael/Chris/Lars/Dave', 'The number 1/The number 2/The number 3/The number 4/The number 5/The number 6/The number 7' );
});

QUnit.test( "simple TALContent with indexExpressions = false test", function( assert ) {

    var dictionary = {
        number1: 1,
        text1: 'test 1'
    };

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't10' ),
        dictionary: dictionary,
        indexExpressions: false
    });

    var testFunction = function(){
        assert.equal( $('#t10-1').text() , "" + arguments[ 0 ] );
        assert.equal( $('#t10-2').text() , "" + arguments[ 1 ] );        
        assert.equal( errorsArray, arguments[ 2 ] );
    };

    testFunction( 1, 'test 1' );

    var dictionaryChanges = {
        number1: 2
    };
    dictionary.text1 = 'test 2';
    
    zpt.run({
        command: 'update',
        dictionaryChanges: dictionaryChanges
    });
    
    // No changes done to DOM, no index was built
    testFunction( 1, 'test 1', 'Unable to update, no index built! Set indexExpressions to true!' );
});
