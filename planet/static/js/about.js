// first lets create a window that opens when you click on "Click me" tag above
Ext.onReady(function(){

	var blogLink = Ext.create('Ext.Component', {
		//html: 'Hello world!',
		//y: 50,
		width: 175,
		height: 30,
		//padding: 20,
		html: '<a href="http://blog.planetserver.eu/?page_id=2" target="_new" style="color: black; font-size: 20px; text-decoration: none">blog.planetserver.eu</a>',
	});

	var linkPanel = Ext.create('Ext.panel.Panel', {
		//title: 'Planet server',
		//layout: 'hbox',
		//frame: false,
		border: 0,
		x: 250,
		y: 50,
		width: 200,
		height: 40,
		items: blogLink
	});
	//linkPanel.setBodyStyle('background-position','center');

	var planetServerPanel = Ext.create('Ext.panel.Panel', {
		title: 'Planet server',
		//layout: 'hbox',
		frame: true,
		//x: 10,
		//y: 20,
		height: 300,
		width: '100%',
		items: linkPanel
	});

	var imagePath = '/static/images/AboutBG.jpg';
	planetServerPanel.setBodyStyle('background-image','url(' + imagePath + ')'); 
    
	// we create a window object. Once the document is ready. However you can do all this on link click itself just to save some resources.
	winAbout = Ext.create('Ext.window.Window', {
		title: 'ABOUT',
		closeAction: 'hide',
		height: 720,
		width: 675,
		layout: 'fit',
		resizable: false,
		cls : 'whiteOnBlue',
		componentCls : 'whiteOnBlue',
		items: [{
			region: 'center',
			xtype: 'tabpanel', // important bit. xtype defines the type of container object we are using. In this case it tabpanel
			items: [planetServerPanel,
				 {
				title: 'Developers',
				html: 'Content for Developers Tab'
				 }, {
				title: 'Software',
				html: 'Content for Software Tab'
				 }, {
				title: 'Data',
				html: 'Content for Data Tab'
			 }]
		}]
	});

	//winAbout.show();
});



