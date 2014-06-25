var spectrumToDraw = 1;
var spectrumNumbers = [];
var pointsNumbers = [];
var pointsSpectralRatio = [];
var crossSectionNumbers = [];
var crossSectionChartData = [];
var spectrumData = [];
var chartTitle = 'Chart';
//var diagramPlot = [];
//var myLoader;	// Basic mask (waiting window)
var seriesColors = [];	// series colors array 
var lineChartColor = '#000000';
var nSeriesMax = 30;	//series max number
//need to restore chart's zoom
var cMinX;
var cMaxX;
var cMinY;
var cMaxY;
var cOriginalData;
//need to restore spectral ratio chart's zoom
var srcMinX;
var srcMaxX;
var srcMinY;
var srcMaxY;
var srcOriginalData;
//need to restore spectrumChart's zoom
var scMinX;
var scMaxX;
var scMinY;
var scMaxY;
var scOriginalData;
//need to restore crossSectionChart's zoom
var cscMinX;
var cscMaxX;
var cscMinY;
var cscMaxY;
var cscOriginalData;
//need to draw the histogram chart from console or window button
var histogramFromConsole = false;
var currentBandFromConsole = '';
var nrbinsFromConsole = 0;

Ext.onReady(function(){

	//**************	Start SPECTRUM TAB	***********************************

	// create Spectrum chart object
	var chartData = [];
	var chartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['wavelength', 'value'],
		data: chartData
	});

	var chart = Ext.create('Ext.chart.Chart', {
		id: 'chartId',
		//renderTo: Ext.getBody(),
		minWidth: 450,
		minHeight: 320,
		//width: '100%',
		//height: '100%',
		animate: false,
		store: chartStore,
		//theme: 'Category1',
		//theme: 'White',
		theme: 'Blue',
		background: '#ffffff',
		shadow: false,
		//hidden: true,
		enableMask: true,
		//mask: 'horizontal',
		mask: true,
		axes: [{
			type: 'Numeric',
			position: 'bottom',
			fields: ['wavelength'],
			title: 'Wavelength'
			}, {
			type: 'Numeric',
		    	position: 'left',
			fields: ['value'],
			//label: {renderer: Ext.util.Format.numberRenderer('0,0')},
			title: 'Values',
			grid: true,
			//minimum: 0,
			//maximum: 1,
			//minorTickSteps: 0.2
		}],
		series: [{
			type: 'line',
			highlight: {size: 1, radius: 5, fill: '#38B8BF'},
			axis: 'left',
			xField: 'wavelength',
			yField: 'value',
		        style: {
				//fill: '#000000',
				//stroke: '#000000',

				fill: lineChartColor,
				stroke: lineChartColor,
				'stroke-width': 1,
				/*
				renderer: function (sprite, record, attr, index) {
				   // var color = '#38B8BF'; //some logic here
				    return Ext.apply(attr, {
					fill: lineChartColor,
					stroke: lineChartColor
				    });
				}
				*/
		        },
			markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			tips: {
				trackMouse: true,
				width: 150,
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle(storeItem.get('wavelength') + ', ' + storeItem.get('value'));
				}
			},
		}],
		listeners: {
			'select': function(me, selection) {
					me.setZoom(selection);
					me.mask.hide();
					//me.enableMask = true;
				},
			'dblclick': function (e, eOpts) {
					//restore zoom
					this.restoreZoom();
					//reset axes
					this.axes.items[0].minimum = cMinX;
					this.axes.items[0].maximum = cMaxX;
					this.axes.items[1].minimum = cMinY;
					this.axes.items[1].maximum = cMaxY;
					//Refresh the store with new data and Redraw the chart
					chartStore.loadData(cOriginalData);
					/*
					if (spectrumNumbers.length == 0) {
						//reset axes
						this.axes.items[0].minimum = scMinX;
						this.axes.items[0].maximum = scMaxX;
						this.axes.items[1].minimum = scMinY;
						this.axes.items[1].maximum = scMaxY;
						//Refresh the store with new data and Redraw the chart
						chartStore.loadData(scOriginalData);
					} else {
						//reset axes
						this.axes.items[0].minimum = cMinX;
						this.axes.items[0].maximum = cMaxX;
						this.axes.items[1].minimum = cMinY;
						this.axes.items[1].maximum = cMaxY;
						//Refresh the store with new data and Redraw the chart
						chartStore.loadData(cOriginalData);
					}
					*/
		    		}
		}
	});
	// end chart object
		/*
		alert('chart.series.items[0].style[fill]' + chart.series.items[0].style['fill']);
		chart.series.items[0].style['fill'] = '#4bb2c5';
		chart.series.items[0].style['stroke'] = '#4bb2c5';
		alert('chart.series.items[0].style[fill]' + chart.series.items[0].style['fill']);
		*/
	// Define the model for the Spectral library
	Ext.define('mainSelectModel', {
		extend: 'Ext.data.Model',
		fields: [
		    {type: 'string', name: 'fileName'},
		    {type: 'string', name: 'name'}
		]}
	);

	// The data for all states
	var mainElements = [
		{"fileName":"all_sulfates_resamp.js", "name":"All sulfates"},
		{"fileName":"carbonate.js", "name":"Carbonates"},
		{"fileName":"inosil.js", "name":"Inosilicates"},
		{"fileName":"meteor.js", "name":"Meteor"},
		{"fileName":"moon.js", "name":"Moon"},
		{"fileName":"nesosil.js", "name":"Nesosilicates"},
		{"fileName":"nitrates.js", "name":"Nitrates"},
		{"fileName":"oxide.js", "name":"Oxides"},
		{"fileName":"phosphate.js", "name":"Phosphates"},
		{"fileName":"phylosil.js", "name":"Phyllosilicates"},
		{"fileName":"rocks.js", "name":"Rocks"},
		{"fileName":"RT_resamp.js", "name":"Rio Tinto materials measured in RELAB"},
		{"fileName":"sorosil.js", "name":"Sorosilicates"},
		{"fileName":"sulfate.js", "name":"Sulfates"},
		{"fileName":"synth.js", "name":"Synth"},
		{"fileName":"tectosil.js", "name":"Tectosilicates"},
		{"fileName":"unconsolidated.js", "name":"Unconsolidated"}
	];

	// The data store holding the elements for the ComboBox
	var mainComboStore = Ext.create('Ext.data.Store', {
		model: 'mainSelectModel',
		data: mainElements
	});


	// Simple ComboBox using the data store
	var mainComboBox = Ext.create('Ext.form.field.ComboBox', {
		id: 'mainComboBoxId',
		//fieldLabel: 'Select a single library',
		editable: false,
		displayField: 'name',
		width: 440,
		//labelWidth: 130,
		store: mainComboStore,
		queryMode: 'local',
		typeAhead: true,
		emptyText: 'Select library',
		tooltip: 'Select the library to show',
		padding: 10,
		listeners: {
			'select' : function (combo, value) {
				/*
				combo.getValue() -> the valueField
				combo.getRawValue() -> the displayField
				*/
				var v = combo.getValue();
				//var record = store.getById(v);
				var record = combo.findRecord(combo.valueField || combo.displayField, v);
				var index = combo.store.indexOf(record);
				//Ext.Msg.alert('Info', 'v: ' + v + ' - RawValue: ' + combo.getRawValue() + ' - Value: ' + combo.getValue() + ' - Index: ' + index + ' - mainElements[index].fileName: ' + mainElements[index].fileName);

				//Load data to the secondary comboBox
				loadSecondaryComboBox(mainElements[index].fileName);

				}
		}
	});

	// The data for all states
	var secondaryElements = [];

	// Simple ComboBox using the data store
	var secondaryComboBox = Ext.create('Ext.form.field.ComboBox', {
		id: 'secondaryComboBoxId',
		//fieldLabel: 'Select a single library',
		//labelWidth: 130,
		emptyText: 'Select library',
		editable: false,
		displayField: 'name',
		width: 440,
		store: secondaryElements,
		queryMode: 'local',
		typeAhead: true,
		//emptyText: 'Select library',
		tooltip: 'Select the library to show',
		padding: 10,
		/*
		listeners: {
			'select' : function (combo, value) {
			}
		}
		*/
	});


	// Copy the global var colors to seriesColors array and extent it
	seriesColors = colors;
	//alert('seriesColors.length = ' + seriesColors.length);	
	for(var i = colors.length; i < nSeriesMax; i++){
		seriesColors.push('white');
	};
	
	// Create the Points Spectrum Chart

	//var spectrumData = [];
	var spectrumChartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['wavelength', 'wavelength2', 'dataLib', 'dataRatio', 'data0', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9', 'data10', 'data11', 'data12', 'data13', 'data14', 'data15', 'data16', 'data17', 'data18', 'data19', 'data20', 'data21', 'data22', 'data23', 'data24', 'data25', 'data26', 'data27', 'data28', 'data29'],
		data: spectrumData
	});
	
	var gridStore = Ext.create('Ext.data.JsonStore', {
		fields: ['dataX', 'dataY'],
		//data: gridModel
	});

    	var tipsGrid = Ext.create('Ext.grid.Panel', {
		//title: 'Points',        
		store: gridStore,
        	width: 220,
        	height: 150,
		forceFit: true,
        	columns: [{
            		text: 'Wavelength',
            		dataIndex: 'dataX',
			width: 90
        		}, {
            		text: 'Average spectrum',
            		dataIndex: 'dataY',
			width: 130
        		}]
	});

	var spectrumChart = Ext.create('Ext.chart.Chart', {
		id: 'spectrumChartId',
		minWidth: 450,
		minHeight: 320,
		//width: '100%',
		//height: '100%',
		shadow: false,
		animate: false,
		store: spectrumChartStore,
		theme: 'Blue',
		background: '#ffffff', 
		//hidden: true,
		enableMask: true,
		//mask: 'horizontal',
		mask: true,
		axes: [{
			type: 'Numeric',
			position: 'bottom',
			fields: ['wavelength', 'wavelength2'],
			title: 'Wavelength',
			//minimum: 0,
			//maximum: 1.2,
			}, {
			type: 'Numeric',
		    	position: 'left',
            		fields: ['dataLib', 'dataRatio', 'data0', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9', 'data10', 'data11', 'data12', 'data13', 'data14', 'data15', 'data16', 'data17', 'data18', 'data19', 'data20', 'data21', 'data22', 'data23', 'data24', 'data25', 'data26', 'data27', 'data28', 'data29'],
            		//fields: ['data0', 'data1'],
			//label: {renderer: Ext.util.Format.numberRenderer('0,0')},
			title: 'Average Spectrum',
			grid: true,
			//minimum: 0,
			//maximum: 0.5,
			//maximum: 1,
		}],
		series: [
			{
				type: 'line',
				highlight: {
					size: 1, 
					radius: 5, 
					//fill: '#38B8BF'
				},
				axis: 'left',
				xField: 'wavelength',
				yField: 'dataRatio',
				style: {
					fill: '#4bb2c5',
					stroke: '#4bb2c5',
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
				tips: {
					trackMouse: true,
					width: 150,
					height: 20,
					renderer: function(storeItem, item) {
						this.setTitle(storeItem.get('wavelength') + ', ' + storeItem.get('dataRatio'));
					}
				}
			}, {				
				type: 'line',
				highlight: {
					size: 1, 
					radius: 5, 
					//fill: '#38B8BF'
				},
				axis: 'left',
				xField: 'wavelength2',
				yField: 'dataLib',
				style: {
					fill: 'black',
					stroke: 'black',
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
				tips: {
					trackMouse: true,
					width: 150,
					height: 20,
					renderer: function(storeItem, item) {
						this.setTitle(storeItem.get('wavelength2') + ', ' + storeItem.get('dataLib'));
					}
				}
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data0',
				style: {
					fill: seriesColors[0],
					stroke: seriesColors[0],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
				tips: {
				    	trackMouse: true,
				    	width: 220,
				    	height: 150,
				    	layout: 'fit',
					items: tipsGrid,
					renderer: function(storeItem, item) {
						//this.setTitle(storeItem.get('wavelength') + ', ' + storeItem.get('data1'));
						var data = [];
						for(var i = 0; i < pointsNumbers.length; i++){
							data.push({'dataX': '<span style="color:' + seriesColors[i] + ';">' + storeItem.get('wavelength').toFixed(5) + '</span>', 'dataY': '<span style="color:' + seriesColors[i] + ';">' + storeItem.get('data' + i.toString()) + '</span>'});
						}
				        gridStore.loadData(data);
				        tipsGrid.setSize(180, (pointsNumbers.length + 1) * 50);
					this.setHeight(20*pointsNumbers.length + 50);
					}
				}
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data1',
				style: {
					//fill: 'red',
					//stroke: 'red',
					fill: seriesColors[1],
					stroke: seriesColors[1],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data2',
				style: {
					fill: seriesColors[2],
					stroke: seriesColors[2],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data3',
				style: {
					fill: seriesColors[3],
					stroke: seriesColors[3],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data4',
				style: {
					fill: seriesColors[4],
					stroke: seriesColors[4],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data5',
				style: {
					fill: seriesColors[5],
					stroke: seriesColors[5],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data6',
				style: {
					fill: seriesColors[6],
					stroke: seriesColors[6],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data7',
				style: {
					fill: seriesColors[7],
					stroke: seriesColors[7],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data8',
				style: {
					fill: seriesColors[8],
					stroke: seriesColors[8],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data9',
				style: {
					fill: seriesColors[9],
					stroke: seriesColors[9],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data10',
				style: {
					fill: seriesColors[10],
					stroke: seriesColors[10],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data11',
				style: {
					//fill: 'red',
					//stroke: 'red',
					fill: seriesColors[11],
					stroke: seriesColors[11],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data12',
				style: {
					fill: seriesColors[12],
					stroke: seriesColors[12],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data13',
				style: {
					fill: seriesColors[13],
					stroke: seriesColors[13],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data14',
				style: {
					fill: seriesColors[14],
					stroke: seriesColors[14],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data15',
				style: {
					fill: seriesColors[15],
					stroke: seriesColors[15],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data16',
				style: {
					fill: seriesColors[16],
					stroke: seriesColors[16],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data17',
				style: {
					fill: seriesColors[17],
					stroke: seriesColors[17],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data18',
				style: {
					fill: seriesColors[18],
					stroke: seriesColors[18],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data19',
				style: {
					fill: seriesColors[19],
					stroke: seriesColors[19],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data20',
				style: {
					fill: seriesColors[20],
					stroke: seriesColors[20],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data21',
				style: {
					//fill: 'red',
					//stroke: 'red',
					fill: seriesColors[21],
					stroke: seriesColors[21],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data22',
				style: {
					fill: seriesColors[22],
					stroke: seriesColors[22],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data23',
				style: {
					fill: seriesColors[23],
					stroke: seriesColors[23],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data24',
				style: {
					fill: seriesColors[24],
					stroke: seriesColors[24],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data25',
				style: {
					fill: seriesColors[25],
					stroke: seriesColors[25],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data26',
				style: {
					fill: seriesColors[26],
					stroke: seriesColors[26],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data27',
				style: {
					fill: seriesColors[27],
					stroke: seriesColors[27],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data28',
				style: {
					fill: seriesColors[28],
					stroke: seriesColors[28],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}, {
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'data29',
				style: {
					fill: seriesColors[29],
					stroke: seriesColors[29],
					'stroke-width': 1
				},
				//showMarkers: false,
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			}
		],
		listeners: {
			'select': function(me, selection) {
				//alert('zoom');
				me.setZoom(selection);
				me.mask.hide();
					//Refresh the store with new data and Redraw the chart
					spectrumChartStore.loadData(scOriginalData);
				/*
					this.axes.items[0].minimum = 1.35;
					this.axes.items[0].maximum = 1.85;
					this.axes.items[1].minimum = 0.25;
					this.axes.items[1].maximum = 0.5;
					//Refresh the store with new data and Redraw the chart
					spectrumChartStore.loadData(scOriginalData);
				*/
				},
			'dblclick': function (e, eOpts) {
					/*
					*/
					//restore zoom
					this.restoreZoom();
					//reset axes
					//alert('scMinX = ' + scMinX + ', scMaxX = ' + scMaxX + '\nscMinY = ' + scMinY + ', scMaxY = ' + scMaxY);

					this.axes.items[0].minimum = scMinX;
					this.axes.items[0].maximum = scMaxX;
					this.axes.items[1].minimum = scMinY;
					this.axes.items[1].maximum = scMaxY;
					//Refresh the store with new data and Redraw the chart
					spectrumChartStore.loadData(scOriginalData);
		    		}
		}

	});
	// end chart object


	var zoomSpectrumButton = Ext.create('Ext.Button', {
		id: 'zoomSpectrumButtonId',
		text: 'Zoom In',
		iconCls: 'imgZoomIn',
		handler: function(){
				//var zoomCrossSection = Ext.getCmp('zoomCrossSectionButtonId');
				//alert('zoomCrossSection = ' + zoomCrossSection);
				if (this.getText() == 'Zoom In') {
					winDiagrams.maximize();	
					this.setText('Zoom Out');
					this.setIconCls('imgZoomOut');
					//zoomCrossSection.setText('Zoom Out');
					//zoomCrossSection.setIconCls('imgZoomOut');
					zoomHistogramButton.setText('Zoom Out');
					zoomHistogramButton.setIconCls('imgZoomOut');
					zoomCrossSectionButton.setText('Zoom Out');
					zoomCrossSectionButton.setIconCls('imgZoomOut');
				} else {
					//winDiagrams.minimize();	
					//winDiagrams.setSize(500, 560);
					winDiagrams.restore();
					this.setText('Zoom In');
					this.setIconCls('imgZoomIn');
					//zoomCrossSection.setText('Zoom In');
					//zoomCrossSection.setIconCls('imgZoomIn');
					zoomHistogramButton.setText('Zoom In');
					zoomHistogramButton.setIconCls('imgZoomIn');
					zoomCrossSectionButton.setText('Zoom In');
					zoomCrossSectionButton.setIconCls('imgZoomIn');
				}	
			}
	});

	var zoomHistogramButton = Ext.create('Ext.Button', {
		id: 'zoomHistogramButtonId',
		text: 'Zoom In',
		iconCls: 'imgZoomIn',
		handler: function(){
				if (this.getText() == 'Zoom In') {
					winDiagrams.maximize();	
					this.setText('Zoom Out');
					this.setIconCls('imgZoomOut');
					zoomSpectrumButton.setText('Zoom Out');
					zoomSpectrumButton.setIconCls('imgZoomOut');
					zoomCrossSectionButton.setText('Zoom Out');
					zoomCrossSectionButton.setIconCls('imgZoomOut');
				} else {
					winDiagrams.restore();
					this.setText('Zoom In');
					this.setIconCls('imgZoomIn');
					zoomSpectrumButton.setText('Zoom In');
					zoomSpectrumButton.setIconCls('imgZoomIn');
					zoomCrossSectionButton.setText('Zoom In');
					zoomCrossSectionButton.setIconCls('imgZoomIn');
				}	
			}
	});

	var zoomCrossSectionButton = Ext.create('Ext.Button', {
		id: 'zoomCrossSectionButtonId',
		text: 'Zoom In',
		iconCls: 'imgZoomIn',
		handler: function(){
				if (this.getText() == 'Zoom In') {
					winDiagrams.maximize();	
					this.setText('Zoom Out');
					this.setIconCls('imgZoomOut');
					zoomHistogramButton.setText('Zoom Out');
					zoomHistogramButton.setIconCls('imgZoomOut');
					zoomSpectrumButton.setText('Zoom Out');
					zoomSpectrumButton.setIconCls('imgZoomOut');
				} else {
					winDiagrams.restore();
					this.setText('Zoom In');
					this.setIconCls('imgZoomIn');
					zoomHistogramButton.setText('Zoom In');
					zoomHistogramButton.setIconCls('imgZoomIn');
					zoomSpectrumButton.setText('Zoom In');
					zoomSpectrumButton.setIconCls('imgZoomIn');
				}	
			}
	});

	// Crate panels for tabs 
	var chartPanel = Ext.create('Ext.panel.Panel', {
		id: 'chartPanelId',
		title: 'Chart',
		bodyStyle: {'background-color': '#ffffff'}, 
		//background: '#ffffff',
		frame: true,
		x: 10,
		y: 10,
		//width: 470,
		//height: 320,
		minWidth: 470,
		minHeight: 340,
		//width: '100%',
		//height: '100%',
		items:  [chart, spectrumChart],
		//items:  chart,
		//itemId: 1
		tools:[zoomSpectrumButton]
	});

	var winSaveDialog = new Ext.create('Ext.window.Window', {                            
		id: 'winSaveDialogId',
		title: 'SAVING DATA CHART',
		modal: true,
		resizable: false,
		//maximizable: true,
		//minimizable: true,
		closeAction: 'hide',
		width: 260,
		height: 120,
		//x: 600,
		//y: 100,
            	items : [
			{
		        //html : '<b>Do you want to download the chart data?</b>',
		        html : 'Do you want to download the chart data?',
			//frame: false,
			x: 15,
			y: 10,
			width: 230,
			bodyStyle: 'background:transparent; border:0',
	    		},{
		        //region : 'north',
			//frame: false,
			x: 90,
			y: 30,
		        contentEl : 'downloadChartDivId',   //content read from html div#header
			bodyStyle: 'background:transparent; border:0',
		        //id : 'mainHeader'
	    	}]
	});

	var selectPanel = Ext.create('Ext.panel.Panel', {
		//title: 'Select',
		//layout: 'hbox',
		frame: true,
		x: 10,
		y: 20,
		width: 470,
		height: 110,
		items:  [mainComboBox, secondaryComboBox],
		/* permit to add a toolbox into the panel header
		tools:[{
		    type:'refresh',
		    tooltip: 'Refresh form Data',
		    // hidden:true,
		    handler: function(event, toolEl, panel){
			// refresh logic
		    }
		},
		{
		    type:'help',
		    tooltip: 'Get Help',
		    handler: function(event, toolEl, panel){
			// show help here
		    }
		}],
		*/
		buttons: [{
			id: 'loadChartButtonId',
			text: 'Load',
			iconCls: 'imgLoad',
			//padding: 0,
			handler: function(){	
					if (spectrumToDraw == 1) {
						//spectrumChart.setVisible(false);
						//chart.setVisible(true);
						if (spectrumNumbers.length == 0) {	//Diagrams window loaded from library menu (load button)
							if (secondaryComboBox.getValue() == null) {
								//alert('secondary combo is NULL');	
								Ext.Msg.alert('Info', 'Select the libraries and try again!');
							} else {
								if (pointsNumbers.length > 0) {
									drawMultiSpectrum();
								} else if (pointsSpectralRatio.length > 0) {
									drawDoubleSpectrum();
								} else {
									drawSpectrum();
								}
							}
						} else {	//Diagrams window loaded from footprint click event
							//reset chart zoom
							chart.restoreZoom();
							spectrumChart.setVisible(false);
							chart.setVisible(true);

							chart.series.items[0].style['fill'] = '#000000';
							chart.series.items[0].style['stroke'] = '#000000';

							myLoader.show();
							var chartData = [];
							diagramplot.spectra = [spectrumNumbers];
							//Get min and max value for axes
							cMinX = spectrumNumbers[0][0];
							cMaxX = spectrumNumbers[0][0];
							cMinY = spectrumNumbers[0][1];
							cMaxY = spectrumNumbers[0][1];
							var elemX, elemY;
							for(var i = 0; i < spectrumNumbers.length; i++){
								chartData.push({'wavelength': spectrumNumbers[i][0], 'value': spectrumNumbers[i][1]});
								elemX = spectrumNumbers[i][0];
								elemY = spectrumNumbers[i][1];
								//min-max for X axes
								if (cMinX === null || cMinX > elemX) cMinX = elemX;
								if (cMaxX === null || cMaxX < elemX) cMaxX = elemX;
								//min-max for Y axes
								if (cMinY === null || cMinY > elemY) cMinY = elemY;
								if (cMaxY === null || cMaxY < elemY) cMaxY = elemY;
							}
							cOriginalData = chartData;
							//alert('minX = ' + minX + ', maxX = ' + maxX + '\nminY = ' + minY + ', maxY = ' + maxY);

							//var maxValue = Math.max.apply(Math, spectrumNumbers[5][0]);
							//alert('chart.axes.items[1] = ' + chart.axes.items[1]);

							chart.axes.items[0].minimum = cMinX;
							chart.axes.items[0].maximum = cMaxX;
							chart.axes.items[1].minimum = cMinY;
							chart.axes.items[1].maximum = cMaxY;
							/*
							makeChart(minX, maxX, minY, maxY, chartData);
							*/

							//Refresh the store with new data and Redraw the chart
							chartStore.loadData(chartData);
							// it's not necessary to redraw the chart
							//chart.redraw();

							spectrumNumbers = [];
							chartPanel.setTitle(chartTitle);
							myLoader.hide();
						}
					} else if (spectrumToDraw == 2) {
						drawPointsSpectrum();
					} else if (spectrumToDraw == 3) {
						drawSpectralRatio();
					}
				}
			},{
			id: 'saveSpectrumButtonId',
			text: 'Save',
			iconCls: 'imgSave',
			//html:'<span id="spectrum_download">You must have Flash 10 installed to download this file.</span>',
			handler: function(){	
					//alert('Save - Spectrum');
				 	if (typeof diagramplot.spectra != 'undefined') {
						winSaveDialog.show();
					} else {
						Ext.Msg.alert('Information', "No chart data to be saved.");
					}
				}
			}],
			buttonAlign: 'center'
	});

	var spectrumPanel = Ext.create('Ext.panel.Panel', {
		title: 'Spectrum',
		bodyStyle:{"background-color":"#dfe8f6"}, 
		//resizable: true,
		//width: '100%',
		//height: '100%',
		items: [chartPanel, selectPanel],
		iconCls: 'imgSpectrum',
		itemId: 0
	});

	//**************	End SPECTRUM TAB	***********************************


	//**************	Start HISTOGRAM TAB	***********************************

	// create histogramChart object
	var histogramChartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['name', 'histogramData'],
		data: [{
		    'name': '1',
		    'histogramData': 0
		}, {
		    'name': '2',
		    'histogramData': 0
		}, {
		    'name': '3',
		    'histogramData': 0
		}, {
		    'name': '4',
		    'histogramData': 0
		}, {
		    'name': '5',
		    'histogramData': 0
		}]
	});

	var histogramChart = Ext.create('Ext.chart.Chart', {
		id: 'histogramChartId',
		minWidth: 450,
		minHeight: 300,
		animate: true,
		shadow: true,
		store: histogramChartStore,
		axes: [{
			type: 'Numeric',
			position: 'left',
			fields: ['histogramData'],
			label: {renderer: Ext.util.Format.numberRenderer('0,0')},
			//title: 'Number of Hits',
			grid: true,
			minimum: 0
			}, {
			type: 'Category',
			position: 'bottom',
			fields: ['name']
		}],
		theme: 'Blue',
		background: '#ffffff',
		series: [{
			type: 'column',
			axis: 'bottom',
			highlight: true,
			tips: {
				trackMouse: true,
				width: 60,
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle(storeItem.get('name') + ', ' + storeItem.get('histogramData'));
				}
			},
			xField: 'name',
			yField: ['histogramData']
		}]
        });
	// end histogramChart object

	// Create panels for tabs 
	var histogramChartPanel = Ext.create('Ext.panel.Panel', {
		id: 'histogramChartPanelId',
		title: 'Histogram',
		bodyStyle: {'background-color': '#ffffff'}, 
		frame: true,
		x: 10,
		y: 10,
		width: 470,
		height: 340,
		minWidth: 470,
		minHeight: 340,
		items: histogramChart,
		tools:[zoomHistogramButton]
	});

	// The data for combobox
	var comboValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

	// Simple ComboBox using the data store
	var histogramComboBox = Ext.create('Ext.form.field.ComboBox', {
		id: 'histogramComboBoxId',
		fieldLabel: 'Select a value',
		//emptyText: 'Select a number',
		editable: false,
		displayField: 'name',
		width: 440,
		//labelWidth: 130,
		store: comboValues,
		queryMode: 'local',
		typeAhead: true,
		//emptyText: 'Select library',
		value: 10,
		tooltip: 'Select a number to create a bar chart',
		padding: 10
	});

	var histogramSelectPanel = Ext.create('Ext.panel.Panel', {
		//title: 'Select',
		//layout: 'hbox',
		frame: true,
		x: 10,
		y: 20,
		width: 470,
		height: 110,
		items:  histogramComboBox,
		buttons: [{
			id: 'histogramButtonId',
			text: 'Load',
			iconCls: 'imgLoad',
			handler: function(){	
					if (histogramFromConsole == false) {
						//retrieve the combo value
						var nrbins = histogramComboBox.getValue();

						//retrieve the current seleleted band
						var currentBand = '';	
						var dataTabs = Ext.getCmp('dataTabsId');
						var activeTab = dataTabs.getActiveTab();
						if (activeTab.itemId == 0) {
							var irGrid = Ext.getCmp('irGridId');
							var gridRow = irGrid.getSelectionModel().getSelection()[0];
							if (gridRow != undefined) {
								currentBand = gridRow.get('irBandNr');
							}
						} else if (activeTab.itemId == 1) {
							var vnirGrid = Ext.getCmp('vnirGridId');
							var gridRow = vnirGrid.getSelectionModel().getSelection()[0];
							if (gridRow != undefined) {
								currentBand = gridRow.get('vnirBandNr');
							}
						} else {
							Ext.Msg.alert('Info', 'Select a tab and a band!');
						}
						if (currentBand != '') {
							drawHistogram(currentBand, nrbins);					
						} else {
							Ext.Msg.alert('Info', 'Select a band!');
						}
					} else {
						//alert('currentBandFromConsole = ' + currentBandFromConsole + '\nnrbinsFromConsole = ' + nrbinsFromConsole);
						//var winDiagrams = Ext.getCmp('winDiagrams');
						//winDiagrams.show();
						//var diagramsTabs = Ext.getCmp('diagramsTabsId');
						diagramsTabs.setActiveTab(1);
						drawHistogram(currentBandFromConsole, nrbinsFromConsole);
					}
				}
			},{
			text: 'Save',
			iconCls: 'imgSave',
			handler: function(){	
				 	if (typeof diagramplot.histogram != 'undefined') {
						winSaveDialog.show();
					} else {
						Ext.Msg.alert('Information', "No chart data to be saved.");
					}
				}
			}],
			buttonAlign: 'center'
	});

	var histogramPanel = Ext.create('Ext.panel.Panel', {
		title: 'Histogram',
		bodyStyle:{"background-color":"#dfe8f6"}, 
		items: [histogramChartPanel, histogramSelectPanel],
		iconCls: 'imgHistogram',
		itemId: 1
	});

	//**************	End HISTOGRAM TAB	***********************************

	//**************	Start CROSS SECTION TAB	***********************************

	// create Cross Section chart object
	var crossSectionChartData = [];
	var crossSectionChartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['distanceCount', 'elevation'],
		data: crossSectionChartData
	});

	var crossSectionChart = Ext.create('Ext.chart.Chart', {
		id: 'crossSectionChartId',
		minWidth: 450,
		minHeight: 300,
		//width: '100%',
		//height: '100%',
		shadow: false,
		animate: false,
		store: crossSectionChartStore,
		theme: 'Blue',
		background: '#ffffff', 
		enableMask: true,
		//mask: 'horizontal',
		mask: true,
		axes: [{
			type: 'Numeric',
			position: 'bottom',
			fields: ['distanceCount'],
			title: 'Distance count'
			}, {
			type: 'Numeric',
		    	position: 'left',
			fields: ['elevation'],
			//label: {renderer: Ext.util.Format.numberRenderer('0,0')},
			title: 'Elevation',
			grid: true,
			//minimum: 0,
			//maximum: 1,
			//minorTickSteps: 0.2
		}],
		series: [{
			type: 'line',
			highlight: {size: 1, radius: 5, fill: '#38B8BF'},
			axis: 'left',
			xField: 'distanceCount',
			yField: 'elevation',
		        style: {
				fill: '#00BFFF',
				stroke: '#00BFFF',
				'stroke-width': 1
		        },
			//showMarkers: false,
			markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
			tips: {
				trackMouse: true,
				width: 150,
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle(storeItem.get('distanceCount') + ', ' + storeItem.get('elevation'));
				}
			},
		}],
		listeners: {
			'select': function(me, selection) {
				//alert('zoom');
				me.setZoom(selection);
				me.mask.hide();
				},
			'dblclick': function (e, eOpts) {
					//restore zoom
					this.restoreZoom();
					//reset axes
					this.axes.items[0].minimum = cscMinX;
					this.axes.items[0].maximum = cscMaxX;
					this.axes.items[1].minimum = cscMinY;
					this.axes.items[1].maximum = cscMaxY;
					//Refresh the store with new data and Redraw the chart
					crossSectionChartStore.loadData(cscOriginalData);
		    		}
		}

	});
	// end chart object

	// Create panels for tabs 
	var crossSectionChartPanel = Ext.create('Ext.panel.Panel', {
		id: 'crossSectionChartPanelId',
		title: 'Cross Section',
		bodyStyle: {'background-color': '#ffffff'}, 
		frame: true,
		x: 10,
		y: 10,
		width: 470,
		height: 430,
		minWidth: 470,
		minHeight: 430,
		items: crossSectionChart,
		tools:[zoomCrossSectionButton]
	});

	var crossSectionSelectPanel = Ext.create('Ext.panel.Panel', {
		//title: 'Select',
		//layout: 'hbox',
		frame: true,
		x: 10,
		y: 20,
		width: 470,
		height: 40,
		//items:  cross,
		buttons: [{
			id: 'loadCrossSectionButtonId',
			text: 'Load',
			iconCls: 'imgLoad',
			hidden: true,
			handler: function(){	
					drawCrossSection();
				}
			},{
			text: 'Save',
			iconCls: 'imgSave',
			handler: function(){	
				 	if (typeof diagramplot.crosssection != 'undefined') {
						winSaveDialog.show();
					} else {
						Ext.Msg.alert('Information', "No chart data to be saved.");
					}
				}
			}],
			buttonAlign: 'center'
	});

	var crossSectionPanel = Ext.create('Ext.panel.Panel', {
		title: 'Cross Section',
		bodyStyle:{"background-color":"#dfe8f6"}, 
		iconCls: 'imgCrossSection',
		items: [crossSectionChartPanel, crossSectionSelectPanel],
		itemId: 2
	});

	//**************	End CROSS SECTION TAB	***********************************

	var diagramsTabs = Ext.createWidget('tabpanel', {
		id: 'diagramsTabsId',
		activeTab: 0,
		//width: 490,
		//height: 490,
		minHeight: 550,
		width: '100%',
		height: '100%',
		plain: true,
		//resizable: true,
		items: [spectrumPanel, histogramPanel, crossSectionPanel],
		listeners: {
			'tabchange': function (diagramsTabs, tab) {
					//alert('width = ' + winDiagrams.getWidth() + ', height = ' + winDiagrams.getHeight());
					//var diagramsTabs = Ext.getCmp('dataTabsId');
					var activeTab = diagramsTabs.getActiveTab();
					if (activeTab.itemId == 0) {
						//Resize the Spectrum panel and its chart
						chartPanel.setSize(winDiagrams.getWidth() - 30, winDiagrams.getHeight() - 200);
						chart.setSize(winDiagrams.getWidth() - 80, winDiagrams.getHeight() - 240);
						chart.redraw();
						spectrumChart.setSize(winDiagrams.getWidth() - 80, winDiagrams.getHeight() - 240);
						spectrumChart.redraw();
						//Center the select panel
						//selectPanel.setPosition((winDiagrams.getWidth() - selectPanel.getWidth() - 10)/2);
					}
					if (activeTab.itemId == 1) {
						//Resize the Histogram panel and its chart
						histogramChartPanel.setSize(winDiagrams.getWidth() - 30, winDiagrams.getHeight() - 200);
						histogramChart.setSize(winDiagrams.getWidth() - 80, winDiagrams.getHeight() - 240);
						histogramChart.redraw();
						//Center the select panel
						//histogramSelectPanel.setPosition((winDiagrams.getWidth() - histogramSelectPanel.getWidth() - 10)/2);
					}
					if (activeTab.itemId == 2) {
						//Resize the Cross Section panel and its chart
						crossSectionChartPanel.setSize(winDiagrams.getWidth() - 30, winDiagrams.getHeight() - 130);
						crossSectionChart.setSize(winDiagrams.getWidth() - 80, winDiagrams.getHeight() - 180);
						crossSectionChart.redraw();
						//Center the select panel
						//crossSectionSelectPanel.setPosition((winDiagrams.getWidth() - crossSectionSelectPanel.getWidth() - 10)/2);
					}
		    	}
		}
	});

	winDiagrams = new Ext.create('Ext.window.Window', {                            
		id: 'winDiagrams',
		title: 'DIAGRAMS',
		//maximizable: true,
		//minimizable: true,
		closeAction: 'hide',
		//width: diagramsTabs.width,
		width: 500,
		height: 560,
		x: Ext.getBody().getViewSize().width - 510,
		y: 90,
		items: [diagramsTabs],
		listeners : {
			'resize' : function(win, width, height, opt){
			   		//alert('width=' + width + '\nheight=' + height);

					//Resize the diagrams tabs
					diagramsTabs.setSize(width - 10, height - 32);
					//diagramsTabs.doComponentLayout();

					//Resize the Spectrum panel and its chart
					chartPanel.setSize(width - 30, height - 200);

					chart.setSize(width - 80, height - 240);

					spectrumChart.setSize(width - 80, height - 240);

					//Resize the Histogram panel and its chart
					histogramChartPanel.setSize(width - 30, height - 200);
					histogramChart.setSize(width - 80, height - 240);
					//Resize the Cross Section panel and its chart
					crossSectionChartPanel.setSize(width - 30, height - 130);
					crossSectionChart.setSize(width - 80, height - 180);
					
					/*
					//Center the select panels

					//winDiagrams.setActivate();
					alert('winDiagrams.isVisible() = ' + winDiagrams.isVisible() + '\nwinDiagrams.isHidden() = ' + winDiagrams.isHidden());
					if (winDiagrams.isVisible() == true) {
						selectPanel.setPosition((width - selectPanel.getWidth() - 10)/2);
						crossSectionSelectPanel.setPosition((width - crossSectionSelectPanel.getWidth() - 10)/2);
						histogramSelectPanel.setPosition((width - histogramSelectPanel.getWidth() - 10)/2);
					}

					*/
 			}
		}
	});

	// Basic mask (waiting window)
	//myLoader = new Ext.LoadMask(winDiagrams, {msg:"Please wait..."});
	
	//winDiagrams.show();



	//**************************************	FUNCTIONS	************************************//	

	function drawSpectrum() {
		//reset chart zoom
		//chart.restoreZoom();

		//show chart
		spectrumChart.setVisible(false);
		chart.setVisible(true);
		chart.series.items[0].style['fill'] = '#000000';
		chart.series.items[0].style['stroke'] = '#000000';

		myLoader.show();
		//retrieve the selected filename from the mainComboBox
		var v = mainComboBox.getValue();
		//alert('v = ' + v);	
		var record = mainComboBox.findRecord(mainComboBox.valueField || mainComboBox.displayField, v);
		var index = mainComboBox.store.indexOf(record);
		//retrieve the filename from the correspondent store
		var jsFileName = mainElements[index]['fileName'];
		var library = jsFileName.substring(0, jsFileName.length - 3);
		var libspectra = secondaryComboBox.getValue();

		//var spectrumNumbers = [];
		spectrumNumbers = [];
		var chartData = [];

		eval('data = ' + library + ';');
		wavelength = data["Wavelength"];
		values = data[libspectra];

		//Get min and max value for axes
		cMinX = wavelength[0];
		cMaxX = wavelength[0];
		cMinY = values[0];
		cMaxY = values[0];
		var elemX, elemY;
		for(var i = 0; i < wavelength.length; i++){
		    	spectrumNumbers.push([wavelength[i], values[i]]);
			chartData.push({'wavelength': wavelength[i], 'value': values[i]});
			//get min-max
			elemX = wavelength[i];
			elemY = values[i];
			//min-max for X axes
			if (cMinX === null || cMinX > elemX) cMinX = elemX;
			if (cMaxX === null || cMaxX < elemX) cMaxX = elemX;
			//min-max for Y axes
			if (cMinY === null || cMinY > elemY) cMinY = elemY;
			if (cMaxY === null || cMaxY < elemY) cMaxY = elemY;
		}
		cOriginalData = chartData;
		//set chart's axes
		chart.axes.items[0].minimum = cMinX;
		chart.axes.items[0].maximum = cMaxX;
		chart.axes.items[1].minimum = cMinY;
		chart.axes.items[1].maximum = cMaxY;
		//Refresh the store with new data and Redraw the chart
		chartStore.loadData(chartData);
		// it's not necessary to redraw the chart
		//chart.redraw();

		//set globalvar diagramplot to the chart data
		diagramplot.spectra = [spectrumNumbers];
	
		spectrumNumbers = [];
		chartTitle = libspectra;
		chartPanel.setTitle(chartTitle);
		myLoader.hide();

		var output = [];
		var tempcolors = [];
		for (i=0; i < pos; i++) {
			output.push(hsdataset.point[i].spectrum);
			tempcolors.push(colors[i]);
		}
		tempcolors.push("Black");
		output.push(spectrumNumbers);
		spectrum_load(output,tempcolors,libspectra);	

		//set globalvar diagramplot to the chart data
		//diagramplot.spectra = output;
	}

	function drawSpectralRatio() {
		//reset spectrum chart zoom
		//spectrumChart.restoreZoom();
		//show spectrum chart

		//spectrumChart.setVisible(false);
		//chart.setVisible(true);
		chart.setVisible(false);
		spectrumChart.setVisible(true);
		//alert('lineChartColor = ' + lineChartColor);

		//chart.series.items[0].style['fill'] = lineChartColor;
		//chart.series.items[0].style['stroke'] = lineChartColor;
		
		//alert('chart.series.items[0].style[fill] = ' + chart.series.items[0].style['fill']);

		myLoader.show();
		var chartData = [];
		// clear chart
		spectrumChartStore.loadData(chartData);
		//Get min and max value for axes
		cMinX = pointsSpectralRatio[0][0];
		cMaxX = pointsSpectralRatio[0][0];
		cMinY = pointsSpectralRatio[0][1];
		cMaxY = pointsSpectralRatio[0][1];
		var elemX, elemY;
		for(var i = 0; i < pointsSpectralRatio.length; i++){
			chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': pointsSpectralRatio[i][1]});
			elemX = pointsSpectralRatio[i][0];
			elemY = pointsSpectralRatio[i][1];
			/*
			if (elemY == null) {
				//alert('element[' + i + '] = ' + elemY);
				chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': ''});

			} else {
			chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': pointsSpectralRatio[i][1]});
			}
			*/
			//min-max for X axes
			if (elemX != null) {
				if (cMinX === null || cMinX > elemX) cMinX = elemX;
				if (cMaxX === null || cMaxX < elemX) cMaxX = elemX;
			}
			//min-max for Y axes
			if (elemY != null) {
				if (cMinY === null || cMinY > elemY) cMinY = elemY;
				if (cMaxY === null || cMaxY < elemY) cMaxY = elemY;
			}
		}
		cOriginalData = chartData;
		//set chart's axes
		spectrumChart.axes.items[0].minimum = cMinX;
		spectrumChart.axes.items[0].maximum = cMaxX;
		spectrumChart.axes.items[1].minimum = cMinY;
		spectrumChart.axes.items[1].maximum = cMaxY;

		//alert('scMinX = ' + scMinX + ', scMaxX = ' + scMaxX + '\nscMinY = ' + scMinY + ', scMaxY = ' + scMaxY);	
	
		//Refresh the store with new data and Redraw the chart
		spectrumChartStore.loadData(chartData);
		chartPanel.setTitle(chartTitle);
		// it's not necessary to redraw the chart
		//chartPanel.redraw();	
		//chart.redraw();
		myLoader.hide();
	}

	function drawDoubleSpectrum() {
		//alert('drawDoubleSpectrum');

		//reset spectrum chart zoom
		//spectrumChart.restoreZoom();

		//show spectrum chart
		chart.setVisible(false);
		spectrumChart.setVisible(true);

		myLoader.show();
		// retrieve values data array from library
		// retrieve the selected filename from the mainComboBox
		var v = mainComboBox.getValue();
		var record = mainComboBox.findRecord(mainComboBox.valueField || mainComboBox.displayField, v);
		var index = mainComboBox.store.indexOf(record);
		//retrieve the filename from the correspondent store
		var jsFileName = mainElements[index]['fileName'];
		var library = jsFileName.substring(0, jsFileName.length - 3);
		var libspectra = secondaryComboBox.getValue();
		spectrumNumbers = [];
		eval('data = ' + library + ';');
		wavelength = data["Wavelength"];
		values = data[libspectra];
		for(var i = 0; i < wavelength.length; i++){
		    	spectrumNumbers.push([wavelength[i], values[i]]);
		}
		//diagramPlot = spectrumNumbers;
		var output = [];
		var tempcolors = [];
		for (i=0; i < pos; i++) {
			output.push(hsdataset.point[i].spectrum);
			tempcolors.push(colors[i]);
		}
		tempcolors.push("Black");
		output.push(spectrumNumbers);

		//set globalvar diagramplot to the chart data
		diagramplot.spectra = output;

		spectrum_load(output,tempcolors,libspectra);	

		spectrumNumbers = [];
		chartTitle = libspectra;

		// create the store for the library values array
		var chartData = [];
		//refresh the chart
		spectrumChartStore.loadData(chartData);


		//Get min and max value for axes
		scMinX = wavelength[0];
		scMaxX = wavelength[0];
		scMinY = values[0];
		scMaxY = values[0];
		var elemX, elemY;
		//var seriesNumber = pointsNumbers.length;
		for(var i = 0; i < wavelength.length; i++){
			var strElement = "{'wavelength2':" + wavelength[i] + ',';
			strElement += "'dataLib':" + values[i] + "}";	
			eval('var objData = ' + strElement);
			chartData.push(objData);
			elemX = wavelength[i];
			elemY = values[i];
			//min-max for X axes
			if (scMinX === null || scMinX > elemX) scMinX = elemX;
			if (scMaxX === null || scMaxX < elemX) scMaxX = elemX;
			//min-max for Y axes
			if (scMinY === null || scMinY > elemY) scMinY = elemY;
			if (scMaxY === null || scMaxY < elemY) scMaxY = elemY;
		}

		// Add the spectral ratio points to chartData store 
		var elemX, elemY;
		for(var i = 0; i < pointsSpectralRatio.length; i++){
			chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': pointsSpectralRatio[i][1]});
			elemX = pointsSpectralRatio[i][0];
			elemY = pointsSpectralRatio[i][1];
			/*
			if (elemY == null) {
				//alert('element[' + i + '] = ' + elemY);
				chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': ''});

			} else {
			chartData.push({'wavelength': pointsSpectralRatio[i][0], 'dataRatio': pointsSpectralRatio[i][1]});
			}
			*/
			//min-max for X axes
			if (elemX != null) {
				if (scMinX === null || scMinX > elemX) scMinX = elemX;
				if (scMaxX === null || scMaxX < elemX) scMaxX = elemX;
			}
			//min-max for Y axes
			if (elemY != null) {
				if (scMinY === null || scMinY > elemY) scMinY = elemY;
				if (scMaxY === null || scMaxY < elemY) scMaxY = elemY;
			}
		}
		cOriginalData = chartData;
		//set chart's axes
		spectrumChart.axes.items[0].minimum = scMinX;
		spectrumChart.axes.items[0].maximum = scMaxX;
		spectrumChart.axes.items[1].minimum = scMinY;
		spectrumChart.axes.items[1].maximum = scMaxY;

		//alert('scMinX = ' + scMinX + ', scMaxX = ' + scMaxX + '\nscMinY = ' + scMinY + ', scMaxY = ' + scMaxY);	
	
		//Refresh the store with new data and Redraw the chart
		spectrumChartStore.loadData(chartData);
		chartPanel.setTitle(chartTitle);


		myLoader.hide();
	}

	function drawPointsSpectrum() {
		//reset spectrum chart zoom
		spectrumChart.restoreZoom();
		//show spectrum chart
		chart.setVisible(false);
		spectrumChart.setVisible(true);

		myLoader.show();
		var chartData = [];
		// clear chart
		spectrumChartStore.loadData(chartData);

		var seriesNumber = pointsNumbers.length;
		//Get min and max value for axes
		scMinX = null;
		scMaxX = null;
		scMinY = null;
		scMaxY = null;
		var elemX, elemY;
		for(var i = 0; i < pointsNumbers[0].length; i++){
			var series = [];
			series = pointsNumbers[0];
			if ((series[i][0] != null) && (series[i][0] != '')){
				var strElement = "{'wavelength':" + series[i][0] + ',';
				elemX = series[i][0];
				//min-max for X axes
				if (scMinX === null || scMinX > elemX) scMinX = elemX;
				if (scMaxX === null || scMaxX < elemX) scMaxX = elemX;
				for(var j = 0; j < seriesNumber; j++){
					series = pointsNumbers[j];
					if ((series[i][1] != null) && (series[i][1] != '')){
						strElement += "'data" + j.toString() + "':" + series[i][1] + ",";
						elemY = series[i][1];
						//min-max for Y axes
						if (scMinY === null || scMinY > elemY) scMinY = elemY;
						if (scMaxY === null || scMaxY < elemY) scMaxY = elemY;
					}
				}
				strElement = strElement.substring(0, strElement.length - 1);
				strElement += "}";
				eval('var objData = ' + strElement);
				chartData.push(objData);
			}
		}
		scOriginalData = chartData;
		spectrumChart.axes.items[0].minimum = scMinX;
		spectrumChart.axes.items[0].maximum = scMaxX;
		spectrumChart.axes.items[1].minimum = scMinY;
		spectrumChart.axes.items[1].maximum = scMaxY;

		//Refresh the store with new data and Redraw the chart
		spectrumChartStore.loadData(chartData);
		chartPanel.setTitle(chartTitle);
		// it's not necessary to redraw the chart
		//chartPanel.redraw();	
		myLoader.hide();
	}

	function drawMultiSpectrum() {
		//reset spectrum chart zoom
		//spectrumChart.restoreZoom();

		//show spectrum chart
		chart.setVisible(false);
		spectrumChart.setVisible(true);

		myLoader.show();
		// retrieve values data array from library
		// retrieve the selected filename from the mainComboBox
		var v = mainComboBox.getValue();
		var record = mainComboBox.findRecord(mainComboBox.valueField || mainComboBox.displayField, v);
		var index = mainComboBox.store.indexOf(record);
		//retrieve the filename from the correspondent store
		var jsFileName = mainElements[index]['fileName'];
		var library = jsFileName.substring(0, jsFileName.length - 3);
		var libspectra = secondaryComboBox.getValue();
		spectrumNumbers = [];
		eval('data = ' + library + ';');
		wavelength = data["Wavelength"];
		values = data[libspectra];
		for(var i = 0; i < wavelength.length; i++){
		    	spectrumNumbers.push([wavelength[i], values[i]]);
		}
		//diagramPlot = spectrumNumbers;
		var output = [];
		var tempcolors = [];
		for (i=0; i < pos; i++) {
			output.push(hsdataset.point[i].spectrum);
			tempcolors.push(colors[i]);
		}
		tempcolors.push("Black");
		output.push(spectrumNumbers);

		//set globalvar diagramplot to the chart data
		diagramplot.spectra = output;

		spectrum_load(output,tempcolors,libspectra);	

		spectrumNumbers = [];
		chartTitle = libspectra;

		// create the store for the library values array
		var chartData = [];
		//refresh the chart
		spectrumChartStore.loadData(chartData);


		//Get min and max value for axes
		scMinX = wavelength[0];
		scMaxX = wavelength[0];
		scMinY = values[0];
		scMaxY = values[0];
		var elemX, elemY;
		//var seriesNumber = pointsNumbers.length;
		for(var i = 0; i < wavelength.length; i++){
			var strElement = "{'wavelength2':" + wavelength[i] + ',';
			strElement += "'dataLib':" + values[i] + "}";	
			eval('var objData = ' + strElement);
			chartData.push(objData);
			elemX = wavelength[i];
			elemY = values[i];
			//min-max for X axes
			if (scMinX === null || scMinX > elemX) scMinX = elemX;
			if (scMaxX === null || scMaxX < elemX) scMaxX = elemX;
			//min-max for Y axes
			if (scMinY === null || scMinY > elemY) scMinY = elemY;
			if (scMaxY === null || scMaxY < elemY) scMaxY = elemY;
		}

		// Add to chartData store the points data array
		var seriesNumber = pointsNumbers.length;
		for(var i = 0; i < pointsNumbers[0].length; i++){
			var series = [];
			series = pointsNumbers[0];
			if ((series[i][0] != null) && (series[i][0] != '')){
				var strElement = "{'wavelength':" + series[i][0] + ',';	
				elemX = series[i][0];
				//min-max for X axes
				if (scMinX === null || scMinX > elemX) scMinX = elemX;
				if (scMaxX === null || scMaxX < elemX) scMaxX = elemX;
				for(var j = 0; j < seriesNumber; j++){
					series = pointsNumbers[j];
					if ((series[i][1] != null) && (series[i][1] != '')){
						strElement += "'data" + j.toString() + "':" + series[i][1] + ",";
						elemY = series[i][1];
						//min-max for Y axes
						if (scMinY === null || scMinY > elemY) scMinY = elemY;
						if (scMaxY === null || scMaxY < elemY) scMaxY = elemY;
					}
				}
				strElement = strElement.substring(0, strElement.length - 1);
				strElement += "}";
				eval('var objData = ' + strElement);
				chartData.push(objData);
			}
		}
		scOriginalData = chartData;
		spectrumChart.axes.items[0].minimum = scMinX;
		spectrumChart.axes.items[0].maximum = scMaxX;
		spectrumChart.axes.items[1].minimum = scMinY;
		spectrumChart.axes.items[1].maximum = scMaxY;
		
		//alert('scMinX = ' + scMinX + ', scMaxX = ' + scMaxX + '\nscMinY = ' + scMinY + ', scMaxY = ' + scMaxY);

		//Refresh the store with new data and Redraw the chart
		spectrumChartStore.loadData(chartData);
		chartPanel.setTitle(chartTitle);
		// it's not necessary to redraw the chart
		//chartPanel.redraw();


		myLoader.hide();
	}

	function drawHistogram(currentBand, nrbins) {
		myLoader.show();

		//Create the histogram chart
		var dataBand = band2data(currentBand);
		var nodata = hsdataset.nodata;
		var collection = hsdataset.collection;
		var wcpsstring = planetserver_path + 'wcps.php?use=histogram&nrbins='+ nrbins +'&collection=' + collection + '&nodata=' + nodata + '&calc=' + dataBand;
		// extract numbers from the query using regex
		var histogramNumbers = getBinary(wcpsstring).match(/\d+\.?\d*/g);

		//set globalvar diagramplot to the chart data
		diagramplot.histogram = histogramNumbers;

		var histogramData = [];
		for(var i = 0; i < histogramNumbers.length; i++){
			histogramData.push({'name': (i+1), 'histogramData': histogramNumbers[i]});
		}
		//Refresh the store with new data and Redraw the chart
		histogramChartStore.loadData(histogramData);
		// it's not necessary to redraw the chart
		//histogramChart.redraw();
		histogramChartPanel.setTitle(currentBand);
		myLoader.hide();
	}

	function drawCrossSection() {
		myLoader.show();

		//reset chart zoom
		//crossSectionChart.restoreZoom();

		// Reload the store
		var crossSectionChartData = [];
		var ele = [];
		//Get min and max value for axes
		cscMinX = crossSectionNumbers[0][0];
		cscMaxX = crossSectionNumbers[0][0];
		cscMinY = crossSectionNumbers[0][1];
		cscMaxY = crossSectionNumbers[0][1];
		var elemX, elemY;
		for(var i = 0; i < crossSectionNumbers.length; i++){
			ele = crossSectionNumbers[i];
			crossSectionChartData.push({'distanceCount': ele[0], 'elevation': ele[1]});
			elemX = ele[0];
			elemY = ele[1];
			//min-max for X axes
			if (cscMinX === null || cscMinX > elemX) cscMinX = elemX;
			if (cscMaxX === null || cscMaxX < elemX) cscMaxX = elemX;
			//min-max for Y axes
			if (cscMinY === null || cscMinY > elemY) cscMinY = elemY;
			if (cscMaxY === null || cscMaxY < elemY) cscMaxY = elemY;
		}
		cscOriginalData = crossSectionChartData;
		crossSectionChart.axes.items[0].minimum = cscMinX;
		crossSectionChart.axes.items[0].maximum = cscMaxX;
		crossSectionChart.axes.items[1].minimum = cscMinY;
		crossSectionChart.axes.items[1].maximum = cscMaxY;
		
		crossSectionChartStore.loadData(crossSectionChartData);
		// it's not necessary to redraw the chart
		//crossSectionChart.redraw();

		myLoader.hide();
	}


	/*
	function makeChart(minX, maxX, minY, maxY, chartData) {
		if (chart != null) {
			chart = null;
		}
		// create Spectrum chart object
		//var chartData = [];
		var chartStore = Ext.create('Ext.data.JsonStore', {
			fields: ['wavelength', 'value'],
			data: chartData
		});

		chart = Ext.create('Ext.chart.Chart', {
			id: 'chartId',
			//renderTo: Ext.getBody(),
			minWidth: 450,
			minHeight: 320,
			//width: '100%',
			//height: '100%',
			animate: false,
			store: chartStore,
			//theme: 'Category1',
			//theme: 'White',
			theme: 'Blue',
			background: '#ffffff',
			shadow: false,
			//hidden: true,
			enableMask: true,
			//mask: 'horizontal',
			mask: true,
			axes: [{
				type: 'Numeric',
				position: 'bottom',
				fields: ['wavelength'],
				title: 'Wavelength',
				minimum: minX,
				maximum: maxX
				}, {
				type: 'Numeric',
			    	position: 'left',
				fields: ['value'],
				//label: {renderer: Ext.util.Format.numberRenderer('0,0')},
				title: 'Values',
				grid: true,
				minimum: minY,
				maximum: maxY,
				//minorTickSteps: 0.2
			}],
			series: [{
				type: 'line',
				highlight: {size: 1, radius: 5, fill: '#38B8BF'},
				axis: 'left',
				xField: 'wavelength',
				yField: 'value',
				style: {
					fill: '#000000',
					stroke: '#000000',
					'stroke-width': 1
				},
				markerConfig: {type: 'circle', size: 0, radius: 0, 'stroke-width': 0},
				tips: {
					trackMouse: true,
					width: 150,
					height: 20,
					renderer: function(storeItem, item) {
						this.setTitle(storeItem.get('wavelength') + ', ' + storeItem.get('value'));
					}
				},
			}],
			listeners: {
				'select': function(me, selection) {
					//alert('zoom');
					me.setZoom(selection);
					me.mask.hide();
					},
				'dblclick': function (e, eOpts) {
					//alert('dblClick');
					this.restoreZoom();
			    		}
			}
		});
		// end chart object

	}
	*/
	
});


//**************************************	EXTERNAL FUNCTIONS	************************************//	

function showSpectrum(numbersData, title) {
	var chartButton = Ext.getCmp('loadChartButtonId');
	spectrumNumbers = numbersData;
	chartTitle = title;
	spectrumToDraw = 1;
	chartButton.handler();
	spectrumNumbers = [];
};

function showPointsSpectrum(pointsData, title) {
	//set globalvar diagramplot to the chart data
	diagramplot.spectra = pointsData;

	var winDiagrams = Ext.getCmp('winDiagrams');
	winDiagrams.show();
	var diagramsTabs = Ext.getCmp('diagramsTabsId');
	diagramsTabs.setActiveTab(0);	
	var chartButton = Ext.getCmp('loadChartButtonId');
	pointsNumbers = pointsData;
	chartTitle = title;
	var mainComboBox = Ext.getCmp('mainComboBoxId');
	mainComboBox.clearValue();
	var secondaryComboBox = Ext.getCmp('secondaryComboBoxId');
	secondaryComboBox.clearValue();
	secondaryComboBox.bindStore([]);
	spectrumToDraw = 2;
	chartButton.handler();
	spectrumToDraw = 1;
};

function showSpectralRatio(pointsData, color, title) {
	//set globalvar diagramplot to the chart data
	diagramplot.spectra = [pointsData];
	lineChartColor = color;
	var winDiagrams = Ext.getCmp('winDiagrams');
	winDiagrams.show();
	var diagramsTabs = Ext.getCmp('diagramsTabsId');
	diagramsTabs.setActiveTab(0);	
	var chartButton = Ext.getCmp('loadChartButtonId');
	pointsSpectralRatio = pointsData;
	chartTitle = title;
	var mainComboBox = Ext.getCmp('mainComboBoxId');
	mainComboBox.clearValue();
	var secondaryComboBox = Ext.getCmp('secondaryComboBoxId');
	secondaryComboBox.clearValue();
	secondaryComboBox.bindStore([]);
	spectrumToDraw = 3;
	chartButton.handler();
	spectrumToDraw = 1;
};

function showCrossSectionDiagram(lon1, lat1, lon2, lat2) {
	var winDiagrams = Ext.getCmp('winDiagrams');
	winDiagrams.show();
	var diagramsTabs = Ext.getCmp('diagramsTabsId');
	diagramsTabs.setActiveTab(2);
	
	myLoader.show();
	// Create data for the Cross Section diagram
	var response = JSON.parse(getBinary(planetserver_path + '/cgi-bin/greatcircle.cgi?nrpoints=' + nrpoints + '&lon1=' + lon1 + '&lat1=' + lat1 + '&lon2=' + lon2 + '&lat2=' + lat2));
	var values = [];
	for(var i = 0; i < nrpoints; i++)
	{
		lon = response[0][i];
		lat = response[1][i];
		var distancecount = OpenLayers.Util.distVincenty(
		      {lon: lon2, lat: lat2},
		      {lon: lon, lat: lat}
		    )
		wcpsquery = 'for data in ( ' + dtmdataset.collection + ' ) return encode(  (data[x:"' + dtmdataset.crs + '"(' + lon + ':' + lon + '),y:"' + dtmdataset.crs + '"(' + lat + ':' + lat + ')]), "csv")';
		//url = 'http://planetserver.jacobs-university.de/wcps.php?use=csv&query=' + encodeURIComponent(wcpsquery);
		url = planetserver_path + 'wcps.php?use=csv&query=' + encodeURIComponent(wcpsquery);
		elevation = JSON.parse(getBinary(url));
		values.push([distancecount,parseFloat(elevation.data)]);
	};

	//set globalvar diagramplot to the chart data
	diagramplot.crosssection = [values];
	crossSectionNumbers = values;

	var loadButton = Ext.getCmp('loadCrossSectionButtonId');
	loadButton.handler();
	crossSectionNumbers = [];
	myLoader.hide();
};

function loadSecondaryComboBox(fileName) {
	// The data for the comboBox
	var secondaryElements = [];

	// first load the corresponding js file
	var file = '/static/js/speclib/' + fileName;
	var library = fileName.substring(0, fileName.length - 3);
	var secondaryComboBox = Ext.getCmp('secondaryComboBoxId');
	$.getScript(file)
		.done(function(){
			eval('data = ' + library + ';');
			for (var key in data) {
				if(key != "Wavelength") {
					secondaryElements.push(key);
				}
			}
			secondaryComboBox.clearValue();
			secondaryComboBox.bindStore(secondaryElements);
		})
		.fail(function(){
			secondaryComboBox.clearValue();
			secondaryComboBox.bindStore([]);
			Ext.Msg.alert('Info', 'Error loading the file.');
		});
			
};

function showHistogram(currentBand, nrbins) {
	histogramFromConsole = true;
	currentBandFromConsole = currentBand;
	nrbinsFromConsole = nrbins;
	var chartButton = Ext.getCmp('histogramButtonId');
	chartButton.handler();
	histogramFromConsole = false;

	//alert('currentBand = ' + currentBand + '\nnrbins = ' +nrbins);
	//drawHistogram(currentBand, nrbins);
};

