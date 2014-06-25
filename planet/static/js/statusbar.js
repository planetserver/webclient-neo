Ext.onReady(function () {
	Ext.create('Ext.toolbar.Toolbar', {
		renderTo: 'div_bottomBlock',
        width: '100%',
		layout: 'column',
		items: [{//col1
			columnWidth: '0.30',
			
			xtype: 'toolbar',
			border: 0,
			items: [
				Ext.create('Ext.form.Label', {
					//text: 'Testing...',
					height: 20,
				}),
				{ xtype: 'tbfill' },
				'-',
			]
		},{//col2
			columnWidth: '0.50',
			
			xtype: 'toolbar',
			border: 0,
			items: [
				labelShowStatus,
				{ xtype: 'tbfill' },
				{ xtype: 'tbspacer', width: 0 },
				labelShowCoord,		
				{ xtype: 'tbspacer', width: 0 },
			]
		},{//col3
			columnWidth: '0.20',
			
			xtype: 'toolbar',
			border: 0,
			items: [
				'-',
				{ xtype: 'tbfill' },
				
				buttonShowTwitter,
				buttonShowBlog,
				buttonShowGithub,
				buttonShowEarthServer,
				buttonShowLinkedIn,
			]
		}]
	});//Ext.toolbar.Toolbar
});//onReady

/* Label to show status */
var labelShowStatus = Ext.create('Ext.form.Label', {
	id: 'labelShowStatus',
	width: '60%',
	height: 20,
	fixed: true,
	style: 'paddingLeft: 5px; text-align: left; font-size: 14px',
});

/* Label to show coordinate */
var labelShowCoord = Ext.create('Ext.form.Label', {
	text: '',
	id: 'labelShowCoord', // this receive coorditane from planetmap.js
	width: '38%',
	height: 20,
	fixed: true,
	style: 'text-align: center; font-size: 14px',
});

//Buttons
var buttonShowTwitter = Ext.create('Ext.button.Button', {
	iconCls: 'imgStatusBarTwitter',
	tooltipType: 'title',
	tooltip: 'Follow us on Twitter...',
	href: 'https://twitter.com/planetser',
	hrefTarget: '_blank',
});

var buttonShowBlog = Ext.create('Ext.button.Button', {
	iconCls: 'imgStatusBarBlog',
	tooltipType: 'title',
	tooltip: 'Visit our blog...',
	href: 'http://blog.planetserver.eu',
	hrefTarget: '_blank',
});

var buttonShowGithub = Ext.create('Ext.button.Button', {
	iconCls: 'imgStatusBarGithub',
	tooltipType: 'title',
	tooltip: 'Visit GitHub pages...',
	href: 'https://github.com/planetserver/',
	hrefTarget: '_blank',
});

var buttonShowEarthServer = Ext.create('Ext.button.Button', {
	iconCls: 'imgStatusBarEarthServer',
	tooltipType: 'title',
	tooltip: 'EarhServer official page...',
	href: 'http://earthserver.eu',
	hrefTarget: '_blank',
});

var buttonShowLinkedIn = Ext.create('Ext.button.Button', {
	iconCls: 'imgStatusBarLinkedIn',
	tooltipType: 'title',
	tooltip: 'Follow us on LinkedIn...',
	href: 'http://www.linkedin.com/groups/EarthServer-User-Interest-Group-4880343/about',
	hrefTarget: '_blank',
});