'use client';

import { useState } from 'react';
import MyTodos from './MyTodos';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from '@/components/ui/Card';
import { GameDayPlanner } from './PlannerCard';

// Your existing components remain unchanged

const MyDayPlannerWithDndProvider = ({ todos, dayPlanner }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className='flex'>
                <div className='w-1/3'>
                    <MyTodos todos={todos} />
                </div>
                <div className='w-2/3'>
                    <GameDayPlanner dayPlanner={dayPlanner} />
                </div>
            </div>
        </DndProvider>
    );
};

export default MyDayPlannerWithDndProvider;