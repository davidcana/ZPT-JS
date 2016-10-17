$(function () {
    "use strict";

    var msg = {
        en : {},
        es : {}
    };
    
    /* English */
    msg.en[ 'Hello world!' ] = 'Hello world!';
    
    /* Spanish i18n messages */
    msg.es[ 'Hello world!' ] = '¡Hola mundo!';
    
    var i18nBundle = defaultTranslator.createI18nBundle( msg );
    
    var dictionary = {
        'i18n:es': i18nBundle.getI18n( 'es' ),
        'i18n:en': i18nBundle.getI18n( 'en' )
    };

    /* zpt.run( document.body, dictionary ); */
    $( 'body' ).zpt({
        dictionary: dictionary
    });
    
    QUnit.test( "Simple i18n test", function( assert ) {
        assert.equal( $('#t1-1').html() , "¡Hola mundo!" );
        assert.equal( $('#t1-2').html() , "Hello world!" );
    });
});
