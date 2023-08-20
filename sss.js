const Fs = require('fs');
const CsvReadableStream = require('csv-reader');

let inputStream = Fs.createReadStream('1.csv', 'utf8');

let item = []

inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        if (row[4].trim() == "Active" && row[5]?.includes("-") && row[5]?.includes("ongoing") && row[7] == "ENG" 
        && row[13] == "Journal" 
        && typeof row[21]=='string'
         && row[3] && row[3].toString().length > 0
        ) {
            item.push({
                name: row[1],
                scopusid: row[0],
                issn:row[3],
                from:row[5].split?.("-")?.[0] || "1990",
                citescore:row[8],
                publication:row[20],
                cat:row[21]?.split?.(";")?.map(x=> x.trim())?.filter(x=>x.length > 0),

            })
            // console.log('A row arrived: ', row);
        }
    })
    .on('end', function () {
        console.log('No more rows!');
        Fs.writeFileSync("scopus.json", JSON.stringify(item, null, 2))
    });