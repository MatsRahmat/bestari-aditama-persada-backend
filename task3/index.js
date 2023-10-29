function cekKelipatan(number = 0){
    for(let i = 1; i < number; i++) {
        if(i % 7 === 0) {
            console.log("bestada");
        } else {
            console.log(i);
        }
    }
    console.log("sukses");
}

// cekKelipatan(15)


const arr = [3,7,1,2,6,7,8,9,12,5,3,12]

function sortAndRemoveDuplicat(arr){
    const sorted = arr.sort((a, b) => b - a)
    let duplicat = []
    for(let i = 0; i < sorted.length; i++) {
        if(arr[i] === arr[i + 1]) {
            duplicat.push(arr[i])
        }
    }
    const result = [...new Set(arr)]
    console.log(`Angka duplikat ada: ${duplicat}`);
    console.log(`Total angka duplikat: ${duplicat.length}`);
    console.log(result);
}

// sortAndRemoveDuplicat(arr)