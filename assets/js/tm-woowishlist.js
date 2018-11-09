( function( $ ) {

	'use strict';

	$( document ).ready( function() {

		var tmWooLoadingClass = 'loading',
			tmWooAddedClass   = 'added in_wishlist',
			buttonSelector    = 'button.tm-woowishlist-button';
		$( document ).on( 'tm_wishlist_update_fragments', updateWishlistFragments );

		function productButtonsInit() {

			$( document ).on( 'click', buttonSelector, function ( event ) {

				var button = $( this );

				event.preventDefault();

				if( button.hasClass( 'in_wishlist' ) ) {

					return;
				}

				var url  = tmWoowishlist.ajaxurl,
					data = {
						action: 'tm_woowishlist_add',
						pid:    button.data( 'id' ),
						nonce:  button.data( 'nonce' ),
						single: button.hasClass( 'tm-woowishlist-button-single' )
					};

				button
					.removeClass( tmWooAddedClass )
					.addClass( tmWooLoadingClass );

				$.post(
					url,
					data,
					function( response ) {

						button.removeClass( tmWooLoadingClass );

						if( response.success ) {

							button
								.addClass( tmWooAddedClass )
								.find( '.text' )
								.text( tmWoowishlist.addedText );

							if( response.data.wishlistPageBtn ) {

								button.after( response.data.wishlistPageBtn );
							}
							var data = {
								action: 'tm_woowishlist_update'
							};
							$( document ).trigger( 'tm_wishlist_update_fragments');
							tmWoowishlistAjax( null, data );
						}
					}
				);
			} );
		}

		function tmWoowishlistAjax( event, data ) {

			if( event ) {
				event.preventDefault();
			}

			var url           = tmWoowishlist.ajaxurl,
				widgetWrapper = $( 'div.tm-woocomerce-wishlist-widget-wrapper' ),
				wishList      = $( 'div.tm-woowishlist' );

			data.isWishlistPage = !!wishList.length;
			data.isWidget       = !!widgetWrapper.length;

			if ( 'tm_woowishlist_update' === data.action && !data.isWishlistPage && !data.isWidget ) {
				return;
			}
			if( data.isWishlistPage ) {

				data.wishListData = JSON.stringify( wishList.data() );
			}
			wishList.addClass( tmWooLoadingClass );

			widgetWrapper.addClass( tmWooLoadingClass );
			$.post(
				url,
				data,
				function( response ) {

					wishList.removeClass( tmWooLoadingClass );

					widgetWrapper.removeClass( tmWooLoadingClass );

					if( response.success ) {

						if( data.isWishlistPage ) {

							$( 'div.tm-woowishlist-wrapper' ).html( response.data.wishList );
						}
						if( data.isWidget ) {

							widgetWrapper.html( response.data.widget );
						}
						if ( 'tm_woowishlist_remove' === data.action ) {

							$( buttonSelector + '[data-id=' + data.pid + ']' ).removeClass( tmWooAddedClass ).find( '.text' ).text( tmWoowishlist.addText );

							$( buttonSelector + '[data-id=' + data.pid + ']' ).next( '.tm-woowishlist-page-button' ).remove();
						}
						$( document ).trigger( 'tm_wishlist_update_fragments');
					}
					widgetButtonsInit();
				}
			);
		}

		function tmWoowishlistRemove( event ) {

			var button = $( event.currentTarget ),
				data   = {
					action: 'tm_woowishlist_remove',
					pid:    button.data( 'id' ),
					nonce:  button.data( 'nonce' )
				};

			tmWoowishlistAjax( event, data );
		}

		function widgetButtonsInit() {

			$( '.tm-woowishlist-remove' )
				.off( 'click' )
				.on( 'click', function ( event ) {
					tmWoowishlistRemove( event );
				} );
			if ( isFunction(window["wcqib_refresh_quantity_increments"]) ) wcqib_refresh_quantity_increments();
		}
		function updateWishlistFragments() {
			var url = tmWoowishlist.ajaxurl,
			data1 = {
				action: 'tm_woowislist_count'
			};
			$.post(
				url,
				data1,
				function( response ) {
					if( response.success ) {
						$( 'div.cart_butt .butt_favor .num .wishlist-count' ).html( response.data.count );
					}
				}
			);
		}
		function isFunction(functionToCheck)  {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		}

		widgetButtonsInit();
		productButtonsInit();

	} );
}( jQuery) );