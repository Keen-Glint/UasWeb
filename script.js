document.addEventListener('DOMContentLoaded', function() {
    // Initialize data in localStorage if not exists
    if (!localStorage.getItem('pesertaQurban')) {
        localStorage.setItem('pesertaQurban', JSON.stringify([]));
    }
    if (!localStorage.getItem('potonganGaji')) {
        localStorage.setItem('potonganGaji', JSON.stringify([]));
    }

    // Form elements
    const pesertaForm = document.getElementById('pesertaForm');
    const potonganForm = document.getElementById('potonganForm');
    const searchBtn = document.getElementById('searchBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const printReportBtn = document.getElementById('printReportBtn');

    // Modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    // Fungsi untuk menampilkan data peserta
    function displayPesertaData() {
        const pesertaList = JSON.parse(localStorage.getItem('pesertaQurban'));
        const pesertaTableBody = document.getElementById('pesertaTableBody');
        
        pesertaTableBody.innerHTML = '';
        
        if (pesertaList.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" class="text-center">Belum ada data peserta</td>`;
            pesertaTableBody.appendChild(row);
            return;
        }
        
        pesertaList.forEach((peserta, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${peserta.nip}</td>
                <td>${peserta.nama}</td>
                <td>${peserta.unitKerja}</td>
                <td>${peserta.jenisHewan}</td>
                <td>${peserta.tanggalDaftar}</td>
            `;
            pesertaTableBody.appendChild(row);
        });
    }

    // Fungsi untuk menampilkan data potongan gaji
    function displayPotonganData() {
        const potonganList = JSON.parse(localStorage.getItem('potonganGaji'));
        const potonganTableBody = document.getElementById('potonganTableBody');
        
        potonganTableBody.innerHTML = '';
        
        if (potonganList.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" class="text-center">Belum ada data potongan</td>`;
            potonganTableBody.appendChild(row);
            return;
        }
        
        potonganList.forEach((potongan, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${potongan.nip}</td>
                <td>${potongan.bulan} ${potongan.tahun}</td>
                <td>Rp ${potongan.nominal.toLocaleString('id-ID')}</td>
                <td>${potongan.jenisHewan}</td>
                <td>${potongan.tanggalInput}</td>
            `;
            potonganTableBody.appendChild(row);
        });
    }

    // Panggil fungsi display saat halaman dimuat
    displayPesertaData();
    displayPotonganData();

    // Peserta Form Submission
    pesertaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pesertaData = {
            nama: document.getElementById('nama').value,
            nip: document.getElementById('nip').value,
            email: document.getElementById('email').value,
            noHp: document.getElementById('noHp').value,
            unitKerja: document.getElementById('unitKerja').value,
            jenisHewan: document.getElementById('jenisHewan').value,
            alamat: document.getElementById('alamat').value,
            tanggalDaftar: new Date().toLocaleDateString('id-ID')
        };
        
        // Save to localStorage
        const pesertaList = JSON.parse(localStorage.getItem('pesertaQurban'));
        pesertaList.push(pesertaData);
        localStorage.setItem('pesertaQurban', JSON.stringify(pesertaList));
        
        // Show success message
        document.getElementById('modalMessage').textContent = 'Pendaftaran qurban berhasil disimpan.';
        successModal.show();
        
        // Reset form dan update tampilan
        pesertaForm.reset();
        displayPesertaData();
    });

    // Search Participant
    searchBtn.addEventListener('click', function() {
        const nip = document.getElementById('searchNip').value;
        const pesertaList = JSON.parse(localStorage.getItem('pesertaQurban'));
        
        const peserta = pesertaList.find(p => p.nip === nip);
        
        if (peserta) {
            document.getElementById('namaPeserta').value = peserta.nama;
            document.getElementById('jenisHewanPotong').value = peserta.jenisHewan;
        } else {
            document.getElementById('modalMessage').textContent = 'Peserta dengan NIP tersebut tidak ditemukan.';
            successModal.show();
            document.getElementById('namaPeserta').value = '';
            document.getElementById('jenisHewanPotong').value = '';
        }
    });

    // Potongan Form Submission
    potonganForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const potonganData = {
            nip: document.getElementById('searchNip').value,
            bulan: document.getElementById('bulanPotong').value,
            tahun: document.getElementById('tahunPotong').value,
            nominal: parseInt(document.getElementById('nominalPotong').value),
            jenisHewan: document.getElementById('jenisHewanPotong').value,
            tanggalInput: new Date().toLocaleDateString('id-ID')
        };
        
        // Save to localStorage
        const potonganList = JSON.parse(localStorage.getItem('potonganGaji'));
        potonganList.push(potonganData);
        localStorage.setItem('potonganGaji', JSON.stringify(potonganList));
        
        // Show success message
        document.getElementById('modalMessage').textContent = 'Data potongan gaji berhasil disimpan.';
        successModal.show();
        
        // Reset form dan update tampilan
        potonganForm.reset();
        document.getElementById('namaPeserta').value = '';
        document.getElementById('jenisHewanPotong').value = '';
        displayPotonganData();
    });

    // Generate Report
    generateReportBtn.addEventListener('click', function() {
        const pesertaList = JSON.parse(localStorage.getItem('pesertaQurban'));
        const potonganList = JSON.parse(localStorage.getItem('potonganGaji'));
        
        // Calculate totals
        const totalPeserta = pesertaList.length;
        let totalPotongan = 0;
        let sapiCount = 0;
        let kambingCount = 0;
        
        // Process each participant
        const reportData = pesertaList.map(peserta => {
            // Find all deductions for this participant
            const pesertaPotongan = potonganList.filter(p => p.nip === peserta.nip);
            const totalPotonganPeserta = pesertaPotongan.reduce((sum, p) => sum + p.nominal, 0);
            
            // Add to totals
            totalPotongan += totalPotonganPeserta;
            
            // Count animals
            if (peserta.jenisHewan.includes('Sapi')) {
                sapiCount++;
            } else if (peserta.jenisHewan.includes('Kambing')) {
                kambingCount++;
            }
            
            // Determine status
            let status = 'Belum Lunas';
            if (pesertaPotongan.length >= 12) {
                status = 'Lunas';
            } else if (pesertaPotongan.length > 0) {
                status = `Proses (${pesertaPotongan.length}/12)`;
            }
            
            return {
                nip: peserta.nip,
                nama: peserta.nama,
                unitKerja: peserta.unitKerja,
                jenisHewan: peserta.jenisHewan,
                totalPotongan: totalPotonganPeserta,
                status: status
            };
        });
        
        // Update summary
        document.getElementById('totalPeserta').textContent = totalPeserta;
        document.getElementById('totalPotongan').textContent = `Rp ${totalPotongan.toLocaleString('id-ID')}`;
        document.getElementById('estimasiHewan').textContent = `${sapiCount} Sapi, ${kambingCount} Kambing`;
        
        // Update report date
        const today = new Date();
        document.getElementById('reportDate').textContent = today.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Populate table
        const tableBody = document.getElementById('reportTableBody');
        tableBody.innerHTML = '';
        
        if (reportData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="7" class="text-center">Belum ada data laporan</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        reportData.forEach((data, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.nip}</td>
                <td>${data.nama}</td>
                <td>${data.unitKerja}</td>
                <td>${data.jenisHewan}</td>
                <td>Rp ${data.totalPotongan.toLocaleString('id-ID')}</td>
                <td>${data.status}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        document.getElementById('modalMessage').textContent = 'Laporan berhasil digenerate.';
        successModal.show();
    });

    // Print Report
    printReportBtn.addEventListener('click', function() {
        window.print();
    });

    // Sample data for demonstration
    if (JSON.parse(localStorage.getItem('pesertaQurban')).length === 0) {
        const samplePeserta = [
            {
                nama: "Dr. Ahmad Syafri, M.Pd",
                nip: "197001011987031001",
                email: "ahmad.syafri@unp.ac.id",
                noHp: "081234567890",
                unitKerja: "FIP",
                jenisHewan: "Sapi (1/7)",
                alamat: "Jl. Pendidikan No. 10, Padang",
                tanggalDaftar: "01/01/2026"
            },
            {
                nama: "Dra. Budi Lestari, M.Si",
                nip: "197502151994022001",
                email: "budi.lestari@unp.ac.id",
                noHp: "082345678901",
                unitKerja: "FMIPA",
                jenisHewan: "Kambing (1/1)",
                alamat: "Jl. Mawar No. 5, Padang",
                tanggalDaftar: "15/01/2026"
            }
        ];
        localStorage.setItem('pesertaQurban', JSON.stringify(samplePeserta));
        displayPesertaData();
    }

    if (JSON.parse(localStorage.getItem('potonganGaji')).length === 0) {
        const samplePotongan = [
            {
                nip: "197001011987031001",
                bulan: "Januari",
                tahun: "2026",
                nominal: 500000,
                jenisHewan: "Sapi (1/7)",
                tanggalInput: "05/01/2026"
            },
            {
                nip: "197502151994022001",
                bulan: "Januari",
                tahun: "2026",
                nominal: 300000,
                jenisHewan: "Kambing (1/1)",
                tanggalInput: "05/01/2026"
            }
        ];
        localStorage.setItem('potonganGaji', JSON.stringify(samplePotongan));
        displayPotonganData();
    }
});