// ==================== MODERN TOAST SYSTEM ====================
function showNotification(message, type = "info") {
  // Create toast container if not exists
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 100%;
    word-wrap: break-word;
  `;
  // Add icon based on type
  const icon = document.createElement("span");
  icon.innerHTML = getToastIcon(type);
  icon.style.fontSize = "18px";
  toast.appendChild(icon);
  // Add message
  const messageEl = document.createElement("span");
  messageEl.textContent = message;
  messageEl.style.flex = "1";
  toast.appendChild(messageEl);
  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
  `;
  closeBtn.onclick = () => removeToast(toast);
  toast.appendChild(closeBtn);
  container.appendChild(toast);
  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 100);
  // Auto remove after delay
  const autoRemove = setTimeout(() => {
    removeToast(toast);
  }, 5000);
  // Pause auto-remove on hover
  toast.addEventListener('mouseenter', () => {
    clearTimeout(autoRemove);
  });
  toast.addEventListener('mouseleave', () => {
    setTimeout(() => {
      removeToast(toast);
    }, 3000);
  });
}
function getToastColor(type) {
  const colors = {
    success: "#27ae60",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db"
  };
  return colors[type] || colors.info;
}
function getToastIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };
  return icons[type] || icons.info;
}
function removeToast(toast) {
  toast.style.transform = "translateX(400px)";
  toast.style.opacity = "0";
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}
// ==================== LOADING SPINNER ====================
function showLoading(show = true) {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.style.display = show ? 'flex' : 'none';
  }
}
// ==================== CONNECTION STATUS ====================
function updateConnectionStatus() {
  const statusElement = document.getElementById("connection-status");
  if (!statusElement) return;
  const isOnline = navigator.onLine;
  if (isOnline) {
    statusElement.innerHTML = `✅ Online`;
    statusElement.style.background = "#27ae60";
  } else {
    statusElement.innerHTML = `❌ Offline`;
    statusElement.style.background = "#e74c3c";
  }
}
// ==================== DATE & TIME FUNCTIONS ====================
function formatTanggalIndonesia(date) {
  const hari = [
    "MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU",
  ];
  const bulan = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI",
    "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
  ];
  return `${hari[date.getDay()]}, ${date.getDate()} ${
    bulan[date.getMonth()]
  } ${date.getFullYear()}`;
}
function showDatePicker() {
  const tempInput = document.createElement("input");
  tempInput.type = "date";
  tempInput.style.display = "none";
  document.body.appendChild(tempInput);
  tempInput.onchange = function () {
    if (this.value) {
      const selectedDate = new Date(this.value);
      document.getElementById("date").value = formatTanggalIndonesia(selectedDate);
      draft.date = document.getElementById("date").value;
      saveDraft();
    }
    document.body.removeChild(tempInput);
  };
  if (tempInput.showPicker) {
    tempInput.showPicker();
  } else {
    tempInput.click();
  }
}
// ==================== STA FORMATTING ====================
function formatSTA(input) {
  let value = input.value.trim().toUpperCase();
  if (!value) return;
  const match = value.match(/^(\d+)\s*([A-Z]?)$/i); // Cocokkan angka dan opsional huruf (misalnya 1234R)
  if (!match) {
    // Jika tidak cocok dengan format dasar, jangan format dan biarkan validasi di tempat lain menangani
    return; // Tidak tampilkan notifikasi di sini
  }
  let angka = match[1].replace(/\D/g, ""); // Ambil hanya digit
  let arah = match[2] || ""; // Ambil arah (R/L) jika ada
  if (!angka) return;
  // Format: 123 -> 0+123, 1234 -> 1+234
  while (angka.length < 4) angka = "0" + angka; // Tambahkan leading zero hingga 4 digit
  const last3 = angka.slice(-3); // Ambil 3 digit terakhir
  const firstPart = angka.slice(0, -3) || "0"; // Ambil bagian depan, default ke 0 jika kosong
  input.value = `${firstPart}+${last3}${arah ? " " + arah.toUpperCase() : ""}`; // Setel nilai diformat
  // Update draft dan simpan setelah format diterapkan
  if (input.id === 'staAwal') {
    draft.staAwal = input.value;
  } else if (input.id === 'staAkhir') {
    draft.staAkhir = input.value;
  }
  saveDraft();
}

// ==================== LENGTH CALCULATION ====================
function calculateLength() {
  const staAwalInput = document.getElementById('staAwal');
  const staAkhirInput = document.getElementById('staAkhir');
  const panjangInput = document.getElementById('panjang');
  
  if (!staAwalInput.value || !staAkhirInput.value) {
    panjangInput.value = '';
    draft.panjang = '';
    saveDraft();
    return;
  }
  
  // Extract numeric values from STA format (X+XXX)
  const staAwalMatch = staAwalInput.value.match(/(\d+)\+(\d+)/);
  const staAkhirMatch = staAkhirInput.value.match(/(\d+)\+(\d+)/);
  
  if (!staAwalMatch || !staAkhirMatch) {
    panjangInput.value = 'Format STA tidak valid';
    draft.panjang = 'Format STA tidak valid';
    saveDraft();
    return;
  }
  
  // Convert to numeric values
  const staAwalValue = parseInt(staAwalMatch[1]) * 1000 + parseInt(staAwalMatch[2]);
  const staAkhirValue = parseInt(staAkhirMatch[1]) * 1000 + parseInt(staAkhirMatch[2]);
  
  // Calculate length in meters
  const length = Math.abs(staAkhirValue - staAwalValue);
  
  // Format to 2 decimal places with uppercase unit
  panjangInput.value = `${length.toFixed(2)} METER`;
  draft.panjang = panjangInput.value;
  saveDraft();
}

// ==================== FORMAT NUMBER + SATUAN ====================
// Fungsi yang diperbaiki untuk mengekstrak angka dan satuan
function formatNumberSatuan(inputValue) {
  // Bersihkan nilai dari spasi berlebih di awal/akhir
  let trimmedValue = inputValue.trim();
  if (!trimmedValue) {
    // Jika input kosong, kembalikan null untuk angka dan string kosong untuk satuan
    return { number: null, satuan: '' };
  }

  // Ubah ke huruf besar
  trimmedValue = trimmedValue.toUpperCase();
  
  // Pisahkan angka dan satuan
  // Cocokkan angka di awal (bisa desimal) dan satuan di akhir
  const match = trimmedValue.match(/^([\d.]+)\s*([A-Z0-9]+)?$/i);
  
  if (match) {
    const number = parseFloat(match[1]);
    let satuan = match[2] || '';
    
    // Normalisasi satuan umum
    if (satuan && satuan.toLowerCase() === 'm3') {
      satuan = 'M3';
    } else if (satuan && satuan.toLowerCase() === 'cbm') {
      satuan = 'CBM';
    }
    
    return { number, satuan };
  }
  
  // Jika tidak cocok dengan pola, coba ekstrak secara terpisah
  const numberMatch = trimmedValue.match(/^([\d.]+)/);
  const satuanMatch = trimmedValue.match(/([A-Z0-9]+)$/);
  
  const number = numberMatch ? parseFloat(numberMatch[1]) : null;
  let satuan = satuanMatch ? satuanMatch[1] : '';
  
  // Normalisasi satuan umum
  if (satuan && satuan.toLowerCase() === 'm3') {
    satuan = 'M3';
  } else if (satuan && satuan.toLowerCase() === 'cbm') {
    satuan = 'CBM';
  }
  
  return { number, satuan };
}

// ==================== CALCULATION FUNCTIONS ====================
function hitungDeviasi() {
  // Mendapatkan referensi elemen input
  const targetInput = document.getElementById("rencana");
  const realisasiInput = document.getElementById("realisasi");
  const deviasiInput = document.getElementById("deviasi");

  // Mendapatkan nilai string dari input
  const targetStr = targetInput.value;
  const realisasiStr = realisasiInput.value;

  // Reset deviasi jika salah satu input kosong
  if (!targetStr || !realisasiStr) {
    deviasiInput.value = "";
    deviasiInput.className = "deviasi-nol";
    draft.deviasi = ""; // Perbarui draft
    saveDraft(); // Simpan perubahan draft
    return;
  }

  // Ekstrak angka dan satuan menggunakan fungsi yang diperbaiki
  const { number: targetNum, satuan: targetSatuan } = formatNumberSatuan(targetStr);
  const { number: realisasiNum, satuan: realisasiSatuan } = formatNumberSatuan(realisasiStr);

  // Jika salah satu tidak valid sebagai angka, reset deviasi
  if (targetNum === null || realisasiNum === null) {
    deviasiInput.value = "";
    deviasiInput.className = "deviasi-nol";
    draft.deviasi = ""; // Perbarui draft
    saveDraft(); // Simpan perubahan draft
    return;
  }

  // Hitung deviasi
  const deviasi = realisasiNum - targetNum;

  // Tentukan satuan untuk hasil: prioritas realisasi, kemudian target
  let satuan = realisasiSatuan || targetSatuan || "";

  // Format angka dengan dua desimal
  const targetFormatted = targetNum.toFixed(2);
  const realisasiFormatted = realisasiNum.toFixed(2);
  const deviasiFormatted = Math.abs(deviasi).toFixed(2);

  // --- PEMFORMATAN INPUT DAN UPDATE DRAFT ---
  // Format input Rencana jika belum diformat (cek spasi sebagai indikator)
  if (targetSatuan) {
    targetInput.value = `${targetFormatted} ${targetSatuan}`;
  } else {
    targetInput.value = `${targetFormatted}`;
  }
  
  // Format input Realisasi jika belum diformat (cek spasi sebagai indikator)
  if (realisasiSatuan) {
    realisasiInput.value = `${realisasiFormatted} ${realisasiSatuan}`;
  } else {
    realisasiInput.value = `${realisasiFormatted}`;
  }

  // Update draft dengan nilai input yang sudah diformat
  draft.rencana = targetInput.value;
  draft.realisasi = realisasiInput.value;

  // Tentukan kelas dan nilai untuk input deviasi berdasarkan hasil perhitungan
  if (deviasi > 0) {
    if (satuan) {
      deviasiInput.value = `+${deviasiFormatted} ${satuan}`;
    } else {
      deviasiInput.value = `+${deviasiFormatted}`;
    }
    deviasiInput.className = "deviasi-positif";
  } else if (deviasi < 0) {
    if (satuan) {
      deviasiInput.value = `-${deviasiFormatted} ${satuan}`;
    } else {
      deviasiInput.value = `-${deviasiFormatted}`;
    }
    deviasiInput.className = "deviasi-negatif";
    // Tampilkan warning jika deviasi negatif dan masalah belum diisi
    const masalahInput = document.getElementById("masalah");
    if (!masalahInput.value.trim()) {
      showNotification('⚠️ Deviasi negatif! Silakan isi kolom MASALAH.', 'warning');
      masalahInput.style.borderColor = "#e74c3c";
      masalahInput.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.1)";
      setTimeout(() => {
        masalahInput.style.borderColor = "#e1e5e9";
        masalahInput.style.boxShadow = "none";
      }, 3000);
    }
  } else {
    // Jika deviasi nol
    if (satuan) {
      deviasiInput.value = `0.00 ${satuan}`;
    } else {
      deviasiInput.value = `0.00`;
    }
    deviasiInput.className = "deviasi-nol";
  }

  // Update draft dengan nilai deviasi yang telah dihitung dan diformat
  draft.deviasi = deviasiInput.value;
  saveDraft(); // Simpan semua perubahan ke draft
}

// ==================== VALIDATION FUNCTIONS ====================
function validateForm() {
  const errors = [];
  // Validasi jenis pekerjaan
  if (!draft.jenisPekerjaan) {
    errors.push('Jenis pekerjaan harus dipilih');
    document.getElementById('jenisPekerjaanSelect').style.borderColor = "#e74c3c";
  } else {
    document.getElementById('jenisPekerjaanSelect').style.borderColor = "#e1e5e9";
  }
  // Validasi deviasi negatif
  const deviasiInput = document.getElementById("deviasi");
  const masalahInput = document.getElementById("masalah");
  if (deviasiInput.value.includes('-') && !masalahInput.value.trim()) {
    errors.push('Kolom MASALAH harus diisi ketika deviasi negatif');
    masalahInput.style.borderColor = "#e74c3c";
    masalahInput.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.1)";
  } else {
    masalahInput.style.borderColor = "#e1e5e9";
    masalahInput.style.boxShadow = "none";
  }
  // Validasi bahan
  const bahanRows = document.querySelectorAll('.bahan-row');
  let hasValidBahan = false;
  bahanRows.forEach(row => {
    const materialSelect = row.querySelector('.material-select');
    if (materialSelect.value && materialSelect.value !== '') {
      hasValidBahan = true;
    } else {
      materialSelect.style.borderColor = "#e74c3c";
    }
  });
  if (!hasValidBahan) {
    errors.push('Pilih minimal satu material');
  } else {
    document.querySelectorAll('.material-select').forEach(select => {
      if (select.value && select.value !== '') {
        select.style.borderColor = "#e1e5e9";
      }
    });
  }
  return errors;
}
// ==================== MAIN APPLICATION FUNCTIONS ====================
// Data draft
let draft = {
    date: formatTanggalIndonesia(new Date()),
    jenisPekerjaan: '',
    staAwal: '',
    staAkhir: '',
    panjang: '',
    beforePhoto: null,
    afterPhoto: null,
    rencana: '',
    realisasi: '',
    deviasi: '',
    masalah: '',
    bahan: []
};

// Track selected materials to ensure each can only be selected once
let selectedMaterials = new Set();

let currentModalAction = null;
let currentMaterialRow = null;
let currentCameraType = null;
let cameraStream = null;

// Load draft from localStorage
window.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    setupEventListeners();
    setupConnectionMonitoring();
});

function setupConnectionMonitoring() {
  updateConnectionStatus();
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
}

function setupEventListeners() {
    // Event listeners untuk rencana dan realisasi
    const rencanaInput = document.getElementById('rencana');
    const realisasiInput = document.getElementById('realisasi');
    const masalahInput = document.getElementById('masalah');

    // Listener untuk menyimpan draft saat pengguna mengetik (input berubah)
    // Hanya untuk menyimpan draft sementara, tidak memicu perhitungan
    rencanaInput.addEventListener('input', () => {
        draft.rencana = rencanaInput.value; // Update draft sementara
        saveDraft(); // Simpan draft
    });
    realisasiInput.addEventListener('input', () => {
        draft.realisasi = realisasiInput.value; // Update draft sementara
        saveDraft(); // Simpan draft
    });

    // Listener untuk menghitung deviasi dan memformat saat pengguna selesai mengetik (kehilangan fokus)
    rencanaInput.addEventListener('blur', () => {
        hitungDeviasi(); // Hitung dan format
        // draft.rencana & draft.realisasi diperbarui di dalam hitungDeviasi
        // saveDraft() juga dipanggil di dalam hitungDeviasi
    });
    realisasiInput.addEventListener('blur', () => {
        hitungDeviasi(); // Hitung dan format
        // draft.realisasi & draft.rencana diperbarui di dalam hitungDeviasi
        // saveDraft() juga dipanggil di dalam hitungDeviasi
    });

    masalahInput.addEventListener('input', () => {
        draft.masalah = masalahInput.value;
        const deviasiInput = document.getElementById("deviasi");
        if (deviasiInput.value.includes('-') && masalahInput.value.trim()) {
            masalahInput.style.borderColor = "#28a745";
            masalahInput.style.boxShadow = "0 0 0 3px rgba(40, 167, 69, 0.1)";
            setTimeout(() => {
                masalahInput.style.borderColor = "#e1e5e9";
                masalahInput.style.boxShadow = "none";
            }, 2000);
        }
        saveDraft();
    });

    // Clear error on focus
    masalahInput.addEventListener('focus', () => {
        masalahInput.style.borderColor = "#e1e5e9";
        masalahInput.style.boxShadow = "none";
    });

    // Event listeners untuk STA
    document.getElementById('staAwal').addEventListener('blur', function() {
        formatSTA(this); // Panggil formatSTA secara eksplisit di sini
        // draft.staAwal = this.value; // Ambil nilai yang sudah diformat - DIPINDAHKAN KE formatSTA
        // saveDraft(); // Simpan draft - DIPINDAHKAN KE formatSTA
    });
    document.getElementById('staAkhir').addEventListener('blur', function() {
        formatSTA(this); // Panggil formatSTA secara eksplisit di sini
        // draft.staAkhir = this.value; // Ambil nilai yang sudah diformat - DIPINDAHKAN KE formatSTA
        // saveDraft(); // Simpan draft - DIPINDAHKAN KE formatSTA
    });

    // Event listener untuk jenis pekerjaan
    document.getElementById('jenisPekerjaanSelect').addEventListener('change', function() {
        const value = this.value;
        if (value === 'tambah-baru') {
            showTambahJenisPekerjaanModal();
            this.value = '';
        } else if (value) {
            draft.jenisPekerjaan = value;
            this.style.borderColor = "#e1e5e9";
            saveDraft();
            showNotification('Jenis pekerjaan dipilih: ' + value, 'success');
        }
    });

    // Clear error on change
    document.getElementById('jenisPekerjaanSelect').addEventListener('change', function() {
        if (this.value && this.value !== 'tambah-baru') {
            this.style.borderColor = "#e1e5e9";
        }
    });

    // Event listener untuk tanggal
    document.getElementById('date').addEventListener('click', showDatePicker);

    // Event listener untuk material select
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('material-select')) {
            const select = e.target;
            const value = select.value;
            
            // Show error if user tries to select an already selected material
            if (value && value !== '' && value !== 'tambah-baru' && selectedMaterials.has(value)) {
                // Check if this is actually a duplicate (not just the current selection)
                let count = 0;
                document.querySelectorAll('.material-select').forEach(s => {
                    if (s.value === value) count++;
                });
                
                if (count > 1) {
                    showNotification('Material ini sudah dipilih sebelumnya!', 'warning');
                    select.value = ''; // Reset the selection
                    select.style.borderColor = "#e74c3c";
                    return;
                }
            }
            
            if (value && value !== '') {
                select.style.borderColor = "#e1e5e9";
            }
            
            updateSatuan(select);
        }
    });

    // Hitung deviasi saat pertama kali load
    setTimeout(() => {
        hitungDeviasi();
        calculateLength();
    }, 100);
}

function loadDraft() {
    const saved = localStorage.getItem('dailyReportDraft');
    if (saved) {
        try {
            const parsedDraft = JSON.parse(saved);
            draft = { ...draft, ...parsedDraft };
            populateForm();
            showNotification('Draft berhasil dimuat', 'success');
        } catch (e) {
            console.error('Error loading draft:', e);
            showNotification('Gagal memuat draft', 'error');
        }
    } else {
        document.getElementById('date').value = draft.date;
    }
}

function populateForm() {
    document.getElementById('date').value = draft.date || '';
    document.getElementById('jenisPekerjaanSelect').value = draft.jenisPekerjaan || '';
    document.getElementById('staAwal').value = draft.staAwal || '';
    document.getElementById('staAkhir').value = draft.staAkhir || '';
    document.getElementById('panjang').value = draft.panjang || '';
    document.getElementById('rencana').value = draft.rencana || '';
    document.getElementById('realisasi').value = draft.realisasi || '';
    document.getElementById('deviasi').value = draft.deviasi || '';
    document.getElementById('masalah').value = draft.masalah || '';

    // Handle photos
    if (draft.beforePhoto) {
        showPhotoPreview('before', draft.beforePhoto);
    } else {
        showPhotoPreview('before', null);
    }
    if (draft.afterPhoto) {
        showPhotoPreview('after', draft.afterPhoto);
    } else {
        showPhotoPreview('after', null);
    }

    // Load bahan
    loadBahanData();
}

function showPhotoPreview(type, src) {
    const img = document.getElementById(`preview${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const noPhoto = document.getElementById(`noPhoto${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const photoActions = document.getElementById(`photoActions${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const previewContainer = document.getElementById(`previewContainer${type.charAt(0).toUpperCase() + type.slice(1)}`);

    if (src) {
        img.src = src;
        img.style.display = 'block';
        noPhoto.style.display = 'none';
        photoActions.classList.add('show');
        previewContainer.classList.add('has-photo');
    } else {
        img.style.display = 'none';
        noPhoto.style.display = 'block';
        photoActions.classList.remove('show');
        previewContainer.classList.remove('has-photo');
    }

    // Update draft
    draft[type + 'Photo'] = src;
    saveDraft();
}

function loadBahanData() {
    const container = document.getElementById('bahanContainer');
    container.innerHTML = '';
    selectedMaterials.clear(); // Clear the selected materials set
    
    if (draft.bahan && draft.bahan.length > 0) {
        draft.bahan.forEach(b => {
            // Add to selected materials
            if (b.material) {
                selectedMaterials.add(b.material);
            }
            addBahanRow(b.material, b.qty, b.satuan);
        });
    } else {
        addBahanRow();
    }
    
    // Update the options in all selects
    updateMaterialOptions();
}

function addBahanRow(material = '', qty = '', satuan = '') {
    const container = document.getElementById('bahanContainer');
    const row = document.createElement('div');
    row.className = 'bahan-row';
    row.innerHTML = `
        <select class="material-select" required>
            <option value="" disabled ${!material ? 'selected' : ''}>PILIH MATERIAL</option>
            <option value="SEMEN" ${material === 'SEMEN' ? 'selected' : ''}>SEMEN</option>
            <option value="PASIR" ${material === 'PASIR' ? 'selected' : ''}>PASIR</option>
            <option value="BATU PASANG" ${material === 'BATU PASANG' ? 'selected' : ''}>BATU PASANG</option>
            <option value="BATU PECAH" ${material === 'BATU PECAH' ? 'selected' : ''}>BATU PECAH</option>
            <option value="tambah-baru">➕ TAMBAH BARU</option>
        </select>
        <input type="text" class="qty-input" placeholder="QTY" value="${qty}">
        <input type="text" class="satuan-input" placeholder="SATUAN" readonly value="${satuan}">
        <button class="remove-row-btn">-</button>
    `;
    container.appendChild(row);
    
    // If a material was pre-selected, add it to the selected materials set
    if (material && material !== '' && material !== 'tambah-baru') {
        selectedMaterials.add(material);
    }
    
    // Update the material select options based on already selected materials
    updateMaterialOptions();
}

function updateMaterialOptions() {
    // Clear the selected materials set first
    selectedMaterials.clear();
    
    // Collect all currently selected materials
    const selects = document.querySelectorAll('.material-select');
    selects.forEach(select => {
        const value = select.value;
        if (value && value !== '' && value !== 'tambah-baru') {
            selectedMaterials.add(value);
        }
    });
    
    // Update all selects to disable already selected materials
    selects.forEach(select => {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            if (option.value !== '' && option.value !== 'tambah-baru') {
                option.disabled = selectedMaterials.has(option.value);
            }
        });
    });
}

function updateSatuan(select) {
    const value = select.value;
    const row = select.closest('.bahan-row');
    const satuanInput = row.querySelector('.satuan-input');
    
    if (value === 'tambah-baru') {
        showTambahMaterialModal(row);
        return;
    }
    
    // Update selected materials set
    updateSelectedMaterials();
    
    // Update the options in all selects
    updateMaterialOptions();
    
    const satuanMap = {
        'SEMEN': 'ZAK',
        'PASIR': 'M3',
        'BATU PASANG': 'M3',
        'BATU PECAH': 'M3'
    };
    satuanInput.value = satuanMap[value] || '';
    updateBahanData();
}

function updateSelectedMaterials() {
    selectedMaterials.clear();
    const selects = document.querySelectorAll('.material-select');
    selects.forEach(select => {
        const value = select.value;
        if (value && value !== '' && value !== 'tambah-baru') {
            selectedMaterials.add(value);
        }
    });
}

function updateBahanData() {
    draft.bahan = [];
    const rows = document.querySelectorAll('.bahan-row');
    rows.forEach(row => {
        const material = row.querySelector('.material-select').value;
        const qty = row.querySelector('.qty-input').value;
        const satuan = row.querySelector('.satuan-input').value;
        if (material && material !== 'tambah-baru') {
            draft.bahan.push({ material, qty, satuan });
        }
    });
    
    // Update selected materials set
    updateSelectedMaterials();
    
    // Update the options in all selects
    updateMaterialOptions();
    
    saveDraft();
}

function saveDraft() {
    try {
        localStorage.setItem('dailyReportDraft', JSON.stringify(draft));
    } catch (e) {
        console.error('Error saving draft:', e);
        showNotification('Gagal menyimpan draft', 'error');
    }
}

// ==================== LOCATION FUNCTIONS ====================
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const coords = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
                    
                    // Try to get location name using reverse geocoding
                    getLocationName(lat, lon)
                        .then(locationName => {
                            resolve(`${coords} (${locationName})`);
                        })
                        .catch(() => {
                            // If reverse geocoding fails, just return coordinates
                            resolve(coords);
                        });
                },
                error => {
                    console.error('Error getting location:', error);
                    resolve('Location not available');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            resolve('Geolocation not supported');
        }
    });
}

// Fungsi untuk mendapatkan nama lokasi dari koordinat
function getLocationName(lat, lon) {
    return new Promise((resolve, reject) => {
        // Using a simple reverse geocoding approach with Nominatim (OpenStreetMap)
        // Note: In a production environment, you might want to use a more robust service
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        
        // Since we can't make direct requests due to CORS, we'll use a simple approach
        // For now, we'll just return a generic location name
        // In a real implementation, you would use a proper reverse geocoding service
        
        // Simple approach: return a generic name based on coordinates
        resolve(`Location near ${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    });
}

// ==================== CAMERA FUNCTIONS ====================
function openCamera(type) {
    currentCameraType = type;
    const modal = document.getElementById('cameraModal');
    const title = document.getElementById('cameraTitle');
    title.textContent = `Ambil Foto ${type === 'before' ? 'Sebelum' : 'Sesudah'}`;
    modal.style.display = 'flex';
    startCamera();
}

async function startCamera() {
    try {
        document.getElementById('cameraLoading').style.display = 'block';
        document.getElementById('cameraError').style.display = 'none';
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            } 
        });
        const video = document.getElementById('cameraVideo');
        video.srcObject = cameraStream;
        document.getElementById('cameraLoading').style.display = 'none';
    } catch (err) {
        document.getElementById('cameraLoading').style.display = 'none';
        document.getElementById('cameraError').style.display = 'block';
        document.getElementById('cameraError').textContent = 
            'Gagal mengakses kamera: ' + err.message;
    }
}

function closeCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    document.getElementById('cameraModal').style.display = 'none';
}

async function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get location
    const location = await getCurrentLocation();
    
    // Get timestamp
    const timestamp = new Date().toLocaleString('id-ID');
    
    // Get STA values
    const staAwal = document.getElementById('staAwal').value || 'N/A';
    const staAkhir = document.getElementById('staAkhir').value || 'N/A';
    
    // Create two-line watermark
    const staText = `STA: ${staAwal}`;
    const infoText = `WAKTU: ${timestamp} | LOKASI: ${location}`;
    
    // Calculate watermark height for two lines (increased height to accommodate longer text)
    const watermarkHeight = 70;
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);
    
    context.fillStyle = 'white';
    context.textAlign = 'left';
    
    // First line: STA (larger and bold)
    context.font = 'bold 18px Arial';
    context.fillText(staText, 10, canvas.height - watermarkHeight + 25);
    
    // Second line: Timestamp and location
    context.font = '16px Arial';
    context.fillText(infoText, 10, canvas.height - watermarkHeight + 50);
    
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    savePhoto(currentCameraType, dataURL);
    // Close camera modal after taking photo with delay
    setTimeout(function() {
        closeCamera();
    }, 500); // Add slight delay to ensure photo is saved first
}

function savePhoto(type, dataURL) {
    draft[type + 'Photo'] = dataURL;
    showPhotoPreview(type, dataURL);
    saveDraft();
    showNotification(`Foto ${type === 'before' ? 'sebelum' : 'sesudah'} berhasil diambil`, 'success');
}

async function loadImage(input, type) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File terlalu besar. Maksimal 5MB.', 'warning');
        return;
    }
    showLoading(true);
    const reader = new FileReader();
    reader.onload = async e => {
        const img = new Image();
        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Get location
            const location = await getCurrentLocation();
            
            // Get timestamp
            const timestamp = new Date().toLocaleString('id-ID');
            
            // Get STA values
            const staAwal = document.getElementById('staAwal').value || 'N/A';
            const staAkhir = document.getElementById('staAkhir').value || 'N/A';
            
            // Create two-line watermark
            const staText = `STA: ${staAwal}`;
            const infoText = `WAKTU: ${timestamp} | LOKASI: ${location}`;
            
            // Calculate watermark height for two lines (increased height to accommodate longer text)
            const watermarkHeight = 70;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);
            
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            
            // First line: STA (larger and bold)
            ctx.font = 'bold 18px Arial';
            ctx.fillText(staText, 10, canvas.height - watermarkHeight + 25);
            
            // Second line: Timestamp and location
            ctx.font = '16px Arial';
            ctx.fillText(infoText, 10, canvas.height - watermarkHeight + 50);
            
            savePhoto(type, canvas.toDataURL('image/jpeg', 0.8));
            showLoading(false);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function viewPhoto(type) {
    const img = document.getElementById(`preview${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const viewImg = document.getElementById('photoViewImg');
    const modal = document.getElementById('photoViewModal');
    if (img.src) {
        viewImg.src = img.src;
        modal.style.display = 'flex';
    }
}

function closePhotoView() {
    document.getElementById('photoViewModal').style.display = 'none';
}

// ==================== MODAL FUNCTIONS ====================
function confirmRemovePhoto(type) {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Set danger class for remove photo
    modalContent.className = 'modal-content danger';
    
    document.getElementById('modalTitle').textContent = 'HAPUS FOTO';
    document.getElementById('modalText').textContent = `Apakah Anda yakin ingin menghapus foto ${type === 'before' ? 'sebelum' : 'sesudah'}? Tindakan ini tidak dapat dibatalkan.`;
    currentModalAction = () => {
        draft[type + 'Photo'] = null;
        showPhotoPreview(type, null); // Use function to update UI
        saveDraft();
        showNotification('Foto berhasil dihapus', 'info');
        closeModal();
    };
    modal.style.display = 'flex';
    // Ensure proper centering
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
}

function confirmGenerateReport() {
    const errors = validateForm();
    if (errors.length > 0) {
        errors.forEach(error => {
            showNotification(error, 'warning');
        });
        return;
    }
    
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Set success class for generate report
    modalContent.className = 'modal-content success';
    
    document.getElementById('modalTitle').textContent = 'GENERATE LAPORAN';
    document.getElementById('modalText').textContent = 'Apakah Anda yakin ingin menghasilkan laporan dalam bentuk PNG? Pastikan semua data sudah benar.';
    currentModalAction = () => {
        generateReport();
        closeModal();
    };
    modal.style.display = 'flex';
    // Ensure proper centering
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
}

function executeModalAction() {
    if (currentModalAction) {
        currentModalAction();
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    currentModalAction = null;
    
    // Reset to default styling
    const modalContent = modal.querySelector('.modal-content');
    modalContent.className = 'modal-content default';
}

// ==================== JENIS PEKERJAAN MODAL ====================
function showTambahJenisPekerjaanModal() {
    document.getElementById('newJenisPekerjaanInput').value = '';
    document.getElementById('modalJenisPekerjaan').style.display = 'flex';
    // Ensure proper centering
    document.getElementById('modalJenisPekerjaan').style.alignItems = 'center';
    document.getElementById('modalJenisPekerjaan').style.justifyContent = 'center';
    setTimeout(() => {
        document.getElementById('newJenisPekerjaanInput').focus();
    }, 100);
}

function closeJenisPekerjaanModal() {
    document.getElementById('modalJenisPekerjaan').style.display = 'none';
}

function addNewJenisPekerjaan() {
    const input = document.getElementById('newJenisPekerjaanInput');
    let value = input.value.trim().toUpperCase();
    if (!value) {
        showNotification('Masukkan jenis pekerjaan terlebih dahulu', 'warning');
        input.focus();
        return;
    }
    const select = document.getElementById('jenisPekerjaanSelect');
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    const tambahBaruOption = select.querySelector('option[value="tambah-baru"]');
    select.insertBefore(option, tambahBaruOption);
    select.value = value;
    draft.jenisPekerjaan = value;
    showNotification('Jenis pekerjaan baru berhasil ditambahkan', 'success');
    closeJenisPekerjaanModal();
    saveDraft();
}

// ==================== MATERIAL MODAL ====================
function showTambahMaterialModal(row) {
    document.getElementById('newMaterialInput').value = '';
    document.getElementById('newSatuanInput').value = '';
    document.getElementById('modalTambahMaterial').style.display = 'flex';
    // Ensure proper centering
    document.getElementById('modalTambahMaterial').style.alignItems = 'center';
    document.getElementById('modalTambahMaterial').style.justifyContent = 'center';
    currentMaterialRow = row;
}

function closeTambahMaterialModal() {
    document.getElementById('modalTambahMaterial').style.display = 'none';
    currentMaterialRow = null;
}

function addNewMaterial() {
    const input = document.getElementById('newMaterialInput');
    const satuanInput = document.getElementById('newSatuanInput');
    let value = input.value.trim().toUpperCase();
    let satuan = satuanInput.value.trim().toUpperCase();
    
    if (!value) {
        showNotification('Masukkan nama material terlebih dahulu', 'warning');
        return;
    }
    
    if (!currentMaterialRow) return;
    
    // Add the new material to the select dropdown
    const select = currentMaterialRow.querySelector('.material-select');
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    const tambahBaruOption = select.querySelector('option[value="tambah-baru"]');
    select.insertBefore(option, tambahBaruOption);
    select.value = value;
    
    // If a unit was provided, set it in the satuan input field
    if (satuan) {
        const satuanField = currentMaterialRow.querySelector('.satuan-input');
        satuanField.value = satuan;
    }
    
    updateBahanData();
    showNotification('Material baru berhasil ditambahkan', 'success');
    closeTambahMaterialModal();
}

function addRow() {
    addBahanRow();
    updateBahanData();
    showNotification('Baris bahan berhasil ditambahkan', 'success');
}

function removeRow(button) {
    const row = button.closest('.bahan-row');
    const rows = document.querySelectorAll('.bahan-row');
    
    // Remove the material from selected materials if it was selected
    const materialSelect = row.querySelector('.material-select');
    const selectedValue = materialSelect.value;
    if (selectedValue && selectedValue !== '' && selectedValue !== 'tambah-baru') {
        selectedMaterials.delete(selectedValue);
    }
    
    if (rows.length > 1) {
        row.remove();
        updateBahanData();
        showNotification('Baris bahan berhasil dihapus', 'info');
    } else {
        showNotification('Minimal satu baris harus ada', 'warning');
    }
    
    // Update the options in all selects
    updateMaterialOptions();
}

// ==================== REPORT GENERATION ====================
function generateReport() {
    showLoading(true);
    const preview = document.getElementById('preview');
    preview.innerHTML = buildReportHTML();
    preview.style.display = 'block';
    
    // Get device pixel ratio for better quality on mobile
    const pixelRatio = Math.min(window.devicePixelRatio || 2, 3);
    
    html2canvas(preview, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: preview.scrollWidth,
        height: preview.scrollHeight,
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        pixelRatio: pixelRatio // Use device pixel ratio for better quality
    }).then(canvas => {
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `laporan_harian_${dateStr}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showLoading(false);
        showNotification('Laporan PNG berhasil diunduh', 'success');
    }).catch(err => {
        console.error('Error generating report:', err);
        showLoading(false);
        showNotification('Gagal mengenerate laporan', 'error');
    });
}

function buildReportHTML() {
    const deviasiClass = getDeviasiClass(draft.deviasi);
    const deviasiColor = getDeviasiColor(draft.deviasi);
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;
    
    // Adjust styles for mobile
    const containerWidth = isMobile ? '100%' : '800px';
    const fontSize = isMobile ? '14px' : '16px';
    const titleFontSize = isMobile ? '20px' : '24px';
    const photoHeight = isMobile ? '150px' : '200px';
    
    return `
        <div style="font-family: Arial, sans-serif; max-width: ${containerWidth}; width: ${containerWidth}; margin: 0 auto; padding: 20px; background: white; border: 2px solid #333; box-sizing: border-box;">
            <div style="text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="color: #007bff; margin: 0; font-size: ${titleFontSize};">LAPORAN HARIAN PROYEK</h1>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Generated on ${new Date().toLocaleString('id-ID')}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: ${fontSize};">
                <tr>
                    <td style="width: 30%; padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">HARI/TANGGAL</td>
                    <td style="width: 70%; padding: 8px; border: 1px solid #ddd;">${draft.date || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">JENIS PEKERJAAN</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.jenisPekerjaan || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">STA. AWAL</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.staAwal || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">STA. AKHIR</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.staAkhir || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">PANJANG</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.panjang || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">RENCANA HARI INI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.rencana || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">REALISASI HARI INI</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${draft.realisasi || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">DEVIASI</td>
                    <td style="padding: 8px; border: 1px solid #ddd; color: ${deviasiColor}; font-weight: bold;">${draft.deviasi || '-'}</td>
                </tr>
            </table>
            ${draft.masalah ? `
            <div style="margin-bottom: 20px; font-size: ${fontSize};">
                <h3 style="color: #dc3545; margin-bottom: 10px; font-size: 16px;">MASALAH:</h3>
                <div style="padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
                    ${draft.masalah.replace(/\n/g, '<br>')}
                </div>
            </div>
            ` : ''}
            ${draft.bahan && draft.bahan.length > 0 ? `
            <div style="margin-bottom: 20px; font-size: ${fontSize};">
                <h3 style="color: #28a745; margin-bottom: 10px; font-size: 16px;">BAHAN YANG DIGUNAKAN:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #28a745; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">MATERIAL</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">QTY</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">SATUAN</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${draft.bahan.map(item => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.material}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.qty}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.satuan}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            <div style="${isMobile ? 'flex-direction: column; gap: 15px;' : 'display: flex; gap: 20px;'} margin-bottom: 20px;">
                ${draft.beforePhoto ? `
                <div style="${isMobile ? 'width: 100%;' : 'flex: 1;'}">
                    <h4 style="color: #666; margin-bottom: 8px; font-size: 14px;">FOTO SEBELUM</h4>
                    <img src="${draft.beforePhoto}" style="max-width: 100%; height: ${photoHeight}; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                ` : ''}
                ${draft.afterPhoto ? `
                <div style="${isMobile ? 'width: 100%;' : 'flex: 1;'}">
                    <h4 style="color: #666; margin-bottom: 8px; font-size: 14px;">FOTO SESUDAH</h4>
                    <img src="${draft.afterPhoto}" style="max-width: 100%; height: ${photoHeight}; object-fit: cover; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                ` : ''}
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ddd; color: #666; font-size: 12px;">
                <p>Laporan ini digenerate secara otomatis oleh Sistem Laporan Harian Proyek</p>
            </div>
        </div>
    `;
}

function getDeviasiClass(deviasi) {
    if (!deviasi) return '';
    if (deviasi.includes('+')) return 'positive';
    if (deviasi.includes('-')) return 'negative';
    return '';
}

function getDeviasiColor(deviasi) {
    if (!deviasi) return '#666';
    if (deviasi.includes('+')) return '#27ae60';
    if (deviasi.includes('-')) return '#e74c3c';
    return '#666';
}

// ==================== RESET FUNCTIONS ====================
function confirmReset() {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Set warning class for reset
    modalContent.className = 'modal-content warning';
    
    document.getElementById('modalTitle').textContent = 'RESET FORM';
    document.getElementById('modalText').textContent = 'Apakah Anda yakin ingin mereset semua data? Semua data yang telah diinput akan hilang secara permanen.';
    currentModalAction = () => {
        resetForm();
        closeModal();
    };
    modal.style.display = 'flex';
    // Ensure proper centering
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
}

function resetForm() {
    draft = {
        date: formatTanggalIndonesia(new Date()),
        jenisPekerjaan: '',
        staAwal: '',
        staAkhir: '',
        panjang: '',
        beforePhoto: null,
        afterPhoto: null,
        rencana: '',
        realisasi: '',
        deviasi: '',
        masalah: '',
        bahan: []
    };
    localStorage.removeItem('dailyReportDraft');
    populateForm();
    showNotification('Form berhasil direset', 'info');
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(e) {
    // Check if modal is open
    const modal = document.getElementById('modal');
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    }
    
    // Other shortcuts
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        confirmGenerateReport();
    }
    if (e.key === 'Escape') {
        closeModal();
        closeTambahMaterialModal();
        closeJenisPekerjaanModal();
        closeCamera();
        closePhotoView();
    }
});