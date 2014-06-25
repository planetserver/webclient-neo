function initdownloadify() {
	/*
	Downloadify.create('spectrum_download',{
		filename: function()
		    {
		    if($('.defaulttab').hasClass('selected'))
			{
			if (typeof diagramplot.spectra != 'undefined')
			    {
			    return 'spectra.csv';
			    }
			}
		    else if($('.histtab').hasClass('selected'))
			{
			if (typeof diagramplot.histogram != 'undefined')
			    {
			    return 'histogram.csv';
			    }
			}
		    else if($('.crosstab').hasClass('selected'))
			{
			if (typeof diagramplot.crosssection != 'undefined')
			    {
			    return 'crosssection.csv';
			    }
			}
	    	},
		data: function()
		    {
		    if($('.defaulttab').hasClass('selected'))
			{
			if (typeof diagramplot.spectra != 'undefined')
			    {
			    return spectrumtocsv(diagramplot.spectra);
			    }
			}
		    else if($('.histtab').hasClass('selected'))
			{
			if (typeof diagramplot.histogram != 'undefined')
			    {
			    return histogramtocsv(diagramplot.histogram);
			    }
			}
		    else if($('.crosstab').hasClass('selected'))
			{
			if (typeof diagramplot.crosssection != 'undefined')
			    {
			    return crosssectiontocsv(diagramplot.crosssection);
			    }
			}
	    	},
		onComplete: function(){ alert('Your file has been saved!'); },
		//onCancel: function(){ alert('You have cancelled the saving of this file.'); },
		onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
		//swf: 'media/downloadify.swf',
		//downloadImage: 'images/download.png',
		swf: '/static/files/downloadify.swf',
		downloadImage: '/static/images/download.png',
		width: 17,
		height: 17,
		transparent: true,
		append: false
	});
	*/
	Downloadify.create('downloadChartDivId',{
        	filename: function()
            	{
			var diagramsTab = Ext.getCmp('diagramsTabsId');
			var activeDiagramsTab = diagramsTab.getActiveTab();
			if (activeDiagramsTab.itemId == 0) {	
				//spectrum chart
				 if (typeof diagramplot.spectra != 'undefined') {
                    			return 'spectra.csv';
				} else {
					Ext.Msg.alert('Information', "No chart data to be saved.");
				}
			} else if (activeDiagramsTab.itemId == 1) {	
				//histogram chart
				if (typeof diagramplot.histogram != 'undefined') {
					return 'histogram.csv';
				} else {
					Ext.Msg.alert('Information', "No chart data to be saved.");
				}
			} else {
				//cross section chart
				if (typeof diagramplot.crosssection != 'undefined') {
					return 'crosssection.csv';
				} else {
					Ext.Msg.alert('Information', "No chart data to be saved.");
				}
			}
            	},
        	data: function()
		{
			var diagramsTab =Ext.getCmp('diagramsTabsId');
			var activeDiagramsTab = diagramsTab.getActiveTab();
			if ((activeDiagramsTab.itemId == 0) && (typeof diagramplot.spectra != 'undefined')) {	
				//spectrum chart
                    		return spectrumtocsv(diagramplot.spectra);
			} else if ((activeDiagramsTab.itemId == 1) && (typeof diagramplot.histogram != 'undefined')) {	
				//histogram chart
				return histogramtocsv(diagramplot.histogram);
			} else if ((activeDiagramsTab.itemId == 2) && (typeof diagramplot.crosssection != 'undefined')) {	
				//cross section chart
				return crosssectiontocsv(diagramplot.crosssection);
			}
		},
		onComplete: function(){ 
			//alert('Your file has been saved!'); 
			var windowDialog = Ext.getCmp('winSaveDialogId');
			windowDialog.hide();
			Ext.Msg.alert('Information', "Your file has been saved.");
		},
		onCancel: function(){ 
			//alert('You have cancelled the saving of this file.'); 
			var windowDialog = Ext.getCmp('winSaveDialogId');
			windowDialog.hide();
			//Ext.Msg.alert('Information', "You have cancelled the saving of this file.");
		},
		onError: function(){
			//alert('You must put something in the File Contents or there will be nothing to save!'); 
			Ext.Msg.alert('Information', "You must put something in the File Contents or there will be nothing to save!");
		},
		//swf: 'media/downloadify.swf',
		//downloadImage: 'images/download.png',
		swf: '/static/files/downloadify.swf',
		//downloadImage: '/static/images/save_16px.png',
		downloadImage: '/static/images/download2.png',
		width: 62,
		height: 22,
		transparent: true,
		append: false
	});

}
