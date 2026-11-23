
// =====================================
// DOM ELEMENTS
// =====================================

const itemsContainer = document.getElementById("checkoutItems");
const totalPriceElement = document.getElementById("totalPrice");

const confirmModal = document.getElementById("confirmModal");
const confirmMessage = document.getElementById("confirmMessage");

const backBtn = document.getElementById("backBtn");
const payBtn = document.getElementById("payBtn");
const cancelPayBtn = document.getElementById("cancelPayBtn");
const confirmPayBtn = document.getElementById("confirmPayBtn");


// =====================================
// LẤY DỮ LIỆU ĐƠN HÀNG
// =====================================

// Lấy dữ liệu từ sessionStorage
const checkoutData = JSON.parse(
    sessionStorage.getItem("checkoutData") || "null"
);

// Danh sách món ăn
let order = checkoutData?.items || [];


// =====================================
// FORMAT GIÁ TIỀN
// =====================================

function formatPrice(price) {
    return Number(price).toLocaleString("vi-VN") + "đ";
}


// =====================================
// TÍNH TOÁN ĐƠN HÀNG
// =====================================

// Tổng số lượng món
function getTotalQuantity() {
    return order.reduce((total, item) => {
        return total + Number(item.quantity);
    }, 0);
}

// Tổng tiền
function getTotalPrice() {
    return order.reduce((total, item) => {
        return total + Number(item.price) * Number(item.quantity);
    }, 0);
}


// =====================================
// HIỂN THỊ DANH SÁCH MÓN
// =====================================

function renderOrder() {
    itemsContainer.innerHTML = "";

    // Kiểm tra đơn hàng trống
    if (order.length === 0) {
        itemsContainer.innerHTML = `
            <p class="empty-order">
                Chưa có món ăn nào trong đơn hàng.
            </p>
        `;

        totalPriceElement.textContent = "0đ";
        payBtn.disabled = true;

        return;
    }

    payBtn.disabled = false;

    order.forEach((item, index) => {

        // Khung món ăn
        const row = document.createElement("div");
        row.className = "checkout-item";

        // Thông tin món
        const info = document.createElement("div");
        info.className = "item-info";

        // Tên món và số lượng
        const heading = document.createElement("div");
        heading.className = "item-heading";

        const quantity = document.createElement("span");
        quantity.className = "item-quantity";
        quantity.textContent = `${item.quantity} x`;

        const name = document.createElement("strong");
        name.textContent = item.name;

        heading.append(quantity, name);

        // Thành tiền
        const price = document.createElement("div");
        price.className = "item-price";
        price.textContent = formatPrice(
            item.price * item.quantity
        );

        // Ghi chú
        const note = document.createElement("p");
        note.className = "item-note";
        note.textContent = `Ghi chú: ${item.note || ""}`;

        info.append(heading, price, note);

        // Nút giảm số lượng
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.type = "button";
        removeBtn.textContent = "−";

        removeBtn.setAttribute(
            "aria-label",
            `Giảm số lượng ${item.name}`
        );

        removeBtn.addEventListener("click", () => {
            decreaseQuantity(index);
        });

        row.append(info, removeBtn);

        itemsContainer.appendChild(row);
    });

    // Cập nhật tổng tiền
    totalPriceElement.textContent = formatPrice(
        getTotalPrice()
    );
}


// =====================================
// GIẢM SỐ LƯỢNG MÓN
// =====================================

function decreaseQuantity(index) {

    // Giảm một món
    order[index].quantity--;

    // Nếu số lượng bằng 0 thì xóa món
    if (order[index].quantity <= 0) {
        order.splice(index, 1);
    }

    // Lưu và cập nhật giao diện
    saveOrder();
    renderOrder();
}


// =====================================
// LƯU ĐƠN HÀNG
// =====================================

function saveOrder() {

    // Cập nhật lại dữ liệu đơn hàng
    checkoutData.items = order;

    checkoutData.total = getTotalPrice();

    checkoutData.totalQuantity = getTotalQuantity();

    // Lưu vào sessionStorage
    sessionStorage.setItem(
        "checkoutData",
        JSON.stringify(checkoutData)
    );
}


// =====================================
// QUAY LẠI TRANG MENU
// =====================================

backBtn.addEventListener("click", () => {
    window.history.back();
});


// =====================================
// MỞ HỘP THOẠI XÁC NHẬN
// =====================================

payBtn.addEventListener("click", () => {

    if (order.length === 0) {
        return;
    }

    const quantity = getTotalQuantity();
    const total = formatPrice(getTotalPrice());

    confirmMessage.textContent =
        `Xác nhận thanh toán ${quantity} món, tổng cộng ${total}?`;

    confirmModal.hidden = false;
});


// =====================================
// ĐÓNG HỘP THOẠI
// =====================================

cancelPayBtn.addEventListener("click", () => {
    confirmModal.hidden = true;
});


// =====================================
// XÁC NHẬN THANH TOÁN
// =====================================

confirmPayBtn.addEventListener("click", () => {

    // Kiểm tra lại đơn hàng
    if (order.length === 0) {
        return;
    }

    // Lấy dữ liệu cuối cùng
    const finalOrder = {
        items: order,
        total: getTotalPrice(),
        totalQuantity: getTotalQuantity()
    };

    // TODO: Gửi finalOrder lên API đặt hàng
    console.log("Final order:", finalOrder);

    // Thông báo demo
    alert("Đã xác nhận đơn hàng!");

    // Xóa dữ liệu đơn hàng tạm thời
    sessionStorage.removeItem("checkoutData");

    // Quay lại trang trước
    window.location.href = "/";
});


// =====================================
// ĐÓNG MODAL KHI BẤM RA NGOÀI
// =====================================

confirmModal.addEventListener("click", (event) => {

    if (event.target === confirmModal) {
        confirmModal.hidden = true;
    }

});


// =====================================
// KHỞI TẠO TRANG
// =====================================

if (!checkoutData || order.length === 0) {
    itemsContainer.innerHTML = `
        <p class="empty-order">
            Chưa có dữ liệu đơn hàng.
        </p>
    `;

    totalPriceElement.textContent = "0đ";
    payBtn.disabled = true;
} else {
    renderOrder();
}
