import { DndProvider } from 'react-dnd';
import MyTodos from '../_PageSections/MyTodos';
import { GetTodosByUserId } from '@/lib/API/Database/todos/queries';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MyDayPlannerWithDndProvider from '../_PageSections/PlannerHome';
import { GetDayPlanner } from '@/lib/API/Database/planner/queries';

export default async function ListTodos() {
  const todos = await GetTodosByUserId();
  const dayPlanner = await GetDayPlanner(new Date());

  return (
    <MyDayPlannerWithDndProvider todos={todos} dayPlanner={dayPlanner} />
  );
}
