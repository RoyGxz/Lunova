# 🌸 LUNOVA — Catálogo Web de Cosméticos

Catálogo estático optimizado para celulares, listo para GitHub Pages.

---

## 📁 Estructura

```
/
├── index.html          ← Página principal
├── css/
│   └── estilos.css     ← Todos los estilos
├── js/
│   ├── productos.js    ← ✏️ EDITA AQUÍ tus productos
│   └── app.js          ← Lógica (carrito, WhatsApp, filtros)
└── img/
    ├── placeholder.svg ← Imagen de reemplazo automática
    └── ...             ← Agrega tus imágenes aquí
```

---

## ⚙️ Configuración inicial (2 pasos)

### 1. Cambia tu número de WhatsApp
Abre `js/app.js` y edita la primera línea:
```js
const WHATSAPP_NUMBER = "51987654321"; // ← Tu número real (sin +)
```

### 2. Agrega tus productos
Abre `js/productos.js` y edita el arreglo:
```js
{
  id: 1,                          // ID único (número)
  nombre: "Labial Mate Rojo",     // Nombre del producto
  precio: 25,                     // Precio en soles (sin S/)
  categoria: "Labiales",          // Categoría (se genera el filtro automáticamente)
  imagen: "img/mi-foto.jpg",      // Ruta de la imagen
  descripcion: "Descripción..."   // Descripción corta
}
```

### 3. Agrega tus imágenes
Sube tus fotos a la carpeta `/img/`. Tamaño recomendado: **600×600px**.
Si una imagen no carga, se mostrará automáticamente el placeholder rosado.

---

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio en GitHub (ej: `lunova-catalogo`)
2. Sube todos los archivos
3. Ve a **Settings → Pages → Source: main branch → / (root)**
4. Tu tienda estará en: `https://TU-USUARIO.github.io/lunova-catalogo`

---

## ✨ Funciones incluidas

- 🔍 Buscador en tiempo real
- 🗂️ Filtros por categoría automáticos
- 🛒 Carrito con contador
- 📲 Botón WhatsApp por producto
- 📦 Envío de carrito completo por WhatsApp
- 🌸 Diseño 100% responsive para celular
- ⚡ Carga rápida, sin dependencias externas

---

## 📱 Vista previa del mensaje WhatsApp (carrito)

```
Hola, quiero hacer un pedido en LUNOVA 🌸

• Labial Mate Rojo x2 — S/ 50.00
• Sérum Vitamina C x1 — S/ 58.00

*Total: S/ 108.00*

Tienda: LUNOVA
```
