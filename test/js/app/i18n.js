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
    msg.en[ '/CONF/' ] = {
        language: 'en',
        locale: 'en-US'
    };
    msg.en[ 'Hello world!' ] = 'Hello world!';
    msg.en[ 'Results msg' ] = '{GENDER, select, male{He} female{She} other{They} }' +
        ' found ' +
        '{RES, plural, =0{no results} one{1 result} other{# results} }';
    msg.en[ 'Oh, noooo!' ] = 'Error found... Oh, noooo!';
    msg2.en[ 'Hello world!' ] = 'Hello world 2.0!!!';
    
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
    msg.es[ 'Oh, noooo!' ] = 'Error encontrado... Oh, noooo!';
    msg2.es[ 'Hello world!' ] = '¡¡¡Hola mundo 2!!!';
    
    var dictionary = {
        'i18n-ES': new I18n( 'es', msg[ 'es' ] ),
        'i18n-ES2': new I18n( 'es', msg2[ 'es' ] ),
        'i18n-EN': new I18n( 'en', msg[ 'en' ] ),
        'i18n-EN2': new I18n( 'en', msg2[ 'en' ] ),
        fireError: function( ){
            //return 1 / 0;
            document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
        },
        date : new Date( Date.UTC( 2012, 11, 20, 3, 0, 0 ) )
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
    
    QUnit.test( "Attributes test (spanish)", function( assert ) {
        assert.equal( $('#t8-1').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-2').attr('title') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-3').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-3').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4').attr('title') , "¡Hola mundo!" );
        assert.equal( $('#t8-4').attr('alt') , "Ella ha encontrado 4 resultados" );
        assert.equal( $('#t8-4').attr('longdesc') , "http://www.fsf.org" );
    });
    
    QUnit.test( "Attributes test (english)", function( assert ) {
        assert.equal( $('#t9-1').attr('title') , "Hello world!" );
        assert.equal( $('#t9-2').attr('title') , "She found 4 results" );
        assert.equal( $('#t9-3').attr('title') , "Hello world!" );
        assert.equal( $('#t9-3').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4').attr('title') , "Hello world!" );
        assert.equal( $('#t9-4').attr('alt') , "She found 4 results" );
        assert.equal( $('#t9-4').attr('longdesc') , "http://www.fsf.org" );
    });
    
    QUnit.test( "Replace (spanish)", function( assert ) {
        assert.equal( $('#t10-1').html().trim() , "¡Hola mundo!" );
        assert.equal( $('#t10-2').html().trim() , "Él ha encontrado un único resultado" );
    });
    
    QUnit.test( "Replace (english)", function( assert ) {
        assert.equal( $('#t11-1').html().trim() , "Hello world!" );
        assert.equal( $('#t11-2').html().trim() , "He found 1 result" );
    });
    
    QUnit.test( "Define (spanish)", function( assert ) {
        assert.equal( $('#t12-1').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-2').html(), "Él ha encontrado un único resultado" );
        assert.equal( $('#t12-3').html(), "¡Hola mundo!" );
        assert.equal( $('#t12-4').html(), "Él ha encontrado un único resultado" );
    });
    
    QUnit.test( "Define (english)", function( assert ) {
        assert.equal( $('#t13-1').html(), "Hello world!" );
        assert.equal( $('#t13-2').html(), "He found 1 result" );
        assert.equal( $('#t13-3').html(), "Hello world!" );
        assert.equal( $('#t13-4').html(), "He found 1 result" );
    });
    
    QUnit.test( "On error test (spanish)", function( assert ) {
        assert.equal( $('#t14-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t14-2').html() , "Error encontrado... Oh, noooo!" );
    });
    
    QUnit.test( "On error test (english)", function( assert ) {
        assert.equal( $('#t15-1').html() , "Hello world!" );
        assert.equal( $('#t15-2').html() , "Error found... Oh, noooo!" );
    });
    
    QUnit.test( "Numbers (spanish)", function( assert ) {
        assert.equal( $('#t16-1').html() , "1.355,23" );
        assert.equal( $('#t16-2').html() , "1.355,236" );
        assert.equal( $('#t16-3').html() , "001.355,236" );
    });
    
    QUnit.test( "Numbers (english)", function( assert ) {
        assert.equal( $('#t17-1').html() , "1,355.23" );
        assert.equal( $('#t17-2').html() , "1,355.236" );
        assert.equal( $('#t17-3').html() , "001,355.236" );
    });
        
    QUnit.test( "Currencies (spanish)", function( assert ) {
        assert.equal( $('#t18-1').html() , "1.355,23&nbsp;€" );
        assert.equal( $('#t18-2').html() , "1.355,23&nbsp;$" );
        assert.equal( $('#t18-3').html() , "1.355,23 euros" );
        assert.equal( $('#t18-4').html() , "1.355,23 dólares estadounidenses" );
    });
    
    QUnit.test( "Currencies (english)", function( assert ) {
        assert.equal( $('#t19-1').html() , "€1,355.23" );
        assert.equal( $('#t19-2').html() , "$1,355.23" );
        assert.equal( $('#t19-3').html() , "1,355.23 euros" );
        assert.equal( $('#t19-4').html() , "1,355.23 US dollars" );
    });
    
    QUnit.test( "Datetime (spanish)", function( assert ) {
        assert.equal( $('#t20-1').html() , "20/12/2012" );
        assert.equal( $('#t20-2').html() , "21/12/2012" );
        assert.equal( $('#t20-3').html() , "jueves, 20 de diciembre de 2012" );
        assert.equal( $('#t20-4').html() , "viernes, 21 de diciembre de 2012" );
        assert.equal( $('#t20-5').html() , "4:00:00" );
        assert.equal( $('#t20-6').html() , "4:00:00" );
        assert.equal( $('#t20-7').html() , "jueves, 20 de diciembre de 2012 4:00:00" );
        assert.equal( $('#t20-8').html() , "viernes, 21 de diciembre de 2012 4:00:00" );
    });
    
    QUnit.test( "Datetime (english)", function( assert ) {
        assert.equal( $('#t21-1').html() , "12/20/2012" );
        assert.equal( $('#t21-2').html() , "12/21/2012" );
        assert.equal( $('#t21-3').html() , "Thursday, December 20, 2012" );
        assert.equal( $('#t21-4').html() , "Friday, December 21, 2012" );
        assert.equal( $('#t21-5').html() , "4:00:00 AM" );
        assert.equal( $('#t21-6').html() , "4:00:00 AM" );
        assert.equal( $('#t21-7').html() , "Thursday, December 20, 2012, 4:00:00 AM" );
        assert.equal( $('#t21-8').html() , "Friday, December 21, 2012, 4:00:00 AM" );
    });
});
