
// =====================================
// 1. DATA
// =====================================

// TODO: Thay bằng dữ liệu lấy từ API.
// img để trống thì hiển thị nền kem.

const CATEGORIES = [
    "Tất cả",
    "Khai vị",
    "Món chính",
    "Hải sản",
    "Món nướng",
    "Lẩu",
    "Tráng miệng",
    "Đồ uống",
    "Rượu"
];

const RAW = {
    "Khai vị": [
        ["Gỏi cuốn tôm thịt", 85000],
        ["Salad cá hồi", 135000],
        ["Súp cua", 95000],
        ["Chả giò hải sản", 110000]
    ],

    "Món chính": [
        ["Bò bít tết", 320000],
        ["Cơm chiên dương châu", 120000],
        ["Mì Ý hải sản", 175000],
        ["Gà nướng mật ong", 210000]
    ],

    "Hải sản": [
        ["Tôm hùm nướng", 890000],
        ["Cua rang me", 650000],
        ["Cá hồi áp chảo", 280000],
        ["Sò điệp nướng mỡ hành", 190000]
    ],

    "Món nướng": [
        ["Sườn heo nướng", 230000],
        ["Bò nướng lá lốt", 180000],
        ["Vịt quay", 320000],
        ["Bạch tuộc nướng", 210000]
    ],

    "Lẩu": [
        ["Lẩu Thái hải sản", 450000],
        ["Lẩu bò nhúng giấm", 420000],
        ["Lẩu nấm", 320000]
    ],

    "Tráng miệng": [
        ["Bánh flan", 45000],
        ["Panna cotta", 75000],
        ["Kem dừa", 60000],
        ["Tiramisu", 85000]
    ],

    "Đồ uống": [
        ["Nước cam ép", 55000],
        ["Trà đào cam sả", 60000],
        ["Cà phê sữa đá", 45000],
        ["Sinh tố bơ", 65000]
    ],

    "Rượu": [
        ["Vang đỏ Bordeaux", 1250000],
        ["Vang trắng Chardonnay", 980000],
        ["Champagne Brut", 2400000],
        ["Whisky Single Malt", 1800000]
    ]
};


// Chuyển dữ liệu RAW thành danh sách món ăn
let nextId = 1;

const ITEMS = [];

Object.keys(RAW).forEach((category) => {
    RAW[category].forEach(([name, price]) => {
        ITEMS.push({
            id: nextId++,
            name: name,
            price: price,
            category: category,
            img: ""
        });
    });
});


// =====================================
// 2. RESPONSIVE LAYOUT
// =====================================

function layout() {
    const width = window.innerWidth;

    if (width > 1100) {
        return { cols: 5, rows: 2 };
    }

    if (width > 860) {
        return { cols: 4, rows: 2 };
    }

    if (width > 600) {
        return { cols: 3, rows: 2 };
    }

    return { cols: 2, rows: 2 };
}


// =====================================
// 3. STATE
// =====================================

const state = {
    category: "Tất cả",
    query: "",
    page: 1,

    // Lưu số lượng món đã chọn
    // Ví dụ: { 1: 2, 3: 1 }

    order: {},

    // Lưu ghi chú của từng món
    // Ví dụ: { 1: "Không rau thơm" }

    notes: {}
};


// =====================================
// 4. HELPER FUNCTIONS
// =====================================

const $ = (id) => document.getElementById(id);


// Format tiền Việt Nam
const money = (number) => {
    return number.toLocaleString("vi-VN") + "đ";
};


// Lấy món ăn theo ID
function findItem(id) {
    return ITEMS.find((item) => item.id === Number(id));
}


// Lấy số lượng của món
function getQuantity(id) {
    return state.order[id] || 0;
}


// =====================================
// 5. FILTER MENU
// =====================================

function filtered() {
    const keyword = state.query.trim().toLowerCase();

    return ITEMS.filter((item) => {
        const matchCategory =
            state.category === "Tất cả" ||
            item.category === state.category;

        const matchSearch =
            item.name.toLowerCase().includes(keyword);

        return matchCategory && matchSearch;
    });
}


// =====================================
// 6. RENDER CATEGORIES
// =====================================

function renderCategories() {
    const container = $("categories");

    container.innerHTML = "";

    CATEGORIES.forEach((category) => {
        const button = document.createElement("button");

        button.type = "button";

        button.className =
            "pill" +
            (category === state.category ? " active" : "");

        button.textContent = category;

        // Khi chọn danh mục
        button.addEventListener("click", () => {
            state.category = category;

            state.page = 1;

            renderCategories();

            renderMenu();
        });

        container.appendChild(button);
    });
}


// =====================================
// 7. PRODUCT DETAIL
// =====================================

// Lấy các thành phần của giao diện chi tiết

const detailView = $("detailView");
const backBtn = $("backBtn");

const detailImage = $("detailImage");
const detailName = $("detailName");
const detailPrice = $("detailPrice");

const quantityValue = $("quantityValue");
const decreaseBtn = $("decreaseBtn");
const increaseBtn = $("increaseBtn");

const dishNote = $("dishNote");
const detailOrderBtn = $("detailOrderBtn");


// Món ăn đang xem
let selectedDetailItem = null;

// Số lượng đang chọn trong giao diện chi tiết
let detailQuantity = 1;


// Mở giao diện chi tiết món ăn
function openDetail(id) {
    const item = findItem(id);

    if (!item) return;

    selectedDetailItem = item;

    // Mặc định số lượng là 1
    detailQuantity = 1;

    // Hiển thị tên món
    detailName.textContent = item.name;

    // Hiển thị giá
    detailPrice.textContent = money(item.price);

    // Hiển thị hình ảnh
    // Dữ liệu hiện tại sử dụng thuộc tính img
    if (item.img) {
        detailImage.src = item.img;
        detailImage.alt = item.name;
        detailImage.style.display = "block";
    } else {
        detailImage.removeAttribute("src");
        detailImage.alt = "";
        detailImage.style.display = "none";
    }

    // Hiển thị ghi chú đã lưu trước đó
    dishNote.value = state.notes[id] || "";

    // Cập nhật số lượng
    updateDetailQuantity();

    // Hiển thị giao diện chi tiết
    detailView.hidden = false;

    // Khóa cuộn trang phía sau
    document.body.style.overflow = "hidden";

    // Đưa focus về nút quay lại
    backBtn.focus();
}


// Cập nhật số lượng trên giao diện
function updateDetailQuantity() {
    quantityValue.textContent = detailQuantity;

    // Không cho giảm dưới 1
    decreaseBtn.disabled = detailQuantity <= 1;
}


// Nút giảm số lượng
decreaseBtn.addEventListener("click", () => {
    if (detailQuantity > 1) {
        detailQuantity--;

        updateDetailQuantity();
    }
});


// Nút tăng số lượng
increaseBtn.addEventListener("click", () => {
    detailQuantity++;

    updateDetailQuantity();
});


// Đóng giao diện chi tiết
function closeDetail() {
    detailView.hidden = true;

    // Mở lại cuộn trang
    document.body.style.overflow = "";

    selectedDetailItem = null;
}


// Nút quay lại
backBtn.addEventListener("click", () => {
    closeDetail();
});


// Nhấn ESC để đóng chi tiết món ăn
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        detailView &&
        !detailView.hidden
    ) {
        closeDetail();
    }
});


// =====================================
// 8. CREATE MENU CARD
// =====================================

function createMenuCard(item) {
    const quantity = getQuantity(item.id);

    // Thẻ món ăn
    const card = document.createElement("div");

    card.className = "card";

    card.dataset.id = item.id;

    card.setAttribute("role", "button");

    card.setAttribute("tabindex", "0");

    card.setAttribute(
        "aria-label",
        `${item.name}, ${money(item.price)}`
    );

    card.setAttribute(
        "aria-pressed",
        quantity > 0 ? "true" : "false"
    );

    // Đánh dấu món đã chọn
    if (quantity > 0) {
        card.classList.add("selected");
    }


    // Hình ảnh món ăn
    const thumb = document.createElement("div");

    thumb.className = "thumb";

    if (item.img) {
        thumb.style.backgroundImage =
            `url("${item.img}")`;
    }


    // Thông tin món ăn
    const info = document.createElement("div");

    info.className = "info-box";


    // Tên món
    const name = document.createElement("p");

    name.className = "name";

    name.textContent = item.name;

    name.title = item.name;


    // Giá món
    const price = document.createElement("p");

    price.className = "price";

    price.textContent = money(item.price);


    info.append(name, price);

    card.append(thumb, info);


    // Hiển thị số lượng nếu món đã được chọn
    if (quantity > 0) {
        const badge = document.createElement("span");

        badge.className = "badge";

        badge.textContent = quantity;

        card.appendChild(badge);
    }


    // Nhấn vào món ăn để mở chi tiết
    card.addEventListener("click", () => {
        openDetail(item.id);
    });


    // Hỗ trợ chọn món bằng bàn phím
    card.addEventListener("keydown", (event) => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();

            openDetail(item.id);
        }
    });


    return card;
}


// =====================================
// 9. ADD ITEM TO ORDER
// =====================================

function addItem(id, quantity = 1, note = null) {
    // Tăng số lượng món
    state.order[id] = getQuantity(id) + quantity;

    // Cập nhật ghi chú nếu có truyền vào
    if (note !== null) {
        state.notes[id] = note;
    }

    // Cập nhật giao diện
    renderMenu();

    renderSummary();
}


// =====================================
// 10. REMOVE ITEM FROM ORDER
// =====================================

function removeItem(id) {
    const quantity = getQuantity(id);

    if (quantity <= 1) {
        delete state.order[id];

        // Xóa ghi chú khi xóa hết món
        delete state.notes[id];

    } else {
        state.order[id] = quantity - 1;
    }

    renderMenu();

    renderSummary();
}


// =====================================
// 11. ADD DETAIL ITEM TO ORDER
// =====================================

detailOrderBtn.addEventListener("click", () => {
    if (!selectedDetailItem) return;

    const id = selectedDetailItem.id;

    // Lấy ghi chú
    const note = dishNote.value.trim();

    // Thêm đúng số lượng đã chọn
    addItem(id, detailQuantity, note);

    // Đóng giao diện chi tiết
    closeDetail();

    // Thông báo
    //alert("Đã thêm món vào đơn hàng!");
});


// =====================================
// 12. RENDER MENU
// =====================================

function renderMenu() {
    const { cols, rows } = layout();

    // Số món hiển thị trên mỗi trang
    const pageSize = cols * rows;

    // Danh sách sau khi lọc
    const list = filtered();

    // Tổng số trang
    const totalPages = Math.max(
        1,
        Math.ceil(list.length / pageSize)
    );

    // Đảm bảo trang hiện tại hợp lệ
    state.page = Math.max(
        1,
        Math.min(state.page, totalPages)
    );

    // Lấy các món thuộc trang hiện tại
    const startIndex = (state.page - 1) * pageSize;

    const currentItems = list.slice(
        startIndex,
        startIndex + pageSize
    );


    // Khu vực hiển thị menu
    const menu = $("menu");

    menu.style.setProperty("--cols", cols);

    menu.style.setProperty("--rows", rows);

    menu.innerHTML = "";


    // Không tìm thấy món
    if (currentItems.length === 0) {
        const empty = document.createElement("p");

        empty.className = "empty";

        empty.textContent =
            "Không tìm thấy món nào. Thử từ khóa khác.";

        menu.appendChild(empty);
    }


    // Hiển thị danh sách món
    currentItems.forEach((item) => {
        const card = createMenuCard(item);

        menu.appendChild(card);
    });


    // Cập nhật trạng thái nút chuyển trang
    $("prevBtn").disabled = state.page <= 1;

    $("nextBtn").disabled = state.page >= totalPages;
}


// =====================================
// 13. RENDER ORDER SUMMARY
// =====================================

function renderSummary() {
    const summary = $("summary");

    summary.innerHTML = "";


    // Danh sách ID món đã chọn
    const ids = Object.keys(state.order);


    // Tổng số lượng món
    const count = ids.reduce((total, id) => {
        return total + state.order[id];
    }, 0);


    // Tổng tiền
    const total = ids.reduce((sum, id) => {
        const item = findItem(id);

        return sum + item.price * state.order[id];
    }, 0);


    // Chưa chọn món
    if (count === 0) {
        summary.textContent = "Chưa chọn món nào";

        $("orderBtn").disabled = true;

        return;
    }


    // Hiển thị tổng số lượng và tiền
    const strong = document.createElement("strong");

    strong.textContent =
        `${count} món · ${money(total)}`;


    // Nút xóa tất cả
    const clear = document.createElement("button");

    clear.type = "button";

    clear.className = "clear";

    clear.textContent = "Xóa hết";


    clear.addEventListener("click", () => {
        state.order = {};

        state.notes = {};

        renderMenu();

        renderSummary();
    });


    summary.append(strong, clear);

    $("orderBtn").disabled = false;
}


// =====================================
// 14. SEARCH
// =====================================

$("search").addEventListener("input", (event) => {
    state.query = event.target.value;

    state.page = 1;

    renderMenu();
});


// =====================================
// 15. PAGINATION
// =====================================

// Trang trước
$("prevBtn").addEventListener("click", () => {
    if (state.page > 1) {
        state.page--;

        renderMenu();
    }
});


// Trang tiếp theo
$("nextBtn").addEventListener("click", () => {
    const { cols, rows } = layout();

    const pageSize = cols * rows;

    const totalPages = Math.max(
        1,
        Math.ceil(filtered().length / pageSize)
    );

    if (state.page < totalPages) {
        state.page++;

        renderMenu();
    }
});


// =====================================
// 16. RESPONSIVE RESIZE
// =====================================

let resizeTimeout;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        renderMenu();
    }, 150);
});


// =====================================
// 17. KEYBOARD PAGINATION
// =====================================

document.addEventListener("keydown", (event) => {
    // Không chuyển trang khi đang nhập tìm kiếm
    if (event.target === $("search")) {
        return;
    }

    // Không chuyển trang khi đang mở chi tiết món
    if (detailView && !detailView.hidden) {
        return;
    }

    if (
        event.key === "ArrowLeft" &&
        !$("prevBtn").disabled
    ) {
        $("prevBtn").click();
    }

    if (
        event.key === "ArrowRight" &&
        !$("nextBtn").disabled
    ) {
        $("nextBtn").click();
    }
});


// =====================================
// 18. PLACE ORDER
// =====================================

$("orderBtn").addEventListener("click", () => {
    const ids = Object.keys(state.order);

    // Kiểm tra đơn hàng có món hay chưa
    if (ids.length === 0) {
        alert("Vui lòng chọn món trước khi đặt đơn!");
        return;
    }

    // Tạo dữ liệu đơn hàng
    const orderData = ids.map((id) => {
        const item = findItem(id);

        return {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(state.order[id]),
            note: state.notes[id] || "",
            subtotal: Number(item.price) * Number(state.order[id])
        };
    });

    // Tính tổng tiền
    const total = orderData.reduce((sum, item) => {
        return sum + item.subtotal;
    }, 0);

    // Tạo object đơn hàng hoàn chỉnh
    const checkoutData = {
        items: orderData,
        total: total,
        totalQuantity: orderData.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0)
    };

    // Lưu dữ liệu để trang Checkout sử dụng
    sessionStorage.setItem(
        "checkoutData",
        JSON.stringify(checkoutData)
    );

    // Chuyển sang trang Checkout
    window.location.href = "/order";
});


// =====================================
// 19. INITIALIZE
// =====================================

renderCategories();

renderMenu();

renderSummary();
