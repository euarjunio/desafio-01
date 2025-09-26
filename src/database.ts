import { readFile, writeFile } from "node:fs/promises";

const pathDatabase = new URL("./db.json", import.meta.url)

class Database {
    #database: any = {};

    constructor() {
        readFile(pathDatabase, "utf8")
            .then((data) => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                writeFile(
                    pathDatabase,
                    JSON.stringify({}, null, 2)
                );
            });
    }

    #persist() {
        writeFile(
            pathDatabase,
            JSON.stringify(this.#database, null, 2)
        );
    }

    select(table: any, id?: any, search?: any) {
        let data = this.#database[table] ?? [];

        if (id) {
            return data.find((item: { id: any }) => item.id === id);
        }

        if (Object.entries(search).length !== 0) {
            return data.filter((row: any) => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(decodeURI(String(value)).toLowerCase())
                })
            });
        }

        return data;
    }

    insert(table: any, data: any) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        this.#persist();
    }

    update(table: any, id: any, data: any) {
        if (Array.isArray(this.#database[table])) {
            let index = this.#database[table].findIndex((v) => v.id === id)

            if (index >= 0) {
                this.#database[table][index] = {
                    ...this.#database[table][index],
                    ...data,
                    updated_at: new Date()
                }
                this.#persist();
                return true;
            }
        }
        return false;
    }

    delete(table: any, id: any) {
        if (Array.isArray(this.#database[table])) {
            let index = this.#database[table].findIndex((v) => v.id === id)

            if (index >= 0) {
                this.#database[table].splice(index, 1);
                this.#persist();
                return true;
            }
        }
        return false;
    }
}

export default new Database();
