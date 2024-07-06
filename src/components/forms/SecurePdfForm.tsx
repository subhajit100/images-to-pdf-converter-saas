import { securePdfFormSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SecurePdfFormProps {
  onClose: () => void;
  handleConvertToPdf: (
    isSecured: boolean,
    values?: z.infer<typeof securePdfFormSchema>
  ) => void;
}

const SecurePdfForm = ({ onClose, handleConvertToPdf }: SecurePdfFormProps) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof securePdfFormSchema>>({
    resolver: zodResolver(securePdfFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof securePdfFormSchema>) {
    // Do something with the form values.
    console.log(values);
    if (values.password === values.confirmPassword) {
      handleConvertToPdf(true);
    } else {
      alert("password and confirm password doesn't match");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={onClose}
          className="px-4 py-2 mx-1 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 mx-1 text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default SecurePdfForm;
