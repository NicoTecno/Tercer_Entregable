const fs = require("fs");
class Producto {
  static idIncremental = 0;
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Producto.idIncremental;
    Producto.idIncremental++;
  }
}

class ProductManager {
  #arr;

  constructor(path) {
    this.#arr = [];
    this.path = path;
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, "[]", "utf-8");
    } else {
      this.loadProductsFromJSON();
    }
  }

  addProduct(...params) {
    if (params.length !== 6) {
      console.error("Error: Incorrect number of parameters");
      return;
    }

    const [title, description, price, thumbnail, code, stock] = params;
    if (this.codigoExiste(code)) {
      console.error(`Error : Codigo ya existe`);
      return;
    }

    const nuevoProducto = new Producto(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    this.#arr.push(nuevoProducto);
    this.updateJSONFile();
  }

  loadProductsFromJSON() {
    const jsonData = fs.readFileSync(this.path, "utf-8");
    const products = JSON.parse(jsonData);
    products.forEach((product) => {
      const { title, description, price, thumbnail, code, stock } = product;
      this.addProduct(title, description, price, thumbnail, code, stock);
    });
  }

  updateJSONFile() {
    const jsonStr = JSON.stringify(this.#arr, null, 2);
    fs.writeFileSync(this.path, jsonStr, "utf-8");
    console.log("The JSON file has been updated.");
  }

  deleteProduct(id) {
    const posicionProductoEliminar = this.#arr.findIndex(
      (obj) => obj.id === id
    );
    if (posicionProductoEliminar !== -1) {
      this.#arr.splice(posicionProductoEliminar, 1);
      this.updateJSONFile();
    }
  }

  updateProduct(id, title, description, price, thumbnail, code, stock) {
    const productoModificar = this.getProductById(id);
    if (!(productoModificar instanceof Producto)) {
      return;
    }

    productoModificar.title = title ?? productoModificar.title;
    productoModificar.description =
      description ?? productoModificar.description;
    productoModificar.price = price ?? productoModificar.price;
    productoModificar.thumbnail = thumbnail ?? productoModificar.thumbnail;
    productoModificar.code = code ?? productoModificar.code;
    productoModificar.stock = stock ?? productoModificar.stock;
    this.updateJSONFile();
  }

  getProducts() {
    return this.#arr;
  }

  getProductById(id) {
    const productoEncontrado = this.#arr.find((producto) => producto.id === id);
    return productoEncontrado ? productoEncontrado : null;
  }

  codigoExiste = (code) => {
    if (this.#arr.find((producto) => producto.code == code)) return true;
    return false;
  };
}

module.exports = ProductManager;
