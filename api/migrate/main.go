package main

import (
	"database/sql"
	"encoding/csv"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./storage/database.sqlite")
	if err != nil {
		log.Fatal(err)
	}

	file, err := os.Open("./dump.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	for {
		record, err := reader.Read()
		if err != nil {
			if err.Error() == "EOF" {
				break
			}
			log.Fatal(err)
		}

		id := record[0]
		createdAt := record[1]
		source := record[2]

		_, err = db.Exec(`INSERT OR IGNORE INTO reports (id, createdAt, source) VALUES (?, ?, ?)`, id, createdAt, source)
		if err != nil {
			log.Fatal(err)
		}
	}
}
