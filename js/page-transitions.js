/**
 * PageTransitions
 */
var PageTransitions = ( function() {
    var settings = {
        duration: 250,
        selector: 'a[href*=' + window.location.hostname + ']:not([data-page-transition="ignore"])'
    };

    var init = function() {
        Debug.log( 'PageTransitions.init()' );

        $( 'html' )
            .addClass( 'page-transitions' );

        bindEventHandlers();

        setTimeout( function() {
            $( 'html' )
                .removeClass( 'page-transitioning' );
        }, settings.duration );
    }

    var bindEventHandlers = function() {
        // break BF Cache
        $( window )
            .on( 'unload', function( e ) {

            } );

        // break BF Cache even more
        $( window )
            .on( 'popstate pageinit pageshow', function() {
              setTimeout( function() {
                $( 'html' )
                  .removeClass( 'page-transitioning' );
              }, settings.duration );
            } );

        $( document )
            // click event on links without delay
            .on( 'mousedown', settings.selector, function( event ) {
                if( event.button === 0 ) {
                    onClick( $( this ), event );
                }
            } )

            // prevent click event
            .on( 'click', settings.selector, function( event ) {
                if( event.button === 0 ) {
                    event.preventDefault();
                }
            } );
    }

    var onClick = function( element, event ) {
        Debug.log( 'PageTransitions.onClick()' );

        event.preventDefault();
        var href = element.attr( 'href' );

        $( 'html' )
            .addClass( 'page-transitioning' );

        setTimeout( function() {
            window.location = href;
        }, settings.duration );
    }

    return {
        init: function() { init(); }
    }
} )();

$( document ).ready( function() {
    PageTransitions.init();
} );
