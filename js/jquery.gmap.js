(function ($) {
	
	var GMapPlugin = function(_self, options){
		this._self = _self;
		this.options = $.extend({}, $.fn.gmap.defaults, options);
	};
	
	GMapPlugin.prototype.findAddress = function(address){
        
        	var attrId = $(this._self).attr('id');
            
        	if(!this.geocoder || !Boolean(address) || !Boolean(attrId)){
            		return;
        	}
        
        	var opts = this.options;
        
        	var map = new GMap2(document.getElementById(attrId));
        	map.addControl(new GSmallMapControl());
        	map.addControl(new GMapTypeControl());

        	this.geocoder.getLatLng(address, function(point){
            
            		if(typeof opts.onChange == 'function') opts.onChange(point);
  	  
            		map.clearOverlays()
        		map.setCenter(point, 14);

            		var marker = new GMarker(point, {draggable: true});  
            		map.addOverlay(marker);

            		GEvent.addListener(marker, "dragend", function() {

                		var point = marker.getPoint();
                		map.panTo(point);
            
                		if(typeof opts.onChange == 'function') opts.onChange(point);

            		});

            		GEvent.addListener(map, "moveend", function() {
                		map.clearOverlays();
                		var center = map.getCenter();
                		var marker = new GMarker(center, {draggable: true});
                		map.addOverlay(marker);
            
                		if(typeof opts.onChange == 'function') opts.onChange(center);

                		GEvent.addListener(marker, "dragend", function() {

                    			var point = marker.getPoint();
                    			map.panTo(point);
            
                    			if(typeof opts.onChange == 'function') opts.onChange(point);
				});

            		});

        	});
        
	};
	
	$.fn.gmap = function(option) {
		var options = typeof option == "object" && option;
        
	        var args = Array.prototype.slice.call(arguments);
			
		if (!GBrowserIsCompatible()) {
		    return;
		}
        
        	return this.each(function(){
         
            		var t = $(this);
			var api = t.data("gmap");

			if(!api) {
				api = new GMapPlugin(t, options);
				t.data("gmap", api);
			}

			if (typeof option == 'string' && typeof api[option] == 'function') {
				api[option](args[1]);
                		return;
			} 
            
            		var attrId = t.attr('id');
            		if(!Boolean(attrId)) return;
            
			var map = new GMap2(document.getElementById(attrId));
			map.addControl(new GSmallMapControl());
			map.addControl(new GMapTypeControl());
            
  	        	api.geocoder = new GClientGeocoder();
			
			var center = new GLatLng(options.point.lat, options.point.lng);
			map.setCenter(center, 15);
  
  	        	var marker = new GMarker(center, {draggable: true});  
  	        	map.addOverlay(marker);
  
            		if(typeof options.onChange == 'function') options.onChange(center);
        
            		GEvent.addListener(marker, "dragend", function() {

                		var point = marker.getPoint();
                		map.panTo(point);
  
                		if(typeof options.onChange == 'function') options.onChange(point);

  	        	});
  
            		GEvent.addListener(map, "moveend", function() {
                		map.clearOverlays();
                
                		var center = map.getCenter();
                		var marker = new GMarker(center, {draggable: true});
        			map.addOverlay(marker);
  
                		if(typeof options.onChange == 'function') options.onChange(center);

                		GEvent.addListener(marker, "dragend", function() {

                    			var point = marker.getPoint();
                    			map.panTo(point);
  
                    			if(typeof options.onChange == 'function') options.onChange(point);

                		});

            		});
            
        	});
	};

	$.fn.gmap.defaults = {
        	onChange : function(point){},
		point : {
			lat : 41.00824,
			lng : 28.97836
		}
	};
	
}(jQuery));

