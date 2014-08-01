Ext.onReady(function () {

	//**********************************************	TOP PANEL	****************************************************

	Ext.define('thumbnails', {
	    extend: 'Ext.data.Model',
	    fields: [
		{ name:'region', type:'string' },
		{ name:'src', type:'string' },
		{ name:'caption', type:'string' },
		{ name:'regionNumber', type:'number' }
	    ]
	});

	var regionThumbnails = [];

	var i = 0;
	var str = '';
	for (region in regions) {
		str = '/static/images/' + regions[region].thumbnail;
		//alert('str = ' + str);		
		regionThumbnails.push({'region': region, 'src': str, 'caption': regions[region].name, 'regionNumber': i++ });
	};

	var thumbnailsStore = Ext.create('Ext.data.Store', {
	    id:'imagesStore',
	    model: 'thumbnails',
	    data: regionThumbnails
	});

	var thumbnailsTpl = new Ext.XTemplate(
	    '<tpl for=".">',
		'<div style="margin-bottom: 10px;" class="thumb-wrap">',
		  '<img src="{src}" title="Go to {caption}"/>',
		  '<br/><br/><span>{caption}</span>',
		'</div>',
	    '</tpl>'
	);

	var thumbnailsView = Ext.create('Ext.view.View', {
            trackOver: true,
	    store: thumbnailsStore,
	    tpl: thumbnailsTpl,
	    itemSelector: 'div.thumb-wrap',
	    emptyText: 'No images available',
            listeners: {
                selectionchange: function(dv, nodes ){
			//var comboRegions = Ext.getCmp('comboBoxRegionId');
			//comboRegions.setValue(nodes[0].data['caption']);
			//winWebsearch.hide();
			loadRegion(nodes[0].data['region']);
                }
            }

	});

	// create a panel to choose the region
	var regionsPanel = Ext.create('Ext.FormPanel', {
	//var layersPanel = Ext.create('Ext.form.Panel', {
		id: 'imagesPanelId',
		title: 'Regions',
		frame: true,
		autoScroll: true,
		//hidden: true,
		collapsible: false,
		//collapsed: true,
		x: 10,
		y: 10,
		width: 570,
		//width: '100%',
		height: 460,
		margin: 0,
		autoScroll: true,
        items: [thumbnailsView]
	});

	//**********************	TOP PANEL - END		****************************************************

	//**********************	BOTTOM PANEL	****************************************************

	var textTop = new Ext.form.field.Text({
		labelAlign: 'top',
		labelSeparator: '',
		fieldLabel: 'Max latitude',
		width: 100,
		value: -2.550000
	});

	var textLeft = new Ext.form.field.Text({
		labelAlign: 'top',
    		labelSeparator: '',
    		fieldLabel: 'Min longitude',
		width: 100,
	    	value: 133.000000
	});
	var textRight = new Ext.form.field.Text({
		labelAlign: 'top',
    		labelSeparator: '',
    		fieldLabel: 'Max longitude',
		width: 100,
	    	value: 142.000000
	});

	var textBottom = new Ext.form.field.Text({
		labelAlign: 'top',
    		labelSeparator: '',
    		fieldLabel: 'Min latitude',
		width: 100,
	    	value: -6.670000
	});

	var showButton = Ext.create('Ext.Button', {
		id: 'showButtonId',
		text: 'Show region',
		tooltip: 'Show region on the map',
		width: 120,
		//height: 60,
		iconCls: 'imgShowRegion',
		handler: function(){
				//var zoomCrossSection = Ext.getCmp('zoomCrossSectionButtonId');
				//alert('textTop.getValue() = ' + textTop.getValue());
				loadRegionByRect();
			}
	});

	var drawRectButton = Ext.create('Ext.Button', {
		id: 'drawRectButtonId',
		text: 'Draw Rectangle',
		//tooltip: '"Shift+MouseDown" to draw a rectangle on the map',
		width: 120,
		//height: 60,
		iconCls: 'imgDrawRectangleDisable',
		enableToggle: true,
		handler: function(){
				if (drawRectButton.pressed == true) {
					//this.setText('Disable "Draw Rectangle"');
					this.setIconCls('imgDrawRectangleEnable');
					rectControl.box.activate();
				} else {
					//this.setText('Enable "Draw Rectangle"');
					this.setIconCls('imgDrawRectangleDisable');
					rectControl.box.deactivate();
				}
			}
	});

	var spacerItem = {xtype:'tbspacer', flex: 1};

	// sx panel
	var sxPanel = new Ext.create('Ext.form.Panel', {
		id:'sxPanelId',
		//title: 'Navigation',
		width: 400,
		height: 175,
		//defaults: {bodyStyle: 'padding:15px 15px 15px 15px;border-color:#00ff00'},
		//defaults: {bodyStyle: 'padding:15px 15px 15px 15px'},
		//defaults: {bodyStyle: 'padding: 5px 5px 5px 5px'},
		defaults: {bodyStyle: 'padding: 2px 2px 2px 2px;'},
		padding: 10,
		//border: 0,
		items:[
			{
			//title: 'Top',        
			layout: {
				type: 'hbox',
				padding: '5',
				pack: 'center',
				align: 'middle'
			},
			defaults: {margins:'0 5 0 0'},
			//border: 0,
			bodyStyle: 'background: transparent; border:0',
			items: [textTop]
			},{
			//title:'Center',        
			layout: {
				type: 'hbox',
				//padding: '5',
				padding: '5, 20, 5, 20',
				pack: 'center',
				align: 'middle'
			},
			//border: 0,
			bodyStyle: 'border:0',
			items: [textLeft, spacerItem, textRight]
			},{
			//title:'Bottom',        
			layout: {
				type: 'hbox',
				padding: '5',
				pack: 'center',
				align: 'middle'
			},
			defaults: {margins:'0 5 0 0'},
			//border: 0,
			bodyStyle: 'border:0',
			items: [textBottom]
			}
		]
	});

	// dx panel
	var dxPanel = new Ext.create('Ext.form.Panel', {
	id:'dxPanelId',
	//title: 'Actions',
	width: 150,
	//height: 250,
	height: 175,
	//defaults: {bodyStyle: 'padding:15px 15px 15px 15px;border-color:#00ff00'},
	//padding: '15px 15px 15px 15px',
	padding: 10,
	layout: {
		type: 'vbox',
		align: 'center'
	},
	//border: 0,
	bodyStyle: 'border:0',
	items: [spacerItem, showButton, spacerItem, drawRectButton, spacerItem]
	});

	// create a panel to choose coordinates
	var bottomPanel = Ext.create('Ext.FormPanel', {
	//var layersPanel = Ext.create('Ext.form.Panel', {
		id: 'bottomPanelId',
		title: 'Choose region by coordinates',
		frame: true,
		autoScroll: false,
		collapsible: false,
		x: 10,
		y: 20,
		//width: 570,
		width: 570,
		height: 210,
		layout: {
			type: 'hbox',
			//anchor: '100%',
			padding: 0
		},

		//defaults: {bodyStyle: 'padding:15px 15px 15px 15px;border-color:#00ff00'},
		//defaults: {bodyStyle: 'padding:15px 15px 15px 15px;'},
		bodyStyle: 'background: transparent; border: 0',
		//padding: 10,
		items:[sxPanel, dxPanel]
	});

	//**********************	BOTTOM PANEL - END	****************************************************


	winWebsearch = new Ext.create('Ext.window.Window', {                            
		id: 'winWebsearchId',
		title: 'SEARCH',
		//maximizable: true,
		//minimizable: true,
		resizable: false,
		closeAction: 'hide',
		width: 600,
		height: 730,
		items: [regionsPanel, bottomPanel]
	});

	//******************************	Draw Rectangle OpenLayers map control	****************************************
	//add a control to draw a rectangle on map and retrieve coordinates
	var rectControl = new OpenLayers.Control();
	OpenLayers.Util.extend(rectControl, {
		draw: function () {
			// this Handler.Box will intercept the shift-mousedown
			// before Control.MouseDefault gets to see it
			this.box = new OpenLayers.Handler.Box(rectControl,
				{"done": this.notice}
				//{keyMask: OpenLayers.Handler.MOD_SHIFT}	//"Shift+MouseDown"//
			);
			//this.box.activate();
			this.box.deactivate();
			},
			notice: function (bounds) {
				var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
				var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 
				textTop.setValue(ur.lat.toFixed(6));
				textBottom.setValue(ll.lat.toFixed(6));
				textLeft.setValue(ll.lon.toFixed(6));
				textRight.setValue(ur.lon.toFixed(6));
				//alert('bounds = ' + bounds);
				//alert(ll.lon.toFixed(6) + ", " + ll.lat.toFixed(6) + ", " + ur.lon.toFixed(6) + ", " + ur.lat.toFixed(6));
		}
	});

	map.addControl(rectControl);

	winWebsearch.on('show', function(win) {
		textBottom.setValue('');
		textTop.setValue('');
		textLeft.setValue('');
		textRight.setValue('');
		drawRectButton.toggle(false);
		drawRectButton.setIconCls('imgDrawRectangleDisable');
	});
	winWebsearch.on('hide', function(win) {
		//deactivate the control
		rectControl.box.deactivate();
	});
	//winWebsearch.show();

	// Basic mask (waiting window)
	//var myLoader = new Ext.LoadMask(winWebsearch, {msg:"Please wait..."});

	


		// Verify if uncomment
		//var myLoader = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});




	//**********************	INTERNAL FUNCTIONS	****************************************************

	function loadRegion(region) {
		myLoader.show();
		//hide the Web search windows if it's open
		winWebsearch.hide();
		//Load region data
		data = regions[region];

		getODEfootprints('CRISM footprints', data.westernlon, data.easternlon, data.minlat, data.maxlat);

		// WMS
		// Remove previously loaded WMS layers
		for(var i = 0; i < WMSlayers.length; i++) {
			map.removeLayer(WMSlayers[i]);
		}
		WMSlayers = [];
		//reset the TOC overlayes panel
		resetOverlayesPanel();

		// Add new WMS layers
		wms = data['wms'];
		for(var i = 0; i < wms.length; i++) {
			temp = new OpenLayers.Layer.MapServer(wms[i].name,
				planetserver_ms_wms,
				{map: wms[i].map, layers: wms[i].layer, projection: wms[i].projection},
		    		{isBaseLayer: false, transitionEffect: 'resize'}
			);
			map.addLayers([temp]);
			WMSlayers[i] = temp;
			addCheckboxInOverlayesPanel(i, wms[i].name)
		}
		map.addLayers([footprints]);
		map.zoomToExtent(footprints.getDataExtent());

		//Load data to the secondary comboBox
		//loadSecondaryComboBox(mainElements[index].fileName);

		// DTM
		dtm = data['dtm'];
		var dtmData = [];
		//add a default value
		dtmData.push({'val': 'mola', 'name': 'MOLA'});
		//add the dtm values
		for(var i = 0; i < dtm.length; i++) {
			//alert('dtm[i].collection = ' + dtm[i].collection);
			//alert('dtm[i].name = ' + dtm[i].name);
			dtmData.push({'val': dtm[i].collection, 'name': dtm[i].name});
		}

		var comboDtm = Ext.getCmp('comboBoxDtmId');
		comboDtm.clearValue();
		dtmStore.loadData(dtmData);
		comboDtm.bindStore(dtmStore);
		comboDtm.setValue('MOLA');
		myLoader.hide();
	};

	function loadRegionByRect() {
		myLoader.show();
		//Load region data
		var minLat = 0;
		if (isNumber(textBottom.getValue()) == true) {
			minLat = parseFloat(textBottom.getValue());
		}
		var maxLat = 0;
		if (isNumber(textTop.getValue()) == true) {
			maxLat = parseFloat(textTop.getValue());
		}
		var westLon = 0;
		if (isNumber(textLeft.getValue()) == true) {
			westLon = parseFloat(textLeft.getValue());
		}
		var eastLon = 0;
		if (isNumber(textRight.getValue()) == true) {
			eastLon = parseFloat(textRight.getValue());
		}
		
		//var maxLat = textTop.getValue();
		//var westLon = textLeft.getValue();
		//var eastLon = textRight.getValue();
		//alert('westLon = ' + westLon + '\neastLon = ' + eastLon + '\nminLat = ' +  minLat + '\nmaxLat = ' +  maxLat);
		if ((minLat != '') && (maxLat != '') && (westLon != '') && (eastLon != '') && (westLon <= eastLon) && (minLat <= maxLat)) {
			//data = regions[region];
			getODEfootprints('CRISM footprints', westLon, eastLon, minLat, maxLat);

			// WMS
			// Remove previously loaded WMS layers
			for(var i = 0; i < WMSlayers.length; i++) {
				map.removeLayer(WMSlayers[i]);
			}
			WMSlayers = [];
			//reset the TOC overlayes panel
			resetOverlayesPanel();

			/*
			// Add new WMS layers
			wms = data['wms'];
			for(var i = 0; i < wms.length; i++) {
				temp = new OpenLayers.Layer.MapServer(wms[i].name,
					planetserver_ms_wms,
					{map: wms[i].map, layers: wms[i].layer, projection: wms[i].projection},
			    		{isBaseLayer: false, transitionEffect: 'resize'}
				);
				map.addLayers([temp]);
				WMSlayers[i] = temp;
				addCheckboxInOverlayesPanel(i, wms[i].name)
			}
			*/
			
			if ((footprints != null) && (footprints.getDataExtent() != null)) {
				//alert('footprints = ' + footprints);
				//alert('footprints.getDataExtent() = ' + footprints.getDataExtent());
				map.addLayers([footprints]);
				map.zoomToExtent(footprints.getDataExtent());
				//hide the Web search windows if it's open
				winWebsearch.hide();
				myLoader.hide();
				//deactivate the control
				//rectControl.box.deactivate();
			} else {
				myLoader.hide();
				Ext.Msg.alert('Info', 'Sorry, no data for that region.');
			}

	/*
		
			// DTM
			dtm = data['dtm'];
			var dtmData = [];
			//add a default value
			dtmData.push({'val': 'mola', 'name': 'MOLA'});
			//add the dtm values
			for(var i = 0; i < dtm.length; i++) {
				//alert('dtm[i].collection = ' + dtm[i].collection);
				//alert('dtm[i].name = ' + dtm[i].name);
				dtmData.push({'val': dtm[i].collection, 'name': dtm[i].name});
			}

			var comboDtm = Ext.getCmp('comboBoxDtmId');
			comboDtm.clearValue();
			dtmStore.loadData(dtmData);
			comboDtm.bindStore(dtmStore);
			rectControl.box.deactivate();
	*/
		} else {
			myLoader.hide();
			Ext.Msg.alert('Info', 'Wrong coordinates!');
		}
	};
});

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

