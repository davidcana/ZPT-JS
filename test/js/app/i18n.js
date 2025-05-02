"use strict";

var zz = require( 'zzdom' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );
var I18n = zpt.I18n;
var I18nBundle = zpt.I18nBundle;
var i18nTests = require( './i18nTests.js' );

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
msg1.en[ 'option1' ] = 'This is option 1';
msg1.en[ 'option2' ] = 'This is option 2';
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
msg1.es[ 'option1' ] = 'Ésta es la opción 1';
msg1.es[ 'option2' ] = 'Ésta es la opción 2';
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
    'i18nENArray': [ i18nEN2, i18nEN1 ],
    fireError: function( ){
        //return 1 / 0;
        document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
    },
    date : new Date( Date.UTC( 2012, 11, 20, 3, 0, 0 ) )
};

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests!
i18nTests( dictionary );
