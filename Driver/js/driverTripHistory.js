// Hàm xử lý lọc dữ liệu chuyến đi theo ngày và loại chuyến

document.getElementById("filterBtn").addEventListener("click", function () {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const tripType = document.getElementById("tripType").value;

  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const dateCell = row.cells[1].textContent.trim();
    const statusCell = row.cells[5].textContent.trim().toLowerCase();

    let showRow = true;

    // Kiểm tra ngày (định dạng mm/dd/yyyy)
    if (startDate) {
      const start = new Date(startDate);
      const tripDate = new Date(dateCell);
      if (tripDate < start) showRow = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      const tripDate = new Date(dateCell);
      if (tripDate > end) showRow = false;
    }

    // Kiểm tra loại chuyến (status)
    if (tripType) {
      if (tripType === "completed" && !statusCell.includes("completed")) showRow = false;
      else if (tripType === "in-progress" && !statusCell.includes("in progress")) showRow = false;
      else if (tripType === "cancelled" && !statusCell.includes("cancelled")) showRow = false;
    }

    row.style.display = showRow ? "" : "none";
  });
});
