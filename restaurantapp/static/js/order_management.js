
document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".order-tab");

    const newCount = document.getElementById("newCount");
    const completedCount = document.getElementById("completedCount");

    const newTabCount = document.getElementById("newTabCount");
    const completedTabCount = document.getElementById("completedTabCount");

    const emptyOrders = document.getElementById("emptyOrders");

    let currentTab = "new";


    // =====================================
    // CẬP NHẬT SỐ LƯỢNG ĐƠN
    // =====================================

    function updateCounts() {

        const newTotal = newOrders.querySelectorAll(".order-card").length;

        const completedTotal = completedOrders.querySelectorAll(".order-card").length;

        newTabCount.textContent = newTotal;
        completedTabCount.textContent = completedTotal;

        checkEmpty();
    }


    // =====================================
    // KIỂM TRA ĐƠN TRỐNG
    // =====================================

    function checkEmpty() {

        const currentList = currentTab === "new"
            ? newOrders
            : completedOrders;

        emptyOrders.classList.toggle(
            "hidden",
            currentList.querySelectorAll(".order-card").length > 0
        );
    }


    // =====================================
    // CHUYỂN TAB
    // =====================================

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            currentTab = tab.dataset.tab;

            newOrders.classList.toggle(
                "hidden",
                currentTab !== "new"
            );

            completedOrders.classList.toggle(
                "hidden",
                currentTab !== "completed"
            );

            checkEmpty();

        });

    });


    // =====================================
    // HOÀN THÀNH ĐƠN
    // =====================================

    document.addEventListener("click", function (event) {

        const button = event.target.closest(".btn-complete");

        if (!button) return;

        const card = button.closest(".order-card");

        if (!card) return;

        const confirmed = confirm(
            "Bạn có chắc chắn muốn hoàn thành đơn này?"
        );

        if (!confirmed) return;

        // Xóa nút hoàn thành
        const actions = card.querySelector(".order-actions");

        actions.innerHTML = `
            <span class="completed-label">
                ✓ Đã hoàn tất
            </span>
        `;

        card.classList.add("completed-card");

        // Chuyển sang danh sách hoàn tất
        completedOrders.prepend(card);

        updateCounts();

    });


    // =====================================
    // IN ĐƠN
    // =====================================

    document.addEventListener("click", function (event) {

        const button = event.target.closest(".btn-print");

        if (!button) return;

        const card = button.closest(".order-card");

        if (!card) return;

        // Đánh dấu đơn cần in
        document.querySelectorAll(".order-card").forEach(function (item) {
            item.classList.remove("printing-order");
        });

        card.classList.add("printing-order");

        document.body.classList.add("printing-single-order");

        window.print();

    });


    // Xóa trạng thái sau khi in
    window.addEventListener("afterprint", function () {

        document.body.classList.remove("printing-single-order");

        document.querySelectorAll(".printing-order").forEach(function (item) {
            item.classList.remove("printing-order");
        });

    });


    // =====================================
    // KHỞI TẠO
    // =====================================

    updateCounts();

});
