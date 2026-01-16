// Nombre: Pengyu Ye

// Iniciación del mapa
var map = L.map("map").setView([40.416775, -3.70379], 6);

// Cargar la capa de "tiles" usando OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Referencias al DOM
const inputLat = document.getElementById("lat");
const inputLng = document.getElementById("lng");
const canvas = document.getElementById("miCanvas");
const ctx = canvas.getContext("2d");

// Array para guardar los puntos en memoria durante la ejecución
let puntosGuardados = [];

// Mostrar coordenadas al mover el ratón
map.on("mousemove", function (e) {
  inputLat.value = e.latlng.lat.toFixed(5);
  inputLng.value = e.latlng.lng.toFixed(5);
});

// Guardar en localStorage al hacer click
map.on("click", function (e) {
  const nuevaUbicacion = {
    lat: e.latlng.lat,
    lng: e.latlng.lng,
  };

  // 1. Añadir al array local
  puntosGuardados.push(nuevaUbicacion);

  // 2. Guardar en localStorage (convertir a texto JSON)
  localStorage.setItem("ubicaciones", JSON.stringify(puntosGuardados));

  // 3. Poner marcador en el mapa
  agregarMarcador(nuevaUbicacion);

  // 4. Actualizar el Canvas
  dibujarEnCanvas();
});

// Función para poner un marcador visual en el mapa
function agregarMarcador(ubicacion) {
  L.marker([ubicacion.lat, ubicacion.lng])
    .addTo(map)
    .bindPopup(`Posición: ${puntosGuardados.length}`)
    .openPopup();
}

// Dibujar los puntos en el canvas
function dibujarCanvas() {
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.Width, canvas.height);

  if (puntosGuardados.length === 0) {
    ctx.fillText("No hay puntos guardados. Haz clic en el mapa.");

    return;
  }

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  // Recorrer los puntos
  puntosGuardados.forEach((punto, index) => {
    // Convertimos Lat/Lng a puntos X/Y relativos al contenedor del mapa
    const pointPixel = map.latLngToContainerPoint([punto.lat, punto.lng]);

    // Ajustar si el canvas tiene tamaño diferente
    const x = pointPixel.x;
    const y = pointPixel.y;

    // Dibujamos círculo
    ctx.fillStyle = "red";
    ctx.fillRect(x - 3, y - 3, 6, 6); // Un cuadrado pequeño representando el punto

    // Dibujar línea conectando
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

// Recuperar datos al recargar la página
window.onload = function () {
  // 1. Leer de localStorage
  const datosGuardados = localStorage.getItem("ubicaciones");

  if (datosGuardados) {
    // Convertir de texto JSON a Array
    puntosGuardados = JSON.parse(datosGuardados);

    // 2. Representar marcadores y Canvas
    puntosGuardados.forEach((punto) => {
      agregarMarcador(punto);
    });

    // Esperar a que el mapa cargue dimensiones para dibujar en canvas
    setTimeout(dibujarCanvas, 500);
  }
};

// Botón para limpiar y empezar de cero
function borrarDatos() {
  localStorage.removeItem("ubicaciones");
  location.reload();
}
