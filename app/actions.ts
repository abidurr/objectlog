"use server";

import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
import { revalidatePath } from "next/cache";

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
  input = {},
}: {
  input: CreateObjectInput;
}) {
  try {
    const session = await auth0.getSession();
    const email = session?.user?.email?.toLowerCase();

    if (!email) {
      throw new Error("Unauthorized");
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: email,
          name: session?.user?.name ?? "Imported User",
        },
      });
    }

    const object = await prisma.object.create({
      data: {
        name: input.name?.trim() || "Untitled object",
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

    revalidatePath("/objects");
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
