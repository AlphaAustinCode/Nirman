const mongoose = require('mongoose');
const Agency = require('./models/Agency');

const seedData = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/eendhan_bhandu');

    const agencies = [
        {
            agencyId: "IND001",
            name: "Indane - Mumbai Central",
            location: "Mumbai",
            validPassbooks: ["12345678901234567", "11112222333344445"]
        },
        {
            agencyId: "BHP002",
            name: "Bharat Gas - Dadar East",
            location: "Dadar",
            validPassbooks: ["23456789102345678"]
        },
        {
            agencyId: "HPG003",
            name: "HP Gas - Andheri West",
            location: "Andheri",
            validPassbooks: ["34567890123456789"]
        }
    ];

    await Agency.deleteMany(); // Clear old data
    await Agency.insertMany(agencies);
    console.log("🌱 Database Seeded with Agencies!");
    process.exit();
};

seedData();