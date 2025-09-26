import fs from 'node:fs'
import { parse } from 'csv-parse'

async function importCsv() {
    const parser = fs.createReadStream(new URL("tasks.csv", import.meta.url)).pipe(
        parse({ from_line: 2 })
    );

    for await (const [key, value] of parser) {
        try {
            const response = await fetch('http://localhost:80/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: key, description: value })
            });

            console.log(response.status);
        } catch (err) {
            console.log(err);
        }
    }
}

importCsv()