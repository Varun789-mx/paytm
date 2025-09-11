const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seedDatabase() {
    try {
        console.log("í¼± Starting database seeding...");

        // Clear existing data (optional - remove if you want to keep existing data)
        console.log("í·¹ Cleaning existing data...");
        await db.onRampTransaction.deleteMany({});
        await db.balance.deleteMany({});
        await db.merchant.deleteMany({});
        await db.user.deleteMany({});

        // Create test users
        console.log("í±¥ Creating users...");
        const user1 = await db.user.create({
            data: {
                email: "john.doe@example.com",
                name: "John Doe",
                number: "9876543210",
                password: "hashed_password_123" // In real app, this should be properly hashed
            }
        });

        const user2 = await db.user.create({
            data: {
                email: "jane.smith@example.com", 
                name: "Jane Smith",
                number: "9876543211",
                password: "hashed_password_456"
            }
        });

        const user3 = await db.user.create({
            data: {
                email: "bob.johnson@example.com",
                name: "Bob Johnson", 
                number: "9876543212",
                password: "hashed_password_789"
            }
        });

        console.log(`âœ… Created 3 users`);

        // Create merchants
        console.log("í¿ª Creating merchants...");
        const merchant1 = await db.merchant.create({
            data: {
                email: "merchant1@example.com",
                name: "Test Merchant 1",
                auth_type: "Google"
            }
        });

        const merchant2 = await db.merchant.create({
            data: {
                email: "merchant2@example.com",
                name: "Test Merchant 2", 
                auth_type: "Github"
            }
        });

        console.log(`âœ… Created 2 merchants`);

        // Create balance records for each user
        console.log("í²° Creating balance records...");
        await db.balance.create({
            data: {
                userId: user1.id,
                amount: 0,
                locked: 0
            }
        });

        await db.balance.create({
            data: {
                userId: user2.id,
                amount: 50000, // Starting with some balance
                locked: 0
            }
        });

        await db.balance.create({
            data: {
                userId: user3.id,
                amount: 25000,
                locked: 5000 // Some locked amount
            }
        });

        console.log(`âœ… Created 3 balance records`);

        // Create test onRamp transactions
        console.log("í³ Creating test transactions...");
        await db.onRampTransaction.create({
            data: {
                token: "hdfc_test_token_001",
                userId: user1.id,
                amount: 10000, // 100.00 INR (assuming paise)
                status: "Processing",
                provider: "HDFC",
                startTime: new Date()
            }
        });

        await db.onRampTransaction.create({
            data: {
                token: "hdfc_test_token_002", 
                userId: user2.id,
                amount: 25000, // 250.00 INR
                status: "Processing",
                provider: "HDFC",
                startTime: new Date()
            }
        });

        await db.onRampTransaction.create({
            data: {
                token: "hdfc_test_token_003",
                userId: user3.id, 
                amount: 50000, // 500.00 INR
                status: "Processing",
                provider: "HDFC",
                startTime: new Date()
            }
        });

        // Some completed transactions for testing
        await db.onRampTransaction.create({
            data: {
                token: "hdfc_completed_001",
                userId: user1.id,
                amount: 15000,
                status: "Success",
                provider: "HDFC", 
                startTime: new Date(Date.now() - 86400000) // 1 day ago
            }
        });

        await db.onRampTransaction.create({
            data: {
                token: "hdfc_failed_001",
                userId: user2.id,
                amount: 5000,
                status: "Failure",
                provider: "HDFC",
                startTime: new Date(Date.now() - 3600000) // 1 hour ago
            }
        });

        console.log(`âœ… Created 5 test transactions`);

        // Display summary
        console.log("\ní³Š Seed Summary:");
        console.log("================");
        
        const finalUsers = await db.user.findMany({
            include: {
                Balance: true,
                OnRampTransaction: true
            }
        });

        finalUsers.forEach(user => {
            console.log(`í±¤ ${user.name} (ID: ${user.id})`);
            console.log(`   í³§ Email: ${user.email}`);
            console.log(`   í³± Number: ${user.number}`);
            console.log(`   í²° Balance: â‚¹${(user.Balance[0]?.amount || 0) / 100}`);
            console.log(`   í´’ Locked: â‚¹${(user.Balance[0]?.locked || 0) / 100}`);
            console.log(`   í³ Transactions: ${user.OnRampTransaction?.length || 0}`);
            console.log("");
        });

        const merchants = await db.merchant.findMany();
        console.log("í¿ª Merchants:");
        merchants.forEach(merchant => {
            console.log(`   ${merchant.name} - ${merchant.email} (${merchant.auth_type})`);
        });

        console.log("\ní·ª Test Webhook Payloads:");
        console.log("=========================");
        console.log("âœ… Valid payload (should succeed):");
        console.log(JSON.stringify({
            token: "hdfc_test_token_001",
            user_identifier: user1.id.toString(),
            amount: "10000"
        }, null, 2));

        console.log("\nâŒ Duplicate payload (should fail):");
        console.log(JSON.stringify({
            token: "hdfc_completed_001", // Already successful
            user_identifier: user1.id.toString(), 
            amount: "15000"
        }, null, 2));

        console.log("\nâŒ Non-existent user (should fail):");
        console.log(JSON.stringify({
            token: "hdfc_test_token_999",
            user_identifier: "999", // Non-existent user
            amount: "10000"
        }, null, 2));

        console.log("\ní¾‰ Database seeding completed successfully!");

    } catch (error) {
        console.error("âŒ Error seeding database:", error);
        throw error;
    } finally {
        await db.$disconnect();
    }
}

// Helper function to create additional test data
async function createAdditionalUser(email, name, number, initialBalance = 0) {
    try {
        const user = await db.user.create({
            data: {
                email,
                name,
                number,
                password: "hashed_password_" + Date.now()
            }
        });

        await db.balance.create({
            data: {
                userId: user.id,
                amount: initialBalance,
                locked: 0
            }
        });

        console.log(`âœ… Created user: ${name} with balance: â‚¹${initialBalance / 100}`);
        return user;
    } catch (error) {
        console.error(`âŒ Failed to create user ${name}:`, error);
        throw error;
    }
}

// Run the seed
seedDatabase()
    .then(() => {
        console.log("\nâœ¨ Seeding completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Failed to seed database:", error);
        process.exit(1);
    });

module.exports = { seedDatabase, createAdditionalUser };
