import { getEle } from "../../admin/controllers/main.js";

class Validation {
checkEmpty(value, idNoti, mess) {
    if (value === "") {
      getEle(idNoti).innerHTML = mess;
      getEle(idNoti).style.display = "block";
      return false;
    }
    getEle(idNoti).innerHTML = "";
    getEle(idNoti).style.display = "none";
    return true;
  }
 checkSelectOption(idSelect, idNoti, mess) {
    if (getEle(idSelect).selectedIndex !== 0) {
      getEle(idNoti).innerHTML = "";
      getEle(idNoti).style.display = "none";
      return true;
    }
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }
  checkIsNumber(value, idNoti, mess) {
  const pattern = /^[0-9]+$/;
  if (!pattern.test(value)) {
    getEle(idNoti).innerHTML = mess;
    getEle(idNoti).style.display = "block";
    return false;
  }
  getEle(idNoti).innerHTML = "";
  getEle(idNoti).style.display = "none";
  return true;
}

}

export default Validation;