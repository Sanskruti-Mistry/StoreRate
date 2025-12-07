// prisma/seedMoreData.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Role } = require("@prisma/client");
const prisma = require("../src/config/prisma");

async function main() {
  console.log("🚀 Starting seed...");

  // 1. Define 5 Owners
  const ownersData = [
    { name: "Aarav", email: "aarav@store.com", address: "Mumbai, MH" },
    { name: "Vihaan", email: "vihaan@store.com", address: "Pune, MH" },
    { name: "Aditya", email: "aditya@store.com", address: "Delhi, DL" },
    { name: "Sai", email: "sai@store.com", address: "Bangalore, KA" },
    { name: "Reyansh", email: "reyansh@store.com", address: "Hyderabad, TS" },
  ];

  const createdOwners = [];
  const passwordHash = await bcrypt.hash("Owner@1234", 10); // Same password for all

  console.log("👤 Creating 5 Owners...");
  
  for (const owner of ownersData) {
    // Check if user exists first to avoid crashing
    const existing = await prisma.user.findUnique({ where: { email: owner.email } });
    if (!existing) {
      const newOwner = await prisma.user.create({
        data: {
          name: owner.name,
          email: owner.email,
          passwordHash, // Password is 'Owner@1234'
          role: Role.OWNER,
          address: owner.address,
        },
      });
      createdOwners.push(newOwner);
      console.log(`   - Created: ${newOwner.name}`);
    } else {
      createdOwners.push(existing);
      console.log(`   - Skipped (Already exists): ${owner.name}`);
    }
  }

  // 2. Define 7 Stores
  const storesData = [
    { name: "Tech World", address: "Andheri East, Mumbai" },
    { name: "Fashion Hub", address: "Koregaon Park, Pune" },
    { name: "Green Grocers", address: "Connaught Place, Delhi" },
    { name: "Book Haven", address: "Indiranagar, Bangalore" },
    { name: "Sports Gear", address: "Jubilee Hills, Hyderabad" },
    { name: "Home Decor", address: "Bandra West, Mumbai" },
    { name: "Gadget Guru", address: "Whitefield, Bangalore" },
  ];

  console.log("🏪 Creating 7 Stores...");

  // We loop through stores and assign them to owners in a round-robin fashion
  for (let i = 0; i < storesData.length; i++) {
    const storeData = storesData[i];
    // This math ensures we cycle through owners: 0, 1, 2, 3, 4, 0, 1...
    const ownerToAssign = createdOwners[i % createdOwners.length];

    const newStore = await prisma.store.create({
      data: {
        name: storeData.name,
        address: storeData.address,
        // Create a unique email for the store automatically
        email: `contact.${storeData.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
        ownerId: ownerToAssign.id,
      },
    });
    console.log(`   - Created: ${newStore.name} (Owner: ${ownerToAssign.name})`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });