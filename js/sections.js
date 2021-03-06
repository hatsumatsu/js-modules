/**
 * Sections
 */
var Sections = ( function() {
    var settings = {
        current: {
            id: undefined
        },
        _current: {
            id: undefined
        },
        offset: 0,
        snap: false,
        snapeDelay: 1000,
        snapSpeed: 250,
        snapDebouncer: null
    }

    var selector = {
        section: '[data-section]',
    }

    var cache = [];

    var init = function() {
        Debug.log( 'Sections.init();' );

        onResize();
        onScroll();

        bindEventhandlers();
    }

    var bindEventhandlers = function() {
        $( document )
            .on( 'viewport/scroll', function() {
                onScroll();
            } )
            .on( 'viewport/resize/finish', function() {
                onResize();
            } )
            .on( 'sections/change', function( event, data ) {
                onChange( data.section, data.index );
            } )
            .on( 'sections/leave', function( event, data ) {
                onLeave( data.section, data.index );
            } )
            .on( 'sections/enter', function( event, data ) {
                onEnter( data.section, data.index );
            } );
    }

    var onScroll = function() {
        var scrollTop = Viewport.get( 'scrollTop' );

        for( var i = 0; i < cache.length; i++ ) {
            if( scrollTop >= cache[i].top - settings.offset && scrollTop < cache[i].bottom - settings.offset ) {
                settings._current = settings.current;

                if( cache[i].id !== settings._current.id || !settings.current.id ) {
                    settings.current = cache[i];

                    $( document ).trigger( 'sections/change', [{ section: settings.current, index: i }] );
                    $( document ).trigger( 'sections/enter', [{ section: settings.current, index: i }] );
                    $( document ).trigger( 'sections/leave', [{ section: settings._current, index: i }] );
                }
            }
        }

        // debounce
        if( settings.snap ) {
            clearTimeout( settings.snapDebouncer );
            settings.snapDebouncer = setTimeout( function() {
                snap();
            }, settings.snapeDelay );
        }
    }

    var onResize = function() {
        settings.offset = ( Viewport.get( 'height' ) / 2 );

        buildCache();
    }

    var onChange = function( section, index ) {
        Debug.log( 'Sections.onChange()', section, index );

        if( !section.id ) {
            return false;
        }

        for( var i = 0; i < cache.length; i++ ) {
            cache[i].section
                .removeClass( 'before' )
                .removeClass( 'after' );

            if( i < index ) {
                cache[i].section
                    .addClass( 'before' );
            }

            if( i > index ) {
                cache[i].section
                    .addClass( 'after' );
            }
        }
    }

    var onEnter = function( section, index ) {
        Debug.log( 'Sections.onEnter()', section, index );

        if( !section.id ) {
            return false;
        }

        section.section
            .addClass( 'current' );
    }

    var onLeave = function( section, index ) {
        Debug.log( 'Sections.onLeave()', section, index );

        if( !section.id ) {
            return false;
        }

        section.section
            .removeClass( 'current' );
    }

    var buildCache = function() {
        Debug.log( 'Sections.cache();' );

        cache = [];

        $( selector.section ).each( function() {
            var section = $( this );
            var top = section.offset().top;
            var bottom = top + section.outerHeight();

            cache.push( {
                id: section.attr( 'data-section' ),
                section: section,
                top: top,
                bottom: bottom
            } );
        } );

        Debug.log( cache );
    }

    var snap = function() {
        Debug.log( 'Sections.snap();' );

        var section = settings.current.section;

        if( Viewport.scrollTo ) {
            Viewport.scrollTo( section, 0, true );
        }
    }

    return {
        init: function() { init(); }
    }
} )();

$( document ).ready( function() {
    Sections.init();
} );
