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
  color?: string;
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
        createdAt: new Date(),
        updatedAt: new Date(),
        color: input?.color || "blue",
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

type UpdateObjectInput = {
  name?: string;
  fields?: { name: string }[];
  color?: string | null;
};

export async function updateObject({
  objectId,
  input = {},
}: {
  objectId: string;
  input: UpdateObjectInput;
}) {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (
    !input.name?.trim() &&
    input.color === undefined &&
    input.fields === undefined
  ) {
    throw new Error("No updates provided");
  }

  const object = await prisma.object.update({
    where: {
      id: objectId,
      userId: user.id,
    },
    data: {
      name: input.name?.trim() || undefined,
      color: input.color,
      fields:
        input.fields === undefined
          ? undefined
          : {
              deleteMany: {},
              create: input.fields.map((field) => ({ name: field.name })),
            },
    },
    include: {
      fields: true,
    },
  });

  revalidatePath("/objects");
  revalidatePath(`/objects/${objectId}`);
  return object;
}

export async function deleteObject(objectId: string) {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async (transaction) => {
    const object = await transaction.object.findFirst({
      where: {
        id: objectId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!object) {
      throw new Error("Object not found");
    }

    // await transaction.changeLog.deleteMany({ where: { objectId } });
    await transaction.record.deleteMany({ where: { objectId } });
    await transaction.field.deleteMany({ where: { objectId } });
    await transaction.object.delete({
      where: {
        id: objectId,
        userId: user.id,
      },
    });
  });

  revalidatePath("/objects");
  revalidatePath(`/objects/${objectId}`);
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

export async function getObject(objectId: string) {
  try {
    const object = await prisma.object.findUnique({
      where: {
        id: objectId,
      },
      include: {
        fields: true,
      },
    });

    return object;
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
