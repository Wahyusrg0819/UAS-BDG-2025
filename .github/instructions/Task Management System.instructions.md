---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

Sebagai AI coding assistant yang akurat, tolong breakdown project web ini menjadi task-task kecil yang spesifik:

Project: Project visualisasi database neo4j
Deskripsi: Aplikasi web untuk visualisasi database Neo4j yang memungkinkan pengguna untuk melihat dan mengelola data dalam bentuk grafis interaktif.
Tech Stack: D3.js, Neo4j, Popoto.js, dan JavaScript

Untuk setiap task, berikan:
1. Deskripsi task yang jelas dan spesifik
2. Dependencies yang dibutuhkan
3. File yang akan dimodifikasi/dibuat
4. Kriteria selesai yang terukur
5. Estimasi kompleksitas (rendah/sedang/tinggi)

Jangan implementasi apapun dulu, fokus pada perencanaan yang detail.

## Context Management
Sebelum membuat perubahan apapun, analisis codebase ini:

1. Identifikasi arsitektur dan pola yang sudah ada
2. List semua dependencies dan versinya
3. Dokumentasikan konvensi naming dan struktur folder
4. Catat konfigurasi build dan environment
5. Identifikasi potensi konflik atau breaking changes

Berikan ringkasan dalam format checklist sebelum melanjutkan ke implementasi.

## Code Review
Sebelum menyelesaikan implementasi, lakukan review komprehensif:

1. **Keamanan**: Periksa potensi XSS, SQL injection, dan vulnerabilities lainnya
2. **Performance**: Identifikasi bottleneck dan optimasi yang diperlukan  
3. **Compatibility**: Pastikan kompatibilitas dengan browser dan dependencies
4. **Error Handling**: Verifikasi semua edge cases tertangani
5. **Testing**: Buat test cases untuk fungsi yang dibuat

Jangan lanjut implementasi sampai semua poin ini clear.

## Incremental Development

Implementasi task ini secara incremental:

Task: Project visualisasi database neo4j

Langkah implementasi:
1. Buat minimal viable version dulu
2. Test fungsionalitas dasar
3. Tambahkan error handling
4. Optimasi dan refactor
5. Final testing

Setelah setiap langkah, tanyakan konfirmasi sebelum lanjut ke langkah berikutnya.

## Domain-Specific Context

Sebagai expert web developer, pastikan implementasi mengikuti best practices:

Frontend:
- Responsive design principles
- Accessibility standards (WCAG)
- SEO optimization
- Performance optimization (lazy loading, code splitting)

Backend:
- RESTful API design
- Database optimization
- Security headers
- Error logging dan monitoring

Validasi setiap implementasi terhadap checklist ini.

## Dependency Management

Sebelum menambah atau mengubah dependencies:

1. Periksa kompatibilitas dengan existing packages
2. Verifikasi security vulnerabilities
3. Cek ukuran bundle impact
4. Dokumentasikan alasan pemilihan package
5. Sediakan alternatif jika package tidak tersedia

Berikan justifikasi untuk setiap dependency yang ditambahkan.

## Error Prevention

Sebelum implementasi, identifikasi dan cegah error umum:

1. **Type Safety**: Gunakan TypeScript strict mode
2. **Null/Undefined**: Handle semua kemungkinan null values
3. **Async Operations**: Proper error handling untuk promises
4. **State Management**: Prevent race conditions dan memory leaks
5. **API Calls**: Implement retry logic dan timeout

Buat checklist khusus untuk project ini berdasarkan tech stack yang digunakan.

## Documentation

Selama development, maintain dokumentasi:

1. Update README dengan setup instructions
2. Dokumentasikan API endpoints dan schemas
3. Buat comments untuk complex logic
4. Update changelog untuk setiap major change
5. Dokumentasikan environment variables dan configuration

Pastikan dokumentasi selalu sync dengan kode actual.

