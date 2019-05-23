"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
require( '../../../js/app/jqueryPlugin.js' );
var I18n = require( '../../../js/app/i18n/i18n.js' );
var I18nBundle = require( '../../../js/app/i18n/i18nBundle.js' );
var utils = require( './utils.js' );

QUnit.test( "Rerun simple tests", function( assert ) {
    
    var $root = $( '#simple' );
    var dictionary = { 
        counter: 4
    };
    
    $root.zpt({
        dictionary: dictionary
    });

    function continueTesting(){
        runTests( dictionary.counter );
        if ( dictionary.counter-- > 1 ){
            $root.zpt();
            continueTesting();
        }
    }

    function runTests( counter ){
        assert.equal( $('#t1-1').attr('title') , "counter=" + counter );

        if ( counter % 2 == 0 ){
            assert.ok( $('#t1-2').is(':visible') );
        } else {
            assert.notOk( $('#t1-2').is(':visible') );
        }

        assert.equal( $('#t1-3').html() , "counter=" + counter );
        assert.equal( $('#t1-4').html() , "counter=" + counter );
    }
    
    continueTesting();
});

QUnit.test( "Rerun and check dictionary vars", function( assert ) {

    $( '#ul1' ).zpt();
    runTests();
    
    $( '#ul2' ).zpt({
        command: 'partialRender'
    });
    runTests();
    
    function runTests(){
        
        assert.equal( $('#t2-1-1').html() , "1" );
        assert.equal( $('#t2-1-2').html() , "OK" );
        assert.equal( $('#t2-1-3').html() , "OK" );
        assert.equal( $('#t2-2-1').html() , "OK" );
        assert.equal( $('#t2-3-1').html() , "1" );
        assert.equal( $('#t2-3-2').html() , "OK" );
        assert.equal( $('#t2-3-3').html() , "OK" );
        assert.equal( $('#t2-4-1').html() , "2" );
        assert.equal( $('#t2-4-2').html() , "OK" );
        assert.equal( $('#t2-4-3').html() , "OK" );
    }
});

QUnit.test( "Rerun and check dictionary vars (more complex)", function( assert ) {
    
    var dictionary = { 
        var: 10
    };
    
    $( '#ul2-1' ).zpt({
        dictionary: dictionary
    });
    runTests( 10, 10, 10 );

    dictionary.var = 20;
    $( '#ul2-2' ).zpt({
        command: 'partialRender'
    });
    runTests( 10, 20, 20 );
    
    dictionary.var = 30;
    $( '#ul2-3' ).zpt({
        command: 'partialRender'
    });
    runTests( 10, 20, 30 );
    
    function runTests( value1, value2, value3 ){

        assert.equal( $('#t3-1-1').html() , "1" );
        assert.equal( $('#t3-1-2').html() , "2" );
        assert.equal( $('#t3-1-3').html() , "" + value1 );
        
        assert.equal( $('#t3-2-1').html() , "1" );
        assert.equal( $('#t3-2-2').html() , "2" );
        assert.equal( $('#t3-2-3').html() , "" + value2 );
        assert.equal( $('#t3-2-4').html() , "" + (value2 + 1 + 2) );
        
        assert.equal( $('#t3-3-1').html() , "1" );
        assert.equal( $('#t3-3-2').html() , "2" );
        assert.equal( $('#t3-3-3').html() , "" + value3 );
        assert.equal( $('#t3-3-4').html() , "" + (value3 + 1 + 2) );
        assert.equal( $('#t3-3-5').html() , "" + (value3 + 2) );
    }
});

QUnit.test( "Rerun and check dictionary vars (multiple target)", function( assert ) {
    
    var dictionary = { 
        var: 10
    };
    $( '#ul3-1' ).zpt({
        dictionary: dictionary
    });
    runTests( 1, 110, 1, 2, 12, 110, 1, 3, 13, 110, 1, 3, 4, 14, 110 );
    
    dictionary.var = 11;
    zpt.run({
        target: [ 
            document.getElementById( 'ul3-2' ), 
            document.getElementById( 'ul3-4' )
        ],
        command: 'partialRender'
    });
    runTests( 1, 110, 1, 2, 13, 111, 1, 3, 13, 110, 1, 3, 4, 15, 111 );
    
    function runTests(){

        assert.equal( $('#t4-1-1').html() , "" + arguments[0] );
        assert.equal( $('#t4-1-2').html() , "" + arguments[1] );
        assert.equal( $('#t4-2-1').html() , "" + arguments[2] );
        assert.equal( $('#t4-2-2').html() , "" + arguments[3] );
        assert.equal( $('#t4-2-3').html() , "" + arguments[4] );
        assert.equal( $('#t4-2-4').html() , "" + arguments[5] );
        assert.equal( $('#t4-3-1').html() , "" + arguments[6] );
        assert.equal( $('#t4-3-2').html() , "undefined" );
        assert.equal( $('#t4-3-3').html() , "" + arguments[7] );
        assert.equal( $('#t4-3-4').html() , "" + arguments[8] );
        assert.equal( $('#t4-3-5').html() , "" + arguments[9] );
        assert.equal( $('#t4-3-4-1').html() , "" + arguments[10] );
        assert.equal( $('#t4-3-4-2').html() , "undefined" );
        assert.equal( $('#t4-3-4-3').html() , "" + arguments[11] );
        assert.equal( $('#t4-3-4-4').html() , "" + arguments[12] );
        assert.equal( $('#t4-3-4-5').html() , ""  + arguments[13] );
        assert.equal( $('#t4-3-4-6').html() , "" + arguments[14] );
    }
});

QUnit.test( "Rerun and check dictionary vars (multiple root, one target)", function( assert ) {

    var dictionary = { 
        var: 10
    };
    zpt.run({
        root: [ $( '#ul5-1' )[0], $( '#ul5-2' )[0] ],
        dictionary: dictionary
    });
    runTests( 1, 11, 2, 12 );
    
    dictionary.var = 11;
    $( '#t5-2-2' ).zpt({
        command: 'partialRender'
    });
    runTests( 1, 11, 2, 13 );
    
    function runTests(){

        assert.equal( $('#t5-1-1').html() , "" + arguments[0] );
        assert.equal( $('#t5-1-2').html() , "" + arguments[1] );
        assert.equal( $('#t5-2-1').html() , "" + arguments[2] );
        assert.equal( $('#t5-2-2').html() , "" + arguments[3] );
    }
});

QUnit.test( "Rerun using data-domain", function( assert ) {

    // Render #ul6-1 and run tests
    $( '#ul6-1' ).zpt({
        dictionary: buildDictionaryForI18n()
    });
    runTests();

    $( '#t6-2' ).zpt({
        command: 'partialRender'
    });
    runTests();
    
    function runTests(){

        assert.equal( $('#t6-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t6-2').html() , "Él no ha encontrado ningún resultado" );
    }
    
});

QUnit.test( "Rerun using data-language", function( assert ) {

    // Render #ul6-1 and run tests
    var dictionary = buildDictionaryForI18n();
    dictionary.language = 'es';
    $( '#ul7-1' ).zpt({
        dictionary: dictionary
    });
    runTests( '¡Hola mundo!' );
    
    dictionary.language = 'en';
    $( '#t7-2' ).zpt({
        command: 'partialRender'
    });
    runTests( 'Hello world!' );
    
    function runTests( value ){

        assert.equal( $('#t7-1-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t7-2-1').html() , value );
    }

});

QUnit.test( "Rerun using on-error", function( assert ) {

    // Build dictionary
    var c = 0;
    var dictionary = {
        treatErrors: function(){
            return 'Error number ' + (++c);
        },
        fireError: function( ){
            document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
        },
        divBy0: function( ){
            return 1 / 0;
        }
    };
    
    // Render #ul8-1 and run tests
    $( '#ul8-1' ).zpt({
        dictionary: dictionary
    });
    runTests( 'Error number 1', 'Error number 2' );
    
    // Partial render #ul8-2 and run tests again
    $( '#ul8-2' ).zpt({
        command: 'partialRender'
    });
    runTests( 'Error number 1', 'Error number 3' );
    
    function runTests( error1, error2 ){

        assert.equal( $('#t8-1-1').text() , error1 );
        assert.equal( $('#t8-1-2').text() , "Infinity" );
        assert.equal( $('#t8-2-1').text() , error2 );
        assert.equal( $('#t8-2-2').text() , "Infinity" );
    }

});

QUnit.test( "Rerun using loops", function( assert ) {
    
    var dictionary = { 
        number: 0,
        tools: [ 
            {name: "tool A", rent_url: "rent?id=1000"}, 
            {name: "tool B", rent_url: "rent?id=1002"}, 
            {name: "tool C", rent_url: "rent?id=1004"},
            {name: "tool D", rent_url: "rent?id=1006"}
        ]
    };
    
    // Render #t9-1 and run tests
    var startDate = new Date();
    $( '#t9-1' ).zpt({
        dictionary: dictionary
    });
    console.log( 'Run using loops render time: ' + utils.getMilliseconds( startDate ) + ' milliseconds.' );
    runTests( '0/1/2/3' );
    
    // Partial render #t9-2 and run tests again
    dictionary.number = 100;
    startDate = new Date();
    $( '#t9-1-3' ).zpt({
        command: 'partialRender'
    });
    console.log( 'Rerun using loops render time: ' + utils.getMilliseconds( startDate ) + ' milliseconds.' );
    runTests( '0/1/102/3' );
    
    function runTests( added ){
        
        assert.equal( utils.getAllValues( '.value' ) , 'tool A/tool B/tool C/tool D'  );
        assert.equal( utils.getAllValues( '.index' ) , '0/1/2/3'  );
        assert.equal( utils.getAllValues( '.number' ) , '1/2/3/4'  );
        assert.equal( utils.getAllValues( '.isEven' ) , 'true/false/true/false'  );
        assert.equal( utils.getAllValues( '.isOdd' ) , 'false/true/false/true'  );
        assert.equal( utils.getAllValues( '.isStart' ) , 'true/false/false/false'  );
        assert.equal( utils.getAllValues( '.isEnd' ) , 'false/false/false/true'  );
        assert.equal( utils.getAllValues( '.getLength' ) , '4/4/4/4'  );
        assert.equal( utils.getAllValues( '.getLetter' ) , 'a/b/c/d'  );
        assert.equal( utils.getAllValues( '.getCapitalLetter' ) , 'A/B/C/D'  );
        assert.equal( utils.getAllValues( '.getRoman' ) , 'i/ii/iii/iv'  );
        assert.equal( utils.getAllValues( '.getCapitalRoman' ) , 'I/II/III/IV'  );
        assert.equal( utils.getAllValues( '.added' ) , added  );   
    }
});

QUnit.test( "Rerun using internal macros", function( assert ) {

    var dictionary = { 
        number: 10
    };

    macroTests( assert, dictionary, 10 );
});

QUnit.test( "Rerun using external macros", function( assert ) {

    var dictionary = { 
        number: 10
    };
    
    var done = assert.async();
    
    zpt.run({
        command: 'preload',
        root: document.getElementById( 't11-1' ),
        dictionary: dictionary,
        declaredRemotePageUrls: [ 'externalMacros-definitions.html' ],
        callback: function(){
            zpt.run();
            macroTests( assert, dictionary, 11 );
            done();
        }
    });
});

var macroTests = function( assert, dictionary, testNumber ){
    
    // Render #t10-1 and run tests
    $( '#t' + testNumber + '-1' ).zpt({
        dictionary: dictionary
    });
    runMacroTests( 10, 15 );

    // Partial render #t10-2 and run tests again
    dictionary.number = 11;
    $( '#t' + testNumber + '-1b' ).zpt({
        command: 'partialRender'
    });
    runMacroTests( 11, 16 );

    function runMacroTests( value1, value2 ){

        assert.equal( $('#t' + testNumber + '-2').text() , "" + value1 );
        assert.equal( $('#t' + testNumber + '-3').text() , "2" );
        assert.equal( $('#t' + testNumber + '-4').text() , "3" );
        assert.equal( $('#t' + testNumber + '-5').text() , "" + value2 );
    }
};

var buildDictionaryForI18n = function(){
    
    /* I18n maps init */
    var msg1 = {
        en : {},
        es : {}
    };
    var msg2 = {
        en : {},
        es : {}
    };

    /* English i18n messages */
    msg1.en[ '/CONF/' ] = {
        language: 'en',
        locale: 'en-US'
    };
    msg1.en[ 'Hello world!' ] = 'Hello world!';
    msg1.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} }';
    msg1.en[ 'Oh, noooo!' ] = 'Error found... Oh, noooo!';
    msg2.en[ '/CONF/' ] = {
        language: 'en',
        locale: 'en-US'
    };
    msg2.en[ 'Hello world!' ] = 'Hello world 2.0!!!';

    /* Spanish i18n messages */
    msg1.es[ '/CONF/' ] = {
        language: 'es',
        locale: 'es-ES'
    };
    msg1.es[ 'Hello world!' ] = '¡Hola mundo!';
    msg1.es[ 'Results msg' ] = '{ GENDER, select, male{Él} female{Ella} other{Ellos} }' +
        ' ' +
        '{ RES, plural, =0{no } other{} }' +
        '{ GENDER, select, male{ha} female{ha} other{han} }' +
        ' encontrado ' +
        '{ RES, plural, =0{ningún resultado} one{un único resultado} other{# resultados} }';
    msg1.es[ 'Oh, noooo!' ] = 'Error encontrado... Oh, noooo!';
    msg2.es[ '/CONF/' ] = {
        language: 'es',
        locale: 'es-ES'
    };
    msg2.es[ 'Hello world!' ] = '¡¡¡Hola mundo 2!!!';

    // Create I18n and I18nBundle instances
    var i18nES1 = new I18n( 'es', msg1[ 'es' ] );
    var i18nES2 = new I18n( 'es', msg2[ 'es' ] );
    var i18nEN1 = new I18n( 'en', msg1[ 'en' ] );
    var i18nEN2 = new I18n( 'en', msg2[ 'en' ] );
    var i18nBundle1 = new I18nBundle( i18nES1, i18nEN1 );
    var i18nBundle2 = new I18nBundle( i18nES2, i18nEN2 );

    // Init dictionary
    var dictionary = {
        'i18nES1':  i18nES1,
        'i18nES2': i18nES2,
        'i18nEN1':  i18nEN1,
        'i18nEN2': i18nEN2,
        'i18nBundle1': i18nBundle1,
        'i18nBundle2': i18nBundle2,
        'i18nESArray': [ i18nES2, i18nES1 ],
        'i18nENArray': [ i18nEN2, i18nEN1 ]
    };
    
    return dictionary;
};

