package config

import (
	"fmt"
	"log"
)

const (
	UsersTable                   = "users"
	RefreshTokensTable           = "refresh_tokens"
	PasswordResetTokensTable     = "password_reset_tokens"
	EmailVerificationTokensTable = "email_verification_tokens"
)

// Table definition struct
type TableDefinition struct {
	Name  string
	Query string
}

// Create all application tables
func CreateTables() {
	tables := []TableDefinition{
		{
			Name: UsersTable,
			Query: `
				CREATE TABLE IF NOT EXISTS %s (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					last_name VARCHAR(255) NOT NULL,
					email VARCHAR(255) UNIQUE NOT NULL,
					password_hash VARCHAR(255) NOT NULL,
					auth_provider VARCHAR(50) DEFAULT 'JWT',
					email_verified BOOLEAN DEFAULT FALSE,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);
			`,
		},
		{
			Name: RefreshTokensTable,
			Query: `
				CREATE TABLE IF NOT EXISTS %s (
					id SERIAL PRIMARY KEY,
					user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					token_hash VARCHAR(255) NOT NULL,
					expires_at TIMESTAMP NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					is_revoked BOOLEAN DEFAULT FALSE,
					device_info VARCHAR(255),
					ip_address INET
				)
			`,
		},
		{
			Name: PasswordResetTokensTable,
			Query: `
				CREATE TABLE IF NOT EXISTS %s (
					id SERIAL PRIMARY KEY,
					user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					token_hash VARCHAR(255) NOT NULL,
					used BOOLEAN DEFAULT FALSE,
					expires_at TIMESTAMP NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);
			`,
		},
		{
			Name: EmailVerificationTokensTable,
			Query: `
				CREATE TABLE IF NOT EXISTS %s (
					id SERIAL PRIMARY KEY,
					user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					verification_code VARCHAR(6) NOT NULL,
					attempts INTEGER DEFAULT 0,
					success BOOLEAN DEFAULT FALSE,
					expires_at TIMESTAMP NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);
			`,
		},
	}

	// Loop through tables map in order and conditionally
	// create non-existent tables
	for _, table := range tables {
		if tableExists(table.Name) {
			continue
		}

		createTable(table.Name, table.Query)
	}
}

// Create a single table
func createTable(tableName, query string) {
	formattedSQL := fmt.Sprintf(query, tableName)

	_, err := DB.Exec(formattedSQL)
	if err != nil {
		log.Fatalf("❌ Failed to create %s table: %v", tableName, err)
	}

	log.Printf("☑️ Table '%s' created successfully", tableName)
}

func tableExists(tableName string) bool {
	var exists bool

	checkQuery := `
    SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_schema = 'public' 
			AND table_name = $1
    );
	`

	err := DB.QueryRow(checkQuery, tableName).Scan(&exists)
	if err != nil {
		log.Fatalf("❌ Failed to check if %s table exists: %v", tableName, err)
	}

	return exists
}
