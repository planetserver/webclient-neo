Ext.onReady(function () {

	//alert(Ext.getBody().getViewSize().width + ", " + Ext.getBody().getViewSize().height);
	//alert($(window).width() + ", " + $(window).height());

	winConsole = new Ext.create('Ext.window.Window', {                            
		id: 'winConsoleId',
		title: 'CONSOLE',
		//maximizable: true,
		//minimizable: true,
		resizable: true,
		closeAction: 'hide',
		width: 500,
		height: 180,
		x: Ext.getBody().getViewSize().width - 510,
		y: Ext.getBody().getViewSize().height - 220,

		/*
		width: Ext.getBody().getViewSize().width * 0.412,
		height: Ext.getBody().getViewSize().height * 0.17 + 30,
		x: Ext.getBody().getViewSize().width * 0.588 - 10,
		y: Ext.getBody().getViewSize().height * 0.83 - 70,
		*/
	
		//items: [regionsPanel, bottomPanel]
            	items : [
			{
			frame: false,
			width: Ext.getBody().getViewSize().width * 0.405,
			height: Ext.getBody().getViewSize().height * 0.125,
			//x: 5,
			//y: 5,
		        contentEl : 'console',   //content read from html div#header
			bodyStyle: 'background:transparent; border:0',
	    		},
			/*
			{
			frame: false,
			width: Ext.getBody().getViewSize().width * 0.405,
			height: Ext.getBody().getViewSize().height * 0.125,
			x: 5,
			//y: 5,
		        contentEl : 'saveCheckId',   //content read from html div#header
			bodyStyle: 'background:transparent; border:0',
			style: 'text-align: right;'
	    		}
			*/
		],
		bbar: [
			{
				xtype: 'radiogroup',
				id: 'rbChooseCrismId',
				name: 'rbChooseCrism',
				//fieldLabel: 'Choose CRISM',
				columns: 1,
				vertical: true,
				items: [
				    { id: 'rbIrId', boxLabel: 'IR', name: 'rbChoiceCrism', inputValue: '0' },
				    { id: 'rbVnirId', boxLabel: 'VNIR', name: 'rbChoiceCrism', inputValue: '1', checked: true}
				],
				listeners: {
					change: function(field, newValue, oldValue) {
						var dataTabs = Ext.getCmp('dataTabsId');
						if (this.getChecked()[0].boxLabel == 'IR') {
							dataTabs.setActiveTab(0);
						} else {
							dataTabs.setActiveTab(1);
						}
					}
				}
			},
			{ xtype: 'tbfill', },
			//{ xtype: 'tbspacer' },
			{
			xtype: 'checkbox',
			id: 'checkSaveForGisId',
			boxLabel: 'Save for GIS ',
			name: 'saveForGis',
			//inputValue: '0',
			/*
			handler: function () {
				var myFavorite = Ext.getCmp('rbChooseCrismId').getChecked()[0];
				alert("Label is: " + myFavorite.boxLabel + " and Value is: " + myFavorite.getGroupValue());
				}
			*/
			},
			{ xtype: 'tbspacer', width: 5 }
			]
	});


	winConsole.on('show', function(win) {

	});
	winConsole.on('hide', function(win) {
		//deactivate the control
	});
	//winConsole.show();

	// Basic mask (waiting window)
	//var myMask = new Ext.LoadMask(winConsole, {msg:"Please wait..."});
	//var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});


	//**********************	INTERNAL FUNCTIONS	****************************************************


});

