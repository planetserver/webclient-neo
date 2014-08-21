var map;
var GlobalMOLARGB;
var GlobalTHEMISIRday;
var GaleCTXWms;
var GaleHRSCWms;
var fake;
var vector_layer;
var vector_layer2;
var vector_layer3;
var vector_layer4;
var mousePosition;	//pixel

// OpenLayers
OpenLayers.Util.VincentyConstants={a:3396190,b:3396190,f:0}
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
OpenLayers.Util.onImageLoadErrorColor = "transparent";

//OpenLayers.ImgPath = "js/OpenLayers/img/"
OpenLayers.ImgPath = "/static/images/"


// OpenLayers.Projection.addTransform(
    // 'EPSG:4326',
    // 'PS:1',
    // OpenLayers.Projection.nullTransform);
    // OpenLayers.Projection.addTransform(
    // 'PS:1',
    // 'EPSG:4326',
    // OpenLayers.Projection.nullTransform);
OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
var maxextent = new OpenLayers.Bounds(-180,-90,180,90);
//

function createParam(key) 
    {
        var value = urlparams[key];
        return key + "=" + value;
    } 

 function setUrlHash() 
    {
        var hashvalue = createParam('region');
        hashvalue += "&" + createParam("productid");
        hashvalue += "&" + createParam('lat');
        hashvalue += "&" + createParam('lon');
        hashvalue += "&" + createParam('zoomlevel');
        location.hash = hashvalue;
    }

function showAvailableFootprints(westernlon, easternlon, minlat, maxlat)
    {
        getODEfootprints('CRISM footprints',westernlon,easternlon,minlat,maxlat);
        map.addLayers([footprints]);
        iscodezoomevent = true;
        map.zoomToExtent(footprints.getDataExtent());
        iscodezoomevent = false;
    }


function liesInArea(jsonobj, lonlat) 
    {
        if (lonlat.lon >= jsonobj['westernlon'])
            if (lonlat.lon <= jsonobj['easternlon'])
                if (lonlat.lat >= jsonobj['minlat'])
                    if (lonlat.lat <= jsonobj['maxlat']) 
                        return true;
        return false;

    }

function liesInRegion(region, lonlat) 
    {
        return liesInArea(regions[region], lonlat);
    }

function liesInProduct(productid, lonlat) 
{
    return liesInArea(mrdr[productid], lonlat);
}

function getRegion(lonlat) 
    {
        for (region in regions)
        {
            if (liesInRegion(region, lonlat)) 
            {
                return region;
            }
        }
        return "";
    }

function getProduct(lonlat) 
    {
        for (productid in mrdr) 
        {
            if (liesInProduct(productid, lonlat))
            {
                return productid;
            }
        }
        return "";
    }

function initmap() {
	map = new OpenLayers.Map( 'map' , {
		controls: [
    			new OpenLayers.Control.Navigation(),
				//new OpenLayers.Control.LoadingPanel(),
                new OpenLayers.Control.PanZoomBar(),
                    	//new OpenLayers.Control.LayerSwitcher({'ascending':false}),
                    	//new OpenLayers.Control.Permalink(),
                    	//new OpenLayers.Control.ScaleLine(),

                    	//new OpenLayers.Control.Permalink('permalink'),

                    	//new OpenLayers.Control.MousePosition()	//it's possible to eliminate if you want only the the ExtJS point rapresentation

                    	//new OpenLayers.Control.OverviewMap(),
                    	//new OpenLayers.Control.KeyboardDefaults()
                ],
                numZoomLevels: 20, // How can you set the max zoomlevels to HiRISE max?
                projection: 'PS:1', 
                displayProjection: new OpenLayers.Projection("PS:1"), 
                units: 'degrees',
                maxExtent: maxextent
	});

	  /** ENABLE CACHE **/

  var cacheWrite = new OpenLayers.Control.CacheWrite({
      autoActivate: true,
      imageFormat: "image/jpeg",
      eventListeners: {
          cachefull: function() { 
          	if (console && console.log) {
          		console.log('Cache full');
          	}
          }
      }
  });
  map.addControl(cacheWrite);

  var cacheRead = new OpenLayers.Control.CacheRead();
  map.addControl(cacheRead);

  /** END ENABLE CACHE **/

	map.addControl(new OpenLayers.Control.ScaleLine({geodesic: true}));
    	map.events.register("mousemove", map, function(e)
        {
        	var pixel = new OpenLayers.Pixel(e.xy.x,e.xy.y);
        	hsdataset.lonlat = map.getLonLatFromPixel(pixel);
		// show coordinate (longitude, latitude) on ExtJS textArea (statusbar.js)
		var lon = hsdataset.lonlat.lon;
		var lat = hsdataset.lonlat.lat;
		//Ext.getCmp('textAreaCoordLonLat').setValue('Coord '+lon.toFixed(5) + ', ' + lat.toFixed(5));
		Ext.getCmp('labelShowCoord').setText('Coord '+lon.toFixed(5) + ', ' + lat.toFixed(5));

		//moved to the click footprint event
		//showFootprintsGrid(pixel, lon, lat, footprints);
		mousePosition = pixel;
        });

	// A fake base layer
	var baseLayerOptions = {
		isBaseLayer: true, 
		displayInLayerSwitcher: false
	};

	console.log('????');

	fake = new OpenLayers.Layer('fake', baseLayerOptions);
    
    GlobalMOLARGB = new OpenLayers.Layer.MapServer("MOLA RGB",
	                planetserver_ms_wms,
	                { map: "mola.map", layers: 'molargb', projection: 'PS:1'},
                    	{isBaseLayer: false, transitionEffect: 'resize', wrapDateLine: true});
                    
    GlobalTHEMISIRday = new OpenLayers.Layer.MapServer("THEMIS IR day",
	                planetserver_ms_wms,
	                { map: "themisirday.map", layers: 'themisirday', projection: 'PS:2?0', transparent: 'true'},
                    	{isBaseLayer: false, opacity: 0.5, transitionEffect: 'resize', wrapDateLine: true});

    
	// GaleHRSCWms = new OpenLayers.Layer.WMS(
		// "Gale HRSC mosaic",
		// planetserver_ps_wms,
		// {
		    // layers: 'galehrsc_wms',
		    // transparent: true,
		    // version: '1.1.0',
		    // projection: new OpenLayers.Projection("PS:1")
		// }
	    // );

	// GaleCTXWms = new OpenLayers.Layer.WMS(
		// "Gale CTX mosaic",
		// planetserver_ps_wms,
		// {
		    // layers: 'galectx_wms',
		    // transparent: true,
		    // version: '1.1.0',
		    // projection: new OpenLayers.Projection("PS:1")
		// }
	    // );

	// ATTEMPTS to get http://commondatastorage.googleapis.com/ctx_mosaic_1/ctx_mosaic_1.kml
	// var kmlctx = new OpenLayers.Layer.TileCache("CTX Mosaic", {
	    // projection: map.displayProjection,
	    // strategies: [new OpenLayers.Strategy.Refresh()],
	// protocol: new OpenLayers.Protocol.HTTP({
	    // url: "http://commondatastorage.googleapis.com/ctx_mosaic_1/ctx_mosaic_1.kml",
	    // format: new OpenLayers.Format.KML({
		// extractStyles: true,
		// extractAttributes: true,
		// maxDepth: 4
	    // })
	// })
	// });

	// kmlctx.setVisibility(true);     
	// var kmlctx = new OpenLayers.Layer.TileCache("CTX Mosaic",{
	    // "projection": map.displayProjection,
	    // "strategies": [new OpenLayers.Strategy.Refresh()], 
	    // "protocol": new OpenLayers.Protocol.HTTP({
		// "url": "http://commondatastorage.googleapis.com/ctx_mosaic_1/ctx_mosaic_1.kml",
		// "format": new OpenLayers.Format.KML({
		    // "extractStyles": true,
		    // "extractAttributes": true
		// })
	    // })
	// });
 
	map.addLayers([fake, GlobalMOLARGB, GlobalTHEMISIRday]); //, GaleHRSCWms, GaleCTXWms]);
	map.zoomTo(3);
	// Zoom to Gale Crater
	//var lon = 137.93321;
	//var lat = -4.84569;
	//var zoom = 8;
	//var zoom = 3;
	//map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);

	var editor = new OpenLayers.Editor(map, {
        	activeControls: [
			'Navigation', 
			'SnappingSettings', 
			'CADTools', 
			'TransformFeature', 
			'Separator', 
			'DeleteFeature', 
			'DragFeature', 
			'SelectFeature', 
			'Separator', 
			'DrawHole', 
			'ModifyFeature', 
			'Separator'],
		featureTypes: [
			'regular', 
			'polygon', 
			'path', 
			'point'],
	});
	editor.startEditMode();

}

function initpanels()
    {
	var container = document.getElementById("panel");
	var panel = new OpenLayers.Control.Panel({ defaultControl: featureInfo, div: container });
	/* The buttons to show/hide windows heve been moved into the extjs toolbar
	var container2 = document.getElementById("panel2");
	var panel2 = new OpenLayers.Control.Panel({ div: container2 });
	*/
	var container3 = document.getElementById("panel3");
	var panel3 = new OpenLayers.Control.Panel({ div: container3 });

	panel.addControls([
 		featureInfo,
 		featureInfo1,
 		featureInfo2,
 		featureInfo3,
 		featureInfo4,
		zoomBox,
		new OpenLayers.Control.ZoomBox({title:"Zoom out box", displayClass: 'olControlZoomOutBox', out: true}),
		new OpenLayers.Control.DragPan({title:'Drag map', displayClass: 'olControlPanMap'}),
		zoomToContextExtent,
		navHistory.previous,
		navHistory.next,
		measureControls.line,
		measureControls.polygon
	]); 
	/* The buttons to show/hide windows heve been moved into the extjs toolbar
	panel2.addControls([
		toggleBands,
		toggleQuery,
		toggleSpectrum,
		toggleX3d
	]);
	*/
	panel3.addControls([
		//toggleTutorial,
		//toggleAbout,
		permalink
	]);
	// add the panel to the map
	map.addControl(panel);
	//map.addControl(panel2);
	map.addControl(panel3);
}

function initvectors()
    {
	var my_style = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style( 
		{ 
		    fillColor: "${fcolor}"
		}) 
	});
	var my_style2 = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style( 
		{ 
		    fillColor: "#4bb2c5"
		}) 
	});
	var my_style3 = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style( 
		{ 
		    fillColor: "#ee9900",
		    strokeWidth: 2,
		    strokeColor: "#ee9900"
		}) 
	});
	// Create vector layers to record clicks
	vector_layer = new OpenLayers.Layer.Vector("Series", {
		styleMap: my_style,
		rendererOptions: { zIndexing: true, extractAttributes: true },
		displayInLayerSwitcher: false
	});
	vector_layer2 = new OpenLayers.Layer.Vector("Spectral ratio", {
		styleMap: my_style2,
		rendererOptions: { zIndexing: true },
		displayInLayerSwitcher: false
	});
	vector_layer3 = new OpenLayers.Layer.Vector("Elevation point", {
		styleMap: my_style3,
		rendererOptions: { zIndexing: true },
		displayInLayerSwitcher: false
	});
	vector_layer4 = new OpenLayers.Layer.Vector("Cross", {
		styleMap: my_style2,
		rendererOptions: { zIndexing: true },
		displayInLayerSwitcher: false
	});
	// Limit the number of features that can be added to each
	vector_layer.events.on({"beforefeatureadded": function() {
		var len = vector_layer.features.length;
	     	if (len == nrclicks) vector_layer.removeFeatures(vector_layer.features[0]);
	 	} 
	});
	vector_layer2.events.on({"beforefeatureadded": function() {
     		if (vector_layer2.features.length == 2) vector_layer2.destroyFeatures();
		} 
	});
	vector_layer3.events.on({"beforefeatureadded": function() {
     		if (vector_layer3.features.length == 3) vector_layer3.destroyFeatures();
 		} 
	});
	vector_layer4.events.on({"beforefeatureadded": function() {
	     	if (vector_layer4.features.length == 1) vector_layer4.destroyFeatures();
	 	} 
	});

	//Add layers to the map
	map.addLayers([vector_layer,vector_layer2,vector_layer3,vector_layer4]);

	/* A simple way to fix the bug to show color points and line above the map
	vector_layer.setZIndex(1200);
	vector_layer2.setZIndex(1200);
	vector_layer3.setZIndex(1200);
	vector_layer4.setZIndex(1200);
	*/
}
