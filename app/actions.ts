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
