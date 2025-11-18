// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...\n');

  // ========== 1. Clear existing data ==========
  console.log('🗑️  Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleared!\n');

  // ========== 2. Create Users ==========
  console.log('👥 Creating users...');

  const password = 'Password123*';
  const hashedPassword = await argon2.hash(password);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@blog.com',
      password: hashedPassword,
      role: Role.ADMIN,
      avatarUrl: faker.image.avatar(),
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // Create Regular Users
  const users = await Promise.all(
    Array.from({ length: 5 }, async (_, i) => {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: `user${i + 1}@blog.com`,
          password: hashedPassword,
          role: Role.USER,
          avatarUrl: faker.image.avatar(),
        },
      });
      console.log(`✅ Created User: ${user.email} - ${user.name}`);
      return user;
    }),
  );

  const allUsers = [admin, ...users];
  console.log(`\n✅ Created ${allUsers.length} users total!\n`);

  // ========== 3. Create Posts ==========
  console.log('📝 Creating posts...');

  let totalPosts = 0;

  for (const user of allUsers) {
    // Each user creates 3-5 posts
    const numPosts = faker.number.int({ min: 3, max: 5 });

    await Promise.all(
      Array.from({ length: numPosts }, async () => {
        const post = await prisma.post.create({
          data: {
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            description: faker.lorem.paragraphs(
              faker.number.int({ min: 2, max: 4 }),
              '\n\n',
            ),
            published: faker.datatype.boolean(0.7), // 70% published
            authorId: user.id,
            createdAt: faker.date.past({ years: 1 }),
          },
        });
        totalPosts++;
        return post;
      }),
    );

    console.log(`✅ Created ${numPosts} posts for ${user.name}`);
  }

  console.log(`\n✅ Created ${totalPosts} posts total!\n`);

  // ========== 4. Summary ==========
  console.log('📊 Seeding Summary:');
  console.log('==================');
  console.log(`👥 Users: ${allUsers.length}`);
  console.log(`   - Admins: 1`);
  console.log(`   - Regular Users: ${users.length}`);
  console.log(`📝 Posts: ${totalPosts}`);
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('==================');
  console.log('Admin:');
  console.log('  Email: admin@blog.com');
  console.log('  Password: Password123*\n');
  console.log('Users:');
  console.log('  Email: user1@blog.com, user2@blog.com, ..., user5@blog.com');
  console.log('  Password: Password123*');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
