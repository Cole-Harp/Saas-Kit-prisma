'use server';

import prisma, { Prisma } from '../../Services/init/prisma';
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

export const CreateDayPlanner = async ({ title, description }: plannerSettingsFormValues) => {
    const user = await GetUser();

    const user_id = user?.id;
    const author = user?.display_name || '';
    const data: Prisma.DayPlannerCreateInput = {
        date: new Date(),
        user: { connect: { id: user_id } },
        dayPlannerRow: { create: { title: 'DayPlannerRow Default', num_cols: 0, num_rows: 0, category: PlannerRowCategory.HOME } }
    };

    try {
        await prisma.dayPlanner.create({ data });
    } catch (err) {
        PrismaDBError(err);
    }
};

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
