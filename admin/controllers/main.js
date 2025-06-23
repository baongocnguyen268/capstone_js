import Products from "../models/products.js";
import ProductServices from "../services/product-services.js";
import Validation from "../models/validation.js";
import ProductList from "../models/products-list.js";

const services = new ProductServices();
const validation = new Validation();
const productList = new ProductList(services);

export const getEle = (id) => {
  return document.getElementById(id);
};
const getProductList = () => {
  const promise = services.getProductListApi();
  promise
    .then((result) => {
      globalProductList = result.data; 
      applyFilters(); ;
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
  <td>${products.type}</td>
  <td>${products.price}</td>
  <td>${products.screen}</td>
  <td>${products.frontCamera}</td>
  <td>${products.backCamera}</td>
  <td><img src="../../asset/image/${products.img}" width="80" /></td>
  <td>${products.desc}</td>
  <td class="flex justify-center gap-2">
    <button 
      onclick="editProduct('${products.id}')"
      class="inline-flex items-center gap-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-3 py-1.5 transition duration-150 ease-in-out">
      <i class="fa-solid fa-pen-to-square"></i> Edit
    </button>
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
  let isValid = true;
  const name = getEle("productName").value;
  const price = getEle("productPrice").value;
  const screen = getEle("screenSP").value;
  const frontCamera = getEle("frtCamera").value;
  const backCamera = getEle("bckCamera").value;
  const img = getEle("productImg").value;
  const desc = getEle("productDesc").value;
  const type = getEle("productType").value;

  isValid =
    validation.checkEmpty(
      name,
      "invalidName",
      "(*)Vui lòng nhập tên sản phẩm"
    );
  isValid =
    validation.checkEmpty(price, "invalidPrice", "(*)Vui lòng nhập giá") &&
    validation.checkIsNumber(
      price,
      "invalidPrice",
      "(*) Giá chỉ được hơn 1.000.000Đ, Vui lòng nhập lại"
    );
  isValid =
    validation.checkEmpty(
      screen,
      "invalidScreen",
      "(*)Vui lòng nhập màn hình"
    );
  isValid =
    validation.checkEmpty(
      frontCamera,
      "invalidFCamera",
      "(*)Vui lòng nhập camera trước"
    );
  isValid =
    validation.checkEmpty(
      backCamera,
      "invalidBCamera",
      "(*)Vui lòng nhập camera sau"
    );
  isValid =
    validation.checkSelectOption(
      "productType",
      "invalidType",
      "(*) Vui lòng chọn loại"
    ) ;
  if (!isValid) return null;
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
  if (!product) return;
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
  const addBtn = document.getElementById("btnThemSP");
  const updateBtn = document.getElementById("btnCapNhat");

  if (addBtn) addBtn.addEventListener("click", btnThemSP);
  if (updateBtn) updateBtn.addEventListener("click", btnCapNhat);
});

getEle("btnThem").onclick = function () {
  document.querySelector("#addPhoneModal form").reset();
  const modalTitle = document.querySelector(".modal-title");
  if (modalTitle) {
    modalTitle.innerText = "Thêm Điện Thoại Mới";
  }
  getEle("btnCapNhat").style.display = "none";
  getEle("btnThemSP").style.display = "block";
  [
    "invalidName",
    "invalidPrice",
    "invalidScreen",
    "invalidFCamera",
    "invalidBCamera",
    "invalidType",
  ].forEach((id) => {
    getEle(id).innerText = "";
    getEle(id).style.display = "none";
  });
};
let currentEditId = -1;
const editProduct = (id) => {
  currentEditId = id;
  const modal = document.getElementById("addPhoneModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
  getEle("btnThemSP").style.display = "none";
  getEle("btnCapNhat").style.display = "block";
  document.getElementsByClassName("modal-title")[0].innerHTML = "Sửa Thông Tin Điện Thoại";
  const promise = services.getProductById(id);
  promise
    .then((result) => {
      const product = result.data;
      getEle("productName").value = product.name;
      getEle("productPrice").value = product.price;
      getEle("screenSP").value = product.screen;
      getEle("frtCamera").value = product.frontCamera;
      getEle("bckCamera").value = product.backCamera;
      getEle("productImg").value = product.img;
      getEle("productDesc").value = product.desc;
      getEle("productType").value = product.type;
      getProductList();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.editProduct = editProduct;
const btnCapNhat = () => {
  const product = getValue();
  product.id = currentEditId;
  const promise = services.updateProductApi(product);
  promise
    .then((result) => {
      alert(`Update product ${result.data.name} success!`);
      document.getElementById("addPhoneModal").classList.add("hidden");
      getProductList();
    })
    .catch((error) => {
      console.log(error);
    });
};

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

productList.getList();
document.getElementById("sortPrice").addEventListener("change", (e) => {
  const order = e.target.value;
  productList.sortByPrice(order);
});

getEle("selLoai").addEventListener("change", () => {
  const type = getEle("selLoai").value;
  const filtered = productList.filterProduct(type);
  productList.renderProductList(filtered);
});

getEle("keyword").addEventListener("keyup", () => {
  const keyword = getEle("keyword").value;
  const findProducts = productList.searchProducts(keyword);
  productList.renderProductList(findProducts);
})
