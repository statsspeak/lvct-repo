import {
  PrismaClient,
  Role,
  TestStatus,
  CommunicationMethod,
  CommunicationOutcome,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password", 10);

  // Create users
  const roles = [
    Role.ADMIN,
    Role.STAFF,
    Role.LAB_TECHNICIAN,
    Role.CALL_CENTER_AGENT,
  ];
  const users = await Promise.all(
    roles.map(async (role) => {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password,
          role,
        },
      });
      return user;
    })
  );

  // Create sample patients
  const patients = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.patient.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          dateOfBirth: faker.date.past({ years: 50 }),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          qrCode: faker.string.alphanumeric(10),
          createdBy: users[1].id, // Staff member creates patients
          address: faker.location.streetAddress(),
          hivStatus: faker.helpers.arrayElement(['POSITIVE', 'NEGATIVE', 'UNKNOWN']),
        },
      });
    })
  );

  // Create sample tests
  const tests = await Promise.all(
    patients.map(async (patient) => {
      return await prisma.test.create({
        data: {
          patientId: patient.id,
          status: faker.helpers.arrayElement(Object.values(TestStatus)),
          collectionDate: faker.date.recent(),
          createdBy: users[2].id, // Lab technician creates tests
        },
      });
    })
  );

  // Create sample communications
  await Promise.all(
    tests.map(async (test) => {
      return await prisma.communication.create({
        data: {
          patientId: test.patientId,
          testId: test.id,
          method: faker.helpers.arrayElement(
            Object.values(CommunicationMethod)
          ),
          outcome: faker.helpers.arrayElement(
            Object.values(CommunicationOutcome)
          ),
          communicatedBy: users[3].id, // Call center agent creates communications
          notes: faker.lorem.sentence(),
          followUpDate: faker.date.future(),
        },
      });
    })
  );

  // Create sample audit logs
  await Promise.all(
    users.map(async (user) => {
      return await prisma.auditLog.create({
        data: {
          userId: user.id,
          event: "USER_LOGIN",
          details: `${user.name} logged in`,
        },
      });
    })
  );

  // Create sample user preferences
  await Promise.all(
    users.map(async (user) => {
      return await prisma.userPreference.create({
        data: {
          userId: user.id,
          theme: faker.helpers.arrayElement(["light", "dark"]),
          dashboardLayout: JSON.stringify({
            widgets: faker.helpers.arrayElements(
              ["calendar", "tasks", "notifications", "statistics"],
              { min: 2, max: 4 }
            ),
          }),
        },
      });
    })
  );

  // Create sample notifications
  await Promise.all(
    users.map(async (user) => {
      return await prisma.notification.create({
        data: {
          userId: user.id,
          message: faker.lorem.sentence(),
          read: faker.datatype.boolean(),
        },
      });
    })
  );

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
