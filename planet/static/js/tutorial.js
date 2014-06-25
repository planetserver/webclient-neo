Ext.onReady(function () {
    var panelPdf = Ext.widget('panel', {
        //title: 'My PDF',
        //width: 'fit',
        height: 650,
	//plugins: ['fittoparent'],
	layout:'fit',
/*
	viewConfig: {
	    forceFit: true
	},
*/
        items: {
            xtype: 'component',
            autoEl: {
                tag: 'iframe',
                style: 'height: 100%; width: 100%; border: none',
                src: '/static/files/tutorial.pdf'
            }
        },
        //renderTo: 'output'
        //renderTo: Ext.getBody()
    });

    //winTutorial = new Ext.Window({                            
    winTutorial = new Ext.create('Ext.window.Window', {                            
        id: 'winTutorial',
	title: 'TUTORIAL',
	maximizable: true,
	//minimizable: true,
	closeAction: 'hide',
        width: 900,
        height: 700,
        items: [panelPdf]
    });
    
    //winTutorial.show();

});
