import Products from "../models/products.js";
import ProductServices from "../services/product-services.js";

const services = new ProductServices();

const getEle = (id) => document.getElementById(id);
const getProductList = () => {
  const promise = services.getProductListApi();
  promise
    .then((result) => {
      renderProductList(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
const renderProductList = (data) => {
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const products = data[i];
    contentHTML += `
<tr>
  <td>${i + 1}</td>
  <td>${products.name}</td>
  <td>${products.price}</td>
  <td>${products.screen}</td>
  <td>${products.backCamera}</td>
  <td>${products.frontCamera}</td>
  <td>
   <img src="../../asset/image/${products.img}" width="80" />
  </td>
  <td>${products.desc}</td>
  <td>${products.type}</td>
  <td>
    <button 
      onclick="deleteProduct('${products.id}')"
      class="inline-flex items-center gap-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-3 py-1.5 transition duration-150 ease-in-out">
      <i class="fa-solid fa-trash"></i> Xoá
    </button>
  </td>
</tr>
  `;
  }
  getEle("tbodyProducts").innerHTML = contentHTML;
};

getProductList();

const getValue = () => {
  const name = getEle("productName").value;
  const price = getEle("productPrice").value;
  const screen = getEle("screenSP").value;
  const frontCamera = getEle("frtCamera").value;
  const backCamera = getEle("bckCamera").value;
  const img = getEle("productImg").value;
  const desc = getEle("productDesc").value;
  const type = getEle("productType").value;
  const product = new Products(
    "",
    name,
    price,
    screen,
    frontCamera,
    backCamera,
    img,
    desc,
    type
  );
  return product;
};

const btnThemSP = () => {
  const product = getValue();
  const promise = services.addProductApi(product);
  promise
    .then((result) => {
      alert(`Add product ${result.data.name} success!`);
      document.querySelector('[data-modal-hide="addPhoneModal"]')?.click();
      document.querySelector("#addPhoneModal form").reset();
      getProductList();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnThemSP");
  if (btn) {
    btn.addEventListener("click", btnThemSP);
  }
});

const deleteProduct = (id) => {
  const promise = services.deleteProductApi(id);
  promise
    .then((result) => {
      console.log(result);
      alert(`Delete product ${result.data.name} sucessfully`);
      getProductList();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.deleteProduct = deleteProduct;
