import { useDrop } from 'react-dnd';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils/helpers';
import { Icons } from '@/components/Icons';
import { Todo, DayPlannerRow, DayPlanner } from '@prisma/client';
import { CreateDayPlanner, updateTodoIndexAndPlannerRow } from '@/lib/API/Database/planner/mutations';
import { addDays, startOfDay } from 'date-fns'; // For date manipulation
import { GetDayPlanner } from '@/lib/API/Database/planner/queries'; // Assuming this is the correct import path

export const GameDayPlanner = ({initDayPlanner}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayPlanner, setDayPlanner] = useState(initDayPlanner);

  const fetchDayPlanner = useCallback(async () => {
    let planner = await GetDayPlanner(startOfDay(currentDate));

    setDayPlanner(planner);
  }, [currentDate]);

  useEffect(() => {
    fetchDayPlanner();
  }, [fetchDayPlanner]);

  const goPreviousDay = () => setCurrentDate(prevDate => addDays(prevDate, -1));
  const goNextDay = () => setCurrentDate(prevDate => addDays(prevDate, 1));

  return (
    <>
      <div className="navigation">
        <button onClick={goPreviousDay}>←</button>
        <button onClick={goNextDay}>→</button>
      </div>
      {dayPlanner && dayPlanner.dayPlannerRow.map((row: DayPlannerRow) => (
            <div key={row.id} className='py-2'>
              <div className="text-center" ><PlannerTitle row={row} handleEditTitle={undefined}/></div>
              <DisplayDayPlannerRow row={row} initialTodos={row.todos ?? []} />
            </div>
          ))}
    </>
  );
};

const Arrow = ({ color }) => (
  <div className={`mx-1 text-${color}`}>→</div>
);



const DisplayDayPlannerRow = ({ row, initialTodos }) => {
  const [todos, setTodos] = useState(initialTodos);

  const addTodoToEnd = useCallback((newTodo) => {
    // Check if the newTodo already exists in the todos array or any other dayPlannerRow
    const todoExists = todos.some((todo) => todo.id === newTodo.id);
if (!todoExists) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  }, [todos, row.id]);

  const numCols = todos.length + 1; // Use a derived state instead of managing it separately

  return (
    <div className={`inline-block`}>
      <DropZone rowId={row.id} index={0} onDropTodo={addTodoToEnd} />
      {todos.map((todo, index) => (
        <div className='inline-flex' key={todo.id}> {/* It's better to use todo.id as key if unique */}
          <div className='w-11/12'>
            <PlannerCard todo={todo} index={index} rowId={row.id} />
          </div>
          {index < todos.length - 1 && ( // Improved conditional logic
            <div className="w-1/12">
              <Arrow color={todo.complete ? 'green' : 'gray'} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayDayPlannerRow;


// Updated DropZone to accept onDropTodo callback
const DropZone = ({ rowId, index, onDropTodo }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TODO",
    drop: async (item: Todo) => {
      await updateTodoIndexAndPlannerRow(item.id, index, rowId);
      onDropTodo(item); // Invoke the callback with the dropped todo
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [rowId, index, onDropTodo]); // Include onDropTodo in dependencies

  return (
    <div ref={drop} className={`planner-card ${isOver ? ' bg-green-50' : ''} inline-flex`}>
      Drop a todo here
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

const PlannerTitle = ({ row, handleEditTitle }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(row.title);
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    handleEditTitle(row.id, title);
  };
  
  return (
    <div key={row.id} className='py-2'>
      {isEditing ? (
        <input
          type='text'
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className="text-center" onDoubleClick={handleDoubleClick}>{row.title}</div>
      )}
    </div>
  );
  }