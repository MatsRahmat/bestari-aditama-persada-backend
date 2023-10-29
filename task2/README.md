<style>
    p {
        font-size: 18px;
    }
    h1 {
        text-align: center;
    }
</style>

# API DOCUMENTATION

# install dependencies
jalankan perintah install pada command-line

> $ npm install

setelah semua package dependencies terinstall bisa ketikan perintah berikut untuk menjalankan server

> $ npm run start

server berada pada port 3000, jadi untuk mengaksesnya bisa pada alamat &nbsp; *`http://localhost:3000`*

<hr>
<br>

<p>sebelum itu perlu di pahami dahulu untuk struktur data dari perumpamaan database nya itu seperti dibawah ini:</p>

```json
{
  "A": [
    {
      "status": true,
      "lot_id": "A1",
      "car": {
        "number": "B 2093 DEB",
        "model": "Brio"
      }
    },
    {
      "status": false,
      "lot_id": "",
      "car": {
        "number": "",
        "model": ""
      }
    },

    ....
  ],
  "B": [
    {
      "status": false,
      "lot_id": "B1",
      "car": {
        "number": "",
        "model": ""
      }
    },
    {
      "status": true,
      "lot_id": "B5",
      "car": {
        "number": "B 1234 POI",
        "model": "VOLVO"
      }
    },

    ....
  ],

  ....
}
```
untuk block diumpamakan dengan menggunakan huruf dari **'A'** sampai seterusnya. Sedangkan untuk lot pada setiap block menggunakan kombinasi block dan penomoran, contoh **'A1, A2'** dan seterusnya. ini memungkinkan setiap lot pada block atau bahkan block itu sendiri memiliki limitasi, karena telah kita tentukan di awal berapa lot pada setiap block nya dan juga jumlah block nya.

<br>

# END POINT

<br>
<h2 id="lots">GET /lots</h2>

<p>Untuk mendapatkan data block dan lot mana yang masih kosong</p>

### Response
berupa objek yang pada setiap key-nya merupakan lokasi block nya dan memiliki value array of string yang merupakan `lot_id` dari lot yang masih kosong
```json
{
    "A": [
        "A1"
    ],
    "B": [
        "B1",
        "B2",
        "B3",
        "B4"
    ],
    "C": [
        "C2",
        "C3",
        "C4",
        "C5"
    ],
    "D": [
        "D2",
        "D3",
        "D4",
        "D5"
    ],
    "E": [
        "E1",
        "E3",
        "E4"
    ]
}
```

<br>
<h2>PATCH /lots/add</h2>

### Request

### # query params

Value dari block merupakan block tujuannya dan value dari lot id adalah lot_id tujuan nya yang yang merupakan response saat melakukan GET `/lots` 

```json
{
  "block": "A",
  "lot_id": "A4"
}
```
### # Request body

merupakan informasi mengenai kendaraan tersebut, digunakan untuk mencocokan data pada saat akan keluar dari area parkir.

`carNumber` merupakan plat nomor kendaraan dan `carModel` adalah jenis atau model dari kendaraan tersebut.

```json
{
    "carNumber": "B 1245 UYT",
    "carModel": "BMW"
}
```

### Response

- 200-OK
```json
{
    "message": "Success assign BMW with number B 1245 UYT to lot A4",
    "car": {
        "carNumber": "B 1245 UYT",
        "carModel": "BMW"
    },
    "lot_id": "A4"
}
```
terdapat message success, informasi tetang kendaraan dan juga informasi lot_id nya

- _`400-BAD`_

<br>

response ketika slot yang dituju telah terisi
```json
{
    "statusCode": 400,
    "message": "This lot is already in use"
}
```
<hr>
<br>

response ketika block dan lot_id tidak sama, contoh block `A` sedangkan lot_id nya `B3` maka akan mendapatkan response error seperti dibawah ini

- contoh query paramnya
```json
{
  "block": "A",
  "lot_id": "B3"
}
```
- responsenya
```json
{
    "statusCode": 400,
    "message": "block is not match with lot_id"
}
```
<hr>
<br>

- 404-NOT_FOUND

response ketika `lot_id` yang dimasukan tidak tersedia pada database. Contoh `lot_id: B23` yang dimana lot_id yang tersedia hanya sampai 5 ini akan menyebabkan error dan mendapatkan response seperti berikut.

- contoh query paramnya
```json
{
  "block": "B",
  "lot_id": "B23"
}
```
- response nya
```json
{
    "statusCode": 404,
    "message": "Parking lot not available"
}
```
sama dengan kondisi di atas tetapi kasusnya pada value `block` yang dimana block yang tersedia hanya sampai `E` dan yang dimasukan adalah `H` maka akan terjadi error dan mendapatkan response seperi berikut.

- contoh query paramnya
```json
{
  "block": "H",
  "lot_id": "H4"
}
```
- response nya
```json
{
    "statusCode": 404,
    "message": "Lot Block is not available"
}
```

<br>
<h2>PATCH /lots/remove</h2>

## Request
### # query params
```json
{
  "block": "",
  "lot_id": ""
}
```
### # request body
```json
{
    "carNumber": "B 1245 UYT",
    "carModel": "BMW"
}
```
digunakan untuk mencocokan data kendaraan dengan yang ada pada database

## Response

- 200-OK

<p>response ketika berhasil menghapus data kendaraan dan mengosongkan lot parkir</p>

```json
{
    "message": "Success remove VW - B 1232 UYE from lot A1"
}
```

- 400-BAD
<p>response ketika lot parkir yang dituju sudah kosong</p>

```json
{
    "statusCode": 400,
    "message": "Block lot is already empty"
}
```
<hr>

response ketika data kendaraan yang dimasukan berbeda dengan data yang terdapat pada database
```json
{
    "statusCode": 400,
    "message": "car number / car model is not match"
}
```
<hr>
<br>

- 404-NOT_FOUND

response ketika block dan lot_id tidak sama, contoh block `A` sedangkan lot_id nya `B3` maka akan mendapatkan response error seperti dibawah ini

```json
{
    "statusCode": 400,
    "message": "block is not match with lot_id"
}
```

response ketika `block` yang dimasukan tidak tersedia maka akan terjadi error dan mendapatkan response seperi berikut.

```json
{
    "statusCode": 404,
    "message": "Lot Block is not available"
}
```

response ketika `lot_id` yang dimasukan tidak tersedia pada database.maka akan menyebabkan error dan mendapatkan response seperti berikut.
```json
{
    "statusCode": 404,
    "message": "Parking lot not available"
}
```

## Global error 
```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```