import { PrismaDBError } from '@/lib/utils/error';
import { GetUser } from '../user/queries';
import prisma from '../../Services/init/prisma';
import { Todo, DayPlanner, DayPlannerRow } from '@prisma/client';
import { cache } from 'react';


export const GetDayPlanner = async () => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const dayPlanner = await prisma.dayPlanner.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                todos: true, // Assuming direct relation to todos
                dayPlannerRow: {
                    include: {
                        todos: {
                            orderBy: {
                                index: 'asc' // Assuming 'index' is the field you want to sort by
                            }
                    }
                }
            }
        }
        });

        console.log("TOD", dayPlanner);
        return dayPlanner;
    } catch (err) {
        console.error(err);
        // Assuming PrismaDBError is a custom function for handling errors
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
