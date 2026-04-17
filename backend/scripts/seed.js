require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Agency = require("../models/Agency");
const Consumer = require("../models/Consumer");
const User = require("../models/User");

const DEFAULT_REGISTERED_PASSWORD = "Demo123";

const agencies = [
  { agency_name: "Indian Oil Corporation", agency_code: "IND001" },
  { agency_name: "Bharat Petroleum", agency_code: "BHP001" },
  { agency_name: "Hindustan Petroleum", agency_code: "HIN001" },
];

const consumerBlueprints = {
  IND001: [
    {
      full_name: "Rahul Sharma",
      registered_phone: "+919810100101",
      address: "Flat 4B, Aashiyana Apartments, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
      email: "rahul.sharma@gmail.com",
      secondary_phone: null,
      is_registered: true,
    },
    {
      full_name: "Sunita Verma",
      registered_phone: "+918329754847",
      address: "House No. 118, Rajendra Nagar, Bareilly, Uttar Pradesh 243122",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Amit Tiwari",
      registered_phone: "+919810100103",
      address: "C-27, Sharda Enclave, Kanpur Road, Lucknow, Uttar Pradesh 226012",
      email: "amit.tiwari@outlook.com",
      secondary_phone: "+919945550103",
      is_registered: false,
    },
    {
      full_name: "Pooja Mishra",
      registered_phone: "+919810100104",
      address: "Village Bhatauli, Post Itaunja, Sitapur Road, Lucknow, Uttar Pradesh 226203",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Manoj Singh",
      registered_phone: "+919810100105",
      address: "19, Civil Lines Extension, Prayagraj, Uttar Pradesh 211001",
      email: "manoj.singh@yahoo.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Neha Yadav",
      registered_phone: "+919810100106",
      address: "Plot 52, Saraswati Vihar, Rae Bareli Road, Lucknow, Uttar Pradesh 226014",
      email: null,
      secondary_phone: "+919945550106",
      is_registered: false,
    },
    {
      full_name: "Sanjay Chauhan",
      registered_phone: "+919810100107",
      address: "Ward 6, Main Bazaar Road, Mohanlalganj, Lucknow, Uttar Pradesh 226301",
      email: "sanjay.chauhan@gmail.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Kavita Pandey",
      registered_phone: "+919810100108",
      address: "H. No. 23, Sector 8, Vrindavan Yojana, Lucknow, Uttar Pradesh 226029",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Arvind Dubey",
      registered_phone: "+919810100109",
      address: "Village Tikri Kalan, Block Sarojini Nagar, Lucknow, Uttar Pradesh 226008",
      email: "arvind.dubey@proton.me",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Meera Saxena",
      registered_phone: "+919810100110",
      address: "B-91, Indira Nagar, Lucknow, Uttar Pradesh 226016",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
  ],
  BHP001: [
    {
      full_name: "Sourav Dutta",
      registered_phone: "+919820200111",
      address: "3rd Floor, 17 Lake View Road, Tollygunge, Kolkata, West Bengal 700033",
      email: "sourav.dutta@gmail.com",
      secondary_phone: null,
      is_registered: true,
    },
    {
      full_name: "Anindita Roy",
      registered_phone: "+919820200112",
      address: "21/4A, Prince Anwar Shah Road, Jodhpur Park, Kolkata, West Bengal 700068",
      email: "anindita.roy@mail.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Prasenjit Pal",
      registered_phone: "+919820200113",
      address: "Village Gopalpur, Post Bira, North 24 Parganas, West Bengal 743234",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Mousumi Ghosh",
      registered_phone: "+919820200114",
      address: "Flat 2A, Udayan Housing, Dum Dum Park, Kolkata, West Bengal 700055",
      email: null,
      secondary_phone: "+919955660114",
      is_registered: false,
    },
    {
      full_name: "Debasish Nandi",
      registered_phone: "+919820200115",
      address: "House 11, Station Road, Chandannagar, Hooghly, West Bengal 712136",
      email: "debasish.nandi@gmail.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Rituparna Sen",
      registered_phone: "+919820200116",
      address: "38, Salt Lake Sector II, Bidhannagar, Kolkata, West Bengal 700091",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Subhajit Mondal",
      registered_phone: "+919820200117",
      address: "Village Kismatpur, Baruipur, South 24 Parganas, West Bengal 700144",
      email: "subhajit.mondal@outlook.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Priyanka Das",
      registered_phone: "+919820200118",
      address: "8, Rabindra Sarani, Krishnanagar, Nadia, West Bengal 741101",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Bikramjit Saha",
      registered_phone: "+919820200119",
      address: "4/6, College Para Road, Siliguri, Darjeeling, West Bengal 734001",
      email: "bikramjit.saha@yahoo.com",
      secondary_phone: "+919955660119",
      is_registered: false,
    },
    {
      full_name: "Nandini Kar",
      registered_phone: "+919820200120",
      address: "Ward 12, Hospital More, Bolpur, Birbhum, West Bengal 731204",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
  ],
  HIN001: [
    {
      full_name: "Ramesh Gowda",
      registered_phone: "+919830300121",
      address: "No. 14, 5th Cross, Basavanagudi, Bengaluru, Karnataka 560004",
      email: "ramesh.gowda@gmail.com",
      secondary_phone: null,
      is_registered: true,
    },
    {
      full_name: "Lakshmi Narayan",
      registered_phone: "+919830300122",
      address: "Door No. 7-2-18, Temple Street, Chintamani, Chikkaballapur, Karnataka 563125",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Asha Bhat",
      registered_phone: "+919830300123",
      address: "Flat 301, Shree Residency, Kankanady, Mangaluru, Karnataka 575002",
      email: "asha.bhat@outlook.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Prakash Shetty",
      registered_phone: "+919830300124",
      address: "Survey No. 42, Village Kotekar, Bantwal Taluk, Dakshina Kannada, Karnataka 574219",
      email: null,
      secondary_phone: "+919966770124",
      is_registered: false,
    },
    {
      full_name: "Divya Kulkarni",
      registered_phone: "+919830300125",
      address: "52, Station Road, Vidyanagar, Hubballi, Karnataka 580021",
      email: "divya.kulkarni@mail.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Shankarappa Hegde",
      registered_phone: "+919830300126",
      address: "House 88, Main Road, Sirsi Rural, Uttara Kannada, Karnataka 581401",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Nisha Reddy",
      registered_phone: "+919830300127",
      address: "Plot 16, Green County, Whitefield, Bengaluru, Karnataka 560066",
      email: "nisha.reddy@gmail.com",
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Vinay Kumar",
      registered_phone: "+919830300128",
      address: "Ward 3, Bus Stand Road, Channapatna, Ramanagara, Karnataka 562160",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
    {
      full_name: "Bhavya Naik",
      registered_phone: "+919830300129",
      address: "1st Main, Ashok Nagar, Shivamogga, Karnataka 577201",
      email: "bhavya.naik@proton.me",
      secondary_phone: "+919966770129",
      is_registered: false,
    },
    {
      full_name: "Harish Poojary",
      registered_phone: "+919830300130",
      address: "Village Kalladka Junction, Bantwal, Dakshina Kannada, Karnataka 574222",
      email: null,
      secondary_phone: null,
      is_registered: false,
    },
  ],
};

const passbookPrefixes = {
  IND001: "11012026",
  BHP001: "22022026",
  HIN001: "33032026",
};

function generatePassbookNumber(agencyCode, index) {
  const prefix = passbookPrefixes[agencyCode];
  return `${prefix}${String(index).padStart(9, "0")}`;
}

function buildConsumerDocuments(agencyDocuments) {
  return agencyDocuments.flatMap((agency) => {
    const blueprints = consumerBlueprints[agency.agency_code];

    return blueprints.map((consumer, index) => ({
      agency_id: agency._id,
      passbook_number: generatePassbookNumber(agency.agency_code, index + 1),
      full_name: consumer.full_name,
      registered_phone: consumer.registered_phone,
      address: consumer.address,
      email: consumer.email,
      secondary_phone: consumer.secondary_phone,
      is_registered: consumer.is_registered,
    }));
  });
}

async function buildUserDocuments(consumers) {
  const registeredConsumers = consumers.filter((consumer) => consumer.is_registered);
  const passwordHash = await bcrypt.hash(
    process.env.DEMO_REGISTERED_PASSWORD || DEFAULT_REGISTERED_PASSWORD,
    Number(process.env.BCRYPT_ROUNDS || 12)
  );

  return registeredConsumers.map((consumer) => ({
    consumer_id: consumer._id,
    phone: consumer.registered_phone,
    email: consumer.email,
    password: passwordHash,
  }));
}

function summarizeSeed(consumers, users) {
  const withEmail = consumers.filter((consumer) => Boolean(consumer.email)).length;
  const withoutEmail = consumers.length - withEmail;

  console.log(`Seeded ${consumers.length} consumers`);
  console.log(`Consumers with email: ${withEmail}`);
  console.log(`Consumers without email: ${withoutEmail}`);
  console.log(`Pre-registered demo users: ${users.length}`);
  console.log(
    `Registered user password for demo accounts: ${
      process.env.DEMO_REGISTERED_PASSWORD || DEFAULT_REGISTERED_PASSWORD
    }`
  );
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to seed data");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Promise.all([Agency.deleteMany({}), Consumer.deleteMany({}), User.deleteMany({})]);
  console.log("Dropped existing Agency, Consumer, and User data");

  const agencyDocuments = await Agency.insertMany(agencies);
  const consumerDocuments = await Consumer.insertMany(buildConsumerDocuments(agencyDocuments));
  const userDocuments = await User.insertMany(await buildUserDocuments(consumerDocuments));

  console.log(`Seeded ${agencyDocuments.length} agencies`);
  summarizeSeed(consumerDocuments, userDocuments);

  await mongoose.connection.close();
  console.log("Mock LPG dataset ready");
}

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exit(1);
});
