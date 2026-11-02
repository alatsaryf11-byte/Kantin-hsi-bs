document.addEventListener("DOMContentLoaded", () => {


  const rawTransactions = [
    // 15 Okt
    { date: "2026-10-15", product: "Nasi Goreng", category: "Makanan", price: 10000, qty: 5 },
    { date: "2026-10-15", product: "Es Teh Manis", category: "Minuman", price: 3000, qty: 5 },
    // 16 Okt
    { date: "2026-10-16", product: "Mie Ayam", category: "Makanan", price: 8000, qty: 4 },
    { date: "2026-10-16", product: "Air Mineral", category: "Minuman", price: 4000, qty: 6 },
    // 17 Okt (Sesuai gambar - Omzet tinggi)
    { date: "2026-10-17", product: "Nasi Goreng", category: "Makanan", price: 10000, qty: 10 },
    { date: "2026-10-17", product: "Mie Ayam", category: "Makanan", price: 8000, qty: 5 },
    { date: "2026-10-17", product: "Es Teh Manis", category: "Minuman", price: 3000, qty: 10 },
    { date: "2026-10-17", product: "Pisang Goreng", category: "Snack", price: 3000, qty: 5 },
    // 18 Okt
    { date: "2026-10-18", product: "Nasi Uduk", category: "Makanan", price: 7000, qty: 8 },
    { date: "2026-10-18", product: "Air Mineral", category: "Minuman", price: 4000, qty: 8 },
    { date: "2026-10-18", product: "Tahu Isi", category: "Snack", price: 3000, qty: 10 },
    // 19 Okt
    { date: "2026-10-19", product: "Nasi Goreng", category: "Makanan", price: 10000, qty: 8 },
    { date: "2026-10-19", product: "Kopi Hitam", category: "Minuman", price: 5000, qty: 5 },
    { date: "2026-10-19", product: "Pisang Goreng", category: "Snack", price: 3000, qty: 10 },
    // 20 Okt
    { date: "2026-10-20", product: "Ayam Geprek", category: "Makanan", price: 15000, qty: 7 },
    { date: "2026-10-20", product: "Es Teh Manis", category: "Minuman", price: 3000, qty: 10 },
    { date: "2026-10-20", product: "Kentang Goreng", category: "Snack", price: 5000, qty: 6 },
    // 21 Okt
    { date: "2026-10-21", product: "Mie Ayam", category: "Makanan", price: 8000, qty: 9 },
    { date: "2026-10-21", product: "Air Mineral", category: "Minuman", price: 4000, qty: 12 },
    // 22 Okt
    { date: "2026-10-22", product: "Nasi Uduk", category: "Makanan", price: 7000, qty: 6 },
    { date: "2026-10-22", product: "Kopi Hitam", category: "Minuman", price: 5000, qty: 6 },
    { date: "2026-10-22", product: "Tahu Isi", category: "Snack", price: 3000, qty: 15 },
    // 23 Okt
    { date: "2026-10-23", product: "Nasi Goreng", category: "Makanan", price: 10000, qty: 12 },
    { date: "2026-10-23", product: "Ayam Geprek", category: "Makanan", price: 15000, qty: 5 },
    { date: "2026-10-23", product: "Es Teh Manis", category: "Minuman", price: 3000, qty: 15 },
    { date: "2026-10-23", product: "Pisang Goreng", category: "Snack", price: 3000, qty: 12 },
    // 24 Okt & 25 Okt (Di luar rentang gambar asli, tapi masuk database)
    { date: "2026-10-24", product: "Mie Ayam", category: "Makanan", price: 8000, qty: 5 },
    { date: "2026-10-24", product: "Es Teh Manis", category: "Minuman", price: 3000, qty: 5 },
    { date: "2026-10-25", product: "Nasi Uduk", category: "Makanan", price: 7000, qty: 4 },
    { date: "2026-10-25", product: "Air Mineral", category: "Minuman", price: 4000, qty: 4 }
  ];

  const promoData = [
    { emoji: "🍜", bgColor: "var(--ds-background-accent-blue-subtler)", title: "Senin Hemat", desc: "Mie Ayam cuma Rp7.000", badge: "SENIN", badgeClass: "blue" },
    { emoji: "🍳", bgColor: "var(--ds-background-accent-yellow-subtler)", title: "Paket Sarapan", desc: "Nasi Uduk + Es Teh Rp9.000", badge: "SETIAP HARI", badgeClass: "yellow" },
    { emoji: "🍌", bgColor: "var(--ds-background-accent-teal-subtler)", title: "Menu Baru", desc: "Pisang Goreng Coklat", badge: "MINGGU INI", badgeClass: "teal" },
    { emoji: "💧", bgColor: "var(--ds-background-accent-red-subtler)", title: "Jumat Berkah", desc: "Air mineral gratis tiap beli makanan", badge: "JUMAT", badgeClass: "red" }
  ];


  let state = {
    startDate: new Date(2026, 9, 15), // 15 Okt 2026
    endDate: new Date(2026, 9, 25),   // 25 Okt 2026
    categories: ['makanan', 'minuman', 'snack']
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatNum = (num) => new Intl.NumberFormat('id-ID').format(num);

  // Variabel Global untuk Chart & Table
  let chartBar, chartDn, table;

  // Fungsi Utama untuk Menghitung dan Memperbarui UI
  const updateDashboard = () => {
    // A. Filter Data Mentah Berdasarkan Tanggal & Kategori
    const filteredData = rawTransactions.filter(t => {
      const tDate = new Date(t.date);
      const matchDate = tDate >= state.startDate && tDate <= state.endDate;
      const matchCat = state.categories.includes(t.category.toLowerCase());
      return matchDate && matchCat;
    });

    // B. Kalkulasi KPI
    let totalOmzet = 0;
    let totalItems = 0;
    const totalTrx = filteredData.length;

    filteredData.forEach(t => {
      totalOmzet += (t.price * t.qty);
      totalItems += t.qty;
    });

    // Hitung rata-rata omzet per hari
    const diffTime = Math.abs(state.endDate - state.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 karena inklusif
    const avgOmzet = totalTrx > 0 ? (totalOmzet / diffDays) : 0;

    // C. Update DOM KPI
    document.getElementById("kOmzet").textContent = totalTrx > 0 ? formatRupiah(totalOmzet) : "Rp0";
    document.getElementById("cOmzet").textContent = totalTrx > 0 ? `Rata-rata ${formatRupiah(avgOmzet)} per hari` : "Belum ada data";

    document.getElementById("kItem").textContent = formatNum(totalItems);
    document.getElementById("cItem").textContent = `Dari ${Object.keys(groupByProduct(filteredData)).length} produk yang laku`;

    document.getElementById("kTrx").textContent = formatNum(totalTrx);
    document.getElementById("cTrx").textContent = `Dalam ${diffDays} hari`;

    // D. Agregasi Data untuk Grafik dan Tabel
    const dailyData = groupByDate(filteredData);
    const categoryData = groupByCategory(filteredData);
    const productData = groupByProduct(filteredData);

    // E. Update Charts
    updateCharts(dailyData, categoryData);

    // F. Update Tabel
    table.replaceData(Object.values(productData));
    document.getElementById("tCount").textContent = `${Object.keys(productData).length} produk`;

    // G. Update Label Tanggal di Header
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const startStr = state.startDate.toLocaleDateString('id-ID', options);
    const endStr = state.endDate.toLocaleDateString('id-ID', options);
    document.getElementById("dRange").textContent = `${startStr} - ${endStr} • ${state.categories.length} kategori • ${Object.keys(productData).length} produk`;
  };

  // Helper: Group by Date (Untuk Bar Chart)
  const groupByDate = (data) => {
    const result = {};
    data.forEach(t => {
      if (!result[t.date]) result[t.date] = 0;
      result[t.date] += (t.price * t.qty);
    });

    // Urutkan tanggal
    const sortedDates = Object.keys(result).sort((a, b) => new Date(a) - new Date(b));

    // Ambil label (dd Mmm) dan values
    const labels = sortedDates.map(d => {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit' });
    });
    const values = sortedDates.map(d => result[d]);

    return { labels, values };
  };

  // Helper: Group by Category (Untuk Doughnut Chart)
  const groupByCategory = (data) => {
    const result = { makanan: 0, minuman: 0, snack: 0 };
    data.forEach(t => {
      const cat = t.category.toLowerCase();
      if (result[cat] !== undefined) result[cat] += t.qty;
    });
    return [result.makanan, result.minuman, result.snack];
  };

  // Helper: Group by Product (Untuk Tabulator)
  const groupByProduct = (data) => {
    const result = {};
    data.forEach(t => {
      if (!result[t.product]) {
        result[t.product] = { produk: t.product, kategori: t.category, terjual: 0, omzet: 0 };
      }
      result[t.product].terjual += t.qty;
      result[t.product].omzet += (t.price * t.qty);
    });
    return result;
  };


  const btnTheme = document.getElementById("btnTheme");
  const htmlEl = document.documentElement;

  const getChartColors = () => {
    const isDark = htmlEl.getAttribute("data-color-mode") === "dark";
    return {
      text: isDark ? "#CECFD2" : "#292A2E", grid: isDark ? "#E3E4F21F" : "#0B120E24",
      brand: isDark ? "#4688EC" : "#357DE8", cat1: isDark ? "#4688EC" : "#357DE8",
      cat2: isDark ? "#94C748" : "#82B536", cat3: isDark ? "#C97CF4" : "#BF63F3",
      tooltipBg: isDark ? "#2B2C2F" : "#292A2E",
    };
  };

  const updateChartColors = () => {
    if (!chartBar || !chartDn) return;
    const colors = getChartColors();
    chartBar.data.datasets[0].backgroundColor = colors.brand;
    chartBar.options.scales.y.grid.color = colors.grid;
    chartBar.options.scales.y.ticks.color = colors.text;
    chartBar.options.scales.x.ticks.color = colors.text;
    chartBar.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
    chartBar.update();

    chartDn.data.datasets[0].backgroundColor = [colors.cat1, colors.cat2, colors.cat3];
    chartDn.options.plugins.legend.labels.color = colors.text;
    chartDn.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
    chartDn.update();
  };

  const updateThemeUI = (mode) => {
    if (mode === "dark") {
      btnTheme.querySelector("span").textContent = "Mode terang";
      btnTheme.querySelector("svg").innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
    } else {
      btnTheme.querySelector("span").textContent = "Mode gelap";
      btnTheme.querySelector("svg").innerHTML = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
    }
  };

  let currentMode = htmlEl.getAttribute("data-color-mode");
  updateThemeUI(currentMode);

  btnTheme.addEventListener("click", () => {
    currentMode = currentMode === "light" ? "dark" : "light";
    htmlEl.setAttribute("data-color-mode", currentMode);
    localStorage.setItem("kantin-color-mode", currentMode);
    updateThemeUI(currentMode);
    updateChartColors();
  });

  // Flatpickr (Date Range)
  flatpickr(document.getElementById("fDate"), {
    mode: "range",
    dateFormat: "d M Y",
    locale: "id",
    defaultDate: [state.startDate, state.endDate],
    onChange: function (selectedDates) {
      if (selectedDates.length === 2) {
        state.startDate = selectedDates[0];
        state.endDate = selectedDates[1];
        updateDashboard(); // Triggers full recalculation
      }
    }
  });

  // Tom Select (Kategori)
  new TomSelect("#fKat", {
    plugins: ['remove_button'],
    options: [
      { value: 'makanan', text: 'Makanan' },
      { value: 'minuman', text: 'Minuman' },
      { value: 'snack', text: 'Snack' }
    ],
    items: ['makanan', 'minuman', 'snack'],
    onChange: function (values) {
      state.categories = values;
      updateDashboard(); // Triggers full recalculation
    }
  });

  // Floating UI (Tooltip)
  const tooltip = document.getElementById('tooltip');
  document.querySelectorAll('[data-tip]').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      tooltip.textContent = btn.getAttribute('data-tip');
      tooltip.style.opacity = '1';
      const { computePosition, offset, flip, shift } = FloatingUIDOM;
      computePosition(btn, tooltip, { placement: 'top', middleware: [offset(8), flip(), shift({ padding: 8 })] })
        .then(({ x, y }) => { Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` }); });
    });
    btn.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  });


  const colors = getChartColors();

  // Setup Chart Kosong terlebih dahulu
  chartBar = new Chart(document.getElementById('cBar').getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Omzet', data: [], backgroundColor: colors.brand, borderRadius: 4, barThickness: 24 }] },
    options: {
      responsive: true, maintainAspectRatio: false, resizeDelay: 100,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: colors.tooltipBg, callbacks: { label: (ctx) => formatRupiah(ctx.raw) } } },
      scales: {
        y: { beginAtZero: true, border: { display: false }, grid: { color: colors.grid, drawTicks: false }, ticks: { color: colors.text, callback: (v) => v === 0 ? '0rb' : (v / 1000) + 'rb' } },
        x: { border: { display: false }, grid: { display: false }, ticks: { color: colors.text } }
      }
    }
  });

  chartDn = new Chart(document.getElementById('cDn').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Makanan', 'Minuman', 'Snack'], datasets: [{ data: [0, 0, 0], backgroundColor: [colors.cat1, colors.cat2, colors.cat3], borderWidth: 0, hoverOffset: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false, resizeDelay: 100, cutout: '70%', layout: { padding: 10 },
      plugins: { legend: { position: 'bottom', labels: { color: colors.text, usePointStyle: true, boxWidth: 8, padding: 20 } }, tooltip: { backgroundColor: colors.tooltipBg } }
    }
  });

  const updateCharts = (dailyData, categoryData) => {
    // Update Bar
    chartBar.data.labels = dailyData.labels;
    chartBar.data.datasets[0].data = dailyData.values;
    chartBar.update();

    // Update Doughnut
    chartDn.data.datasets[0].data = categoryData;
    chartDn.update();
  };

  // Tabulator
  table = new Tabulator("#tProd", {
    data: [], layout: "fitColumns", placeholder: "Tidak ada data produk", headerSort: true,
    columns: [
      { title: "Produk", field: "produk", headerFilter: "input", headerFilterPlaceholder: "Cari produk...", width: 150 },
      {
        title: "Kategori", field: "kategori", formatter: function (cell) {
          const val = cell.getValue(); let colorClass = "blue";
          if (val === "Minuman") colorClass = "green"; if (val === "Snack") colorClass = "purple";
          return `<span class="lozenge ${colorClass}">${val}</span>`;
        }
      },
      { title: "Terjual", field: "terjual", hozAlign: "right", formatter: (cell) => `<span class="num">${cell.getValue()}</span>` },
      { title: "Omzet", field: "omzet", hozAlign: "right", formatter: (cell) => `<span class="num">${formatRupiah(cell.getValue())}</span>` },
      {
        title: "", field: "action", hozAlign: "center", headerSort: false, width: 50,
        formatter: () => `<button class="icon-btn del"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/></svg></button>`,
        cellClick: function (e, cell) {
          Swal.fire({
            customClass: { popup: 'ads-modal', confirmButton: 'btn danger', cancelButton: 'btn subtle' },
            title: 'Hapus produk?', html: `Apakah Anda yakin ingin menghapus <b>${cell.getRow().getData().produk}</b> dari daftar?`,
            showCancelButton: true, confirmButtonText: 'Hapus', cancelButtonText: 'Batal', buttonsStyling: false, reverseButtons: true
          }).then((res) => {
            if (res.isConfirmed) {
              cell.getRow().delete();
              Swal.fire({ customClass: { popup: 'ads-flag' }, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, icon: 'success', title: 'Produk berhasil dihapus' });
            }
          });
        }
      }
    ],
    footer: true
  });


  updateDashboard();

  const promoContainer = document.getElementById("promo");
  document.getElementById("pCount").textContent = `${promoData.length} aktif`;
  promoData.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="p-emoji" style="background: ${p.bgColor}">${p.emoji}</div>
      <div class="p-body"><b>${p.title}</b><small>${p.desc}</small></div>
      <span class="lozenge ${p.badgeClass}">${p.badge}</span>
    `;
    promoContainer.appendChild(li);
  });

});