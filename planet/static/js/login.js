var winLogin;

Ext.onReady(function(){
	Ext.tip.QuickTipManager.init(); //init tooltip
	
	//create a panel to login
	var loginFormPanel = Ext.create('Ext.form.Panel', {
		bodyPadding: 15,
		standardSubmit: true,
		defaults: { //applying default settings to all added items
			anchor: '100%',
			xtype: 'textfield',
			vtype: 'alphanum',
			allowBlank: false,
        },
        fieldDefaults: {
            labelWidth: 80,
            labelAlign: 'left',
			msgTarget: 'side',
            //use this settings if create a custom error and tooltip...
			//msgTarget: 'none', //the location where the error message text should display
            //invalidCls: '', //unset the invalidCls so individual fields do not get styled as invalid
        },
		items: [{
				name: 'username',
				id: 'idusername',
				fieldLabel: 'Username:',
				minLength: 3,
				maxLength: 30,
			},{
				name: 'password',
				fieldLabel: 'Password:',
				inputType: 'password',
				//vtype: 'customPass',
				minLength: 4,
				maxLength: 30,
			},
		],
		dockedItems: [
			{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [
					{ xtype: 'tbfill' },
					{
						xtype: 'button',
						itemId: 'reset',
						text: 'Reset',
						listeners: {
							click: function() {
								this.up('form').getForm().reset(); //reset all textfiled
							}
						}
					},
					{
						xtype: 'button',
						itemId: 'close',
						text: 'Close',
						listeners: {
							click: function() {
								winLogin.hide();
							}
						}
					},
					{
						xtype: 'button',
						itemId: 'submit',
						formBind: true,
						text: "Submit",
						listeners: {
							click: function() {
								var formPanel = this.up('form');
								var user = formPanel.down('textfield[name=username]').getValue();
								var pass = formPanel.down('textfield[name=password]').getValue();
								if (formPanel.getForm().isValid()) {
									Ext.Ajax.request({
										url: '/request_login',// call method in the django's view
										method: 'POST',
										params: {
											username: user,
											password: pass,
										},
										success: function (response, opts) {
											var data = Ext.decode(response.responseText);
											if(data['response'] == '1') {
												Ext.Msg.alert('Login', 'Welcome '+data['user']);
												Ext.getCmp('labelShowStatus').setText(data['usern']+' has logged in...');
												formPanel.getForm().reset();
												winLogin.hide();
												Ext.getCmp('loginButton').setText('Logout');
												loadGeomData();
												saveGeom.setDisabled(false);
												loadGeom.setDisabled(false);
												clearAllGeom.setDisabled(false);
											}	
											else if(data['response'] == '2') {
												Ext.Msg.alert('Disabled', data['message']);
											}
											else { //data['response'] == '3'
												Ext.Msg.alert('Error', data['message']);
											}
										},
										failure: function (response, opts) {
											// TODO: try: except in django
										},
									});//ajax request
								}//end if
							}//click
						}//listeners
					}//button
				]//items
			}//toolbar
		],//docked
	});//end panel
	
	//create window to contain panel
	winLogin = Ext.create('Ext.window.Window', {
		title: 'Login',
		closeAction: 'hide',
		height: 170,
		width: 360,
		layout: 'fit',
		iconCls: 'imgToolBarButtonLogin',
		resizable: false,
		draggable: false,
		modal: true, //mask everything behind it when displayed
		items: [
			loginFormPanel, //add panel
		],
	});//end window
	winLogin.center();
	
	// geometries from db
	function loadGeomData(){
		Ext.Ajax.request({
			url: '/load_geom',// call method in the django's view
			method: 'POST',
			params: {
				loadgeom: true,
			},
			success: function (response, opts) {
				if((response.responseText).length > 2) {
					vectorDraw.removeAllFeatures(); //refresh
					var data_temp, point, line, poly;
					data_temp = response.responseText.split(';');
					if(data_temp[0].length > 1) {
						var str = data_temp[0].replace(/\)/g, ')#');
						point = str.split('#');
						var wkt = new OpenLayers.Format.WKT();
						for(var i=0; i<point.length-1; i++) {
							var feature = wkt.read(point[i]);
							vectorDraw.addFeatures(feature);
						}
					}
					if(data_temp[1].length > 1) {
						var str = data_temp[1].replace(/\)/g, ')#');
						line = str.split('#');
						var wkt = new OpenLayers.Format.WKT();
						for(var i=0; i<line.length-1; i++) {
							var feature = wkt.read(line[i]);
							vectorDraw.addFeatures(feature);
						}
					}
					if(data_temp[2].length > 1) {
						var str = data_temp[2].replace(/\)\)/g, '))#');
						poly = str.split('#');
						var wkt = new OpenLayers.Format.WKT();
						for(var i=0; i<poly.length-1; i++) {
							var feature = wkt.read(poly[i]);
							vectorDraw.addFeatures(feature);
						}
					}
					//saveGeom.setDisabled(false);
				}
			},
			failure: function (response, opts) {
				// TODO: try: except in django
			},
		});
	}
	
	//custom vtype for password field
	/*Ext.apply(Ext.form.field.VTypes, {
		customPass: function(val, field) {
			return /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{4,16})/.test(val);
		},
		customPassText: 'Not a valid password. Length must be at least 4 characters and maximum of 16. Password must contain one digit, one letter lowercase, one letter uppercase and one special symbol between (@#$%).',
	});*/
});//onReady