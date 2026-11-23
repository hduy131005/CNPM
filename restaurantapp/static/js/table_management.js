document.addEventListener("DOMContentLoaded", function () {

    const tableCards = document.querySelectorAll(".table-card");
    const filterButtons = document.querySelectorAll(".filter-btn");

    const searchInput = document.getElementById("tableSearch");
    const floorFilter = document.getElementById("floorFilter");

    const emptyState = document.getElementById("emptyState");
    const tableGrid = document.getElementById("tableGrid");

    let currentStatus = "all";

    // Lọc bàn theo trạng thái, tầng và từ khóa
    function filterTables() {

        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedFloor = floorFilter.value;

        let visibleCount = 0;

        tableCards.forEach(function (card) {

            const status = card.dataset.status;
            const floor = card.dataset.floor;
            const name = card.dataset.name.toLowerCase();

            const matchStatus =
                currentStatus === "all" || status === currentStatus;

            const matchFloor =
                selectedFloor === "all" || floor === selectedFloor;

            const matchSearch =
                name.includes(searchValue);

            const isVisible =
                matchStatus && matchFloor && matchSearch;

            card.style.display = isVisible ? "" : "none";

            if (isVisible) {
                visibleCount++;
            }
        });

        // Hiển thị thông báo nếu không tìm thấy bàn
        emptyState.style.display =
            visibleCount === 0 ? "block" : "none";

        tableGrid.style.display =
            visibleCount === 0 ? "none" : "grid";

        updateStatistics();
    }

    // Cập nhật số liệu thống kê
    function updateStatistics() {

        let total = 0;
        let available = 0;
        let occupied = 0;
        let reserved = 0;

        tableCards.forEach(function (card) {

            total++;

            switch (card.dataset.status) {
                case "available":
                    available++;
                    break;

                case "occupied":
                    occupied++;
                    break;

                case "reserved":
                    reserved++;
                    break;
            }
        });

        document.getElementById("totalCount").textContent = total;
        document.getElementById("availableCount").textContent = available;
        document.getElementById("occupiedCount").textContent = occupied;
        document.getElementById("reservedCount").textContent = reserved;
        document.getElementById("allFilterCount").textContent = total;
    }

    // Chọn bộ lọc trạng thái
    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentStatus = button.dataset.filter;

            filterTables();
        });
    });

    // Tìm kiếm bàn
    searchInput.addEventListener("input", filterTables);

    // Lọc theo tầng
    floorFilter.addEventListener("change", filterTables);

    // Nút thêm bàn: hiện thông báo tạm thời
    document.getElementById("addTableBtn").addEventListener("click", function () {
        alert("Add New Table: Chức năng này sẽ được kết nối với backend sau.");
    });

    // Nút chi tiết bàn: hiện thông báo tạm thời
    document.querySelectorAll(".table-action").forEach(function (button) {

        button.addEventListener("click", function () {

            const card = button.closest(".table-card");
            const tableName = card.dataset.name;

            alert("Bạn đang chọn " + tableName + ". Chức năng chi tiết sẽ được phát triển tiếp.");
        });
    });

    // Khởi tạo dữ liệu
    updateStatistics();

});
