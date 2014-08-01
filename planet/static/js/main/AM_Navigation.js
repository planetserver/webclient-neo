//----------------------------------------------------------
/**
 * @class
 *
 * @requires OpenLayers/Control/Navigation.js
 */
OpenLayers.Control.AM_Navigation = OpenLayers.Class.create();
OpenLayers.Control.AM_Navigation.prototype =
  OpenLayers.Class.inherit( OpenLayers.Control.Navigation, {

    /**
    * @param {Event} evt
    */
    defaultDblClick: function (evt) {
        var newCenter = this.map.getLonLatFromViewPortPx( evt.xy );
        //this.map.setCenter(newCenter, this.map.zoom + 1);
        this.map.setCenter(newCenter, this.map.zoom);
        OpenLayers.Event.stop(evt);
        return false;
    },

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.AM_Navigation"
});

//----------------------------------------------------------
