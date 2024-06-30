'use server';

import { PrismaDBError } from '@/lib/utils/error';
import { GetUser } from '../user/queries';
import prisma from '../../Services/init/prisma';
import { Todo, DayPlanner, DayPlannerRow } from '@prisma/client';
import { cache } from 'react';
import { CreateDayPlanner } from './mutations';


export const GetDayPlanner = async (date: Date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let dayPlanner = await prisma.dayPlanner.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        todos: true,
        dayPlannerRow: {
          include: {
            todos: {
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });

    if (!dayPlanner) {
      dayPlanner = await CreateDayPlanner(date);
    }

    console.log("TOD", dayPlanner);
    return dayPlanner;
  } catch (err) {
    console.error(err);
    PrismaDBError(err);
    return null;
  }
};

export const GetTodoById = cache(async (id: number): Promise<Todo> => {
  try {
    const todo = await prisma.todo.findFirst({
      where: {
        id
      }
    });

    return todo;
  } catch (err) {
    PrismaDBError(err);
  }
});

export const GetAllTodos = cache(async (): Promise<Todo[]> => {
  try {
    const todos = await prisma.todo.findMany({
      take: 10
    });

    return todos;
  } catch (err) {
    PrismaDBError(err);
  }
});
