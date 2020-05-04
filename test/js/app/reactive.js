"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var QUnit = require( 'qunit' );
var utils = require( './utils.js' );
var context = zpt.context;

var errorsArray;
var errorFunction = function( _errorsArray ) {
    
    errorsArray = _errorsArray;
    //alert( errorsArray );
};
zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "Simple TALContent autoCommit true test", function( assert ) {

    var testNumber = 1;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test 1'
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 2, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 2, 'test 2' );
});

QUnit.test( "Simple TALContent autoCommit false test", function( assert ) {

    var testNumber = 2;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test 1'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );        
        assert.equal( errorsArray, undefined );
    };

    testFunction( 1, 'test 1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 1, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 1, 'test 1' );
    
    // Commit changes
    dictionary._commit();
    testFunction( 2, 'test 2' );
});

QUnit.test( "simple TALAttributes autoCommit true test", function( assert ) {

    var testNumber = 3;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 100,
            text1: 'test 1'
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').attr( 'maxlength' ), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-1').attr( 'placeholder' ), "" + arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };
    testFunction( 100, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 100, 'test 2' );
    
    // Change number1
    dictionary.number1 = 200;
    testFunction( 200, 'test 2' );
});

QUnit.test( "simple TALAttributes autoCommit false test", function( assert ) {

    var testNumber = 4;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 100,
            text1: 'test 1'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').attr( 'maxlength' ), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-1').attr( 'placeholder' ), "" + arguments[ 1 ] );
        assert.equal( errorsArray, undefined );
    };
    testFunction( 100, 'test 1' );

    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 100, 'test 1' );
    
    // Change number1
    dictionary.number1 = 200;
    testFunction( 100, 'test 1' );
    
    // Commit changes
    dictionary._commit();
    testFunction( 200, 'test 2' );
});

QUnit.test( "simple TALRepeat autoCommit true test", function( assert ) {

    var testNumber = 5;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            items: [ 1, 4, 9 ]
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ), arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };

    testFunction( '1/4/9' );

    // Change items
    dictionary.items = [ 2, 6, 8 ];
    testFunction( '2/6/8' );
});

QUnit.test( "simple TALRepeat autoCommit false test", function( assert ) {

    var testNumber = 6;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            items: [ 1, 4, 9 ]
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.item' + testNumber ), arguments[ 0 ]  );   
        assert.equal( errorsArray, undefined );
    };
    testFunction( '1/4/9' );

    // Change items
    dictionary.items = [ 2, 6, 8 ];
    testFunction( '1/4/9' );
    
    // Commit changes
    dictionary._commit();
    testFunction( '2/6/8' );
});

QUnit.test( "simple METALUseMacro autoCommit true test", function( assert ) {
    
    var testNumber = 7;
    
    var done = assert.async();
    
    context.setExpressionCounter( 100 );
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            externalMacro: 'copyright@externalMacros-definitions.html'
        }
    );

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run();
            
            var t = 
`<div data-use-macro=\"externalMacro\" data-id=\"101\" style=\"display: none;\">
                Macro goes here
            </div><p data-mmacro=\"copyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"101\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>`;
            assert.equal( $('#t' + testNumber ).html().trim(), t );

            // Change externalMacro
            dictionary.externalMacro = 'enhancedCopyright@externalMacros-definitions.html';
            
            t = 
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
            assert.equal( $( '#t' + testNumber ).html().trim(), t );
            
            done();
        }
    });
});

QUnit.test( "simple METALUseMacro autoCommit false test", function( assert ) {
    
    var testNumber = 8;
    
    var done = assert.async();
    
    context.setExpressionCounter( 200 );
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            externalMacro: 'copyright@externalMacros-definitions.html'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run();
            
            var t = 
`<div data-use-macro=\"externalMacro\" data-id=\"201\" style=\"display: none;\">
                Macro goes here
            </div><p data-mmacro=\"copyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"201\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>`;
            assert.equal( $('#t' + testNumber ).html().trim(), t );

            // Change externalMacro
            dictionary.externalMacro = 'enhancedCopyright@externalMacros-definitions.html';
            assert.equal( $('#t' + testNumber ).html().trim(), t );
            
            // Commit changes
            dictionary._commit();
            t = 
`<div data-use-macro=\"externalMacro\" data-id=\"201\" style=\"display: none;\">
                Macro goes here
            </div><div data-mmacro=\"enhancedCopyright\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"201\" data-qdup=\"1\">
            <p>
                This macro calls another macro.
            </p>
            <p data-use-macro=\"'copyright'\" data-id=\"202\" style=\"display: none;\">
                Macro goes here
            </p><p data-mmacro=\"copyright\" data-related-id=\"202\" data-qdup=\"1\">
            Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
        </p>
        </div>`;
            assert.equal( $( '#t' + testNumber ).html().trim(), t );
            
            done();
        }
    });
});

QUnit.test( "simple TALCondition autoCommit true, last action false test", function( assert ) {

    var testNumber = 9;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test 1',
            boolean1: false,
            boolean2: false
        }
    );

    errorsArray = undefined;

    // First invokation
    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });
    
    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.ok( arguments[ 1 ] === $('#t' + testNumber + '-1').is( ':visible' ) );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 2 ] );  
        assert.ok( arguments[ 3 ] === $('#t' + testNumber + '-2').is( ':visible' ) );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'an integer', false, 'a text', false );
    
    // Second invokation
    dictionary.boolean2 = true;
    testFunction( 1, true, 'test 1', true );
    
    // Third invokation
    dictionary.boolean2 = false;
    testFunction( 1, false, 'test 1', false );
    
    // Disable autocommit
    dictionary._setAutoCommit( false );
    
    // Change some values without HTML updtating
    dictionary.number1 = 2;
    dictionary.text1 = 'test 2';
    dictionary.boolean2 = true;

    // Commit changes. fourth invokation
    dictionary._commit();
    testFunction( 2, true, 'test 2', true );
});

QUnit.test( "simple I18NLanguage and I18nDomain autoCommit true test", function( assert ) {

    var testNumber = 10;
    
    var I18n = zpt.I18n;
    var I18nBundle = zpt.I18nBundle;

    /* I18n maps init */
    var msg = {
        en: {},
        es: {}
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
    var dictionary = new zpt.ReactiveDictionary(
        {
            i18nES: i18nES,
            i18nEN: i18nEN,
            i18nBundle: i18nBundle,
            language: 'es'
        }
    );
    
    errorsArray = undefined;

    // First ZPT invokation
    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );
        assert.ok( arguments[ 3 ].indexOf( $('#t' + testNumber + '-3').html() ) !== -1 );
        assert.ok( arguments[ 3 ].indexOf( $('#t' + testNumber + '-4').html() ) !== -1 );
        assert.equal( $('#t' + testNumber + '-5').text(), "" + arguments[ 4 ] );
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
    dictionary.language = 'en';
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
    
    dictionary.i18nBundle = i18nBundle;
    testFunction( 
        'Hello world v2!', 
        'She found 10 results v2', 
        '1,355.23', 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
});

QUnit.test( "simple I18NLanguage and I18nDomain autoCommit false test", function( assert ) {

    var testNumber = 11;
    
    var I18n = zpt.I18n;
    var I18nBundle = zpt.I18nBundle;

    /* I18n maps init */
    var msg = {
        en: {},
        es: {}
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
    var dictionary = new zpt.ReactiveDictionary(
        {
            i18nES: i18nES,
            i18nEN: i18nEN,
            i18nBundle: i18nBundle,
            language: 'es'
        },
        false
    );
    
    errorsArray = undefined;

    // First ZPT invokation
    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-2').text(), "" + arguments[ 1 ] );
        assert.ok( arguments[ 3 ].indexOf( $('#t' + testNumber + '-3').html() ) !== -1 );
        assert.ok( arguments[ 3 ].indexOf( $('#t' + testNumber + '-4').html() ) !== -1 );
        assert.equal( $('#t' + testNumber + '-5').text(), "" + arguments[ 4 ] );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        '¡Hola mundo!', 
        'Ella ha encontrado 10 resultados', 
        [ '1.355,23', '1355,23' ], 
        [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ],
        'viernes, 21 de diciembre de 2012' 
    );
    
    // language changes
    dictionary.language = 'en';
    testFunction( 
        '¡Hola mundo!', 
        'Ella ha encontrado 10 resultados', 
        [ '1.355,23', '1355,23' ], 
        [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ],
        'viernes, 21 de diciembre de 2012' 
    );
    
    // domain changes
    msg.en[ 'Hello world!' ] = 'Hello world v2!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} } v2';
    i18nEN = new I18n( 'en', msg[ 'en' ] );
    i18nBundle = new I18nBundle( i18nES, i18nEN );
    
    dictionary.i18nBundle = i18nBundle;
    testFunction( 
        '¡Hola mundo!', 
        'Ella ha encontrado 10 resultados', 
        [ '1.355,23', '1355,23' ], 
        [ "1.355,23&nbsp;€", "1.355,23", "1355,23" ],
        'viernes, 21 de diciembre de 2012' 
    );
    
    // Commit changes
    dictionary._commit();
    testFunction( 
        'Hello world v2!', 
        'She found 10 results v2', 
        '1,355.23', 
        [ "€1,355.23", "1,355.23" ],
        'Friday, December 21, 2012' 
    );
});

QUnit.test( "2 vars in TALContent autoCommit true test", function( assert ) {

    var testNumber = 12;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test'
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function( content ){
        assert.equal( $('#t' + testNumber + '-1').text(), content );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'test1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 'test2' );
    
    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 'test 22' );
});

QUnit.test( "2 vars in TALContent autoCommit false test", function( assert ) {

    var testNumber = 12;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 1,
            text1: 'test'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function( content ){
        assert.equal( $('#t' + testNumber + '-1').text(), content );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'test1' );
    
    // Change number1
    dictionary.number1 = 2;
    testFunction( 'test1' );
    
    // Change text1
    dictionary.text1 = 'test 2';
    testFunction( 'test1' );
    
    // Commit changes
    dictionary._commit();
    testFunction( 'test 22' );
});

QUnit.test( "var in macro autoCommit true test", function( assert ) {

    var testNumber = 14;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            internalMacro: 'macro1',
            var1: 1
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function( content ){
        assert.equal( $('#t' + testNumber + '-1').text(), content );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'This is macro1 and value of var1 is 1' );
    
    // Change internalMacro
    dictionary.internalMacro = 'macro2';
    testFunction( 'This is macro2 and value of var1 is 1' );
    
    // Change var1
    dictionary.var1 = 10;
    testFunction( 'This is macro2 and value of var1 is 10' );
});

QUnit.test( "var in macro autoCommit false test", function( assert ) {

    var testNumber = 15;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            internalMacro: 'macro3',
            var1: 1
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function( content ){
        assert.equal( $('#t' + testNumber + '-1').text(), content );
        assert.equal( errorsArray, undefined );
    };

    testFunction( 'This is macro1 and value of var1 is 1' );
    
    // Change internalMacro
    dictionary.internalMacro = 'macro4';
    testFunction( 'This is macro1 and value of var1 is 1' );
    
    // Change var1
    dictionary.var1 = 10;
    testFunction( 'This is macro1 and value of var1 is 1' );
    
    // Commit changes
    dictionary._commit();
    testFunction( 'This is macro2 and value of var1 is 10' );
});

QUnit.test( "simple METALFillSlot test", function( assert ) {
    
    var done = assert.async();
    var id = 't16';
    context.setExpressionCounter( 300 );
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            items: [ 'item0', 'item1', 'item2' ],
            slot: 'header'
        }
    );

    errorsArray = undefined;

    zpt.run({
        command: 'preload',
        root: document.getElementById( id ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            
            zpt.run();
            
            var t = `
<div data-use-macro=\"'dynamicListWith2Slots@externalMacros-definitions.html'\" data-id=\"301\" style=\"display: none;\">
    <div data-fill-slot=\"slot\" data-id=\"302\">
        My custom slot
    </div>
</div>
<div data-mmacro=\"dynamicListWith2Slots\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"301\" data-qdup=\"1\">
    <div data-id=\"303\">
            My custom slot
        </div>
    <ul>
        <li data-repeat=\"item items\" data-id=\"304\" style=\"display: none;\">
            <span data-content=\"item\">An item</span>
        </li>
        <li data-qdup=\"1\" data-id=\"305\" data-related-id=\"304\" data-tauto-define=\"item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"306\">item0</span>
        </li>
        <li data-qdup=\"1\" data-id=\"307\" data-related-id=\"304\" data-tauto-define=\"item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"308\">item1</span>
        </li>
        <li data-qdup=\"1\" data-id=\"309\" data-related-id=\"304\" data-tauto-define=\"item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"310\">item2</span>
        </li>
    </ul>
    <div data-define-slot=\"footer\">
        Default footer
    </div>
</div>
`;
            utils.assertHtml( assert, id, t );

            // Change slot
            dictionary.slot = 'footer';

            //debugger;
            t = `
<div data-use-macro=\"'dynamicListWith2Slots@externalMacros-definitions.html'\" data-id=\"301\" style=\"display: none;\">
    <div data-fill-slot=\"slot\" data-id=\"302\">
        My custom slot
    </div>
</div>
<div data-mmacro=\"dynamicListWith2Slots\" data-tauto-define=\"_externalMacroUrl 'externalMacros-definitions.html'\" data-related-id=\"301\" data-qdup=\"1\">
    <div data-define-slot=\"header\">
        Default header
    </div>
    <ul>
        <li data-repeat=\"item items\" data-id=\"312\" style=\"display: none;\">
            <span data-content=\"item\">An item</span>
        </li>
        <li data-qdup=\"1\" data-id=\"313\" data-related-id=\"312\" data-tauto-define=\"item-index 0;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"314\">item0</span>
        </li>
        <li data-qdup=\"1\" data-id=\"315\" data-related-id=\"312\" data-tauto-define=\"item-index 1;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"316\">item1</span>
        </li>
        <li data-qdup=\"1\" data-id=\"317\" data-related-id=\"312\" data-tauto-define=\"item-index 2;item-all items;item item-all[item-index];item-repeat context/repeat(item-index,3,0)\">
            <span data-content=\"item\" data-id=\"318\">item2</span>
        </li>
    </ul>
    <div data-id=\"311\">
        My custom slot
    </div>
</div>
`;
            utils.assertHtml( assert, id, t );

            done();
        }
    });
});

QUnit.test( "mixing TALContent and TALAttributes autoCommit true test", function( assert ) {

    var testNumber = 17;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 100,
            text1: 'test 1'
        }
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').attr( 'maxlength' ), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-1').attr( 'placeholder' ), "" + arguments[ 1 ] );
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 2 ] ); 
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        100, 
        'test 1', 
        'placeholder is test 1'
    );
    
    // Update text1
    dictionary.text1 = 'test 2';
    testFunction( 
        100, 
        'test 2', 
        'placeholder is test 2'
    );
    
    // Update number1
    dictionary.number1 = 200;
    testFunction( 
        200, 
        'test 2', 
        'placeholder is test 2'
    );
});

QUnit.test( "mixing TALContent and TALAttributes autoCommit false test", function( assert ) {

    var testNumber = 18;
    
    var dictionary = new zpt.ReactiveDictionary(
        {
            number1: 100,
            text1: 'test 1'
        },
        false
    );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( $('#t' + testNumber + '-1').attr( 'maxlength' ), "" + arguments[ 0 ] );
        assert.equal( $('#t' + testNumber + '-1').attr( 'placeholder' ), "" + arguments[ 1 ] );
        assert.equal( $('#t' + testNumber + '-1').text(), "" + arguments[ 2 ] ); 
        assert.equal( errorsArray, undefined );
    };

    testFunction( 
        100, 
        'test 1', 
        'placeholder is test 1'
    );
    
    // Update text1
    dictionary.text1 = 'test 2';
    testFunction( 
        100, 
        'test 1', 
        'placeholder is test 1'
    );
    
    // Update number1
    dictionary.number1 = 200;
    testFunction( 
        100, 
        'test 1', 
        'placeholder is test 1'
    );
    
    // Commit changes
    dictionary._commit();
    testFunction( 
        200, 
        'test 2', 
        'placeholder is test 2'
    );
});

QUnit.test( "Combined actions starting from an empty array and selecting by search TALRepeat autoCommit true test", function( assert ) {

    var testNumber = 19;
    
    var dictionary = new zpt.ReactiveDictionary( {} );
    dictionary._addVariable( 'objectList' + testNumber, [] );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( '', '' );
    
    // Add 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: {
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
            }
        }
    ]);
    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    // Edit 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'update',
            currentElement: {
                name: 'Luke',
                description: 'The number 3'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ]);
    testFunction( 'John/Peter/Dave', 'The number 1/The number 2/The number 4' );
    
    // Delete 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'delete',
            currentElement: {
                name: 'Peter',
                description: 'The number 2'
            }
        }
    ]);
    testFunction( 'John/Dave', 'The number 1/The number 4' );
    
    // Add 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'create',
            index: 1,
            newElement: {
                name: 'Mary',
                description: 'The number 5'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave', 'The number 1/The number 5/The number 4' );
    
    // Add 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: {
                id: 'object2',
                items: [
                    {
                        name: 'Sophia',
                        description: 'The number 6'
                    }, 
                    {
                        name: 'Jane',
                        description: 'The number 7'
                    },
                    {
                        name: 'Drew',
                        description: 'The number 8'
                    }
                ]
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );
    
    // Add 1 item
    dictionary._addActions([
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
                name: 'Alexis',
                description: 'The number 9'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew/Alexis', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8/The number 9' );
    
    // Edit 1 item
    dictionary._addActions([
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
                name: 'Drew',
                description: 'The number 8'
            },
            newElement: {
                name: 'Lucy',
                description: 'The number 10'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Lucy/Alexis', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 10/The number 9' );
    
    // Delete 1 item
    dictionary._addActions([
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
            currentElement: {
                name: 'Sophia',
                description: 'The number 6'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Jane/Lucy/Alexis', 'The number 1/The number 5/The number 4/The number 7/The number 10/The number 9' );
    
    // Delete 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'delete',
            index: 0
        }
    ]);
    testFunction( 'Jane/Lucy/Alexis', 'The number 7/The number 10/The number 9' );
});

QUnit.test( "Combined actions starting from an empty array and selecting by search TALRepeat autoCommit false test", function( assert ) {

    var testNumber = 20;
    
    var dictionary = new zpt.ReactiveDictionary( {}, false );
    dictionary._addVariable( 'objectList' + testNumber, [] );

    errorsArray = undefined;

    zpt.run({
        root: document.getElementById( 't' + testNumber ),
        dictionary: dictionary
    });

    var testFunction = function(){
        assert.equal( utils.getAllValues( '.itemName' + testNumber ), arguments[ 0 ]  );
        assert.equal( utils.getAllValues( '.itemDescription' + testNumber ), arguments[ 1 ]  );
        assert.equal( errorsArray, undefined );
    };
    
    testFunction( '', '' );
    
    // Add 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: {
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
            }
        }
    ]);
    testFunction( '', '' );
    
    // Commit
    dictionary._commit();
    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );
    
    // Edit 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'update',
            currentElement: {
                name: 'Luke',
                description: 'The number 3'
            },
            newElement: {
                name: 'Dave',
                description: 'The number 4'
            }
        }
    ]);
    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );

    // Delete 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'delete',
            currentElement: {
                name: 'Peter',
                description: 'The number 2'
            }
        }
    ]);
    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );

    // Add 1 item
    dictionary._addActions([
        {
            search: [
                'objectList' + testNumber,
                {
                    name: 'id',
                    value: 'object1'
                },
                'items'
            ],
            action: 'create',
            index: 1,
            newElement: {
                name: 'Mary',
                description: 'The number 5'
            }
        }
    ]);
    testFunction( 'John/Peter/Luke', 'The number 1/The number 2/The number 3' );

    // Commit
    dictionary._commit();
    testFunction( 'John/Mary/Dave', 'The number 1/The number 5/The number 4' );
    
    // Add 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'create',
            index: '_last_',
            newElement: {
                id: 'object2',
                items: [
                    {
                        name: 'Sophia',
                        description: 'The number 6'
                    }, 
                    {
                        name: 'Jane',
                        description: 'The number 7'
                    },
                    {
                        name: 'Drew',
                        description: 'The number 8'
                    }
                ]
            }
        }
    ]);
    testFunction( 'John/Mary/Dave', 'The number 1/The number 5/The number 4' );
    
    // Commit
    dictionary._commit();
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );
    //////
    
    // Add 1 item
    dictionary._addActions([
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
                name: 'Alexis',
                description: 'The number 9'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );
    
    // Edit 1 item
    dictionary._addActions([
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
                name: 'Drew',
                description: 'The number 8'
            },
            newElement: {
                name: 'Lucy',
                description: 'The number 10'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );

    // Delete 1 item
    dictionary._addActions([
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
            currentElement: {
                name: 'Sophia',
                description: 'The number 6'
            }
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );
    
    // Delete 1 object
    dictionary._addActions([
        {
            id: 'objectList' + testNumber,
            action: 'delete',
            index: 0
        }
    ]);
    testFunction( 'John/Mary/Dave/Sophia/Jane/Drew', 'The number 1/The number 5/The number 4/The number 6/The number 7/The number 8' );
    
    // Commit
    dictionary._commit();
    testFunction( 'Jane/Lucy/Alexis', 'The number 7/The number 10/The number 9' );
    
});

