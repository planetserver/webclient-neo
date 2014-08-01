/*global Ext:false */
Ext.onReady(function() {
	Ext.create('Ext.container.Viewport', {
		layout: 'border',
		style:{
		 	'background':'#E8E8E8'
		},
		items: [{
			region: 'north',
			height: 122,
			border: false,
			items : [
				{
					region : 'north',
					height : 70,
					border : 0,
					contentEl : div_topImageBlock
				},
				{
					region : 'south',
					height : 52,
					contentEl : div_topBlock,
				}
			],
			margins: '30 30 0 30'
			}, {
			region: 'south',
			contentEl : 'div_bottomBlock',
			border: false,
			height: 32,
			minHeight: 32,
			style:{
			 	'background':'#E8E8E8'
			},
			margins : '0 30 0 30'
			}, {
			region: 'center',
			border: false,
			contentEl : 'div_centerBlock',
			margins : '0 30 0 30',
			overflowY : 'auto'
		}]
	});
});

