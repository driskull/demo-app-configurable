define([
    "dojo/ready",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
    "dojo/_base/Color"
], function (
    ready,
    declare,
    lang,
    arcgisUtils,
    on,
    dom, domStyle,
    HomeButton, LocateButton,
    Color
) {
    return declare("", null, {
        config: {},
        constructor: function (config) {
            // config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information. 
            this.config = config;
            // document ready
            ready(lang.hitch(this, function () {
                //supply either the webmap id or, if available, the item info 
                var itemInfo = this.config.itemInfo || this.config.webmap;
                this._createWebMap(itemInfo);
            }));
        },
        _mapLoaded: function () {
            // Map is ready

            
            // title
            this.config.title = this.config.title || this.config.itemInfo.item.title;
            var titleNode = dom.byId('title');
            // color
            if(this.config.titleBackgroundColor){
                var c = Color.fromHex(this.config.titleBackgroundColor);
                // set alpha
                c.a = 0.8;
                var cString = c.toCss(true); 
                domStyle.set(titleNode, 'background', cString);  
            }
            titleNode.innerHTML = '<div>' + this.config.title + '</div>';
            
            
            // locate button
            if(this.config.enableLocateButton){
                var locateButton = new LocateButton({
                  map: this.map
                }, "LocateButton");
                locateButton.startup();   
            }
            
            // home button
            if(this.config.enableHomeButton){
                var homeButton = new HomeButton({
                  map: this.map
                }, "HomeButton");
                homeButton.startup();   
            }
            
        },
        //create a map based on the input web map id
        _createWebMap: function (itemInfo) {
            arcgisUtils.createMap(itemInfo, "mapDiv", {
                mapOptions: {
                    //Optionally define additional map config here for example you can 
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more. 
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function (response) {
                //Once the map is created we get access to the response which provides important info 
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.  
                // console.log(this.config);
                this.map = response.map;
     
                // make sure map is loaded
                if (this.map.loaded) {
                    // do something with the map
                    this._mapLoaded();
                } else {
                    on.once(this.map, "load", lang.hitch(this, function () {
                        // do something with the map
                        this._mapLoaded();
                    }));
                }
            }), lang.hitch(this, function (error) {
                //an error occurred - notify the user. In this example we pull the string from the 
                //resource.js file located in the nls folder because we've set the application up 
                //for localization. If you don't need to support multiple languages you can hardcode the
                //strings here and comment out the call in index.html to get the localization strings. 
                if (this.config && this.config.i18n) {
                    alert(this.config.i18n.map.error + ": " + error.message);
                } else {
                    alert("Unable to create map: " + error.message);
                }
            }));
        }
    });
});
