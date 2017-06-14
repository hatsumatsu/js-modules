/**
 * Path
 */
var Path = ( function() {

    var settings = {
        baseURL: 'https://example.com'
    };

    var selector = {
        link: 'a[href^="' + settings.baseURL + '"]:not( [data-path="ignore"] )'
    }

    var state = {
        url: {
            current: '',
            previous: ''
        },
        path: {
            current: '/',
            previous: '/'
        },
        hash: {
            current: '',
            previous: ''
        }
    }

    var init = function() {
        Debug.log( 'Path.init()' );

        location.hash = '';

        state.url.current = location.href;
        state.url.previous = location.href;

        state.path.current = location.pathname;
        state.path.previous = location.pathname;

        state.hash.current = location.hash.replace( '#', '' );
        state.hash.previous = location.hash.replace( '#', '' );

        bindEventHandlers();
    }

    var bindEventHandlers = function() {

        $( window )
            // native history event
            .on( 'popstate', function( event ) {
                Debug.log( 'popstate event', event, event.originalEvent.state );

                if( event.originalEvent.state !== null ) {
                    var url = location.href;
                    checkForChange( url );
                }
            } )
            // native hash change
            .on( 'hashchange', function() {
                checkForChange( url );
            } );

        $( document )
            .on( 'path/change/path', function( event, data ) {
                onChangePath( data );
            } )
            .on( 'path/change/hash', function( event, data ) {
                onChangeHash( data );
            } )
            .on( 'click', selector.link, function( event ) {
                event.preventDefault();

                var url = $( this ).attr( 'href' );
                history.pushState(
                    {},
                    '',
                    url
                );

                checkForChange( url );
            } );
    }

    var onChangePath = function( data ) {
        Debug.log( 'Path.onChangePath()', data );

    }

    var onChangeHash = function( data ) {
        Debug.log( 'Path.onChangeHash()', data );

    }

    var checkForChange = function( url ) {
        Debug.log( 'Path.checkForChange()', url );

        if( !url ) {
            return false;
        }

        state.url.previous = state.url.current;
        state.url.current = location.href;

        state.path.previous = state.path.current;
        state.path.current = location.pathname;

        state.hash.previous = state.hash.current;
        state.hash.current = location.hash.replace( '#', '' );

        if( state.path.current !== state.path.previous ) {
            $( document ).trigger( 'path/change/path', [{
                url: state.url.current,
                path: state.path.current,
                hash: state.hash.current
            }] );
        }

        if( state.hash.current !== state.hash.previous ) {
            $( document ).trigger( 'path/change/hash', [{
                url: state.url.current,
                path: state.path.current,
                hash: state.hash.current
            }] );
        }
    }

    return {
        init: function() { init(); }
    }
} )();

$( document ).ready( function() {
    Path.init();
} );
