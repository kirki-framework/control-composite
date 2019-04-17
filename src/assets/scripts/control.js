/* global kirkiControlLoader */
wp.customize.controlConstructor['kirki-composite'] = wp.customize.Control.extend( {

	ready: function() {
		var control = this,
			value   = control.setting.get();

		_.each( this.params.fields, function( field ) {
			var combinedArgs = control.getCombinedFieldArgs( control, field ),
				subControl   = wp.customize.control.add(
				new wp.customize.Control( field.settings, combinedArgs ) 
			);
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
		params.id      = field.settings;
		params.value   = control.setting._value[ params.id.replace( control.id + '[', '' ).replace( ']', '' ) ];
		params.content = '<li id="customize-control-' + field.settings.replace( /]/g, '' ).replace( /\[/g, '-' ) + '" class="customize-control customize-control-' + field.type + '"></li>';
		params.link    = 'data-customize-setting-link="' + params.id + '"';
		
		return params;
	},

} );
