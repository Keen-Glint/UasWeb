        // Fungsi untuk menampilkan halaman
        function showPage(pageId) {
            // Sembunyikan semua halaman
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Tampilkan halaman yang dipilih
            document.getElementById(pageId).classList.add('active');
            
            // Scroll ke atas
            window.scrollTo(0, 0);
        }

        // Inisialisasi modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));

        // Form submission handlers (hanya UI, tidak menyimpan ke localStorage)
        document.getElementById('pesertaForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('modalMessage').textContent = 'Pendaftaran qurban berhasil disimpan.';
            successModal.show();
            this.reset();
        });

        document.getElementById('potonganForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('modalMessage').textContent = 'Data potongan gaji berhasil disimpan.';
            successModal.show();
            this.reset();
            document.getElementById('namaPeserta').value = '';
            document.getElementById('jenisHewanPotong').value = '';
        });

        // Search button handler
        document.getElementById('searchBtn').addEventListener('click', function() {
            const nip = document.getElementById('searchNip').value;
            if (nip) {
                document.getElementById('namaPeserta').value = "Contoh Nama Peserta";
                document.getElementById('jenisHewanPotong').value = "Sapi (1/7)";
            } else {
                document.getElementById('modalMessage').textContent = 'Silakan masukkan NIP untuk mencari peserta.';
                successModal.show();
            }
        });

        // Generate report button handler
        document.getElementById('generateReportBtn').addEventListener('click', function() {
            // Data contoh untuk laporan
            const today = new Date();
            document.getElementById('totalPeserta').textContent = "15";
            document.getElementById('totalPotongan').textContent = "Rp 5.250.000";
            document.getElementById('estimasiHewan').textContent = "2 Sapi, 11 Kambing";
            document.getElementById('reportDate').textContent = today.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Contoh data tabel
            const reportData = [
                {
                    nip: "197001011987031001",
                    nama: "Dr. Ahmad Syafri, M.Pd",
                    unitKerja: "FIP",
                    jenisHewan: "Sapi (1/7)",
                    totalPotongan: 600000,
                    status: "Lunas"
                },
                {
                    nip: "197502151994022001",
                    nama: "Dra. Budi Lestari, M.Si",
                    unitKerja: "FMIPA",
                    jenisHewan: "Kambing (1/1)",
                    totalPotongan: 300000,
                    status: "Lunas"
                },
                {
                    nip: "198003122000032002",
                    nama: "Dr. Citra Dewi, M.Kom",
                    unitKerja: "FT",
                    jenisHewan: "Kambing (1/1)",
                    totalPotongan: 150000,
                    status: "Proses (6/12)"
                }
            ];
            
            // Isi tabel
            const tableBody = document.getElementById('reportTableBody');
            tableBody.innerHTML = '';
            
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
            
            document.getElementById('modalMessage').textContent = 'Laporan berhasil digenerate dengan data contoh.';
            successModal.show();
        });

        // Print button handler
        document.getElementById('printReportBtn').addEventListener('click', function() {
            window.print();
        });