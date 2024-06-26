import { useDrop } from 'react-dnd';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils/helpers';
import { Icons } from '@/components/Icons';
import { Todo, DayPlannerRow } from '@prisma/client';

export const GameDayPlanner = ({topTodos: Todo, dayPlannerRow: DayPlannerRow}) => {

  const num_high_priority_todos = 3;

  return (
    <>
      <div className='grid grid-cols-4'>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className='col-span-1 inline-flex'>
            <PlannerCard />
            <Icons.Lock />
          </div>
        ))}
      </div>
    </>
  );
}

function PlannerCard() {
  const [todo, setTodo] = useState(null);  // State to track the todo

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: (item, monitor) => {
      setTodo(item);  // Set the dropped todo item to the state
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ background: isOver ? 'lightgreen' : 'white' }}>
      {todo ? (
        <>
          <Card>
      <CardHeader>
        <CardTitle>{todo.title}</CardTitle>
        <CardDescription>{todo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={`/dashboard/todos/edit/${todo.id}`}
          className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mr-6')}
        >
          Edit
        </Link>
        {/* <Button onClick={Delete} variant="destructive">
          Delete
        </Button> */}
      </CardContent>
    </Card>
        </>
      ) : (
        <div className='p-2'>
          Drop a todo here
        </div>
      )}
    </div>
  );
}