var long;
var lat;
if (navigator.geolocation) {
  const elememt = document.querySelector(".maps p");
  elememt.remove();
  window.onload = navigator.geolocation.getCurrentPosition(function(position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFub2puYTE5MSIsImEiOiJjbDRqazlhdTcwNDdpM2lsenhpeGwxc2RjIn0.S0pXqXsX8OAtpIU2ym-p-Q';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/manojna191/cl4ujzb0o005114p9fgdy2ecq',
      center: [78.032188, 30.316496],
      projection: {
        name: 'naturalEarth'
      },
      zoom: 13.5
    });
    map.on('click', (event) => {
      // If the user clicked on one of your markers, get its information.
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['dehradun']
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];

      const popup = new mapboxgl.Popup({
          offset: [0, -15]
        })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        )
        .addTo(map);
        console.log(feature.geometry.coordinates);
    });
    const size = 200;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // Call once before every frame where the icon will be used.
      render: function() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      }
    };
    map.on('load', () => {
      map.addImage('pulsing-dot', pulsingDot, {
        pixelRatio: 2
      });

      map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [78.032188, 30.316496] // icon position [lng, lat]
            }
          }]
        }
      });
      map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    });
    return {
      long,
      lat
    };
  });
} else {
  document.querySelector(".maps p").innerHTML = "Please give access to display near by hospitals in map";
  document.querySelector(".maps p").style.color = "red";
}
