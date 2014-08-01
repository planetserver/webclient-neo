Ext.onReady(function () {

	Ext.QuickTips.init();
	
	Ext.create('Ext.toolbar.Toolbar', {
		renderTo: 'div_topImageBlock',
        width: '100%',
		height: 70,
		//overflowX: 'auto',
		frame : false,
		border : false,
		style:{
		 	'background':'white'
		},
		items: [
			logoEarthServer,
			logoJacobs,
			logoMars,
			logoESS
		],
	})

	Ext.create('Ext.toolbar.Toolbar', {
		renderTo: 'div_topBlock',
        width: '100%',
        cls: 'whiteOnBlue',
		height: 52,
		frame : false,
		border : false,
		overflowX: 'auto',
		items: [
			//logoPlanetServer,
			//comboBoxRegion,
			'-',
			showWebSearchWindow,
			'-',
			comboBoxDtm,
			'-',
			buttonSelect,
			buttonSpectrum,
			buttonSpectralRatio,
			buttonCrossSection,
			buttonElevationPoint,
			buttonZoomInBox,
			buttonZoomOutBox,
			buttonDragMap,
			buttonFullScale,
			buttonViewHistoryBackward,
			buttonViewHistoryForward,
			buttonMeasureDistance,
			buttonMeasureArea,
			buttonOleEditor,
			'-',
			actionShowToc, 
			actionShowConsole, 
			actionShowDiagram, 
			actionShowX3D, 
			actionShowBandRatio,
			'-',
			actionShowTutorial,
			actionShowAbout,
			//buttonReset,
			// '-',
			// { xtype: 'tbfill', },
			// '-',
			// saveGeom,
			// loadGeom,
			// clearAllGeom,
			// '-',
			// showLoginForm,
			// '-',
			// logoEarthServer
		],
	})
});//onReady

var logoEarthServer = {
	xtype: 'box',
	//width: 70,
	height: 70,
	//autoEl: {tag: 'img', src:'../static/images/partOfEarthServer_32px.png'}
	autoEl: {tag: 'img', src:'../static/images/vector-logo-earthserver_with-text_RGB_70px-high.png'}
};

var logoJacobs = {
	xtype: 'box',
	//width: 147,
	height: 70,
	autoEl: {tag: 'img', src:'../static/images/jacobs_70px-high_logo.png'}
};

var logoMars = {
	xtype: 'box',
	//width: 147,
	height: 70,
	autoEl: {tag: 'img', src:'../static/images/mars70.png'}
};

var logoESS = {
	xtype: 'box',
	//width: 147,
	height: 70,
	autoEl: {tag: 'img', src:'../static/images/ess-logo_v1.2_70px.png'}
};

// Define the model for the Region
Ext.define('regionComboModel', {
	extend: 'Ext.data.Model',
	fields: [
	    {name: 'val', type: 'string'},
	    {name: 'name', type: 'string'}
	]
});

var regionsData = [];

//for(var i = 0; i < regions.length; i++){
for (region in regions) {
	//alert('region = ' + region);		
	regionsData.push({'val': region, 'name': regions[region].name});
	//data = regions[region];
	//dtmData.push(data['dtm']);
}

// The data store containing the list of regions
var regionStore = Ext.create('Ext.data.Store', {
	model: 'regionComboModel',
	data: regionsData
});//regionList

// create region combobox
var comboBoxRegion = Ext.create('Ext.form.field.ComboBox', {
	id: 'comboBoxRegionId',
	fieldLabel: 'Region:',
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	labelWidth: 40,
    store: regionStore,
    queryMode: 'local',
    displayField: 'name',
    valueField: 'val',
	editable: false,
	listeners: {
		'select' : function (combo, value) {
			var region = combo.getValue();
			loadRegion(region);
		}
	}
});//comboBoxRegion

var logoPlanetServer = {
	xtype: 'box',
	width: 32,
	height: 32,
	autoEl: {tag: 'img', src:'../static/images/PlanetServer_32px.png'}
};

// Define the model for the DTM
Ext.define('dtmComboModel', {
	extend: 'Ext.data.Model',
	fields: [
	    {type: 'string', name: 'val'},
	    {type: 'string', name: 'name'}
	]
});

var dtmData = [];
dtmData.push({'val': 'mola', 'name': 'MOLA'});

// The data store containing the list of DTM
var dtmStore = Ext.create('Ext.data.Store', {
	model: 'dtmComboModel',
	data: dtmData
});//regionList

// create DTM combobox
var comboBoxDtm = Ext.create('Ext.form.field.ComboBox', {
	id: 'comboBoxDtmId',
	fieldLabel: 'DTM:',
	labelWidth: 30,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',	
	//width: 150,
    store: dtmStore,
    queryMode: 'local',
    displayField: 'name',
    valueField: 'val',
	editable: false,
	value: 'MOLA',
	listeners: {
		'select' : function (combo, value) {
			var dtmValue = combo.getValue();
			if(dtmValue == 'mola') {
				dtmdataset = jQuery.extend({}, dtmdefault);
			} else {
				dtmdataset.collection = dtmValue;
				dtm_load();
			}
		}
	}
});//comboBoxDtm


//************** List of Buttons ***************//
// buttonSelect
var buttonSelect = Ext.create('Ext.button.Button', {
	inputId: 'buttonSelectId',
	iconCls: 'imgToolBarButtonSelect',
	scale: 'medium',
	tooltip: { 
		text: 'Select footprint'
	},
	toggleGroup: 'controls',
	enableToggle: true,
	pressed: true, // this is default
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			if(!(typeof highlightCtrl === "undefined")) {
				highlightCtrl.activate();
				selectCtrl.activate();
				map.editor.stopEditMode();
				reloadZIndex();
			}
		}
		else {
			if(!(typeof highlightCtrl === "undefined")) {
				highlightCtrl.deactivate();
				selectCtrl.deactivate();
			}
		}
	},
});//buttonSelect

// buttonSpectrum
var buttonSpectrum = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonSpectrum',
	scale: 'medium',
	tooltip: { text: 'Spectrum', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			if(hsdataset.productid != '') {
				queryEventHandler1.activate();
				map.editor.stopEditMode();
				reloadZIndex();
			}
			else
				Ext.Msg.alert('Information', "Please, before select a region and a footprint!");
		}
		else {
			if(hsdataset.productid != '')
				queryEventHandler1.deactivate();
		}
	}
});//buttonSpectrum

// buttonSpectralRatio
var buttonSpectralRatio = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonSpectralRatio',
	scale: 'medium',
	tooltip: { text: 'Spectral Ratio', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	frame : false,
	border : false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			if(hsdataset.productid != '') {
				queryEventHandler2.activate();
				map.editor.stopEditMode();
				reloadZIndex();
			}
			else
				Ext.Msg.alert('Information', "Please, before select a region and a footprint!");
		}
		else {
			if(hsdataset.productid != '')
				queryEventHandler2.deactivate();
		}
	}
});//buttonSpectralRatio



// buttonCrossSection
var buttonCrossSection = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonCrossSection',
	scale: 'medium',
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	tooltip: { 
		text: 'Cross Section',
		bodyStyle: {
		    background: '#ffc',
		    padding: '10px'
		}		
	},
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			if(hsdataset.productid != '') {
				queryEventHandler3.activate();
				map.editor.stopEditMode();
				reloadZIndex();
				//map.setLayerIndex(vectorDraw,VECTORDRAW_INDEX_RESET);
				//map.setLayerIndex(vector_layer3,VECTORDRAW_INDEX);
			}
			else
				Ext.Msg.alert('Information', "Please, before select a region and a footprint!");
		}
		else {
			if(hsdataset.productid != '') {
				queryEventHandler3.deactivate();
				//map.setLayerIndex(vectorDraw,VECTORDRAW_INDEX);
			}
		}
	}
});//buttonCrossSection

// buttonElevationPoint
var buttonElevationPoint = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonElevationPoint',
	scale: 'medium',
	tooltip: { text: 'Elevation Point', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			queryEventHandler4.activate();
			map.editor.stopEditMode();
			reloadZIndex();
		}
		else {
			queryEventHandler4.deactivate();
		}
	}
});//buttonElevationPoint

// buttonZoomInBox
var buttonZoomInBox = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonZoomInBox',
	scale: 'medium',
	tooltip: { text: 'Zoom In Box', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			zoomBoxIn.activate();
			map.editor.stopEditMode();
		}
		else {
			zoomBoxIn.deactivate();
		}
	}
});//buttonZoomInBox

// buttonZoomOutBox
var buttonZoomOutBox = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonZoomOutBox',
	scale: 'medium',
	tooltip: { text: 'Zoom Out Box', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			zoomBoxOut.activate();
			map.editor.stopEditMode();
		}
		else {
			zoomBoxOut.deactivate();
		}
	}
});//buttonZoomOutBox

// buttonDragMap
var buttonDragMap = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonDragMap',
	scale: 'medium',
	tooltip: { text: 'Drag Map', },
	toggleGroup: 'controls',
	enableToggle: true,
	//pressed: true, // this is default
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			dragControls['dragger'].activate();
			reloadZIndex();
		}
		else {
			dragControls['dragger'].deactivate();
		}
	}
});//buttonDragMap

// buttonFullScale
var buttonFullScale = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonFullScale',
	scale: 'medium',
	tooltip: { text: 'Full Scale', },
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	listeners: {
		click: function() {
			mapZoomMaximum(); // call function for maximum zoom in planet.events.js
		},
	},
});//buttonFullScale

// buttonViewHistoryBackward
var buttonViewHistoryBackward = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonViewHistoryBackward',
	scale: 'medium',
	tooltip: { text: 'View History Backward', },
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	listeners: {
		click: function() {
			navHistory.previousTrigger();
		},
	},
});//buttonViewHistoryBackward

// buttonViewHistoryForward
var buttonViewHistoryForward = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonViewHistoryForward',
	scale: 'medium',
	tooltip: { text: 'View History Forward', },
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	listeners: {
		click: function() {
			navHistory.nextTrigger();
		},
	},
});//buttonViewHistoryForward

// buttonMeasureDistance
var buttonMeasureDistance = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonMeasureDistance',
	scale: 'medium',
	tooltip: { text: 'Measure Distance', },	
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			measureControls['line'].activate();
			map.editor.stopEditMode();
			reloadZIndex();
		}
		else {
			measureControls['line'].deactivate();
		}
	}
});//buttonMeasureDistance

// buttonMeasureArea
var buttonMeasureArea = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonMeasureArea',
	scale: 'medium',
	tooltip: { text: 'Measure Area', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			measureControls['polygon'].activate();
			map.editor.stopEditMode();
			reloadZIndex();
		}
		else {
			measureControls['polygon'].deactivate();
		}
	}
});//buttonMeasureArea

var buttonOleEditor = Ext.create('Ext.button.Button', {
	text: 'Editor',
	iconCls: 'imgToolBarButtonEditorOle',
	scale: 'small',
	tooltip: { text: 'Enable/Disable Editor', },
	toggleGroup: 'controls',
	enableToggle: true,
	allowDepress: false,
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	toggleHandler: function(toggled) {
		if(toggled.pressed) {
			map.editor.startEditMode();
			reloadZIndex();
		}
		else {
			map.editor.stopEditMode();
		}
	}
});

//buttonReset
/*var buttonReset = Ext.create('Ext.button.Button', {
	iconCls: 'imgToolBarButtonReset',
	scale: 'medium',
	tooltip: { text: 'Reset', },
	href: '?zoom=8&lat=-4.84569&lon=137.93321&layers=BTTTFTTTTTT',
	hrefTarget: '_self',
});//buttonReset*/

// show Web search form
var showWebSearchWindow = Ext.create('Ext.Action', {
	text: 'Search',
	iconCls: 'imgToolBarWebSearch',
	tooltip: {
		text:'Show/hide the Search window',
		title:'Search window'
	},
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	handler: function() {
		if (winWebsearch.isVisible()) {
			winWebsearch.hide();
		} else {
			winWebsearch.show();
		}
	}
});

var tocTooltip = Ext.create('Ext.tip.ToolTip', {
    target : 'tocId',
    html : "hello tooltip"
});

var actionShowToc = Ext.create('Ext.Action', {
	text: 'TOC',
	iconCls: 'imgToc',
	//autoEl: {tag: 'img', src:'../static/images/toc_off.png'},
	tooltip: tocTooltip,
	// {
	// 	text:'Show/hide the table of content window', 
	// 	title:'Table of content'
	// },
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	handler: function(){
		//toggleDisplay('toc');
		if (winToc.isVisible()) {
			winToc.hide();
			//winToc.close();
		} else {
			
			var winPanel = Ext.getCmp('dataPanelId');
			if (typeof(hsdataset.bands) != 'undefined') {
				winPanel.show(); 
				//winToc.height = 660;		
			} else {
				winPanel.hide(); 
				//winToc.height = 165;		
			};
			/**/
			winToc.show();
			//winToc.open();
		}
	}
});

var actionShowConsole = Ext.create('Ext.Action', {
	text: 'Console',
	iconCls: 'imgConsole',
	//autoEl: {tag: 'img', src:'../static/images/toc_off.png'},
	tooltip: {
		text:'Show/hide the console window', 
		title:'Console window'
	},
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',
	handler: function(){
		//toggleDisplay('query');
		if (hsdataset.productid != '') {
			if (winConsole.isVisible()) {
				winConsole.hide();
			} else {
				winConsole.show();
			}			
		} else {
			Ext.Msg.alert('Information', "Please, before select a region and a footprint!");
		}
	}
});

var actionShowDiagram = Ext.create('Ext.Action', {
	text: 'Diagrams',
	iconCls: 'imgDiagram',
	//autoEl: {tag: 'img', src:'../static/images/toc_off.png'},
	tooltip: {
		text:'Show/hide the diagrams window', 
		title:'Diagrams window'
	},
	cls : 'topBlockButton',
	focusCls : 'topBlockButton',
	overCls : 'topBlockButton',
	pressedCls : 'topBlockButton',	
	handler: function(){
		//toggleDisplay('spectra');
		if (winDiagrams.isVisible()) {
			winDiagrams.hide();
		} else {
			winDiagrams.show();
		}
	}
});

var actionShowX3D = Ext.create('Ext.button.Button', {
	text: 'X3D',
	iconCls: 'imgX3D',
	tooltip: {
		title:'X3D window',
		text:'Show the X3D window',
	},
	cls : 'whiteOnBlue',
	focusCls : 'whiteOnBlue',
	overCls : 'whiteOnBlue',
	pressedCls : 'whiteOnBlue',	
	listeners: {
		click: function() {
			if(hsdataset.productid != '') {
				winX3D.show();
				winX3D.center();
			} else 
				Ext.Msg.alert('Information', 'Please, before select a region and a footprint!');
		},
	},
});


var actionShowBandRatio = Ext.create('Ext.button.Button', {
	text: 'Band Ratio',
	iconCls: 'imgShowBandRatio',
	tooltip: {
		title:'Band Ratio window',
		text:'Show the Band Ratio window',
	},
	// cls : 'whiteOnBlue',
	// focusCls : 'whiteOnBlue',
	// overCls : 'whiteOnBlue',
	// pressedCls : 'whiteOnBlue',	
	listeners: {
		click: function() {
			if(hsdataset.productid != '') {
				winBandRatio.show();
				winBandRatio.center();
			} else 
				Ext.Msg.alert('Information', "Please, before select a region and a footprint!");
		},
	},
});

/*var actionShowTutorial = Ext.create('Ext.Action', {
	text: 'Tutorial',
	iconCls: 'imgTutorial',
	tooltip: {
		text:'Show/hide the tutorial window', 
		title:'Tutorial window'
		},
	handler: function(){
		if (winTutorial.isVisible()) {
			winTutorial.hide();
		} else {
			winTutorial.show();
		}
	}
});*/

var actionShowTutorial = Ext.create('Ext.button.Button', {
	text: 'Tutorial',
	color: 'white',
	iconCls: 'imgTutorial',
	tooltip: {
		text:'Visit tutorial page', 
		title:'Tutorial page'
	},
	cls : 'whiteOnBlue',
	focusCls : 'whiteOnBlue',
	overCls : 'whiteOnBlue',
	pressedCls : 'whiteOnBlue',	
	href: 'http://blog.planetserver.eu/?tag=tutorial',
	hrefTarget: '_blank',
});

var actionShowAbout = Ext.create('Ext.Action', {
	text: 'About',
	iconCls: 'imgAbout',
	tooltip: {
		text:'Show/hide the about window', 
		title:'About window'
	},
	cls : 'whiteOnBlue',
	focusCls : 'whiteOnBlue',
	overCls : 'whiteOnBlue',
	pressedCls : 'whiteOnBlue',	
	handler: function(){		
		//toggleDisplay('about');
		if (winAbout.isVisible()) {
			winAbout.hide();
		} else {
			winAbout.show();
		}
	}
});

/* Save drawing */
var saveGeom = Ext.create('Ext.button.Button', {
	text: 'Save',
	id: 'saveGeomButton',
	tooltip: {
		title: 'Save',
		text: 'Save geometric objects drawn on the map in database',
	},
	disabled: true,
	style: {
		'background':'#151B8D',
	},
	listeners: {
		click: function() {
			if(vectorDraw.features.length > 0)
			{
				var fwkt = new OpenLayers.Format.WKT();
				var features_arr = [];
				for(var i=0; i<vectorDraw.features.length; i++)
					features_arr.push(fwkt.write(vectorDraw.features[i]));
				Ext.Ajax.request({
					url: '/save_geom',// call method in the django's view
					method: 'POST',
					params: {
						features: features_arr,
					},
					success: function (response, opts) {
						Ext.Msg.alert('Message', 'Data stored');
						saveGeom.setDisabled(true);
					},
					failure: function (response, opts) {
						// TODO: try: except in django
						Ext.Msg.alert('Error', 'Server error.');
					},
				});
			}
			else {
				Ext.Msg.alert('No data', 'No data to store');
			}
		},
		beforerender: function(){
			Ext.Ajax.request({
				url: '/check_logged',
				method: 'POST',
				success: function (response){
					var data = Ext.decode(response.responseText);
					if(data['logged']) {
						saveGeom.setDisabled(false);
					}
					else {
						saveGeom.setDisabled(true);
					}
				},
				failure: function (response) {
					Ext.Msg.alert('Error', 'Server error.');
				},
			});
		},
	},
});

/* delete all geometries from db */
var clearAllGeom = Ext.create('Ext.button.Button', {
	text: 'Clear All',
	tooltip: {
		title:'Clear All',
		text:'Delete all geometric objects from database',
	},
	style: {
		'background':'#151B8D'
	},
	disabled: true,
	listeners: {
		click: function(){
			Ext.Msg.show({
				title:'Clear all',
				msg: 'Do you want delete all geometric objects from database?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function(resp) {
					if (resp === "yes") {
						Ext.Ajax.request({
							url: '/clear_all_geom',// call method in the django's view
							method: 'POST',
							success: function (response, opts) {
								vectorDraw.removeAllFeatures();
								Ext.Msg.alert('Message', 'All records are deleted!');
							},
							failure: function (response, opts) {
								// TODO: try: except in django
								Ext.Msg.alert('Error', 'Server error.');
							},
						});
					}
				}
			});
		},
		beforerender: function(){
			Ext.Ajax.request({
				url: '/check_logged',
				method: 'POST',
				success: function (response){
					var data = Ext.decode(response.responseText);
					if(data['logged']) {
						clearAllGeom.setDisabled(false);
					}
					else {
						clearAllGeom.setDisabled(true);
					}
				},
				failure: function (response) {
					Ext.Msg.alert('Error', 'Server error.');
				},
			});
		},
	},
});

// load geometry
var loadGeom = Ext.create('Ext.button.Button', {
	text: 'Load',
	tooltip: {
		title:'Load',
		text:'Load all geometric objects from database',
	},
	style: {
		'background':'#151B8D'
	},
	id: 'loadGeomButton',
	disabled: true,
	listeners: {
		click: function() {
			loadGeomFunc();
		},
		beforerender: function(){
			Ext.Ajax.request({
				url: '/check_logged',
				method: 'POST',
				success: function (response){
					var data = Ext.decode(response.responseText);
					if(data['logged']) {
						loadGeom.setDisabled(false);
						loadGeomFunc();
					}
					else {
						loadGeom.setDisabled(true);
					}
				},
				failure: function (response) {
					Ext.Msg.alert('Error', 'Server error.');
				},
			});
		},
	}
});

// show login form
var showLoginForm = Ext.create('Ext.button.Button', {
	text: 'Login',
	id: 'loginButton',
	iconCls: 'imgToolBarButtonLogin',
	tooltip: {
		text:'Show/hide the login window',
		title:'Login window',
	},
	style: {
		'background':'#151B8D'
	},
	listeners: {
		click: function(){
			if(this.getText() == 'Logout') {
				Ext.Ajax.request({
					url: '/request_logout',
					method: 'POST',
					success: function (response, opts) {
						Ext.getCmp('loginButton').setText('Login');
						vectorDraw.removeAllFeatures();
						saveGeom.setDisabled(true);
						loadGeom.setDisabled(true);
						clearAllGeom.setDisabled(true);
						Ext.getCmp('labelShowStatus').setText('You have been successfully logged out');
					},
					failure: function (response, opts) {
						Ext.Msg.alert('Error', 'Server error.');
					},
				});
			}
			else {
				if (winLogin.isVisible()) {
					winLogin.hide();
				} else {
					winLogin.show();
				}
			}
		},
		beforerender: function(){
			Ext.Ajax.request({
				url: '/check_logged',
				method: 'POST',
				success: function (response){
					var data = Ext.decode(response.responseText);
					if(data['logged']) {
						Ext.getCmp('loginButton').setText('Logout');
					}
					else {
						Ext.getCmp('loginButton').setText('Login');
					}
				},
				failure: function (response) {
					Ext.Msg.alert('Error', 'Server error.');
				},
			});
		},
	},
});

//**************************************	FUNCTIONS	************************************//	

//reset the toc overlayes panel
function resetOverlayesPanel() {
	// Set layer name into layers list
	var overlayesPanel = Ext.getCmp('overlayesPanelId');
	overlayesPanel.removeAll();

	overlayesPanel.add({
		xtype: 'checkbox',
	        boxLabel: 'MOLA RGB',
	        name: 'overlayes',
	        checked: true,
	        inputValue: 'molaRGB',
		margin : 0,
		handler: function () {
				if (this.getValue() == false) {
					GlobalMOLARGB.setVisibility(false);
				} else {
					GlobalMOLARGB.setVisibility(true);
				}
		}
	});

	overlayesPanel.add({
		xtype: 'checkbox',
	        boxLabel: 'THEMIS IR day',
	        name: 'overlayes',
	        checked: true,
	        inputValue: 'themisIR',
		margin : 0,
		handler: function () {
				if (this.getValue() == false) {
					GlobalTHEMISIRday.setVisibility(false);
				} else {
					GlobalTHEMISIRday.setVisibility(true);
				}
		}
	});

	overlayesPanel.add({
		xtype: 'checkbox',
		id: 'footprintsId',
	        boxLabel: 'CRISM footprints',
	        name: 'overlayes',
	        checked: true,
	        inputValue: 'footprints',
		handler: function () {
				if (this.getValue() == false) {
					footprints.setVisibility(false);
				} else {
					footprints.setVisibility(true);
				}
		}
	});
	overlayesPanel.doLayout();
	// Scroll to bottom
	//var d = overlayesPanel.body.dom;
	//d.scrollTop = d.scrollHeight - d.offsetHeight;
};

function addCheckboxInOverlayesPanel(n, labelCheck) {
	// Set layer name into layers list
	var overlayesPanel = Ext.getCmp('overlayesPanelId');
	overlayesPanel.add({
		xtype: 'checkbox',
		boxLabel: labelCheck,
		//name: 'checkOverlayesImage_' + n,
		name: 'overlayes',
		inputValue: labelCheck,
		id: 'checkOverlayesImageId_' + n,
		checked: true,
		margin: 0,
		//padding: 0,
		//padding: '2 10 2 10', //top, right, bottom, left
		handler: function () {
				WMSlayers[n].setVisibility(this.getValue());
		    	}
	});
	overlayesPanel.doLayout();
	// Scroll to bottom
	var d = overlayesPanel.body.dom;
	d.scrollTop = d.scrollHeight - d.offsetHeight;
};

/*
*/
function loadRegion(region) {
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

};

/* load function */
function loadGeomFunc(){
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
				saveGeom.setDisabled(false);
			}
			/*else {
				Ext.Msg.alert('Message', 'No data to load');
			}*/
		},
		failure: function (response, opts) {
			// TODO: try: except in django
			Ext.Msg.alert('Error', 'Server error.');
		},
	});
}

function reloadZIndex() {
	if(!(typeof vector_layer4 === 'undefined')) {
		vector_layer.setZIndex(SETZINDEX);
		vector_layer2.setZIndex(SETZINDEX);
		vector_layer3.setZIndex(SETZINDEX);
		vector_layer4.setZIndex(SETZINDEX);
		vectorDraw.setZIndex(SETZINDEX);
	}
}