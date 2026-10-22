"use server";

import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// READ actions
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // revalidatePath("/users");

    return users;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}

export async function getObjects(id: string) {
  try {
    const objects = await prisma.object.findMany({
      where: {
        id: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // revalidatePath("/users");

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
      orderBy: {
        createdAt: "desc",
      },
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
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return fields;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
