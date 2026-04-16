require("dotenv").config();
const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const Consumer = require("../models/Consumer");
const User = require("../models/User");

const agenciesData = [
    {
        agencyId: "AG001",
        agency_name: "Indian Oil Corporation",
        agency_code: "IND001",
    },
    {
        agencyId: "AG002",
        agency_name: "Bharat Petroleum",
        agency_code: "BHP001",
    },
    {
        agencyId: "AG003",
        agency_name: "Hindustan Petroleum",
        agency_code: "HIN001",
    },
];

// Helper to generate exactly 17-character passbook number
const generatePassbook = (agencyCode, index) => {
    // agencyCode = 6 chars
    // index = 2 chars
    // randomPart = 9 chars
    const randomPart = Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, "0");

    const indexPart = index.toString().padStart(2, "0");

    return `${agencyCode}${randomPart}${indexPart}`; // 6 + 9 + 2 = 17
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to Database for Seeding");

        // 1. Clear existing data
        await Agency.deleteMany({});
        await Consumer.deleteMany({});
        await User.deleteMany({});
        console.log("🗑️ Cleared existing collections");

        // 2. Insert Agencies
        const createdAgencies = await Agency.insertMany(agenciesData);
        console.log("🏢 Agencies seeded successfully");

        // 3. Generate Consumers (10 per agency)
        const consumersData = [];
        let phoneCounter = 9000000000;

        for (const agency of createdAgencies) {
            for (let i = 1; i <= 10; i++) {
                consumersData.push({
                    agency_id: agency._id,
                    passbook_number: generatePassbook(agency.agency_code, i),
                    full_name: `Test Consumer ${i} - ${agency.agency_code}`,
                    registered_phone: (phoneCounter++).toString(),
                    address: `123 Demo Street, Block ${i}, Tech City`,
                    email: null,
                    secondary_phone: null,
                    is_registered: false,
                });
            }
        }

        await Consumer.insertMany(consumersData);
        console.log(`👥 ${consumersData.length} Consumers seeded successfully`);

        console.log("🎉 Database seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();