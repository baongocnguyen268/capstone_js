class ProductList {
  constructor(services) {
    this.services = services;
    this.currentProductList = [];
  }

  getList() {
    this.services
      .getProductListApi()
      .then((result) => {
        this.currentProductList = result.data;
        this.renderProductList();
      })
      .catch((error) => console.log(error));
  }
  sortByPrice(order) {
    if (order === "asc") {
      this.currentProductList.sort((a, b) => a.price - b.price);
    } else if (order === "desc") {
      this.currentProductList.sort((a, b) => b.price - a.price);
    }
    this.renderProductList();
  }

  renderProductList(data = this.currentProductList) {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      const p = data[i];
      html += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.type}</td>
        <td>${p.price}</td>
        <td>${p.screen}</td>
        <td>${p.frontCamera}</td>
        <td>${p.backCamera}</td>
        <td><img src="../../asset/image/${p.img}" width="80" /></td>
        <td>${p.desc}</td>
        <td class="flex justify-center gap-2">
          <button onclick="editProduct('${
            p.id
          }')" class="text-white bg-green-600 px-2 py-1 rounded">Edit</button>
          <button onclick="deleteProduct('${
            p.id
          }')" class="text-white bg-red-600 px-2 py-1 rounded">Xóa</button>
        </td>
      </tr>
    `;
    }
    document.getElementById("tbodyProducts").innerHTML = html;
  }

  filterProduct(type) {
    if (type === "all") {
      return this.currentProductList;
    }

    let arrFiltered = [];
    for (let i = 0; i < this.currentProductList.length; i++) {
      const products = this.currentProductList[i];
      if (products.type === type) {
        arrFiltered.push(products);
      }
    }
    return arrFiltered;
  }

  searchProducts(keyword) {
    const result = [];
    const keywordLower = keyword.toLowerCase();
    for (let i = 0; i < this.currentProductList.length; i++) {
      const product = this.currentProductList[i];
      if (product.name.toLowerCase().includes(keywordLower)) {
        result.push(product);
      }
    }
    return result;
  }
}

export default ProductList;
