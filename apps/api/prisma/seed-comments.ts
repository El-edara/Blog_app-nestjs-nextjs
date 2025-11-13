// prisma/seed-comments.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('💬 Starting comments seeding...\n');

  // ========== 1. Get existing users and posts ==========
  console.log('📊 Fetching existing data...');

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  const posts = await prisma.post.findMany({
    select: { id: true, title: true, authorId: true },
  });

  if (users.length === 0) {
    console.log('❌ No users found! Please run the main seed first.');
    return;
  }

  if (posts.length === 0) {
    console.log('❌ No posts found! Please run the main seed first.');
    return;
  }

  console.log(`✅ Found ${users.length} users and ${posts.length} posts\n`);

  // ========== 2. Clear existing comments (optional) ==========
  console.log('🗑️  Clearing existing comments...');
  const deletedCount = await prisma.comment.deleteMany();
  console.log(`✅ Deleted ${deletedCount.count} old comments\n`);

  // ========== 3. Create comments ==========
  console.log('💬 Creating comments...');

  let totalComments = 0;

  for (const post of posts) {
    // Each post gets 3-7 random comments
    const numComments = faker.number.int({ min: 3, max: 7 });

    console.log(
      `📝 Adding ${numComments} comments to: "${post.title.substring(0, 50)}..."`,
    );

    await Promise.all(
      Array.from({ length: numComments }, async () => {
        // Pick a random user (try to avoid post author)
        const otherUsers = users.filter((u) => u.id !== post.authorId);
        const randomUser =
          otherUsers.length > 0
            ? faker.helpers.arrayElement(otherUsers)
            : faker.helpers.arrayElement(users);

        await prisma.comment.create({
          data: {
            description: faker.lorem.paragraph(
              faker.number.int({ min: 1, max: 3 }),
            ),
            authorId: randomUser.id,
            postId: post.id,
            createdAt: faker.date.between({
              from: new Date(2024, 0, 1),
              to: new Date(),
            }),
          },
        });
        totalComments++;
      }),
    );
  }

  console.log(`\n✅ Created ${totalComments} comments total!\n`);

  // ========== 4. Summary ==========
  console.log('📊 Comments Seeding Summary:');
  console.log('============================');
  console.log(`👥 Users: ${users.length}`);
  console.log(`📝 Posts: ${posts.length}`);
  console.log(`💬 Comments: ${totalComments}`);
  console.log(
    `📈 Average: ${(totalComments / posts.length).toFixed(1)} comments per post`,
  );
  console.log('\n🎉 Comments seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during comments seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
