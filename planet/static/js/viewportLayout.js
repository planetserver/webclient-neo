/*global Ext:false */
Ext.onReady(function() {
	Ext.create('Ext.container.Viewport', {
		layout: 'border',
		items: [{
			region: 'north',
			height: 52,
			contentEl : 'div_topBlock',
			border: false,
			//margins: '0 0 0 0'
			}, {
			region: 'south',
			contentEl : 'div_bottomBlock',
			border: false,
			height: 32,
			minHeight: 32,
			}, {
			region: 'center',
			border: false,
			contentEl : 'div_centerBlock',
			//margins: '0 0 0 0'
		}]
	});
});

