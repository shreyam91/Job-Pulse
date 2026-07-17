import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function main() {
  console.log('Seeding database...');

  // Clean up existing data (optional, but good for local dev)
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create dummy user
  const user = await prisma.user.create({
    data: {
      id: 'dummy_user_123',
      email: 'jordan@example.com',
      name: 'Jordan Lee',
    },
  });

  // Create some companies
  const company1 = await prisma.company.create({ data: { name: 'Stripe', website: 'stripe.com' } });
  const company2 = await prisma.company.create({ data: { name: 'Vercel', website: 'vercel.com' } });
  const company3 = await prisma.company.create({ data: { name: 'Linear', website: 'linear.app' } });

  // Create some jobs
  const job1 = await prisma.job.create({
    data: { companyId: company1.id, title: 'Frontend Engineer', location: 'San Francisco, CA', workPreference: 'Hybrid' },
  });
  const job2 = await prisma.job.create({
    data: { companyId: company2.id, title: 'Software Engineer, UI', location: 'Remote', workPreference: 'Remote' },
  });
  const job3 = await prisma.job.create({
    data: { companyId: company3.id, title: 'Product Engineer', location: 'Remote', workPreference: 'Remote' },
  });
  const job4 = await prisma.job.create({
    data: { companyId: company1.id, title: 'Full Stack Developer', location: 'San Francisco, CA', workPreference: 'Onsite' },
  });

  // Create applications
  await prisma.application.create({
    data: { userId: user.id, jobId: job1.id, status: 'Interview', notes: 'First round next Tuesday' },
  });
  await prisma.application.create({
    data: { userId: user.id, jobId: job2.id, status: 'Applied', appliedAt: new Date() },
  });
  await prisma.application.create({
    data: { userId: user.id, jobId: job3.id, status: 'Saved' },
  });
  await prisma.application.create({
    data: { userId: user.id, jobId: job4.id, status: 'Offer', notes: 'Pending background check' },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
