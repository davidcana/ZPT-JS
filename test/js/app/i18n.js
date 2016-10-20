$(function () {
    "use strict";

    var msg = {
        en : {},
        es : {}
    };
    var msg2 = {
        en : {},
        es : {}
    };
    
    /* English */
    msg.en[ 'Hello world!' ] = 'Hello world!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} }';
    msg2.en[ 'Hello world!' ] = 'Hello world 2.0!!!';
    
    /* Spanish i18n messages */
    msg.es[ 'Hello world!' ] = '¡Hola mundo!';
    msg.es[ 'Results msg' ] = '{ GENDER, select, male{Él} female{Ella} other{Ellos} }' +
        ' ' +
        '{ RES, plural, =0{no } other{} }' +
        '{ GENDER, select, male{ha} female{ha} other{han} }' +
        ' encontrado ' +
        '{ RES, plural, =0{ningún resultado} one{un único resultado} other{# resultados} }';
    msg2.es[ 'Hello world!' ] = '¡¡¡Hola mundo 2!!!';
    
    var dictionary = {
        'i18n-ES': new I18n( 'es', msg[ 'es' ] ),
        'i18n-ES2': new I18n( 'es', msg2[ 'es' ] ),
        'i18n-EN': new I18n( 'en', msg[ 'en' ] ),
        'i18n-EN2': new I18n( 'en', msg2[ 'en' ] )
    };

    zpt.run( document.body, dictionary );
    /*
    $( 'body' ).zpt({
        dictionary: dictionary
    });*/
    
    QUnit.test( "Simple i18n test", function( assert ) {
        assert.equal( $('#t1-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t1-2').html() , "Hello world!" );
    });
    
    QUnit.test( "With parameters (spanish)", function( assert ) {
        assert.equal( $('#t2-1').html() , "Él no ha encontrado ningún resultado" );
        assert.equal( $('#t2-2').html() , "Él ha encontrado un único resultado" );
        assert.equal( $('#t2-3').html() , "Él ha encontrado 10 resultados" );
        assert.equal( $('#t2-4').html() , "Ella no ha encontrado ningún resultado" );
        assert.equal( $('#t2-5').html() , "Ella ha encontrado un único resultado" );
        assert.equal( $('#t2-6').html() , "Ella ha encontrado 10 resultados" );
        assert.equal( $('#t2-7').html() , "Ellos no han encontrado ningún resultado" );
        assert.equal( $('#t2-8').html() , "Ellos han encontrado un único resultado" );
        assert.equal( $('#t2-9').html() , "Ellos han encontrado 10 resultados" );
    });

    QUnit.test( "With parameters (english)", function( assert ) {
        assert.equal( $('#t3-1').html() , "He found no results" );
        assert.equal( $('#t3-2').html() , "He found 1 result" );
        assert.equal( $('#t3-3').html() , "He found 10 results" );
        assert.equal( $('#t3-4').html() , "She found no results" );
        assert.equal( $('#t3-5').html() , "She found 1 result" );
        assert.equal( $('#t3-6').html() , "She found 10 results" );
        assert.equal( $('#t3-7').html() , "They found no results" );
        assert.equal( $('#t3-8').html() , "They found 1 result" );
        assert.equal( $('#t3-9').html() , "They found 10 results" );
    });
    
    QUnit.test( "2 domains in domain definition: i18n-ES2 i18n-ES (spanish)", function( assert ) {
        assert.equal( $('#t4-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t4-2').html() , "Él no ha encontrado ningún resultado" );
    });
    
    QUnit.test( "2 domains in domain definition: i18n-EN2 i18n-EN (english) ", function( assert ) {
        assert.equal( $('#t5-1').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t5-2').html() , "He found no results" );
    });
    
    QUnit.test( "Nested domains: i18n-ES and i18n-ES2 nested (spanish) ", function( assert ) {
        assert.equal( $('#t6-1').html() , "¡¡¡Hola mundo 2!!!" );
        assert.equal( $('#t6-2').html() , "Él no ha encontrado ningún resultado" );
    });
    
    QUnit.test( "Nested domains: i18n-EN and i18n-EN2 nested (english) ", function( assert ) {
        assert.equal( $('#t7-1').html() , "Hello world 2.0!!!" );
        assert.equal( $('#t7-2').html() , "He found no results" );
    });
});
