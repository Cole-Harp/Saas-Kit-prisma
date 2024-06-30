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

export const CreateDayPlanner = async (date) => {
  const user = await GetUser();
  const userId = user?.id;

  date.setHours(0, 0, 0, 0);

  // Fetch all dayPlannerConfigs associated with the user ID
  const userDayPlannerConfigs = await prisma.dayPlannerConfig.findMany({
    where: {
      user_id: userId,
    },
  });

  let dayPlanner;
  if (userDayPlannerConfigs.length > 0) {
    // Create today's day planner and include dayPlannerRow in the result
    dayPlanner = await prisma.dayPlanner.create({
      data: {
        date: date,
        user_id: userId,
        dayPlannerRow: {
          create: userDayPlannerConfigs.map(config => ({
            category: config.category as PlannerRowCategory,
            index: config.index,
            num_cols: 0,
            num_rows: 0,
          })),
        },
      },
      include: {
        dayPlannerRow: true, // Include the dayPlannerRows in the returned object
      },
    });
  }

  return dayPlanner;
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
