var data = { "count": 10785236,
 "photos": [{"photo_id": 27932, "photo_title": "Atardecer en Embalse", "photo_url": "http://www.panoramio.com/photo/27932", "photo_file_url": "http://mw2.google.com/mw-panoramio/photos/medium/27932.jpg", "longitude": -64.404945, "latitude": -32.202924, "width": 500, "height": 375, "upload_date": "25 June 2006", "owner_id": 4483, "owner_name": "Miguel Coranti", "owner_url": "http://www.panoramio.com/user/4483"}]
 };

var markerClusterer = null;
            var map = null;
            var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
              'chco=FFFFFF,008CFF,000000&ext=.png';

            function refreshMap() {
              if (markerClusterer) {
                markerClusterer.clearMarkers();
              }

              var markers = [];
              var infowindow = new google.maps.InfoWindow();
              options = {
                cssClass: 'custom-pin'
              };

              var markerImage = new google.maps.MarkerImage(imageUrl,
                new google.maps.Size(24, 32));

              for (var i = 0; i < 1; ++i) {
                var latLng = new google.maps.LatLng(data.photos[i].latitude,
                  data.photos[i].longitude)
                var marker = new google.maps.Marker({
                  position: latLng,
                  draggable: false,
                  icon: 'images/pin-1.png' //markerImage
                });
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                  return function() {
                    var content = '<div class="card lis-brd-light text-center text-lg-left lis-info lis-relative"><a href="#"><div class="lis-grediant grediant-tb-light lis-relative modImage rounded"><img src="' + data.photos[i].photo_file_url +
                      '" class="img-fluid rounded" width="300"></div><div class="lis-absolute lis-left-20 lis-top-20 lis-bg4 lis-icon lis-rounded-circle-50 text-center"><h4 class="text-white mb-0 lis-line-height-2_5"><i class="icofont icofont-fast-food"></i></h4></div></a><div class="hover-text lis-absolute lis-left-20 lis-bottom-20 lis-font-roboto text-white text-left"><h6 class="text-white mb-0">' +
                      data.photos[i].photo_title + '</h6></div></div>';
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                  }
                })(marker, i));

                markers.push(marker);
              }
              markerClusterer = new MarkerClusterer(map, markers, {
                maxZoom: 16,
                gridSize: 100,
                imagePath: 'images/m'
              });
              google.maps.event.addListener(MarkerClusterer, 'clusterclick', function(cluster) {
                map.setCenter(cluster.getCenter());
                map.setZoom(map.getZoom() + 2);
              });

            }

            function initialize() {
              map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: new google.maps.LatLng(-32.202924,-64.404945),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#f5f5f5"
                    }]
                  },
                  {
                    "elementType": "labels.icon",
                    "stylers": [{
                      "visibility": "off"
                    }]
                  },
                  {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#616161"
                    }]
                  },
                  {
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                      "color": "#f5f5f5"
                    }]
                  },
                  {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#bdbdbd"
                    }]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#eeeeee"
                    }]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#757575"
                    }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#e5e5e5"
                    }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#9e9e9e"
                    }]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#ffffff"
                    }]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#757575"
                    }]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#dadada"
                    }]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#616161"
                    }]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#9e9e9e"
                    }]
                  },
                  {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#e5e5e5"
                    }]
                  },
                  {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#eeeeee"
                    }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                      "color": "#c9c9c9"
                    }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                      "color": "#9e9e9e"
                    }]
                  }
                ]
              });
              refreshMap();
            }

            function clearClusters(e) {
              e.preventDefault();
              e.stopPropagation();
              markerClusterer.clearMarkers();
            }

            google.maps.event.addDomListener(window, 'load', initialize);