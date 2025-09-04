const mongoose = require('mongoose');
const Contact = require('./models/Contact'); // Adjust path based on your model location

// MongoDB connection string (same as in server.js)
const MONGO_URI = "mongodb+srv://darkstate49:Hardwork%4018@cluster0.4sq1ggj.mongodb.net/darkpolitics?retryWrites=true&w=majority&appName=Cluster0";

// Contact data from your React component
const contactData = {
  contactInfo: [
    {
      type: "email",
      title: "Email Us",
      info: "contact@politicalcareer.in",
      subInfo: "info@politicalcareer.in",
      icon: "Mail",
      active: true
    },
    {
      type: "phone", 
      title: "Call Us",
      info: "+91 98765 43210",
      subInfo: "+91 87654 32109",
      icon: "Phone",
      active: true
    },
    {
      type: "address",
      title: "Visit Us", 
      info: "123 Political Hub Street",
      subInfo: "New Delhi, India - 110001",
      icon: "MapPin",
      active: true
    },
    {
      type: "hours",
      title: "Working Hours",
      info: "Mon - Fri: 9:00 AM - 6:00 PM",
      subInfo: "Sat: 10:00 AM - 4:00 PM", 
      icon: "Clock",
      active: true
    }
  ],
  officeDetails: {
    address: "123 Political Hub Street, New Delhi, India - 110001",
    description: "Located in the heart of New Delhi, easily accessible by metro and road",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674550090966!2d77.20918471508236!3d28.65671558240516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0683929575%3A0x1b8e2e4e7c8b8e8b!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin"
  },
  socialLinks: [
    {
      platform: "Facebook",
      url: "https://facebook.com/politicalcareer",
      active: true
    },
    {
      platform: "Twitter", 
      url: "https://twitter.com/politicalcareer",
      active: true
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/politicalcareer", 
      active: true
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/politicalcareer",
      active: true
    },
    {
      platform: "YouTube",
      url: "https://youtube.com/politicalcareer",
      active: true
    }
  ]
};

async function seedContactData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('🔄 Checking for existing contact data...');
    
    // Check if contact data already exists
    const existingContact = await Contact.findOne();
    
    if (existingContact) {
      console.log('⚠️  Contact data already exists!');
      console.log('📊 Current data summary:');
      console.log(`   - Contact Info: ${existingContact.contactInfo.length} items`);
      console.log(`   - Social Links: ${existingContact.socialLinks.length} items`);
      console.log(`   - Office Details: ${existingContact.officeDetails.address ? 'Set' : 'Not set'}`);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('Do you want to replace existing data? (y/N): ', (answer) => {
          rl.close();
          resolve(answer.toLowerCase());
        });
      });

      if (answer !== 'y' && answer !== 'yes') {
        console.log('❌ Seeding cancelled by user');
        process.exit(0);
      }

      console.log('🔄 Replacing existing contact data...');
      await Contact.findByIdAndDelete(existingContact._id);
    }

    console.log('🔄 Creating new contact data...');
    const newContact = new Contact(contactData);
    await newContact.save();

    console.log('✅ Contact data seeded successfully!');
    console.log('📊 Data inserted:');
    console.log(`   - Contact Info: ${newContact.contactInfo.length} items`);
    console.log(`     * Email: ${newContact.contactInfo.find(c => c.type === 'email')?.info}`);
    console.log(`     * Phone: ${newContact.contactInfo.find(c => c.type === 'phone')?.info}`);
    console.log(`     * Address: ${newContact.contactInfo.find(c => c.type === 'address')?.info}`);
    console.log(`     * Hours: ${newContact.contactInfo.find(c => c.type === 'hours')?.info}`);
    console.log(`   - Social Links: ${newContact.socialLinks.length} items`);
    newContact.socialLinks.forEach(link => {
      console.log(`     * ${link.platform}: ${link.url}`);
    });
    console.log(`   - Office Details: ${newContact.officeDetails.address}`);
    
  } catch (error) {
    console.error('❌ Error seeding contact data:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    console.log('🔄 Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  }
}

// Additional utility functions
async function viewContactData() {
  try {
    await mongoose.connect(MONGO_URI);
    const contact = await Contact.findOne();
    
    if (!contact) {
      console.log('❌ No contact data found in database');
      return;
    }

    console.log('📊 Current Contact Data:');
    console.log('=' .repeat(50));
    
    console.log('\n📞 Contact Information:');
    contact.contactInfo.forEach((info, index) => {
      console.log(`  ${index + 1}. ${info.title}`);
      console.log(`     Type: ${info.type}`);
      console.log(`     Info: ${info.info}`);
      console.log(`     Sub Info: ${info.subInfo || 'N/A'}`);
      console.log(`     Icon: ${info.icon}`);
      console.log(`     Active: ${info.active ? '✅' : '❌'}`);
      console.log();
    });

    console.log('🏢 Office Details:');
    console.log(`   Address: ${contact.officeDetails.address || 'Not set'}`);
    console.log(`   Description: ${contact.officeDetails.description || 'Not set'}`);
    console.log(`   Map URL: ${contact.officeDetails.mapUrl ? 'Set' : 'Not set'}`);
    
    console.log('\n🌐 Social Links:');
    contact.socialLinks.forEach((link, index) => {
      console.log(`  ${index + 1}. ${link.platform}: ${link.url} ${link.active ? '✅' : '❌'}`);
    });

    console.log('\n📈 Statistics:');
    console.log(`   Total Contact Info: ${contact.contactInfo.length}`);
    console.log(`   Active Contact Info: ${contact.activeContactInfoCount}`);
    console.log(`   Total Social Links: ${contact.socialLinks.length}`);
    console.log(`   Active Social Links: ${contact.activeSocialLinksCount}`);
    
  } catch (error) {
    console.error('❌ Error viewing contact data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function clearContactData() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const result = await Contact.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} contact document(s)`);
    
  } catch (error) {
    console.error('❌ Error clearing contact data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'seed':
  case undefined:
    seedContactData();
    break;
  case 'view':
    viewContactData();
    break;
  case 'clear':
    clearContactData();
    break;
  case 'help':
    console.log('📚 Contact Data Seeder Commands:');
    console.log('');
    console.log('  node seed.js           - Seed contact data into database');
    console.log('  node seed.js seed      - Seed contact data into database');
    console.log('  node seed.js view      - View current contact data');
    console.log('  node seed.js clear     - Clear all contact data');
    console.log('  node seed.js help      - Show this help message');
    console.log('');
    break;
  default:
    console.log(`❌ Unknown command: ${command}`);
    console.log('Use "node seed.js help" for available commands');
}

module.exports = {
  seedContactData,
  viewContactData, 
  clearContactData,
  contactData
};