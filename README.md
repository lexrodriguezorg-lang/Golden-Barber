# Golden Barber — sitio web

Landing de Golden Barber en La Dorada, Caldas. Incluye servicios, referencias de corte, presentación de Javi Velásquez, tienda ligera, reseñas, ubicación y solicitud de citas por WhatsApp.

## Archivos principales

- `index.html`: contenido y estructura del sitio.
- `styles.css`: identidad visual y adaptación responsive.
- `script.js`: teléfono, servicios, horarios, agenda y catálogo.
- `resenas.js`: reseñas autorizadas.
- `admin.html`: herramienta interna para preparar reseñas.
- `privacidad.html`: política de tratamiento de datos.
- `img/`: logo, retrato y fotografías.

## Agenda

La agenda presenta fechas y horas posibles, pero no bloquea espacios ocupados. Al finalizar abre WhatsApp con la solicitud completa; Javi confirma el cupo. Para disponibilidad automática puede conectarse Cal.com desde `CONFIG.calLink` en `script.js`.

## Añadir productos

1. Guarda cada fotografía optimizada en `img/productos/`.
2. Abre `script.js` y agrega el producto al arreglo `PRODUCTOS`:

```js
{
  id: "cera-mate",
  nombre: "Cera mate",
  precio: 35000,
  foto: "img/productos/cera-mate.jpg",
  disponible: true
}
```

Cuando hay productos, el catálogo y el carrito aparecen automáticamente. El pedido se envía a WhatsApp con cantidades y total. Mientras el catálogo esté vacío, la sección permite consultar las existencias del día.

## Datos configurados

- WhatsApp: `+57 350 473 7330`
- Dirección: Cra. 5 con calle 10B, esquina, La Dorada, Caldas.
- Lunes a viernes: 9:00 a. m.–7:00 p. m.
- Sábado: 8:30 a. m.–6:00 p. m.
- Domingo: 10:00 a. m.–2:00 p. m.

No se incluyen redes sociales ficticias.
