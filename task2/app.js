const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000
const fs = require('fs');
const path = require('path');

function writeData(data = Object) {
    fs.writeFileSync(path.join(__dirname, 'dataBase.json'), JSON.stringify(data, null, 2))
}
function readData() {
    try {
        const parkingLots = JSON.parse(fs.readFileSync(path.join(__dirname, 'dataBase.json'), 'utf-8')) || null;
        return parkingLots;
    } catch (error) {
        return new Error("Failed read data");
    }
}

app.use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }));

app
    // untuk menampilkan lot / area yang masih kosong
    .get('/lots', (req, res, next) => {
        try {
            const emptyLots = {}
            const parkingLots = readData();
            for (key in parkingLots) {

                const emptyLotSegment = [];
                parkingLots[key].forEach(lot => {
                    if (!lot.status) {
                        emptyLotSegment.push(lot.lot_id)
                    }
                })
                if (emptyLotSegment.length >= 1) {
                    emptyLots[key] = emptyLotSegment;
                }
            }
            res.status(200).json(emptyLots)
        } catch (error) {
            next(error)
        }
    })
    // untuk menambahkan kendaraan ke lot parkir
    .patch('/lots/add', (req, res, next) => {
        try {
            const { block, lot_id } = req.query;
            const { carNumber, carModel } = req.body;

            if (!block || !lot_id) throw new Error("Block / lot_id is require")
            if (!carNumber || !carModel) throw new Error("Car number / Car model is require");

            // untuk mengecek apakah input block sama dengan lot_id yang di inputkan
            if (!lot_id.startsWith(block)) throw new Error('block is not match with lot_id');

            // simulasi mengambil data dari database
            const parkingLots = readData();

            // untuk mengecek apakah input dari block tersedia atau tidak
            if (!parkingLots[block]) throw new Error('Lot Block is not available');

            const lotBlocks = parkingLots[block];

            // untuk mengecek apakah input lot_id sesuai dengan data dari database
            if (parseInt(lot_id.slice(1, lot_id.length)) > lotBlocks.length) throw new Error('Parking lot not available')

            const newBlockValue = lotBlocks.map(lot => {
                if (lot.lot_id == lot_id) {
                    if (lot.status) {
                        throw new Error('This lot is already in use')
                    }
                    lot.car["number"] = carNumber;
                    lot.car["model"] = carModel;
                    lot.status = true;
                }
                return lot
            })
            parkingLots[block] = newBlockValue;
            writeData(parkingLots)

            const response = { 
                message: `Success assign ${carModel} with number ${carNumber} to lot ${lot_id}`,
                car: { 
                    carNumber, 
                    carModel 
                }, 
                lot_id 
            }
            res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    })
    // untuk remove kendaraan dari lot parkir
    .patch('/lots/remove', (req, res, next) => {
        try {
            const { block, lot_id } = req.query;
            const { carNumber, carModel } = req.body;

            if (!block || !lot_id) throw new Error("Block / lot_id is require");
            if (!carNumber || !carModel) throw new Error("carNumber / carModel is require");

            // untuk mengecek apakah input block sama dengan lot_id yang di inputkan
            if (!lot_id.startsWith(block)) throw new Error('block is not match with lot_id');

            // simulasi mengambil data dari database
            const parkingLots = readData()

            // untuk mengecek apakah input dari block tersedia atau tidak
            if (!parkingLots[block]) throw new Error('Lot Block is not available');

            const lotBlocks = parkingLots[block];

            // untuk mengecek apakah input lot_id sesuai dengan data dari database
            if (parseInt(lot_id.slice(1, lot_id.length)) > lotBlocks.length) throw new Error('Parking lot not available')

            const newBlockValue = lotBlocks.map(lot => {
                if (lot.lot_id == lot_id) {
                    if (!lot.status) throw new Error("Block lot is already empty");

                    const car = lot.car;
                    if (lot.status) {
                        if ((car.number === carNumber) && (car.model === carModel)) {
                            lot.car["number"] = "";
                            lot.car["model"] = "";
                            lot.status = false;
                        } else {
                            throw new Error("car number / car model is not match")
                        }
                    }
                }
                return lot
            })

            parkingLots[block] = newBlockValue;
            writeData(parkingLots)
            res.status(200).json({ message: `Success remove ${carModel} - ${carNumber} from lot ${lot_id}` })
        } catch (error) {
            next(error)
        }
    })

    // error handler
    .use((err, req, res, next) => {
        let message = "";
        let statusCode = 500;

        console.log(err.message);
        switch (err.message) {
            case "Block / lot_id is require":
            case "Car number / Car model is require":
            case "This lot is already in use":
            case "car number / car model is not match":
            case "Block lot is already empty":
            case "block is not match with lot_id":
                message = err.message;
                statusCode = 400;
                break;
            case "Lot Block is not available":
            case "Parking lot not available":
                message = err.message;
                statusCode = 404;
                break;
            default:
                message = "Internal server error"
        }

        res.status(statusCode).json({ statusCode, message })
    })


app.listen(port, () => console.log('Online on port ' + port));