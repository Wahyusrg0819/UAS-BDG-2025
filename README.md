# 🍳 Neo4j Recipe Database Visualization

Aplikasi web untuk visualisasi database Neo4j yang memungkinkan pengguna untuk melihat dan mengelola data resep masakan dalam bentuk grafis interaktif menggunakan Popoto.js.

## 📋 Deskripsi Project

Project ini adalah aplikasi visualisasi database Neo4j yang fokus pada data resep masakan. Aplikasi ini memungkinkan pengguna untuk:

- 🔍 Explore database resep masakan secara visual dan interaktif
- 👨‍🍳 Melihat hubungan antara Chef, Recipe, Country, dan Category
- 📊 Mencari dan memfilter data berdasarikan berbagai kriteria
- 🔗 Melihat query Cypher yang di-generate secara otomatis
- 📱 Interface yang responsive dan user-friendly

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Visualization**: [Popoto.js](https://github.com/Nhogs/popoto) v2.6.2
- **Graphics**: [D3.js](https://d3js.org/) v7.8.5
- **Database**: Neo4j
- **Driver**: Neo4j Driver Lite v5.14.0

## 📊 Database Schema

Database ini terdiri dari 4 entitas utama:

### Nodes
- **Recipe**: `{id, nama, waktu_masak, tingkat_kesulitan, kalori}`
- **Chef**: `{nama, kebangsaan, tahun_lahir}`
- **Country**: `{nama}`
- **Category**: `{nama}`

### Relationships
- **CREATED_BY**: Recipe → Chef
- **ORIGINATED_FROM**: Recipe → Country
- **BELONGS_TO**: Recipe → Category
- **FROM_COUNTRY**: Chef → Country

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14 atau lebih baru
- Neo4j database (local atau cloud)
- Web server (untuk development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd neo4j-recipe-visualization
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Database
Edit file `script.js` dan sesuaikan konfigurasi Neo4j:

```javascript
const CONFIG = {
    neo4j: {
        uri: "neo4j+s://your-neo4j-instance.databases.neo4j.io",
        username: "your-username",
        password: "your-password"
    }
};
```

### 4. Import Data ke Neo4j
Gunakan file CSV di folder `dataset/` untuk mengimport data:

```cypher
// Import Countries
LOAD CSV WITH HEADERS FROM 'file:///countries.csv' AS row
CREATE (c:Country {nama: row.nama})

// Import Categories  
LOAD CSV WITH HEADERS FROM 'file:///categories.csv' AS row
CREATE (cat:Category {nama: row.nama})

// Import Chefs
LOAD CSV WITH HEADERS FROM 'file:///chefs.csv' AS row
CREATE (chef:Chef {
    nama: row.nama_koki,
    kebangsaan: row.kebangsaan_koki,
    tahun_lahir: toInteger(row.tahun_lahir_koki)
})

// Import Recipes
LOAD CSV WITH HEADERS FROM 'file:///recipes.csv' AS row
CREATE (r:Recipe {
    id: row.id_resep,
    nama: row.nama_resep,
    waktu_masak: toInteger(row.waktu_masak_menit),
    tingkat_kesulitan: row.tingkat_kesulitan,
    kalori: toInteger(row.kalori)
})

// Create relationships using relationships.csv
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS row
MATCH (r:Recipe {id: row.id_resep})
MATCH (chef:Chef {nama: row.nama_koki})
MATCH (country:Country {nama: row.negara_asal})
MATCH (category:Category {nama: row.kategori})
MERGE (r)-[:CREATED_BY]->(chef)
MERGE (r)-[:ORIGINATED_FROM]->(country)
MERGE (r)-[:BELONGS_TO]->(category)
MERGE (chef)-[:FROM_COUNTRY]->(country)
```

### 5. Run Development Server
```bash
npm run serve
```

Aplikasi akan berjalan di `http://localhost:8080`

## 🎯 Fitur Utama

### 1. Interactive Graph Visualization
- Drag & drop nodes untuk explore relationships
- Zoom in/out dan pan untuk navigasi
- Click pada node untuk expand connections
- Visual node differentiation berdasarkan entity type

### 2. Smart Search & Filtering
- Search berdasarkan nama recipe, chef, country, atau category
- Filter berdasarkan tingkat kesulitan, waktu masak, kalori
- Real-time result updates

### 3. Auto-Generated Cypher Query
- Lihat query Cypher yang di-generate secara otomatis
- Copy query untuk digunakan di Neo4j Browser
- Educational purpose untuk belajar Cypher

### 4. Rich Result Display
- **Recipe Cards**: Menampilkan nama, waktu masak, tingkat kesulitan, kalori
- **Chef Cards**: Menampilkan nama, kebangsaan, umur
- **Country Cards**: Menampilkan nama negara
- **Category Cards**: Menampilkan kategori masakan

### 5. Responsive Design
- Mobile-friendly interface
- Fullscreen mode untuk graph visualization
- Print-friendly layout

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, glassmorphism effects
- **Smooth Animations**: Hover effects, transitions
- **Loading States**: Loading spinner dan progress indicators
- **Error Handling**: User-friendly error messages
- **Notifications**: Success/error toast notifications

## 📱 Controls & Navigation

- **🔍 Search**: Type untuk search nodes
- **📱 Fullscreen**: Toggle fullscreen mode untuk graph
- **🔄 Reset**: Reset visualization ke initial state
- **⬆️ Scroll**: Scroll results untuk melihat lebih banyak data

## 🛡️ Security & Performance

- **Secure Connection**: SSL/TLS untuk Neo4j cloud
- **Error Boundaries**: Graceful error handling
- **Memory Management**: Proper cleanup dan resource management
- **Optimized Queries**: Efficient Cypher query generation

## 🔧 Customization

### Node Appearance
Edit `script.js` untuk mengubah tampilan nodes:

```javascript
popoto.graph.node.RADIUS = 40;
popoto.graph.node.STROKE_WIDTH = 3;
```

### Result Display
Customize `displayResults` function untuk mengubah tampilan hasil:

```javascript
"Recipe": {
    "displayResults": function(pResultElmt) {
        // Custom display logic here
    }
}
```

### Styling
Edit `style.css` untuk mengubah theme dan colors:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #e17055;
}
```

## 📈 Performance Optimization

- **Lazy Loading**: Results dimuat secara bertahap
- **Debounced Search**: Mencegah excessive API calls
- **Memory Cleanup**: Proper driver connection management
- **Responsive Images**: Optimized untuk berbagai screen sizes

## 🐛 Troubleshooting

### Connection Issues
- Pastikan Neo4j database sudah running
- Verify credentials dan URI connection
- Check firewall settings untuk port 7687

### Performance Issues  
- Reduce `RESULTS_PAGE_SIZE` untuk dataset besar
- Increase graph node radius untuk better visibility
- Clear browser cache jika ada masalah loading

### UI Issues
- Refresh page jika graph tidak muncul
- Check browser console untuk error messages
- Ensure latest browser version

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Course**: Basis Data Grafik - Semester 6
- **Institution**: [Your University]

## 🙏 Acknowledgments

- [Popoto.js](https://github.com/Nhogs/popoto) untuk graph visualization framework
- [D3.js](https://d3js.org/) untuk powerful data visualization
- [Neo4j](https://neo4j.com/) untuk graph database platform
- Inspiration dari berbagai recipe database projects

## 📞 Support

Jika ada pertanyaan atau issues, silakan:
- Create issue di GitHub repository
- Contact via email: [your-email@example.com]
- Join diskusi di [Discord/Slack channel]

---

**Happy Cooking with Data! 🍳✨**