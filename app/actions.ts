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
        fields: undefined,
        // input.fields?.length
        //   ? {
        //       create: input.fields.map((field) => ({
        //         name: field.name,
        //       })),
        //     }
        //   : undefined,
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

  if (!input.name?.trim() && input.color === undefined) {
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
      // fields:
      //   input.fields === undefined
      //     ? undefined
      //     : {
      //         deleteMany: {},
      //         create: input.fields.map((field) => ({ name: field.name })),
      //       },
    },
    include: {
      fields: true,
    },
  });

  revalidatePath("/objects");
  revalidatePath(`/objects/${objectId}`);
  return object;
}

export async function updateObjectFields({
  objectId,
  fields,
}: {
  objectId: string;
  fields: {
    id?: string;
    name: string;
    fieldType?:
      | "TEXT"
      | "LONGTEXT"
      | "DATE"
      | "DATETIME"
      | "SELECT"
      | "MULTISELECT"
      | "ROUNDNUMBER";
    options?: string[];
    canEdit?: boolean;
    visible?: boolean;
  }[];
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

  const object = await prisma.$transaction(async (transaction) => {
    const ownedObject = await transaction.object.findFirst({
      where: { id: objectId, userId: user.id },
      select: { id: true },
    });

    if (!ownedObject) {
      throw new Error("Object not found");
    }

    const existingFields = await transaction.field.findMany({
      where: { objectId },
      select: { id: true },
    });
    const existingIds = new Set(existingFields.map((field) => field.id));
    const retainedIds = new Set<string>();

    for (const field of fields) {
      if (!field.id) {
        continue;
      }
      if (!existingIds.has(field.id) || retainedIds.has(field.id)) {
        throw new Error("Invalid field ID");
      }
      retainedIds.add(field.id);
    }

    const removedIds = existingFields
      .filter((field) => !retainedIds.has(field.id))
      .map((field) => field.id);

    if (removedIds.length > 0) {
      await transaction.field.deleteMany({
        where: { objectId, id: { in: removedIds } },
      });
    }

    for (const field of fields) {
      const data = {
        name: field.name,
        fieldType: field.fieldType ?? "TEXT",
        options: field.options ?? [],
        canEdit: field.canEdit ?? true,
        visible: field.visible ?? true,
      };

      if (field.id) {
        await transaction.field.update({
          where: { id: field.id },
          data,
        });
      } else {
        await transaction.field.create({
          data: { ...data, objectId },
        });
      }
    }

    return transaction.object.findUnique({
      where: { id: objectId },
      include: { fields: true },
    });
  });

  if (!object) {
    throw new Error("Object not found");
  }

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
