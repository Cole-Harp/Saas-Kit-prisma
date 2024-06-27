import { Separator } from '@/components/ui/Separator';
import { TodosNav } from './_PageSections/TodosNav';
import TodosHeader from './_PageSections/TodosHeader';
import configuration from '@/lib/config/dashboard';
import { LayoutProps } from '@/lib/types/types';

export default function Layout({ children }: LayoutProps) {
  const {
    subroutes: { planner }
  } = configuration;

  return (
    <div className="">
      <div>
        <TodosHeader />
        <Separator className="my-6" />
        <TodosNav items={planner} />

        <div>{children}</div>
      </div>
    </div>
  );
}
