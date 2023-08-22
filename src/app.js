const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const productos = new ProductManager("productos.json");

app.get("/products", (req, res) => {
  const limit = req.query.limit;
  const products = limit
    ? productos.getProducts().slice(0, limit)
    : productos.getProducts();
  res.json({ products });
});

app.get("/products/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = productos.getProductById(pid);
  if (!product) {
    res
      .status(404)
      .send({ error: `No se encontró ningún producto con el ID ${pid}` });
  } else {
    res.json({ product });
  }
});

app.listen(8080, () => {
  console.log("Escuchando en el puerto 8080");
});
