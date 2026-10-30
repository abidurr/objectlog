"use server";

import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// READ actions
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      // orderBy: {
      //   createdAt: "desc",
      // },
    });

    // revalidatePath("/users");

    return users;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

type CreateObjectInput = {
  name?: string;
  fields?: { name: string }[];
};

export async function createObject({
  userId,
  email,
  input = {},
}: {
  userId: string;
  email: string;
  input: CreateObjectInput;
}) {
  try {
    // 1) Check if user exists in this app's DB
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // 2) If not, create a minimal fallback user
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId, // if this is a valid Mongo ObjectId string
          email: email,
          username: email,
          name: "Imported User",
        },
      });
    }

    // 3) Create the object
    const object = await prisma.object.create({
      data: {
        name: input.name ?? "Untitled object",
        userId: user.id,
        fields: input.fields?.length
          ? {
              create: input.fields.map((field) => ({
                name: field.name,
              })),
            }
          : undefined,
      },
      include: {
        fields: true,
      },
    });

    return object;
  } catch (error) {
    console.error("createObject error:", error);
    throw new Error("Failed to create object");
  }
}

export async function getObjects(userEmail: string) {
  try {
    const email = await prisma.user.findMany({
      where: {
        email: userEmail,
      },
    });

    const user = email.pop();
    if (!user) {
      return [];
    }

    const objects = await prisma.object.findMany({
      where: {
        userId: user.id,
      },
    });
    return objects;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export async function getFields(objectId: string) {
  try {
    const fields = await prisma.field.findMany({
      where: {
        objectId: objectId,
      },
      // orderBy: {
      //   createdAt: "desc",
      // },
    });

    return fields;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export async function getAllFields(userId: string) {
  try {
    const fields = await prisma.field.findMany({
      where: {
        object: { userId },
      },
      // orderBy: {
      //   createdAt: "desc",
      // },
    });

    return fields;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
