var footprintsData = [];
var selectedFeatures = [];
var lastSelectedFeature = null;
var wantedFootprint = false;

Ext.onReady(function(){

	//var data = [];
	var footprintsStore = Ext.create('Ext.data.JsonStore', {
		//id: 'storeId',
		fields: ['footprintName'],
		data: footprintsData
	});

    	var footprintsGrid = Ext.create('Ext.grid.Panel', {
		title: 'Footprints',    
		hideHeaders: true,    
		store: footprintsStore,
        	width: 220,
        	//height: 180,
        	height: 50,
		forceFit: true,
        	columns: [{
            		//text: 'Footprints',
            		dataIndex: 'footprintName',
			width: 120
        		}]
	});

	footprintsGrid.on('itemclick', function(view, nodes){
		if (footprintsGrid.getSelectionModel().hasSelection()) {
			var selectedRecord = footprintsGrid.getSelectionModel().getSelection()[0];
			currentRow = selectedRecord.get('footprintName');
			var rowNumber = footprintsGrid.store.indexOf(selectedRecord);
			wantedFootprint = true;
			winChoiceFootprint.hide();

			selectCtrl.select(selectedFeatures[rowNumber]);
			lastSelectedFeature = selectedFeatures[rowNumber];
		}
	});
 
	footprintsGrid.on('itemmouseenter', function(view, record, item, index, e, eOpts){
		if (lastSelectedFeature != null) {
			highlightCtrl.unselect(lastSelectedFeature);
		}
		for(var i = 0; i < selectedFeatures.length; i++){
			highlightCtrl.unselect(selectedFeatures[i]);
			//highlightCtrl.unselect(footprints.features[i]);
		};
		highlightCtrl.select(selectedFeatures[index]);
		lastSelectedFeature = selectedFeatures[index];
	});

	//winChoiceFootprint.show();

	// we create a window object. Once the document is ready. However you can do all this on link click itself just to save some resources.
	var winChoiceFootprint = Ext.create('Ext.window.Window', {
		id: 'winChoiceFootprintId',
		title: 'CHOOSING A FOOTPRINT',
		closeAction: 'hide',
		modal: true,
		//header: false,
		width: 200,
		//height: 200,
		//width: 260,
		height: 90,
		layout: 'fit',
		resizable: false,
		items: footprintsGrid,
		//items: spinnerPanel
		listeners: {
			hide: function() {
				highlightCtrl.unselect(lastSelectedFeature);
			},
			show: function() {
				footprintsStore.loadData(footprintsData);
				footprintsGrid.setSize(220, (footprintsData.length + 1) * 50);
				winChoiceFootprint.setHeight(21*footprintsData.length + 65);
			},
			move: function() {
				footprintsStore.loadData(footprintsData);
				footprintsGrid.setSize(220, (footprintsData.length + 1) * 50);
				winChoiceFootprint.setHeight(21*footprintsData.length + 65);
			}
		}


	});

});



//**************************************	EXTERNAL FUNCTIONS	************************************//	

function showFootprintsGrid(pixel, lon, lat, footprints) {
	//alert('pixel = ' + pixel);
	//var point = new OpenLayers.LonLat(3684182, 5207957);
	var point = new OpenLayers.Geometry.Point(lon, lat);
	//alert('point = ' + point);

	var features = footprints.features;
	var feature;
	footprintsData = [];
	selectedFeatures = [];

	//document.getElementById("vectorsId").value = '';
	for(var i=0; i<features.length; ++i) {
		feature = features[i];
		if (feature.geometry.containsPoint(point) == true) {
			selectedFeatures.push(features[i]);
			var footprintName = feature.data.LabelFileName;
			footprintName = footprintName.substring(0, footprintName.length - 4);
			footprintsData.push({'footprintName': '<span style="color: blue;">' + footprintName + '</span>'});
			//footprintsData.push({'footprintName': "'" + footprintName + "'"});	//ok
		}
	}

	var win = Ext.getCmp('winChoiceFootprintId');
	if (selectedFeatures.length > 1) {
		//set the window position
		var xWin, yWin;
		if (pixel.x < screen.width/2) {
			//xWin = screen.width/2 + 50;
			xWin = pixel.x + 50;
		} else {
			//xWin = screen.width/2 - win.width - 50;
			xWin = pixel.x - win.width - 50;
		}
		if (pixel.y < screen.height/2) {
			yWin = pixel.y + 50;
		} else {
			//yWin = pixel.y - win.height - 50;
			yWin = pixel.y - 50;
		}
        	win.show();
		win.setPosition(xWin, yWin);

	} else {
		wantedFootprint = true;
		lastSelectedFeature = selectedFeatures[0];
		selectCtrl.select(selectedFeatures[0]);
        	win.hide();
	}
};


