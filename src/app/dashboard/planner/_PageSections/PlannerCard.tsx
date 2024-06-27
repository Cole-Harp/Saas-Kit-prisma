import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils/helpers';
import { Icons } from '@/components/Icons';
import { Todo, DayPlannerRow, DayPlanner } from '@prisma/client';
import { updateTodoIndexAndPlannerRow } from '@/lib/API/Database/planner/mutations';

export const GameDayPlanner = ({ dayPlanner }) => {
  const dayPlannerRows: DayPlannerRow[] = dayPlanner.dayPlannerRow; // Assuming dayPlanner object has a rows property

  return (
    <>
      {dayPlannerRows.map((row: DayPlannerRow) => (
        <div key={row.id} className='py-2'>
          <div className="priority text-center">{row.title}</div>
          {renderDayPlannerRow(row, row.todos ?? [])}
        </div>
      ))}
    </>
  );
};

const renderDayPlannerRow = (row: DayPlannerRow, todos) => {
  return (
    <div className='grid grid-cols-4'>
      {Array.from({ length: row.num_cols }).map((_, index) => (
        <div key={index} className='col-span-1 inline-flex'>
          <PlannerCard todo={todos[index]} index={index} rowId={row.id} />
          <Icons.Lock />
        </div>
      ))}
    </div>
  );
};

const PlannerCard = ({ todo, index, rowId }) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(todo || null);
  

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: async (item: Todo) => {
      setSelectedTodo(item);
      await updateTodoIndexAndPlannerRow(item.id, index, rowId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [todo]);

  return (
    <div ref={drop} className={`planner-card ${isOver ? 'highlight' : ''}`}>
{selectedTodo ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTodo.title}</CardTitle>
            <CardDescription>{selectedTodo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/todos/edit/${selectedTodo.id}`}
              className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mr-6')}
            >
              Edit
            </Link>
            {/* <Button onClick={Delete} variant="destructive">
              Delete
            </Button> */}
          </CardContent>
        </Card>
      ) : (
        <div className='p-2 border'>
          Drop a todo here
        </div>
      )}
    </div>
  );
};