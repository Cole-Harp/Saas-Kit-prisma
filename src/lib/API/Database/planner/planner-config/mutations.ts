'use server';

import prisma, { Prisma } from '@/lib/API/Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';
import { plannerSettingsFormValues } from '@/lib/types/validations';
import { PlannerRowCategory } from '@prisma/client';

interface UpdateTodoPropsI extends plannerSettingsFormValues {
  id: number;
}

interface DeleteTodoPropsI {
  id: number;
}

export async function CreatePlannerRowConfig(category: string, userId: string) {
  try {
    const plannerRowConfig = await prisma.dayPlannerConfig.create({
      data: {
        category,
        user_id: userId, // Assuming the user_id is passed to this function
      },
    });
    return plannerRowConfig;
  } catch (error) {
    console.error('Failed to create Planner Row Config:', error);
    throw error;
  }
}

export async function GetPlannerRowConfig() {
  try {
    const plannerRowConfig = await prisma.dayPlannerConfig.findMany({
      orderBy: {
        index: 'asc',
      },
    });
    return plannerRowConfig;
  } catch (error) {
    console.error('Failed to get Planner Row Config:', error);
    throw error;
  }
}


export async function updateTodoIndexAndPlannerRow(todoId: number, newIndex: number, dayPlannerRowId: number) {
  const updatedTodo = await prisma.todo.update({
    where: { id: todoId },
    data: {
      index: newIndex,
      // Update the relation to DayPlannerRow
      dayPlannerRow: {
        connect: { id: dayPlannerRowId }, // Correctly connect the Todo to the specified DayPlannerRow
      },
    },
  });
  return updatedTodo;
}

export const UpdateTodo = async ({ id, title, description }: UpdateTodoPropsI) => {
  const data: Prisma.TodoUpdateInput = {
    title,
    description
  };

  try {
    await prisma.todo.update({
      where: {
        id
      },
      data
    });
  } catch (err) {
    PrismaDBError(err);
  }
};

export const DeleteTodo = async ({ id }: DeleteTodoPropsI) => {
  try {
    await prisma.todo.delete({
      where: {
        id
      }
    });
  } catch (err) {
    PrismaDBError(err);
  }
};
