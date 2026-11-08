"use server";

import prisma from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { stringifyCsv } from "@/lib/csv";

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

async function getOrCreateAuthenticatedUser() {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();
  const auth0id = session?.user?.sub;

  if (!email || !auth0id) {
    return null;
  }

  const userByAuth0Id = await prisma.user.findFirst({ where: { auth0id } });
  if (userByAuth0Id) {
    return userByAuth0Id;
  }

  const userByEmail = await prisma.user.findUnique({ where: { email } });
  if (userByEmail) {
    if (userByEmail.auth0id && userByEmail.auth0id !== auth0id) {
      return null;
    }
    return prisma.user.update({
      where: { id: userByEmail.id },
      data: { auth0id },
    });
  }

  return prisma.user.create({
    data: {
      email,
      username: email,
      name: session.user.name ?? "Imported User",
      auth0id,
    },
  });
}

export async function getCurrentUserProfile() {
  const user = await getOrCreateAuthenticatedUser();
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
  };
}

export async function updateCurrentUserProfile({
  username,
  name,
}: {
  username: string;
  name: string;
}) {
  const user = await getOrCreateAuthenticatedUser();
  if (!user) {
    return {
      ok: false as const,
      error: "You must be logged in to edit your profile.",
    };
  }

  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    return { ok: false as const, error: "Username is required." };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username: { equals: normalizedUsername, mode: "insensitive" },
      id: { not: user.id },
    },
    select: { id: true },
  });
  if (existingUser) {
    return { ok: false as const, error: "That username is already taken." };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      username: normalizedUsername,
      name: name.trim() || null,
    },
  });

  revalidatePath("/profile");
  return {
    ok: true as const,
    profile: {
      username: updatedUser.username ?? "",
      name: updatedUser.name ?? "",
    },
  };
}

export async function createObject({
  input = {},
}: {
  input: CreateObjectInput;
}) {
  try {
    const user = await getOrCreateAuthenticatedUser();
    if (!user) {
      throw new Error("Unauthorized");
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
  revalidatePath("/fields");
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

  const ownedObject = await prisma.object.findFirst({
    where: { id: objectId, userId: user.id },
    select: { id: true },
  });

  if (!ownedObject) {
    throw new Error("Object not found");
  }

  const existingFields = await prisma.field.findMany({
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

  for (const field of fields) {
    const data = {
      name: field.name,
      fieldType: field.fieldType ?? "TEXT",
      options: field.options ?? [],
      canEdit: field.canEdit ?? true,
      visible: field.visible ?? true,
    };

    if (field.id) {
      await prisma.field.update({
        where: { id: field.id },
        data,
      });
    } else {
      await prisma.field.create({
        data: { ...data, objectId },
      });
    }
  }

  const removedIds = existingFields
    .filter((field) => !retainedIds.has(field.id))
    .map((field) => field.id);

  if (removedIds.length > 0) {
    await prisma.field.deleteMany({
      where: { objectId, id: { in: removedIds } },
    });
  }

  const object = await prisma.object.findUnique({
    where: { id: objectId },
    include: { fields: true },
  });

  if (!object) {
    throw new Error("Object not found");
  }

  revalidatePath("/objects");
  revalidatePath(`/objects/${objectId}`);
  revalidatePath("/fields");
  return object;
}

type RecordFieldType =
  | "TEXT"
  | "LONGTEXT"
  | "DATE"
  | "DATETIME"
  | "SELECT"
  | "MULTISELECT"
  | "ROUNDNUMBER";

type RecordFieldInputValue = string | string[] | number | null;

const RECORD_VALUE_KEYS: Record<RecordFieldType, string> = {
  TEXT: "text_value",
  LONGTEXT: "longtext_value",
  DATE: "date_value",
  DATETIME: "datetime_value",
  SELECT: "select_value",
  MULTISELECT: "multiselect_value",
  ROUNDNUMBER: "roundnumber_value",
};

function normalizeRecordFieldValue(
  fieldType: RecordFieldType,
  options: string[],
  input: RecordFieldInputValue | undefined,
): RecordFieldInputValue {
  switch (fieldType) {
    case "TEXT":
    case "LONGTEXT":
    case "DATE":
    case "DATETIME":
    case "SELECT": {
      const value = input ?? "";
      if (typeof value !== "string") {
        throw new Error("Invalid field value");
      }
      if (fieldType === "SELECT" && value && !options.includes(value)) {
        throw new Error("Invalid select option");
      }
      return value;
    }
    case "MULTISELECT": {
      const value = input ?? [];
      if (
        !Array.isArray(value) ||
        !value.every((option) => typeof option === "string") ||
        value.some((option) => !options.includes(option))
      ) {
        throw new Error("Invalid multiselect options");
      }
      return value;
    }
    case "ROUNDNUMBER": {
      if (input === null || input === undefined || input === "") {
        return null;
      }
      if (typeof input !== "number" || !Number.isFinite(input)) {
        throw new Error("Invalid number value");
      }
      return input;
    }
  }
}

const MAX_IMPORTED_RECORDS = 100;
const IMPORT_STATUS_HEADER = "Import status";

function sanitizeCsvValue(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function validateImportedField(
  field: { fieldType: RecordFieldType; options: string[] },
  rawValue: string,
): { value: RecordFieldInputValue; error?: string } {
  const value = sanitizeCsvValue(rawValue);

  switch (field.fieldType) {
    case "TEXT":
    case "LONGTEXT":
      return { value };
    case "DATE":
      return !value || isValidDate(value)
        ? { value }
        : { value, error: "must be a valid YYYY-MM-DD date" };
    case "DATETIME": {
      if (!value) {
        return { value };
      }
      const datePart = value.slice(0, 10);
      const isDateTime =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/.test(
          value,
        ) && isValidDate(datePart);
      return isDateTime && !Number.isNaN(Date.parse(value))
        ? { value }
        : { value, error: "must be a valid ISO date and time" };
    }
    case "SELECT":
      return !value || field.options.includes(value)
        ? { value }
        : { value, error: `must match an option: ${field.options.join(", ")}` };
    case "MULTISELECT": {
      const values = value ? value.split(";").map(sanitizeCsvValue) : [];
      const invalidOption = values.find(
        (option) => !option || !field.options.includes(option),
      );
      return invalidOption
        ? {
            value: values,
            error: `contains an invalid option: ${invalidOption}`,
          }
        : { value: values };
    }
    case "ROUNDNUMBER": {
      if (!value) {
        return { value: null };
      }
      const number = Number(value);
      return Number.isFinite(number)
        ? { value: number }
        : { value, error: "must be a finite number" };
    }
  }
}

function buildImportStatusCsv(
  headers: string[],
  rows: string[][],
  statuses: string[],
) {
  const statusIndexes = new Set(
    headers.flatMap((header, index) =>
      header.trim().toLowerCase() === IMPORT_STATUS_HEADER.toLowerCase()
        ? [index]
        : [],
    ),
  );
  const cleanHeaders = headers.filter((_, index) => !statusIndexes.has(index));
  const cleanRows = rows.map((row) =>
    row.filter((_, index) => !statusIndexes.has(index)),
  );

  return stringifyCsv([
    [...cleanHeaders, IMPORT_STATUS_HEADER],
    ...cleanRows.map((row, index) => [
      ...row,
      statuses[index] ?? "ERROR: row could not be validated",
    ]),
  ]);
}

export async function importRecordsFromCsv({
  objectId,
  headers,
  rows,
}: {
  objectId: string;
  headers: string[];
  rows: string[][];
}): Promise<
  | { ok: true; importedCount: number }
  | { ok: false; invalidFieldCount: number; message: string; csv: string }
> {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (
    !Array.isArray(headers) ||
    !Array.isArray(rows) ||
    headers.length === 0 ||
    headers.length > 250 ||
    !headers.every((header) => typeof header === "string") ||
    rows.length === 0 ||
    rows.some(
      (row) =>
        !Array.isArray(row) ||
        row.length > headers.length ||
        row.some((value) => typeof value !== "string"),
    )
  ) {
    throw new Error("Invalid CSV data");
  }

  const object = await prisma.object.findFirst({
    where: { id: objectId, userId: user.id },
    include: { fields: true },
  });
  if (!object) {
    throw new Error("Object not found");
  }

  const importableFields = object.fields.filter(
    (field) => field.visible && field.canEdit,
  );
  const statusIndexes = new Set(
    headers.flatMap((header, index) =>
      header.trim().toLowerCase() === IMPORT_STATUS_HEADER.toLowerCase()
        ? [index]
        : [],
    ),
  );
  const indexesByHeader = new Map<string, number[]>();
  headers.forEach((header, index) => {
    if (statusIndexes.has(index)) {
      return;
    }
    const normalized = header.trim().toLowerCase();
    indexesByHeader.set(normalized, [
      ...(indexesByHeader.get(normalized) ?? []),
      index,
    ]);
  });

  const expectedHeaders = [
    "record name",
    ...importableFields.map((field) => field.name.trim().toLowerCase()),
  ];
  const missingHeaders = expectedHeaders.filter(
    (header) => !indexesByHeader.has(header),
  );
  const duplicateHeaders = [...indexesByHeader.entries()]
    .filter(([, indexes]) => indexes.length > 1)
    .map(([header]) => header);
  const unknownHeaders = [...indexesByHeader.keys()].filter(
    (header) => !expectedHeaders.includes(header),
  );

  if (rows.length > MAX_IMPORTED_RECORDS) {
    const statuses = rows.map(() => "ERROR: maximum of 100 records per upload");
    return {
      ok: false,
      invalidFieldCount: 0,
      message: `This CSV contains ${rows.length} records; the maximum is ${MAX_IMPORTED_RECORDS}.`,
      csv: buildImportStatusCsv(headers, rows, statuses),
    };
  }

  const normalizedRows: {
    name: string;
    objectId: string;
    fields: Prisma.InputJsonValue;
  }[] = [];
  const rowErrors: string[][] = [];

  for (const row of rows) {
    const errors: string[] = [];
    if (row.length !== headers.length) {
      errors.push("row has a different number of columns than the header");
    }
    for (const header of missingHeaders) {
      errors.push(`missing required column: ${header}`);
    }
    for (const header of duplicateHeaders) {
      errors.push(`duplicate column: ${header}`);
    }
    for (const header of unknownHeaders) {
      errors.push(`unknown column: ${header}`);
    }

    const nameIndex = indexesByHeader.get("record name")?.[0];
    const recordName =
      nameIndex === undefined ? "" : sanitizeCsvValue(row[nameIndex] ?? "");
    if (!recordName) {
      errors.push("record name is required");
    }

    const recordFields: Record<string, Prisma.InputJsonValue> = {};
    for (const field of object.fields) {
      const fieldType = field.fieldType as RecordFieldType;
      const index = indexesByHeader.get(field.name.trim().toLowerCase())?.[0];
      const result =
        field.visible && field.canEdit
          ? validateImportedField(
              { fieldType, options: field.options },
              index === undefined ? "" : (row[index] ?? ""),
            )
          : {
              value: normalizeRecordFieldValue(
                fieldType,
                field.options,
                undefined,
              ),
            };
      if (result.error) {
        errors.push(`${field.name}: ${result.error}`);
      }
      recordFields[field.id] = {
        field_id: field.id,
        field_name: field.name,
        field_type: fieldType,
        [RECORD_VALUE_KEYS[fieldType]]: result.value,
        computed_value: result.value,
      } as Prisma.InputJsonValue;
    }

    rowErrors.push(errors);
    if (errors.length === 0) {
      normalizedRows.push({
        name: recordName,
        objectId,
        fields: recordFields,
      });
    }
  }

  const invalidFieldCount = rowErrors.reduce(
    (total, errors) => total + errors.length,
    0,
  );
  if (invalidFieldCount > 0) {
    const statuses = rowErrors.map((errors) =>
      errors.length === 0 ? "OK" : `ERROR: ${errors.join("; ")}`,
    );
    return {
      ok: false,
      invalidFieldCount,
      message: `${invalidFieldCount} field value${invalidFieldCount === 1 ? " was" : "s were"} missing or incorrect. No records were imported.`,
      csv: buildImportStatusCsv(headers, rows, statuses),
    };
  }

  if (normalizedRows.length > 0) {
    await prisma.record.createMany({ data: normalizedRows });
    revalidatePath(`/objects/${objectId}`);
    revalidatePath(`/records/${objectId}`);
    revalidatePath("/fields");
  }

  return { ok: true, importedCount: normalizedRows.length };
}

export async function createRecord({
  objectId,
  name,
  values,
}: {
  objectId: string;
  name: string;
  values: Record<string, RecordFieldInputValue>;
}) {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Unauthorized");
  }

  const recordName = name.trim();
  if (!recordName) {
    throw new Error("A record name is required");
  }

  const object = await prisma.object.findFirst({
    where: { id: objectId, userId: user.id },
    include: { fields: true },
  });
  if (!object) {
    throw new Error("Object not found");
  }

  const fieldIds = new Set(object.fields.map((field) => field.id));
  if (Object.keys(values).some((fieldId) => !fieldIds.has(fieldId))) {
    throw new Error("Invalid field ID");
  }

  const recordFields: Record<string, Prisma.InputJsonValue> = {};
  for (const field of object.fields) {
    const fieldType = field.fieldType as RecordFieldType;
    const input = field.visible && field.canEdit ? values[field.id] : undefined;
    const value = normalizeRecordFieldValue(fieldType, field.options, input);
    recordFields[field.id] = {
      field_id: field.id,
      field_name: field.name,
      field_type: fieldType,
      [RECORD_VALUE_KEYS[fieldType]]: value,
      computed_value: value,
    };
  }

  const record = await prisma.record.create({
    data: {
      name: recordName,
      objectId,
      fields: recordFields,
    },
    select: { id: true },
  });

  revalidatePath(`/objects/${objectId}`);
  revalidatePath(`/records/${objectId}`);
  revalidatePath("/fields");
  return record;
}

export async function getRecords(objectId: string, page = 1, pageSize = 10) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Invalid page");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("Invalid page size");
  }

  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Unauthorized");
  }

  const object = await prisma.object.findFirst({
    where: { id: objectId, userId: user.id },
    select: { id: true },
  });
  if (!object) {
    throw new Error("Object not found");
  }

  const where = { objectId };
  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.record.count({ where }),
  ]);

  return {
    records,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateRecord({
  objectId,
  recordId,
  name,
  values,
}: {
  objectId: string;
  recordId: string;
  name: string;
  values: Record<string, RecordFieldInputValue>;
}) {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Unauthorized");
  }

  const recordName = name.trim();
  if (!recordName) {
    throw new Error("A record name is required");
  }

  const object = await prisma.object.findFirst({
    where: { id: objectId, userId: user.id },
    include: { fields: true },
  });
  if (!object) {
    throw new Error("Object not found");
  }

  const record = await prisma.record.findFirst({
    where: { id: recordId, objectId },
  });
  if (!record) {
    throw new Error("Record not found");
  }

  const editableFields = new Map(
    object.fields
      .filter((field) => field.visible && field.canEdit)
      .map((field) => [field.id, field]),
  );
  const recordFields: Record<string, Prisma.InputJsonValue> =
    record.fields &&
    typeof record.fields === "object" &&
    !Array.isArray(record.fields)
      ? (record.fields as unknown as Record<string, Prisma.InputJsonValue>)
      : {};

  for (const [fieldId, input] of Object.entries(values)) {
    const field = editableFields.get(fieldId);
    if (!field) {
      throw new Error("Invalid field ID");
    }

    const fieldType = field.fieldType as RecordFieldType;
    const value = normalizeRecordFieldValue(fieldType, field.options, input);
    const currentValue = recordFields[fieldId];
    const currentField =
      currentValue &&
      typeof currentValue === "object" &&
      !Array.isArray(currentValue)
        ? (currentValue as Record<string, Prisma.InputJsonValue>)
        : {};

    recordFields[fieldId] = {
      ...currentField,
      field_id: field.id,
      field_name: field.name,
      field_type: fieldType,
      [RECORD_VALUE_KEYS[fieldType]]: value,
      computed_value: value,
    };
  }

  const updatedRecord = await prisma.record.update({
    where: { id: recordId },
    data: { name: recordName, fields: recordFields },
    select: { id: true },
  });

  revalidatePath(`/objects/${objectId}`);
  revalidatePath(`/records/${objectId}`);
  revalidatePath("/fields");
  return updatedRecord;
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

export async function getObjectsWithRecentRecords() {
  const session = await auth0.getSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return [];
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return [];
  }

  return prisma.object.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      fields: true,
      records: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function getObject(objectId: string) {
  try {
    const session = await auth0.getSession();
    const email = session?.user?.email?.toLowerCase();
    if (!email) {
      return null;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const object = await prisma.object.findFirst({
      where: {
        id: objectId,
        userId: user.id,
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
