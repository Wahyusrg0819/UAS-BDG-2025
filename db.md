## Analisis Struktur Data

Dari dataset yang diberikan, saya dapat mengidentifikasi beberapa entitas utama yang dapat dijadikan node dalam graph database:

**Node Labels yang Diidentifikasi:**
- **Recipe** (Resep)
- **Chef** (Koki) 
- **Country** (Negara)
- **Category** (Kategori)

## Pemecahan Data menjadi CSV Terpisah

### 1. recipes.csv
```csv
id_resep,nama_resep,waktu_masak_menit,tingkat_kesulitan,kalori
R1,Nasi Goreng,15,Mudah,550
R2,Spaghetti Carbonara,20,Sedang,620
R3,Sushi,45,Sulit,480
R4,Tom Yum,30,Sedang,350
R5,Tacos,25,Mudah,400
R6,Rendang,180,Sulit,650
R7,Bibimbap,35,Sedang,500
R8,Paella,60,Sulit,700
R9,Pho,45,Sedang,430
R10,Burger,20,Mudah,600
```

### 2. chefs.csv
```csv
nama_koki,kebangsaan_koki,tahun_lahir_koki
Chef Juna,Indonesia,1980
Gordon Ramsay,UK,1966
Nobu Matsuhisa,Jepang,1949
Jet Tila,Thailand,1975
Rick Bayless,USA,1963
William Wongso,Indonesia,1947
Maangchi,Korea,1957
Jose Andres,Spanyol,1969
Luke Nguyen,Vietnam,1978
Guy Fieri,USA,1968
```

### 3. countries.csv
```csv
nama_negara
Indonesia
Italia
Jepang
Thailand
Meksiko
Korea
Spanyol
Vietnam
Amerika
UK
USA
```

### 4. categories.csv
```csv
kategori
Makan Siang
Makan Malam
Hari Raya
Makan Cepat
```

### 5. relationships.csv
```csv
id_resep,nama_koki,asal_masakan,kategori
R1,Chef Juna,Indonesia,Makan Siang
R2,Gordon Ramsay,Italia,Makan Malam
R3,Nobu Matsuhisa,Jepang,Makan Siang
R4,Jet Tila,Thailand,Makan Malam
R5,Rick Bayless,Meksiko,Makan Siang
R6,William Wongso,Indonesia,Hari Raya
R7,Maangchi,Korea,Makan Siang
R8,Jose Andres,Spanyol,Makan Malam
R9,Luke Nguyen,Vietnam,Makan Malam
R10,Guy Fieri,Amerika,Makan Cepat
```

## Import ke Neo4j menggunakan LOAD CSV

### 1. Membuat Node Recipe
```cypher
LOAD CSV WITH HEADERS FROM 'file:///recipes.csv' AS row
CREATE (r:Recipe {
    id: row.id_resep,
    nama: row.nama_resep,
    waktu_masak: toInteger(row.waktu_masak_menit),
    tingkat_kesulitan: row.tingkat_kesulitan,
    kalori: toInteger(row.kalori)
})
```

### 2. Membuat Node Chef
```cypher
LOAD CSV WITH HEADERS FROM 'file:///chefs.csv' AS row
CREATE (c:Chef {
    nama: row.nama_koki,
    kebangsaan: row.kebangsaan_koki,
    tahun_lahir: toInteger(row.tahun_lahir_koki)
})
```

### 3. Membuat Node Country
```cypher
LOAD CSV WITH HEADERS FROM 'file:///countries.csv' AS row
CREATE (co:Country {
    nama: row.nama_negara
})
```

### 4. Membuat Node Category
```cypher
LOAD CSV WITH HEADERS FROM 'file:///categories.csv' AS row
CREATE (cat:Category {
    nama: row.kategori
})
```

### 5. Membuat Relationships
```cypher
// Relasi CREATED_BY (Recipe -> Chef)
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS row
MATCH (r:Recipe {id: row.id_resep})
MATCH (c:Chef {nama: row.nama_koki})
CREATE (r)-[:CREATED_BY]->(c)
```

```cypher
// Relasi ORIGINATED_FROM (Recipe -> Country)
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS row
MATCH (r:Recipe {id: row.id_resep})
MATCH (co:Country {nama: row.asal_masakan})
CREATE (r)-[:ORIGINATED_FROM]->(co)
```

```cypher
// Relasi BELONGS_TO (Recipe -> Category)
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS row
MATCH (r:Recipe {id: row.id_resep})
MATCH (cat:Category {nama: row.kategori})
CREATE (r)-[:BELONGS_TO]->(cat)
```

```cypher
// Relasi FROM_COUNTRY (Chef -> Country)
LOAD CSV WITH HEADERS FROM 'file:///chefs.csv' AS row
MATCH (c:Chef {nama: row.nama_koki})
MATCH (co:Country {nama: row.kebangsaan_koki})
CREATE (c)-[:FROM_COUNTRY]->(co)
```

## Struktur Graph yang Dihasilkan

**Node Properties:**
- **Recipe**: id, nama, waktu_masak, tingkat_kesulitan, kalori
- **Chef**: nama, kebangsaan, tahun_lahir
- **Country**: nama
- **Category**: nama

**Relationships:**
- **(Recipe)-[:CREATED_BY]->(Chef)**: Resep dibuat oleh koki
- **(Recipe)-[:ORIGINATED_FROM]->(Country)**: Resep berasal dari negara
- **(Recipe)-[:BELONGS_TO]->(Category)**: Resep masuk kategori tertentu
- **(Chef)-[:FROM_COUNTRY]->(Country)**: Koki berasal dari negara

