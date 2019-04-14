/* global kirkiControlLoader */
wp.customize.controlConstructor['kirki-composite'] = wp.customize.Control.extend( {

	initialize: function( id, options ) {
		// var control = this,
		// 	args    = options || {},
		// 	content = '';

		// args.params = args.params || {};
		// args.params.content = jQuery( '<li></li>' );
		// args.params.content.attr( 'id', 'customize-control-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
		// args.params.content.attr( 'class', 'customize-control customize-control-' + args.params.type );

		// // Add markup in composite control.
		// content += '<input class="composite-hidden-value" type="hidden" ' + options.link + '>';
		// if ( args.label || args.description ) {
		// 	content += '<label>';
		// 	content += args.label ? '<span class="customize-control-title">' + args.label + '</span>' : '';
		// 	content += args.description ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
		// 	content += '</label>';
		// }
		// content += '<div id="composite-controls-wrapper-' + id.replace( /]/g, '' ).replace( /\[/g, '-' ) + '">';
		// content += '</div>';

		// args.params.content.contents( content );
	
		// control.propertyElements = [];
		// wp.customize.Control.prototype.initialize.call( control, id, args );
		// wp.hooks.doAction( 'kirki.dynamicControl.init.after', id, control, args );

		wp.customize.Control.prototype.initialize.call( this, id, options );
		wp.hooks.doAction( 'kirki.dynamicControl.init.after', id, this, options );
	},

	ready: function() {
		var control = this;

		_.each( this.params.fields, function( field ) {
			// console.log( control.getCombinedFieldArgs( field ) );
			var subControl = wp.customize.control.add(
				// new wp.customize.kirkiDynamicControl( field.settings, control.getCombinedFieldArgs( control, field ) ) 
				new wp.customize.Control( field.settings, control.getCombinedFieldArgs( control, field ) ) 
			);
			// subControl.container = control.container.find( '#composite-controls-wrapper-' + control.id.replace( /]/g, '' ).replace( /\[/g, '-' ) );
			// console.log(control.container);
			// console.log( subControl.container );
			// console.log(subControl);
			kirki.control[ field.type ].init( subControl );
		});

		// Trigger change to the hidden input.
		wp.hooks.addAction( 'kirki.settingSet', 'kirki', function( setting, value ) {
			if ( control.id === setting ) {
				control.container.find( '.composite-hidden-value' ).attr( 'value', JSON.stringify( value ) ).trigger( 'change' );
			}
		});
	},
	
	getCombinedFieldArgs: function( control, field ) {
		var params = control.params;
		_.each( field, function( v, k ) {
			params[ k ] = v;
		});
		if ( ! field.description ) {
			params.description = '';
		}
		// params.choices = params.choices || {};
		// params.params  = params.params || {};
		// params.params.choices = params.params.choices || {};
		params.value   = kirki.setting.get( field.settings );
		params.id      = field.settings;
		// console.log( params)
		params.content = '<li id="customize-control-' + field.settings.replace( /]/g, '' ).replace( /\[/g, '-' ) + '" class="customize-control customize-control-' + field.type + '"></li>';
		return params;
	}
} );

wp.hooks.addAction( 'kirki.dynamicControl.init.after', 'kirki', function( id, innerControl, args ) {
	var innerContent = '';

	// Add markup in composite control.
	if ( 'kirki-composite' === args.type ) {
		innerContent += '<input class="composite-hidden-value" type="hidden" data-id="' + id + '"' + innerControl.params.link + '>';
		if ( args.label || args.description ) {
			innerContent += '<label>';
			innerContent += args.label ? '<span class="customize-control-title">' + args.label + '</span>' : '';
			innerContent += args.description ? '<span class="description customize-control-description">' + args.description + '</span>' : '';
			innerContent += '</label>';
		}
		innerContent += '<div id="composite-controls-wrapper-' + innerControl.id.replace( /]/g, '' ).replace( /\[/g, '-' ) + '">';
		innerContent += '</div>';

		innerControl.container.append( innerContent );

		jQuery( '.composite-hidden-value' ).on( 'change', function() {
			// console.log('here');
			// kirki.setting.set( id, jQuery( this ).val() );
			wp.customize.control( id ).setting.set( jQuery( this ).val() );

		});		
	}
	// console.log( ['init',id,innerContent,args]);
});

wp.hooks.addAction( 'kirki.settingSet.before', 'kirki', function( setting, value ) {
	// console.log( [setting,value]);
});

