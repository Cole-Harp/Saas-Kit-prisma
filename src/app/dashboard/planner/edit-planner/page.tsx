'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { plannerRowConfigFormSchema, PlannerRowConfigFormValues } from '@/lib/types/validations';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/Icons';
import { CreatePlannerRowConfig } from '@/lib/API/Database/planner/planner-config/mutations';
import { toast } from 'react-toastify';
import config from '@/lib/config/api';
import { useRouter } from 'next/navigation';


export default function PlannerRowConfigCreateForm() {
  const router = useRouter();
  const form = useForm<PlannerRowConfigFormValues>({
    resolver: zodResolver(plannerRowConfigFormSchema),
    defaultValues: {
      category: '',
    }
  });
  const {
    reset,
    register,
    formState: { isSubmitting }
  } = form;
  const onSubmit = async (values: PlannerRowConfigFormValues) => {
    const category = values.category;
    const props = { category };
    try {
      await CreatePlannerRowConfig(props);
    } catch (err) {
      toast.error(config.errorMessageGeneral);
      throw err;
    }
    reset({ category: '' });
    toast.success('Planner Row Config Submitted');
    router.refresh();
  };
  return (
    <div>
      <Card className="bg-background-light dark:bg-background-dark">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">New Planner Row Config</CardTitle>
          <CardDescription>Create a Planner Row Config with Category</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage /> <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        {...register('category')}
                        className="bg-background-light dark:bg-background-dark"
                        {...field}
                      >
                        {/* Assuming PlannerRowCategory has predefined options */}
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Health">Health</option>
                        {/* Add more options based on PlannerRowCategory */}
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} className="w-full">
                {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}