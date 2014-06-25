var winX3D;

Ext.onReady(function() {
    winX3D = Ext.widget('window', {
		id: 'x3dObject',
        title: 'PlanetServer X3D',
        modal: true,
		closable: false,
		contentEl: Ext.getDom('container'),
        width: 800,
        height: 600,
		layout: 'fit',
        autoScroll: true,
		dockedItems: [
			{
				xtype: 'toolbar',
				dock: 'top',
				items: [
					{ xtype: 'tbfill' },
					{
						xtype: 'button',
						text: 'Full Screen',
						iconCls: 'imgZoomIn',
						handler: function() {
							if (this.getText() == 'Full Screen') {
								winX3D.maximize();	
								this.setText('Minimize');
								this.setIconCls('imgZoomOut');
							} else {
								winX3D.restore();
								this.setText('Full Screen');
								this.setIconCls('imgZoomIn');
							}	
						}
					},
				],
			},
			{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [
					{ xtype: 'tbfill' },
					{
						xtype: 'button',
						id: 'close',
						text: 'Close',
						listeners: {
							click: function() {
								winX3D.hide();
								EarthServerGenericClient.MainScene.resetScene()
							}
						}
					},
					{
						xtype: 'button',
						id: 'execute',
						text: "Create Scene",
						listeners: {
							click: function() {
								execute();
							}
						}
					}
				],
			}//toolbar
		],//docked
		listeners: {
			activate: function() {
				addX3D();
				initX3D();
			},
		},
	});
});

/* Functions */
function initX3D() {
	// basic setup:
	EarthServerGenericClient.MainScene.setTimeLog(false);//TimeLogging: outputs time of loading and building the models to the console
	EarthServerGenericClient.MainScene.addLightToScene(true);//Adds a light into the scene
	// background of the render window
	EarthServerGenericClient.MainScene.setBackground("0.9 0.9 0.9 0.8 0.8 0.8 0.7 0.7 0.7 0.6 0.6 0.6","0.9 1.5 1.57","0.6 0.6 0.8 0.5 0.5 0.7 0.4 0.4 0.6 0.3 0.3 0.5","0.9 1.5 1.57");
	
	// Onclick function example
	EarthServerGenericClient.MainScene.OnClickFunction = function(modelIndex,hitPoint) {
		var height = EarthServerGenericClient.MainScene.getDemValueAt3DPosition(modelIndex,hitPoint[0],hitPoint[2]);
		console.log("Height at clicked position: ",height);
	};
	
    // create the models:
    var JUB = new EarthServerGenericClient.Model_WCPSDemWCPS();
    JUB.setName("PlanetServer");
    JUB.setURLs("http://planetserver.jacobs-university.de:8080/rasdaman/ows","http://planetserver.jacobs-university.de:8080/rasdaman/ows");
    /* // Demo Data
	collection = "frt0000a906_07_if165l_trr3_1_01"
    JUB.setCoverages(collection);
    JUB.setAreaOfInterest(137.3377685546042,-5.287733984247882,137.57240998815232,-5.065775871432089);
	*/
	JUB.setCoverages(hsdataset.collection);
	JUB.setAreaOfInterest(hsdataset.xmin,hsdataset.ymin,hsdataset.xmax,hsdataset.ymax);
    JUB.setCoordinateReferenceSystem("http://planetserver.jacobs-university.de:8080/def/crs/PS/0/1/");
    JUB.setScale(1.0,0.3,1.0);// Size within the cube 100%width, 30%height and 100%length
    JUB.setResolution(250,250); // make it the width/height of the CRISM
    JUB.setOffset(0,0.4,0);// model has a 40% offset in height of the cube
    JUB.setTransparency(0);// initial transparency of the model
    JUB.setDemNoDataValue(0);
    //JUB.setHeightResolution(100);
	
    var JUB_query = 'for data in ( $CI ) return encode( (char)(';
    //JUB_query += 'red: (char) (255 / (max(((data.100)!=65535) * (data.100)) - min(data.100))) * ((data.100) - min(data.100));';
    //JUB_query += 'green: (char) (255 / (max(((data.200)!=65535) * (data.200)) - min(data.200))) * ((data.200) - min(data.200));';
    //JUB_query += 'blue: (char) (255 / (max(((data.300)!=65535) * (data.300)) - min(data.300))) * ((data.300) - min(data.300))';
    //JUB_query += ', "png")';
    JUB_query += '(255 / max(data.70)) * data.70';
    JUB_query += '), "png", "NODATA=255;")';
    
    JUB.setWCPSImageQuery(JUB_query);
	
    /*var demquery = 'for i in ( moladtm ) ';
    demquery += 'return encode( ';
    demquery += ' scale(trim(i , {x:$CRS($MINX:$MAXX), y:$CRS($MINY:$MAXY) }), {x:"CRS:1"(0:$RESX), y:"CRS:1"(0:$RESZ)}, {}) ';
    demquery += ', "csv" )';
    JUB.setWCPSDemQuery(demquery);*/
	var demquery = 'for i in ( ' +  dtmdataset.collection + ') ';
	demquery += 'return encode( ';
	demquery += ' scale(trim(i , {Long:$CRS($MINX:$MAXX), Lat:$CRS($MINY:$MAXY) }), {Long:"CRS:1"(0:$RESX), Lat:"CRS:1"(0:$RESZ)}, {}) ';
	demquery += ', "csv" )';
	JUB.setWCPSDemQuery(demquery);
	
	// add models to the scene
    EarthServerGenericClient.MainScene.addModel(JUB);
	
    // create the scene: Cube has 50% height compared to width and length
    EarthServerGenericClient.MainScene.createScene('x3dScene','theScene',1,0.5,1 );

    // add annotation layers and annotation (after creating the scene)
    EarthServerGenericClient.MainScene.addAnnotationsLayer("Layer1","JUB",50,"1 1 1",25,6,"1 1 1");
    EarthServerGenericClient.MainScene.addAnnotation("Layer1",310,20,-170,"CityName");
    EarthServerGenericClient.MainScene.addAnnotation("Layer1",200,-30,400,"You can annotate here");

    // create the UI and axis labels
    EarthServerGenericClient.MainScene.createUI('x3domUI');
    EarthServerGenericClient.MainScene.createAxisLabels("Latitude","Height","Longitude");
}

function execute() {
	// register a progressbar (you can register your own or just delete this lines)
    var pb = new EarthServerGenericClient.createProgressBar("progressbar");
    EarthServerGenericClient.MainScene.setProgressCallback(pb.updateValue);

    // starts loading and creating the models
    // here the function starts as soon as the html page is fully loaded
    // you can map this function to e.g. a button
    EarthServerGenericClient.MainScene.createModels();
}
